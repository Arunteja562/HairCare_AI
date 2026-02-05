import React, { useState } from "react";
import axios from "axios";
import "../styles/ForgotReset.css"; // Adjust path if needed



const BASE_URL = "http://localhost:5001/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post(`${BASE_URL}/forgot-password`, { email });
      setMsg(res.data.message || "If registered, a reset link has been sent.");
    } catch {
      setMsg("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="forgot-container">
      <form onSubmit={handleSubmit} className="forgot-form">
        <h2>Forgot Password?</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
