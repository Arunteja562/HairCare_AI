const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const { forgotPassword } = require("../controllers/forgotPassword");
const router = express.Router();


router.post("/", forgotPassword);
router.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ message: "If this email is registered, a reset link has been sent." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Setup transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `Click to reset your password: http://localhost:3000/reset-password/${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "If this email is registered, a reset link has been sent." });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
