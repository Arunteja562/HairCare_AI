import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ForgotReset.css"; // Adjust path if needed


const BASE_URL = "http://localhost:5001/api";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post(`${BASE_URL}/reset-password/${token}`, { password });
      setMsg(res.data.message);
      if (res.data.success) {
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    } catch {
      setMsg("Reset failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="reset-container">
      <form onSubmit={handleSubmit} className="reset-form">
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Set New Password"}
        </button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
