const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";

// --- Register API ---
router.post("/register", async (req, res) => {
  try {
    const { name, age, gender, email, password } = req.body;

    if (!name || !age || !gender || !email || !password) {
      return res.status(400).json({ message: "⚠️ All fields are required!" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "⚠️ User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      age,
      gender,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "✅ User registered successfully!" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "❌ Error registering user" });
  }
});

// --- Login API ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "⚠️ Email and password required!" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "⚠️ User not found!" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "⚠️ Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "✅ Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "❌ Error logging in" });
  }
});

// --- Profile API ---
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "⚠️ User not found!" });
    res.json(user);
  } catch (err) {
    console.error("❌ Profile error:", err);
    res.status(500).json({ message: "❌ Error fetching profile" });
  }
});

module.exports = router;
