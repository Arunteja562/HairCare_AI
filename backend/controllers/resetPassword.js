const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired OTP." });

  const hash = await bcrypt.hash(newPassword, 10);
  user.password = hash;
  user.otp = null;
  user.otpExpires = null;

  await user.save();

  return res.json({ message: "Password reset successful." });
};
