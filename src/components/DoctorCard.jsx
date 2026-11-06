import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, Award, CheckCircle } from './Icons';

export const DoctorCard = ({ doctor, onViewProfile }) => {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate(`/book-appointment?doctorId=${doctor._id}`);
  };

  const handleConsult = () => {
    navigate(`/consultation?doctorId=${doctor._id}`);
  };

  return (
    <div className="doctor-card">
      <div className="doctor-card-badge-row">
        <span className="specialization-pill">{doctor.specialization}</span>
        {doctor.isAvailable ? (
          <span className="status-badge available-badge">
            <span className="status-dot"></span> Available
          </span>
        ) : (
          <span className="status-badge busy-badge">Busy</span>
        )}
      </div>

      <div className="doctor-card-header">
        <div className="doctor-avatar-box">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="doctor-avatar-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>
        <div className="doctor-meta">
          <h3 className="doctor-name">{doctor.name}</h3>
          <p className="doctor-qualifications">{doctor.qualifications}</p>
          <div className="doctor-rating-row">
            <div className="rating-pill">
              <Star size={14} className="star-icon" />
              <span>{doctor.rating ? doctor.rating.toFixed(1) : '4.8'}</span>
            </div>
            <span className="review-count">({doctor.reviewsCount || 45} reviews)</span>
          </div>
        </div>
      </div>

      <div className="doctor-card-details">
        <div className="doctor-detail-item">
          <Award size={16} className="detail-icon" />
          <span><strong>{doctor.experience} Years</strong> Experience</span>
        </div>
        <div className="doctor-detail-item">
          <Clock size={16} className="detail-icon" />
          <span>{doctor.availableTimeSlots ? doctor.availableTimeSlots[0] : '09:00 AM - 05:00 PM'}</span>
        </div>
        <div className="doctor-detail-item">
          <MapPin size={16} className="detail-icon" />
          <span className="truncate-text">{doctor.clinicAddress || 'Medicare Central Clinic'}</span>
        </div>
      </div>

      <div className="doctor-card-footer">
        <div className="fee-display">
          <span className="fee-label">Consultation Fee</span>
          <span className="fee-amount">${doctor.consultationFee}</span>
        </div>

        <div className="card-buttons-group">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onViewProfile(doctor)}
          >
            View Profile
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleBook}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
