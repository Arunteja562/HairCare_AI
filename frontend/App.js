// src/App.js
import React, { useState } from "react";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PredictionForm from "./pages/PredictionForm";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  const [form, setForm] = useState({
    age: "",
    stress: "",
    sleep: "",
    diet: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // simple validation
    if (!form.age || !form.stress || !form.sleep || !form.diet) {
      setError("⚠️ Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/predict", form, {
        headers: { "Content-Type": "application/json" },
      });

      setResult(res.data); // ✅ Expecting { risk, accuracy, recommendation }
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong. Check backend server.");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h2>💇 Hair Fall Prediction System</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stress"
          placeholder="Stress Level (0-10)"
          value={form.stress}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.1"
          name="sleep"
          placeholder="Sleep Hours"
          value={form.sleep}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="diet"
          placeholder="Diet Type (poor/average/good)"
          value={form.diet}
          onChange={handleChange}
          required
        />
        <button type="submit">Predict</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>📊 Prediction Result</h3>
          <p><b>Risk Level:</b> {result.risk}</p>
          {result.accuracy && <p><b>Confidence:</b> {result.accuracy}%</p>}
          <p><b>Doctor's Recommendation:</b> {result.recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default App;
