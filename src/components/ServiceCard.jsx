import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from './Icons';

export const ServiceCard = ({ icon: Icon, title, description, features = [], specialization }) => {
  const navigate = useNavigate();

  const handleBookService = () => {
    if (specialization) {
      navigate(`/doctors?specialization=${encodeURIComponent(specialization)}`);
    } else {
      navigate('/book-appointment');
    }
  };

  return (
    <div className="service-card">
      <div className="service-icon-box">
        <Icon size={28} className="service-icon" />
      </div>
      <h3 className="service-title">{title}</h3>
      <p className="service-desc">{description}</p>
      {features.length > 0 && (
        <ul className="service-features-list">
          {features.map((feature, idx) => (
            <li key={idx}>
              <CheckCircle size={14} className="feature-check" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="service-action-btn" onClick={handleBookService}>
        <span>Find Specialists</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};
