import React from "react";
import { Link } from "react-router-dom";
import "../styles/ConsultationAdvice.css";

function ConsultationAdvice({ risk }) {
  if (!risk) return null;

  let title = "";
  let message = "";

  switch (risk) {
    case "High":
      title = "Consult a Trichologist";
      message =
        "High risk detected. Consult a Trichologist, a specialist in hair and scalp diseases and treatments.";
      break;
    case "Medium":
      title = "Consult a Dermatologist";
      message =
        "Medium risk detected. Consult a Dermatologist trained in hair, skin, and nail conditions.";
      break;
    case "Low":
      title = "Recommendations";
      message =
        "Low risk detected. Follow the recommended hair care routine to maintain healthy scalp and hair.";
      break;
    default:
      return null;
  }

  return (
    <div className="consultation-advice-card">
      <h4>{title}</h4>
      <p>{message}</p>
      <Link to="/doctors" className="doctors-consultation-btn">
        Doctors Consultation
      </Link>
    </div>
  );
}

export default ConsultationAdvice;
