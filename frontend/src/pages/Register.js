import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import "../styles/Register.css";
import modelImg from "../assets/Registation.jpg";

// ✅ API Base URL
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

function Register() {

  // Apply pro theme when requested via query param
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("theme") === "pro") {
      document.body.classList.add("pro-theme");
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/src/styles/Register.pro.css";
      document.head.appendChild(link);
    }
  }

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    // mobile: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.gender || !form.email || !form.password) {
      setMessage("⚠️ Please fill all required fields!");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setMessage(data.message || "❌ Registration failed.");
      }
    } catch (err) {
      setMessage("❌ Server error. Please try again later.");
    }
  };

  // ✅ NEW: Google OAuth success handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const googleUser = {
        name: decoded.name,
        email: decoded.email,
        password: "google_oauth_" + decoded.sub, // Generate a unique password
        // age: "", // Will need to be filled manually or set default
        gender: "", // Will need to be filled manually or set default
        // mobile: "", // Will need to be filled manually or set default
        isGoogleUser: true
      };

      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleUser),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Google registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setMessage(data.message || "❌ Google registration failed.");
      }
    } catch (err) {
      setMessage("❌ Google registration error. Please try again.");
    }
  };

  // ✅ NEW: Google OAuth error handler
  const handleGoogleError = () => {
    setMessage("❌ Google sign-in failed. Please try again.");
  };

  return (
    <div className="register-container two-column">
      <div className="left-panel">
        <div className="image-wrapper">
          <img src={modelImg} alt="Professional Model" className="model-image" />
          <div className="image-overlay">
            <h3>Healthy Hair Starts Here</h3>
            <p>Join thousands who improved their hair health with personalized AI-driven guidance.</p>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="register-card">
          <h2 className="register-title">Create your account</h2>
          {message && <p className="register-message">{message}</p>}

          <form onSubmit={handleSubmit} className="register-form">
            <input name="name" placeholder="Full Name" onChange={handleChange} required />
            <div className="row">
              <input name="age" type="number" placeholder="Age" onChange={handleChange} required />
              <select name="gender" onChange={handleChange} required>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit" className="register-btn">Create Account</button>
          </form>

          <p className="login-link">
            Already registered? <span onClick={() => navigate("/login")}>Login here</span>
          </p>

          <div className="divider"><span>or</span></div>
          <div className="google-auth-section">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="continue_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="100%"
              backgroundColor="#4285F4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
