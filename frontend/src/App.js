import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { GoogleOAuthProvider } from '@react-oauth/google';

// Lazy load pages
const Welcome = lazy(() => import("./pages/Welcome"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PredictionForm = lazy(() => import("./pages/PredictionForm"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Doctors = lazy(() => import("./pages/Doctors")); // Lazy load Doctors

function App() {
  return (
    <GoogleOAuthProvider clientId="869110028553-eqv6epr4q5eo4bsaqsloqv2lkg3f155j.apps.googleusercontent.com">
      <Router>
        <Navbar />
        <main style={{ minHeight: "80vh" }}>
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/predictionForm" element={<PredictionForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="*" element={<h2>404: Page Not Found</h2>} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
