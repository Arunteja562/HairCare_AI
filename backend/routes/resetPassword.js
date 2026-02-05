const express = require("express");
const User = require("../models/User");
const { resetPasswordWithOtp } = require("../controllers/resetPassword");
const router = express.Router();



router.post("/", resetPasswordWithOtp);
router.post("/:token", async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return res.json({ success: false, message: "Token invalid or expired." });

  user.password = req.body.password; // hash before save in real use!
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ success: true, message: "Password reset successful. You can login now." });
});

module.exports = router;
