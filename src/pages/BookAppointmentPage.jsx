import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Toast } from '../components/Toast';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Heart,
  MapPin,
  ArrowRight,
} from '../components/Icons';

export const BookAppointmentPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    doctorId: preselectedDoctorId || '',
    patientName: user?.name || '',
    patientEmail: user?.email || '',
    patientPhone: user?.phone || '',
    patientAge: user?.age || '',
    patientGender: user?.gender || 'Male',
    appointmentDate: '',
    timeSlot: '',
    appointmentType: 'In-Clinic',
    symptoms: '',
  });

  // Load doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.getDoctors();
        if (res.doctors && res.doctors.length > 0) {
          setDoctors(res.doctors);
          let initialDoc = null;
          if (preselectedDoctorId) {
            initialDoc = res.doctors.find((d) => d._id === preselectedDoctorId);
          }
          if (!initialDoc) {
            initialDoc = res.doctors[0];
          }
          setSelectedDoctor(initialDoc);
          setFormData((prev) => ({
            ...prev,
            doctorId: initialDoc._id,
            timeSlot: initialDoc.availableTimeSlots ? initialDoc.availableTimeSlots[0] : '10:00 AM - 11:00 AM',
          }));
        }
      } catch (err) {
        console.error('Failed to load doctors', err);
      }
    };
    fetchDoctors();
  }, [preselectedDoctorId]);

  // Sync user profile data once authenticated
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        patientName: prev.patientName || user.name || '',
        patientEmail: prev.patientEmail || user.email || '',
        patientPhone: prev.patientPhone || user.phone || '',
        patientAge: prev.patientAge || user.age || '',
        patientGender: prev.patientGender || user.gender || 'Male',
      }));
    }
  }, [user]);

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    const doc = doctors.find((d) => d._id === docId);
    setSelectedDoctor(doc);
    setFormData((prev) => ({
      ...prev,
      doctorId: docId,
      timeSlot: doc?.availableTimeSlots ? doc.availableTimeSlots[0] : '',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/book-appointment' } } });
      return;
    }

    if (
      !formData.doctorId ||
      !formData.patientName ||
      !formData.patientEmail ||
      !formData.patientPhone ||
      !formData.patientAge ||
      !formData.appointmentDate ||
      !formData.timeSlot ||
      !formData.symptoms.trim()
    ) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.bookAppointment(formData);
      setToastMessage('Appointment successfully booked!');
      setBookingSuccessData(res.appointment);
    } catch (err) {
      alert(err.message || 'Unable to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  // If already booked, show celebratory confirmation screen
  if (bookingSuccessData) {
    return (
      <div className="container" style={{ padding: '60px 24px', maxWidth: '640px' }}>
        <div
          className="auth-card"
          style={{
            textAlign: 'center',
            padding: '48px 36px',
            border: '2px solid #ccfbf1',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ccfbf1',
              color: '#0f766e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckCircle size={36} />
          </div>

          <span className="section-tag">Booking Confirmed</span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '8px', marginBottom: '8px' }}>
            Appointment Booked!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '28px' }}>
            Your consultation request has been successfully recorded in Medicare.
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '28px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Appointment ID:</span>
              <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>#{bookingSuccessData._id.slice(-6).toUpperCase()}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Doctor:</span>
              <strong>{bookingSuccessData.doctor?.name}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Date & Time:</span>
              <strong>{bookingSuccessData.appointmentDate} ({bookingSuccessData.timeSlot})</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Patient Name:</span>
              <strong>{bookingSuccessData.patientName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Consultation Fee:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>${bookingSuccessData.fee}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px' }}>
            <Link to="/my-appointments" className="btn btn-primary btn-block">
              View My Appointments
            </Link>
            <button
              onClick={() => {
                setBookingSuccessData(null);
                setFormData((prev) => ({ ...prev, symptoms: '', appointmentDate: '' }));
              }}
              className="btn btn-outline btn-block"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-appointment-page" style={{ padding: '48px 0 80px' }}>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage('')}
        />
      )}

      <div className="container">
        <div className="section-header">
          <span className="section-tag">Appointment Booking</span>
          <h1 className="section-title">Schedule a Medical Consultation</h1>
          <p className="section-subtitle">
            Choose your preferred doctor, date, and time slot. Our clinic staff will review your booking instantly.
          </p>
        </div>

        <div className="hero-grid" style={{ alignItems: 'flex-start' }}>
          {/* Booking Form Card */}
          <div className="auth-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '20px' }}>
              Enter Appointment Details
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Doctor Selection */}
              <div className="form-group">
                <label className="form-label">Select Specialist Doctor *</label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleDoctorChange}
                  className="form-select"
                  required
                >
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name} - {doc.specialization} (${doc.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Visit Type */}
              <div className="form-group">
                <label className="form-label">Appointment Mode *</label>
                <select
                  name="appointmentType"
                  value={formData.appointmentType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="In-Clinic">In-Clinic Visit (Hospital Consultation)</option>
                  <option value="Online Consultation">Telehealth Online Video Call</option>
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Appointment Date *</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Available Time Slot *</label>
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {selectedDoctor?.availableTimeSlots?.map((slot, i) => (
                      <option key={i} value={slot}>
                        {slot}
                      </option>
                    ))}
                    {!selectedDoctor?.availableTimeSlots && (
                      <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Patient Details */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>
                  Patient Information
                </h4>

                <div className="form-group">
                  <label className="form-label">Patient Full Name *</label>
                  <div className="form-input-wrapper">
                    <User size={18} className="form-input-icon" />
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="form-input form-input-with-icon"
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <div className="form-input-wrapper">
                      <Phone size={18} className="form-input-icon" />
                      <input
                        type="tel"
                        name="patientPhone"
                        value={formData.patientPhone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="form-input form-input-with-icon"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <div className="form-input-wrapper">
                      <Mail size={18} className="form-input-icon" />
                      <input
                        type="email"
                        name="patientEmail"
                        value={formData.patientEmail}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className="form-input form-input-with-icon"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input
                      type="number"
                      name="patientAge"
                      value={formData.patientAge}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select
                      name="patientGender"
                      value={formData.patientGender}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Symptoms / Notes */}
              <div className="form-group">
                <label className="form-label">Reason for Visit / Health Symptoms *</label>
                <textarea
                  rows={3}
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="Describe what symptoms you are experiencing..."
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                    <span>Confirming Appointment...</span>
                  </>
                ) : (
                  <span>Confirm & Schedule Appointment</span>
                )}
              </button>
            </form>
          </div>

          {/* Selected Doctor Summary Card */}
          <div>
            {selectedDoctor && (
              <div className="doctor-card" style={{ padding: '28px' }}>
                <div className="doctor-card-badge-row">
                  <span className="specialization-pill">{selectedDoctor.specialization}</span>
                  <span className="status-badge available-badge">Available Doctor</span>
                </div>

                <div className="doctor-card-header">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="doctor-avatar-box"
                    style={{ width: '84px', height: '84px' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedDoctor.name}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{selectedDoctor.qualifications}</p>
                    <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>
                      {selectedDoctor.experience} Years Experience
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                  <MapPin size={16} className="detail-icon" />
                  <span>{selectedDoctor.clinicAddress}</span>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', border: '1px solid #ccfbf1', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Doctor Consultation Fee:</span>
                    <strong style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>${selectedDoctor.consultationFee}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Booking Fee:</span>
                    <strong style={{ color: 'var(--accent-green)', fontSize: '0.95rem' }}>$0 (Free)</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  * No advance payment is required online. Consultation fee is settled during appointment check-in or via insurance.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
