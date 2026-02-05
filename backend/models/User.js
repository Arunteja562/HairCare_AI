const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    otp: { type: String, default: null },              // added for OTP
    otpExpires: { type: Date, default: null },          // added for OTP expiry
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
