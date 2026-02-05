const express = require("express");
const Prediction = require("../models/Prediction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// --- Prediction API ---
router.post("/predict", authMiddleware, async (req, res) => {
  try {
    const { age, gender, stressLevel, dietType, sleepHours } = req.body;

    let risk = "Low";
    if (stressLevel > 7 || sleepHours < 5 || dietType === "poor") {
      risk = "High";
    } else if (stressLevel > 4 || sleepHours < 6) {
      risk = "Medium";
    }

    const recommendation =
      risk === "High"
        ? "⚠️ Consult a dermatologist and manage stress."
        : risk === "Medium"
        ? "🙂 Improve diet & sleep habits."
        : "✅ Maintain your healthy lifestyle!";

    const prediction = await Prediction.create({
      user: req.userId,
      age,
      gender,
      stressLevel,
      dietType,
      sleepHours,
      result: risk,
      recommendation,
      meta: {
        ml: {
          probability: Math.floor(Math.random() * 20) + 80, // dummy %
        },
      },
    });

    res.json({ success: true, prediction });
  } catch (err) {
    console.error("Prediction save error:", err);
    res.status(500).json({ success: false, message: "❌ Error saving prediction" });
  }
});

module.exports = router;
