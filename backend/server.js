const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Import routes
const forgotPassword = require("./routes/forgotPassword");
const resetPassword = require("./routes/resetPassword");
const predictRoutes = require("./routes/predictRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { protect } = require("./middleware/authMiddleware");



const app = express();

// Passport setup for OAuth
const passport = require('passport');
const session = require('express-session');

app.use(session({ secret: process.env.SESSION_SECRET || 'sessionsecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// User Schema & Model including Reset Token fields
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    // mobile: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// JWT Secret & Expiry
const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";
const JWT_EXPIRES_IN = "1h";

// Register Route
app.post("/api/register", async (req, res) => {
  try {
    const { name, age, gender, email, password } = req.body;

    if (!name || !age || !gender || !email || !password) {
      return res.status(400).json({ success: false, message: "⚠️ All fields are required!" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "⚠️ User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, age, gender, email, password: hashedPassword });

    res.status(201).json({ success: true, message: "✅ User registered successfully!" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "⚠️ Email already registered!" });
    }
    console.error("❌ Registration error:", err);
    res.status(500).json({ success: false, message: "❌ Error registering user" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ success: false, message: "⚠️ Email and password required!" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: "⚠️ User not found!" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ success: false, message: "⚠️ Invalid credentials!" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      success: true,
      message: "✅ Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, message: "❌ Error logging in" });
  }
});

// Protected Profile Route
app.get("/api/profile", protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error("❌ Profile error:", err);
    res.status(500).json({ success: false, message: "❌ Error fetching profile" });
  }
});

// Prediction Routes (protected)
app.use("/api/predict", protect, predictRoutes);

// Contact Route
app.use("/api/contact", contactRoutes);

// Auth routes (OAuth)
const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

// Forgot Password Route
app.use("/api/forgot-password", forgotPassword);

// Reset Password Route
app.use("/api/reset-password", resetPassword);

// Nodemailer transporter configuration for testing & other usage
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Test email route (optional) to verify mailing setup
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "This is a test email from your backend.",
    });
    res.send("Test email sent!");
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).send("Failed to send email: " + err.message);
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


module.exports = { app, transporter, User };
