// src/pages/Welcome.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Welcome.css";
import hairfallVideo from "../assets/Hair_Loss Treatment.mp4";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-wrapper">
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={hairfallVideo} type="video/mp4" />
        Sorry, your browser does not support video playback.
      </video>

      <div className="overlay" />

      <div className="welcome-content">
        <h1 className="welcome-title">✨ Welcome to HairCare AI ✨</h1>
        <p className="welcome-text">
          Your AI-powered solution to <b>predict, prevent & protect</b> hair health...
        </p>
        <button
          className="welcome-btn"
          onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>
    </div>
  );
}
