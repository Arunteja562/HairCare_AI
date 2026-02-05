import React from "react";
import { useLocation } from "react-router-dom";
import "../styles/Doctors.css";

const allDoctors = {
  High: [
    {
      id: 1,
      type: "Trichologist",
      name: "Dr. A.Yeshwanth Kumar",
      experience: "12 years",
      specialization: "hair Trasplant and Consmetic Dermatology",
      location: "Kalajothi Rd, Sai Pruthvi Enclave, Kondapur, Hyderbad",
      contact: "(+91 9121219123)",
      email: "dr.yeshwanth@gmail.com",
      rating: "4.9/5",
      fee: "₹900 - ₹1200",
      description:
        "Specialized in treating severe hair loss, alopecia, and scalp conditions with advanced treatments."
    },
    {
      id: 2,
      type: "Trichologist",
      name: "Dr. Raj Kumar",
      experience: "10 years",
      specialization: "Advanced Hair Care",
      location: "uppal opposite new bus stop, Hyderbad",
      contact: "+91 8998765478",
      email: "dr.kumar@elitehair.com",
      rating: "4.7/5",
      fee: "₹600 - ₹800",
      description:
        "Focused on personalized hair restoration treatments and scalp analysis."
    },
    {
      id: 3,
      type: "Trichologist",
      name: "Dr. Anita Singh",
      experience: "6 years",
      specialization: "Hair Transplant & Scalp Therapy",
      location: "Hair Wellness Center, New York, NY",
      contact: "+91 8790493278",
      email: "dr.singh@hairwellness.com",
      rating: "4.8/5",
      fee: "₹500 - ₹900",
      description:
        "Expert in surgical and non-surgical hair loss solutions."
    }
  ],
  Medium: [
    {
      id: 4,
      type: "Dermatologist",
      name: "Dr. V Deepak Shodhan",
      experience: "10 years",
      specialization: "Dermatology & Hair Health",
      location: "Nerw Bus stand Rd, Near Hanuman Temple Vijay Talkies Road Waranagl",
      contact: "(+91 7097298070)",
      email: "dr.deepakshodhan@skincare.com",
      rating: "4.8/5",
      fee: "₹400 - ₹600",
      description:
        "Expert in diagnosing and treating hair loss related to skin conditions and hormonal imbalances."
    },
    {
      id: 5,
      type: "Dermatologist",
      name: "Dr. V Ramesh",
      experience: "14 years",
      specialization: "Skin & Hair Cancer Screening",
      location: "NGO's Colony Nakkala Gutta Waranagal",
      contact: "+91 9490440333",
      email: "dr.ramesh@skinhealth.com",
      rating: "4.6/5",
      fee: "₹500 - ₹700",
      description:
        "Provides comprehensive dermatological care including hair and scalp."
    },
    {
      id: 6,
      type: "Dermatologist",
      name: "Dr. Anusha Reddy",
      experience: "11 years",
      specialization: "Scalp & Skin Disorders",
      location: "Kakaji Nagar Colony, Waranagl",
      contact: "+91 7995320026",
      email: "dr.lee@betterskin.com",
      rating: "4.7/5",
      fee: "₹450 - ₹650",
      description:
        "Specializes in inflammatory scalp conditions and hair loss treatment."
    }
  ],
  Low: [
    {
      id: 7,
      type: "General Physician",
      name: "Dr. Kumar Swamy",
      experience: "10 years",
      specialization: "General Medicine and Physician",
      location: "Reddy colony, Warangal ",
      contact: "+91 9963315967",
      email: "dr.kumar@gmail.com",
      rating: "4.5/5",
      fee: "₹200 - ₹400",
      description:
        "Provides comprehensive health assessments and identifies underlying causes of hair loss."
    },
    {
      id: 8,
      type: "General Physician",
      name: "Dr. T Suman ",
      experience: "8 years",
      specialization: "Primary Care",
      location: "Hanumakoda ",
      contact: "(+91 9347371085 )",
      email: "dr.suma@clinic.com",
      rating: "4.5/5",
      fee: "₹150 - ₹350",
      description: "Offers routine medical consultations and basic hair loss advice."
    },
    {
      id: 9,
      type: "General Physician",
      name: "Dr. M.Praven Kumar ",
      experience: "12 years",
      specialization: "Preventive Care",
      location: "Maharshi Clinic Waranagl ",
      contact: "+1 8186980097",
      email: "dr.praveen@health.com",
      rating: "4.6/5",
      fee: "₹180 - ₹380",
      description:
        "Focuses on overall health including lifestyle adjustment for hair health."
    }
  ]
};

const Doctors = () => {
  const location = useLocation();
  const riskLevel = location.state?.riskLevel || "Low";
  const doctors = allDoctors[riskLevel] || [];
  const [expandedIds, setExpandedIds] = React.useState([]);

  const toggleDescription = (id) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  return (
    <div className="doctors-page">
      <button className="back-btn" onClick={() => window.history.back()}>
        <strong>← Back to Results</strong>
      </button>
      <div className="doctors-header">
        <h1>Hair Fall Consultation - {riskLevel} Risk</h1>
        <p>
          {riskLevel === "High" &&
            "High risk detected. Consult a Trichologist, a specialist in hair and scalp diseases and treatments."}
          {riskLevel === "Medium" &&
            "Medium risk detected. Consult a Dermatologist, expert in skin and hair health."}
          {riskLevel === "Low" &&
            "Low risk detected. Personal treatment or consultation with a General Physician is advised."}
        </p>
      </div>

      <div className="doctors-container">
        {doctors.map((doc) => (
          <div key={doc.id} className="doctor-card">
            <div className="doctor-header">
              <h2>{doc.name}</h2>
              <span className="doctor-type">{doc.type}</span>
              <div className="rating">⭐ {doc.rating}</div>
            </div>
            <div className="doctor-details">
              <div className="detail-item">
                <strong>Experience:</strong> <span>{doc.experience}</span>
              </div>
              <div className="detail-item">
                <strong>Specialization:</strong> <span>{doc.specialization}</span>
              </div>
              <div className="detail-item">
                <strong>Location:</strong> <span>{doc.location}</span>
              </div>
              <div className="detail-item">
                <strong>Contact:</strong> <span>{doc.contact}</span>
              </div>
              <div className="detail-item">
                <strong>Email:</strong> <span>{doc.email}</span>
              </div>
              <div className="detail-item">
                <strong>Consultation Fee:</strong> <span>{doc.fee}</span>
              </div>
              <div className="description">
                <strong>About:</strong>
                <p>
                  {expandedIds.includes(doc.id)
                    ? doc.description
                    : `${doc.description.substring(0, 120)}... `}
                  {/* <button
                    className="read-more-btn"
                    onClick={() => toggleDescription(doc.id)}
                  >
                  </button> */}
                </p>
              </div>
              <div className="action-buttons">
                <button
                  className="book-appointment-btn"
                  onClick={() => window.open(`tel:${doc.contact}`)}
                >
                  Call Now
                </button>
                <button
                  className="email-btn"
                  onClick={() => window.open(`mailto:${doc.email}`)}
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
