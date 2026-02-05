const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendRegistrationEmail } = require("../utils/sendMail");

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    // Send registration success email
    await sendRegistrationEmail(user.email, user.name);

    const token = makeToken(user._id);

    return res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (e) {
    next(e);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = makeToken(user._id);
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (e) {
    next(e);
  }
};
