import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    
    <footer className="footer">
    <div className="footer-content">
        {/* Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <strong>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            </strong>
          </ul>
        </div>
        <div className="footer-col">
          <ul className="footer-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/appointment">Book Appointment</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>
        

        {/* Contact Details */}
        <div className="footer-col footer-contact">
          <h3>Contact Details</h3>
          <p>Email: <a href="mailto:info@haircare.com">vasamaruntej2002@gmail.com</a></p>
          <p>Phone: <a href="tel:+919154922849">+91 9154922849</a></p>
          <p>Address: Hyderabad, India</p>
        </div>
        {/* Services Dropdown */}
          <div className="footer-services-dropdown">
            <h5 onClick={() => setServicesOpen(!servicesOpen)}
              className="footer-dropdown" tabIndex={0}
              onKeyPress={e => (e.key === 'Enter' ? setServicesOpen(!servicesOpen) : null)}>
             <strong>Services </strong> <span className="arrow">{servicesOpen ? "▲" : "▼"}</span>
            </h5>
            {servicesOpen && (
              <ul className="footer-links">
                <li>Hair Treatment</li>
                <li>TIA Care Hair Transplant In HYD</li>
                <li>Platelet Rich Plasma (PRP)</li>
                <li>Growth Factor Concentrate (GFC)</li>
                <li>Dandruff Treatment</li>
                <li>Skin Treatment</li>
                <li>Skin Pigmentation & Brightening</li>
                <li>Hydrafacial</li>
                <li>Vampire Facial</li>
                <li>Laser Hair Treatment</li>
              </ul>
            )}
          </div>

        {/* Social Media & Services */}
        <div className="footer-col footer-right">
          <h3>Follow Us</h3>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
          </div>
          
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 HairCare AI | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
