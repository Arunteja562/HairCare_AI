import pandas as pd
import numpy as np
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Dummy dataset
data = {
    "age": np.random.randint(20, 60, 1000),
    "stress_level": np.random.randint(1, 10, 1000),
    "sleep_hours": np.random.randint(4, 9, 1000),
    "work_hours": np.random.randint(6, 12, 1000),
    "hairfall_level": np.random.randint(0, 3, 1000),  # 0=Low, 1=Medium, 2=High
}
df = pd.DataFrame(data)
df.to_csv("hair_fall_dataset.csv", index=False)
print("✅ Dataset created: hair_fall_dataset.csv")

# Prepare features and target
X = df.drop("hairfall_level", axis=1)
y = df["hairfall_level"]

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"📊 Training samples: {len(X_train)}")
print(f"📊 Testing samples: {len(X_test)}")

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Make predictions on test set
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)
training_accuracy = model.score(X_train, y_train)

print(f"\n🎯 Training Accuracy: {training_accuracy:.4f} ({training_accuracy*100:.2f}%)")
print(f"🎯 Testing Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")

# Prediction levels mapping
risk_levels = {0: "Low", 1: "Medium", 2: "High"}

print(f"\n📋 Classification Report:")
print(classification_report(y_test, y_pred, target_names=["Low Risk", "Medium Risk", "High Risk"]))

print(f"\n🔍 Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print(f"\n📈 Sample Predictions:")
for i in range(5):
    actual_level = risk_levels[y_test.iloc[i]]
    predicted_level = risk_levels[y_pred[i]]
    confidence = max(y_pred_proba[i]) * 100
    
    print(f"Sample {i+1}: Actual={actual_level}, Predicted={predicted_level}, Confidence={confidence:.1f}%")

# Save model
model_path = "./hairfall_model.pkl"
joblib.dump(model, model_path)
print(f"\n✅ Model trained and saved as {model_path}")

# Feature importance
feature_names = X.columns.tolist()
print(f"\n📊 Feature Importance:")
for feature, importance in zip(feature_names, abs(model.coef_[0])):
    print(f"{feature}: {importance:.4f}")
