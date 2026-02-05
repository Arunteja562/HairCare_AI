import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // custom CSS

function Navbar() {
  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">HairCare AI</Link>
        

        <ul className="navbar-links">
          {/* <li><Link to="/" className="nav-item">Home</Link></li> */}
          <li><Link to="/about" className="nav-item">About</Link></li>
          <li><Link to="/contact" className="nav-item">Contact</Link></li>
          <li><Link to="/login" className="nav-item">Login</Link></li>
          <li><Link to="/register" className="nav-item register-btn">Register</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
