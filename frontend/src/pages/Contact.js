import React, { useState } from "react";
import axios from "axios";
import "../styles/Contact.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/api/contact", {
        name,
        email,
        message,
      });
      if (res.data.success) {
        setStatus({ type: "success", message: "Message sent successfully!" });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus({ type: "error", message: res.data.message || "Failed to send message." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Failed to send message." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <h2 className="contact-title">📞 Contact Us</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          placeholder="Your Name"
          className="contact-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="contact-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Your Message"
          className="contact-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit" className="contact-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      {status && (
        <p className={status.type === "success" ? "status-success" : "status-error"}>
          {status.message}
        </p>
      )}
    </div>
  );
}
