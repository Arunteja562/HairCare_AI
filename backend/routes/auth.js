require("dotenv").config();
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../server").User; // User model exported from server.js

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in your environment."
  );
}
if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
  throw new Error(
    "LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set in your environment."
  );
}

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        if (!profile || !profile.emails || !profile.emails.length)
          return done(new Error("No email from Google"));
        const email = profile.emails[0].value.toLowerCase();
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName || "Google User",
            age: 18,
            gender: "Other",
            // mobile: "0000000000",
            email,
            password: "google_oauth",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/linkedin/callback`,
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const email =
          profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) return done(new Error("No email from LinkedIn"));
        const lower = email.toLowerCase();
        let user = await User.findOne({ email: lower });
        if (!user) {
          user = await User.create({
            name: profile.displayName || "LinkedIn User",
            age: 18,
            gender: "Other",
            // mobile: "0000000000",
            email: lower,
            password: "linkedin_oauth",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: "1h" });
    const redirectTo = `${FRONTEND_URL}/login?token=${token}`;
    res.redirect(redirectTo);
  }
);

router.get("/linkedin", passport.authenticate("linkedin"));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: "1h" });
    const redirectTo = `${FRONTEND_URL}/login?token=${token}`;
    res.redirect(redirectTo);
  }
);

module.exports = router;
