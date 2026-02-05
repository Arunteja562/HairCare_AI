const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    occupation: { type: String },                // Occupation
    country: { type: String },                   // Country
    healthCondition: { type: String },           // Health Condition
    familyHistory: { type: String },             // Family History (e.g., Yes/No)
    stressLevel: { type: Number },               // Stress Level (0-10)
    dietQuality: { type: String },               // Diet Quality (e.g., "Average", "Good", "Poor")
    sleepHours: { type: Number },                // Sleep Hours
    workHours: { type: Number },                 // Work Hours
    medicationUsage: { type: String },           // Medication Usage (e.g., Yes/No)
    result: { type: String, required: true },    // Prediction result ("Low", "Medium", "High")
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
