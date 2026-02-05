import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logoImg from "../assets/Logo.png";

const BASE_URL = "http://localhost:5001/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect user to backend OAuth endpoint for Google
  const handleGoogleOAuth = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  // Redirect user to backend OAuth endpoint for LinkedIn
  const handleLinkedInOAuth = () => {
    window.location.href = `${BASE_URL}/auth/linkedin`;
  };

  // Capture OAuth token from callback URL and store it for authentication
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        localStorage.setItem("token", token);
        // Remove token from URL without reload
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        window.history.replaceState({}, document.title, url.pathname + url.search);
        navigate("/predictionForm", { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/predictionForm", { replace: true });
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("⚠️ Server not responding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="auth-split">
        <div className="auth-left">
          <div className="brand">
            <img src={logoImg} alt="HairCare AI" className="brand-img" />
            <h3 className="brand-title">HairCare AI</h3>
          </div>

          <h1 style={{ fontSize: "2.4rem", margin: "8px 0 6px" }}>
            Login to Your Account
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: 18 }}>
            Login using social networks
          </p>

          <div className="social-row">
            <button
              type="button"
              onClick={handleGoogleOAuth}
              className="social-btn google"
              title="Sign in with Google"
            >
              G
            </button>
            <button
              type="button"
              onClick={handleLinkedInOAuth}
              className="social-btn linkedin"
              title="Sign in with LinkedIn"
            >
              in
            </button>
          </div>

          <div className="or-sep">OR</div>

          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-field" style={{ position: "relative" }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="eye"
                style={{
                  position: "absolute",
                  right: 18,
                  top: 12,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                👁️
              </button>
            </div>

            <div style={{ marginTop: 18 }}>
              <button
                className="signin-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div style={{ marginTop: 18, color: "#94a3b8" }}>
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="auth-right">
          <h2>New Here?</h2>
          <p>Sign up and discover a great amount of new opportunities!</p>
          <br />
          <b>Don't have an account?</b>
          <button className="cta-btn" onClick={() => navigate("/register")}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
