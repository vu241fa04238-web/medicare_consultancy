import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Clock, Shield } from './Icons';

export const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-top-wave"></div>
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="brand-icon-wrapper">
                <Heart size={22} className="brand-icon" />
              </div>
              <span className="brand-name">
                Medi<span className="brand-accent">Care</span>
              </span>
            </div>
            <p className="footer-description">
              Medicare is a modern online consultancy and healthcare platform providing certified specialist doctors, seamless virtual consultations, and verified appointment scheduling for patients worldwide.
            </p>
            <div className="footer-cert-badge">
              <Shield size={16} /> ISO 27001 & HIPAA Compliant Healthcare Portal
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/doctors">Find Doctors</Link></li>
              <li><Link to="/services">Medical Services</Link></li>
              <li><Link to="/consultation">Online Consultation</Link></li>
              <li><Link to="/book-appointment">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Medical Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Specializations</h4>
            <ul className="footer-links">
              <li><Link to="/doctors?specialization=Cardiologist">Cardiology</Link></li>
              <li><Link to="/doctors?specialization=Neurologist">Neurology</Link></li>
              <li><Link to="/doctors?specialization=Dermatologist">Dermatology</Link></li>
              <li><Link to="/doctors?specialization=Pediatrician">Pediatrics</Link></li>
              <li><Link to="/doctors?specialization=General+Physician">General Medicine</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Contact & Help</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>450 Healthcare Boulevard, Suite 100, Medical Plaza</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>24/7 Helpline: +1 (800) 555-0199</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>support@medicare-consultancy.com</span>
              </li>
              <li>
                <Clock size={18} className="contact-icon" />
                <span>Emergency Support: 24 Hours / 7 Days</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Medicare Consultancy System. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
