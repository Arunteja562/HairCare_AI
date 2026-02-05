import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import "../styles/Dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import ConsultationAdvice from "../pages/ConsultationAdvice";

export default function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPredictions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5001/api/predict", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.predictions)) {
          const normalized = data.predictions.map(pred => {
            const features = pred.input_features || {};
            return {
              createdAt: pred.createdAt || new Date().toISOString(),
              risk_level: pred.risk_level || pred.result || "N/A",
              confidence: pred.confidence ?? "N/A",
              age: features.age ?? features.Age ?? pred.age ?? pred.Age ?? "N/A",
              stress: features.stress_level ?? features.Stress_Level ?? pred.stress ?? pred.Stress_Level ?? "N/A"
            };
          });
          setPredictions(normalized);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchPredictions();
  }, []);

  useEffect(() => {
    const pred = location.state?.prediction;
    if (pred && pred.risk_level) {
      const features = pred.input_features || {};
      const normalized = {
        createdAt: new Date().toISOString(),
        risk_level: pred.risk_level,
        confidence: pred.confidence ?? "N/A",
        age: features.age ?? features.Age ?? pred.age ?? pred.Age ?? "N/A",
        stress: features.stress_level ?? features.Stress_Level ?? pred.stress ?? pred.Stress_Level ?? "N/A"
      };
      setPredictions(prev => [normalized, ...prev]);
    }
  }, [location.state]);

  const counts = { Low: 0, Medium: 1, High: 2 };
  predictions.forEach(pred => {
    if (pred.risk_level && counts.hasOwnProperty(pred.risk_level)) {
      counts[pred.risk_level]++;
    }
  });

  const chartData = [
    { name: "Low", value: counts.Low },
    { name: "Medium", value: counts.Medium },
    { name: "High", value: counts.High }
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF4C4C"];
  const latest = predictions[0] || {};
  <ConsultationAdvice risk={latest.risk_level} />

  return (
    <div className="dashboard">
      
      <button className="back-btn" onClick={() => window.history.back()}><strong>← Back to Results</strong></button>
      <h2>Hairfall Prediction Dashboard</h2>
      <div className="alert alert-info">
        <h5>Latest Prediction Result</h5>
        <p><strong>Risk Level:</strong> {latest.risk_level}</p>
        <p><strong>Confidence:</strong> {latest.confidence}</p>
        <p><strong>Age:</strong> {latest.age}</p>
        <p><strong>Stress:</strong> {latest.stress}</p>
      </div>

      <div className="charts" style={{ display: "flex", gap: 20 }}>
        <PieChart width={360} height={300}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#82ca9d"
            paddingAngle={5}
            dataKey="value"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        <BarChart width={460} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>

      <div className="pred-list" style={{ marginTop: 40 }}>
        <h3>Your Predictions</h3>
        <ul>
          {predictions.map((pred, index) => (
            <li key={index}>
              {pred.createdAt ? new Date(pred.createdAt).toLocaleString() : "Unknown time"} —&nbsp;
              <strong>{pred.risk_level}</strong> (Confidence: {pred.confidence}, Age: {pred.age}, Stress: {pred.stress})
            </li>
          ))}
        </ul>
      </div>
       <button
        className="btn btn-info mt-3"
        style={{
          padding: "10px 24px",
          marginBottom: 20,
          backgroundColor: "#4cf70eff",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer"
        }}
        onClick={() => navigate("/doctors", { state: { riskLevel: latest.risk_level } })}
        onMouseEnter={e => (e.target.style.backgroundColor = "#e73414ff")}
        // onMouseLeave={e => (e.target.style.backgroundColor = "#f7310eff")}
      >
        Doctors Consultation 
      </button>

    </div>
  );
}
