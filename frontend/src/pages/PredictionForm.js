import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/PredictionForm.css";
import { useNavigate } from "react-router-dom";

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    Age: "",
    Gender: "Male",
    Occupation: "",
    Country: "",
    Health_Condition: "",
    Family_History: "",
    Stress_Level: "",
    Diet_Quality: "Average",
    Sleep_Hours: "",
    Work_Hours: "",
    Medication: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNext, setShowNext] = useState(false); // control step
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Check if first 5 required fields are filled
  const firstFiveFilled = () => {
    return (
      formData.Age.trim() !== "" &&
      formData.Gender.trim() !== "" &&
      formData.Occupation.trim() !== "" &&
      formData.Country.trim() !== "" &&
      formData.Health_Condition.trim() !== ""
    );
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    if (firstFiveFilled()) {
      setShowNext(true);
      setError("");
    } else {
      setError("⚠️ Please fill all first 5 fields before continuing.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first.");
      navigate("/login");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        ...formData,
        Age: Number(formData.Age),
        Stress_Level: Number(formData.Stress_Level),
        Sleep_Hours: Number(formData.Sleep_Hours),
        Work_Hours: Number(formData.Work_Hours),
        Family_History: Number(formData.Family_History),
        Medication: Number(formData.Medication)
      };
      const res = await axios.post("http://localhost:5000/api/predict", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success) {
        navigate("/dashboard", { state: { prediction: res.data } });
      } else {
        setError(res.data.message || "Prediction failed");
      }
    } catch (err) {
      console.error("Prediction error:", err);
      if (err?.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err?.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="container mt-5 prediction-form-container"
      style={{
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // professional blue gradient backdrop
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        color: "#f0f4f8",
        minHeight: "auto",
        maxWidth: "650px",
        margin: "auto"
      }}
    >
      <h2 className="form-title mb-3" style={{color: "#d0daf2", fontWeight: "600"}}>
        Fill Your Health Information
      </h2>
      <form
        className="p-4 shadow rounded bg-white custom-form"
        style={{ color: "#333" }} // keep form text dark on white background
        onSubmit={showNext ? handleSubmit : handleNextClick}
      >
        {!showNext ? (
          // Step 1: Only show first 5 fields + Next button
          <>
            <div className="mb-3">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="Age"
                value={formData.Age}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Occupation</label>
              <input
                type="text"
                name="Occupation"
                value={formData.Occupation}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="Country"
                value={formData.Country}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Health Condition</label>
              <input
                type="text"
                name="Health_Condition"
                value={formData.Health_Condition}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <button className="btn btn-primary w-100 my-3" type="submit">
              Next
            </button>
          </>
        ) : (
          // Step 2: Only show remaining fields + Predict button
          <>
            <div className="mb-3">
              <label className="form-label">Family History</label>
              <select
                name="Family_History"
                value={formData.Family_History}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select</option>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Stress Level (0–10)</label>
              <input
                type="number"
                min="0"
                max="10"
                name="Stress_Level"
                value={formData.Stress_Level}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Diet Quality</label>
              <select
                name="Diet_Quality"
                value={formData.Diet_Quality}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="Poor">Poor</option>
                <option value="Average">Average</option>
                <option value="Healthy">Healthy</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Sleep Hours</label>
              <input
                type="number"
                step="0.1"
                name="Sleep_Hours"
                value={formData.Sleep_Hours}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Work Hours</label>
              <input
                type="number"
                name="Work_Hours"
                value={formData.Work_Hours}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Medication Usage</label>
              <select
                name="Medication"
                value={formData.Medication}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select</option>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 predict-btn"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
          </>
        )}
      </form>
      {error && (
        <div
          className="alert alert-danger mt-3"
          style={{ backgroundColor: "#501010", borderColor: "#8c2c2c" }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
