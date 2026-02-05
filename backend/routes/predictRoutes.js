const express = require("express");
const router = express.Router();
const Prediction = require("../models/Prediction");
const { protect } = require("../middleware/authMiddleware");

// POST: Save a prediction with proper validation and numeric cast
router.post("/", protect, async (req, res) => {
  try {
    const { age, gender, stressLevel, dietType, sleepHours } = req.body;

    // Correct validation for empty or undefined fields
    if (
      age === undefined || age === null || age === "" ||
      stressLevel === undefined || stressLevel === null || stressLevel === "" ||
      sleepHours === undefined || sleepHours === null || sleepHours === ""
    ) {
      return res.status(400).json({ success: false, message: "age, stressLevel, and sleepHours are required" });
    }

    // Cast to numbers
    const nAge = Number(age);
    const nStress = Number(stressLevel);
    const nSleep = Number(sleepHours);

    // Compute risk based on sleeping hours and stress level
    let risk;

    // Sleep hours risk logic (priority)
    if (nSleep < 3) {
      risk = "High";
    } else if (nSleep >= 3 && nSleep < 5) {
      risk = "Medium";
    } else if (nSleep >= 5 && nSleep < 7) {
      risk = "Low";
    } else {
      risk = "Low";  // You can adjust this if needed for 7+ hours
    }

    // Compute risk
    
if (nStress > 7) {
  risk = "High";
} else if (nStress > 5 && nStress <= 7) {
  risk = "Medium";
} else {
  risk = "Low";
}

console.log(`Computed risk: ${risk} (Stress Level: ${nStress})`);

    

    // Save prediction  

    const prediction = await Prediction.create({
      user: req.userId,
      age: nAge,
      gender,
      stressLevel: nStress,
      dietType,
      sleepHours: nSleep,
      result: risk,
    });

    console.log("Created prediction:", prediction);

    return res.json({ success: true, prediction });
  } catch (err) {
    console.error("❌ ERROR /api/predict:", err);
    return res.status(500).json({ success: false, message: "❌ Server error: " + err.message });
  }
});

// GET: Retrieve all predictions for logged-in user
router.get("/user", protect, async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.json({ success: true, predictions });
  } catch (err) {
    console.error("Error fetching user predictions:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch predictions" });
  }
});

module.exports = router;
