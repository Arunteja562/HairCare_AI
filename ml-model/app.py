import os
import re
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/Haircare_AI")


def validate_email(email):
    pattern = r'^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.fullmatch(pattern, email) is not None


app = Flask(__name__)
CORS(app)
client = MongoClient(MONGO_URI)
db = client.get_default_database()
users_collection = db["users"]
predictions_collection = db["predictions"]

label_map = {0: "Low", 1: "Medium", 2: "High"}

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"success": False, "message": "User already exists!"}), 400

    hashed_pw = generate_password_hash(password)
    users_collection.insert_one({"name": name, "email": email, "password": hashed_pw})

    return jsonify({"success": True, "message": "✅ Registration successful! Please login."}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    if not check_password_hash(user["password"], password):
        return jsonify({"success": False, "message": "Invalid password"}), 401

    return jsonify({
        "success": True,
        "message": "✅ Login successful!",
        "redirect": "/predictionForm",
        "user": {"name": user["name"], "email": user["email"]}
    }), 200

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        required_fields = ['Age', 'Stress_Level', 'Sleep_Hours', 'Work_Hours', 'Family_History', 'Medication', 'Diet_Quality']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing field: {field}'}), 400

        # Rule-based risk calculation only (ignoring ML model)
        nStress = float(data['Stress_Level'])
        nSleep = float(data['Sleep_Hours'])
        diet_quality = data.get('Diet_Quality', 'Average').strip().lower()

        # Sleep risk (priority)
        if nSleep < 3:
            risk = "High"
        elif 3 <= nSleep < 5:
            risk = "Medium"
        elif 5 <= nSleep < 7:
            risk = "Low"
        else:
            risk = "Low"

        # Stress risk overrides if higher
        if nStress > 7:
            risk = "High"
        elif nStress > 5 < nStress <= 7:
                risk = "Medium"
        else:
                risk = "Low"

        # Diet risk overrides
        if diet_quality == 'poor':
            risk = "High"
        elif diet_quality == 'average':
            if risk != "High":
                risk = "Medium"
        elif diet_quality in ('good', 'healthy'):
            if risk not in ("High", "Medium"):
                risk = "Low"
        else:
            # Unknown diet quality treated as Medium risk
            if risk != "High":
                risk = "Medium"

        risk_map_reverse = {"Low": 0, "Medium":1, "High":2}
        risk_score = risk_map_reverse.get(risk, 0)

        confidence_val = 0.95 if risk == "Low" else 0.85 if risk == "Medium" else 0.75

        prediction_doc = {
            "user_email": data.get("email", "anonymous"),
            "Age": data.get("Age"),
            "Gender": data.get("Gender"),
            "Occupation": data.get("Occupation"),
            "Country": data.get("Country"),
            "Health_Condition": data.get("Health_Condition"),
            "Family_History": data.get("Family_History"),
            "Stress_Level": data.get("Stress_Level"),
            "Sleep_Hours": data.get("Sleep_Hours"),
            "Work_Hours": data.get("Work_Hours"),
            "Diet_Quality": data.get("Diet_Quality"),
            "Medication": data.get("Medication"),
            "prediction": risk_score,
            "risk_level": risk,
            "confidence": confidence_val
        }
        predictions_collection.insert_one(prediction_doc)

        return jsonify({
            'success': True,
            'prediction': risk_score,
            'risk_level': risk,
            'confidence': confidence_val,
            'input_features': {
                'age': int(data['Age']),
                'stress_level': int(data['Stress_Level']),
                'sleep_hours': nSleep,
                'diet_quality': diet_quality
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == "__main__":
    print("Starting Flask Server on port 5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
