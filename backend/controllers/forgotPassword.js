const User = require("../models/User");
const { sendOtpEmail } = require("../utils/sendMail");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.json({ message: "If registered, an OTP was sent to your email." });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry

  await user.save();
  await sendOtpEmail(user.email, otp);

  res.json({ message: "If registered, an OTP was sent to your email." });
};
