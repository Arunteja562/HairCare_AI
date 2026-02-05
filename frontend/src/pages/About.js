import React, { useEffect } from "react";
import "../styles/About.css";
import aiIcon from "../assets/Ai image.jpg";
import insightsIcon from "../assets/Personalises.jpg";
import careIcon from "../assets/Treat.jpg";
import monitorIcon from "../assets/monitoring.jpg";

export default function Features() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const options = { root: null, rootMargin: '0px 0px -12% 0px', threshold: 0.12 };

    // Add .reveal class to images and text to set initial hidden state
    const imgs = Array.from(document.querySelectorAll('.feature-img'));
    const texts = Array.from(document.querySelectorAll('.feature-text'));
    const targets = imgs.concat(texts);
    targets.forEach(el => el.classList.add('reveal'));

    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    targets.forEach(t => obs.observe(t));

    return () => obs.disconnect();
  }, []);
  return (
    <div className="features-container">
      <h1 className="features-title">✨ Hair Fall Prediction System ✨</h1>

      <div className="features-grid">
        {/* Card 1 */}
        <div className="feature-card">
          <div className="feature-img-container">
            <img src={aiIcon} alt="AI Prediction" className="feature-img" />
          </div>
          <div className="feature-text">
            <h2>AI-Powered Hair Fall Prediction</h2>
            <p>
               AI-Powered Hair Fall Prediction is a system that uses artificial intelligence and health analytics to predict the chances of hair fall. <br></br>
               Our system uses lifestyle and health analytics to predict the risk of hair fall at an early stage.<br></br>
              By analyzing lifestyle, health, and personal habits, the system provides accurate predictions and guidance to prevent excessive hair fall.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="feature-card reverse">
          <div className="feature-img-container">
            <img src={insightsIcon} alt="Personalized Insights" className="feature-img" />
          </div>
          <div className="feature-text">
            <h2>Personalized Insights</h2>
            <p>
           Every individual has unique hair and health conditions. <br></br>
              This system delivers personalized insights based on user data such as diet, sleep, stress levels, and medical history. 
              Instead of general advice, it gives tailored recommendations that 
              suit each person’s lifestyle and genetics, ensuring better results.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="feature-card">
          <div className="feature-img-container">
            <img src={careIcon} alt="Preventive Care" className="feature-img" />
          </div>
          <div className="feature-text">
            <h2>Preventive Care</h2>
            <p>
              Preventive Care in the Hair Fall Prediction System focuses on reducing future hair loss risks.<br></br>
              With AI-based analysis, it suggests lifestyle modifications, proper nutrition, and care routines that help strengthen hair roots and maintain long-term scalp health.
              Discover effective measures to reduce hair fall and maintain strong, healthy hair with natural methods.
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="feature-card reverse">
          <div className="feature-img-container">
            <img src={monitorIcon} alt="Track & Monitor" className="feature-img" />
          </div>
          <div className="feature-text">
            <h2>Track & Monitor</h2>
            <p>
              Users can log daily habits, treatment progress, and lifestyle changes, while the AI monitors patterns and provides timely alerts. <br></br>
              This helps users stay aware, motivated, and in control of their hair care journey.
              Track important lifestyle factors and monitor your hair health improvements with easy-to-visualize data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
