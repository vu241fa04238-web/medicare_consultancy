import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';
import {
  Video,
  Calendar,
  Clock,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Phone,
  Pill,
} from '../components/Icons';

export const OnlineConsultationPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [myConsultations, setMyConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingConsultations, setFetchingConsultations] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('request'); // 'request' or 'my-consultations'

  // Selected consultation for virtual room
  const [activeRoomConsultation, setActiveRoomConsultation] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    doctorId: preselectedDoctorId || '',
    consultationType: 'Video Call',
    consultationDate: '',
    timeSlot: '',
    urgency: 'Normal',
    symptoms: '',
  });

  const [selectedDoctorObj, setSelectedDoctorObj] = useState(null);

  // Load doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.getDoctors();
        if (res.doctors) {
          setDoctors(res.doctors);
          if (preselectedDoctorId) {
            const doc = res.doctors.find((d) => d._id === preselectedDoctorId);
            if (doc) {
              setSelectedDoctorObj(doc);
              setFormData((prev) => ({
                ...prev,
                doctorId: doc._id,
                timeSlot: doc.availableTimeSlots ? doc.availableTimeSlots[0] : '',
              }));
            }
          } else if (res.doctors.length > 0) {
            setSelectedDoctorObj(res.doctors[0]);
            setFormData((prev) => ({
              ...prev,
              doctorId: res.doctors[0]._id,
              timeSlot: res.doctors[0].availableTimeSlots ? res.doctors[0].availableTimeSlots[0] : '',
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load doctors list', err);
      }
    };
    fetchDoctors();
  }, [preselectedDoctorId]);

  // Load user's consultations if authenticated
  const loadMyConsultations = async () => {
    if (!isAuthenticated) return;
    try {
      setFetchingConsultations(true);
      const res = await api.getMyConsultations();
      if (res.consultations) {
        setMyConsultations(res.consultations);
      }
    } catch (err) {
      console.error('Failed to load online consultations', err);
    } finally {
      setFetchingConsultations(false);
    }
  };

  useEffect(() => {
    loadMyConsultations();
  }, [isAuthenticated]);

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    const doc = doctors.find((d) => d._id === docId);
    setSelectedDoctorObj(doc || null);
    setFormData((prev) => ({
      ...prev,
      doctorId: docId,
      timeSlot: doc?.availableTimeSlots ? doc.availableTimeSlots[0] : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/consultation' } } });
      return;
    }

    if (!formData.doctorId || !formData.consultationDate || !formData.timeSlot || !formData.symptoms.trim()) {
      alert('Please fill in doctor, preferred date, time slot, and health concerns.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.requestConsultation(formData);
      setToastMessage('Online consultation scheduled successfully!');
      setFormData({
        doctorId: doctors[0]?._id || '',
        consultationType: 'Video Call',
        consultationDate: '',
        timeSlot: doctors[0]?.availableTimeSlots ? doctors[0].availableTimeSlots[0] : '',
        urgency: 'Normal',
        symptoms: '',
      });
      loadMyConsultations();
      setActiveTab('my-consultations');
    } catch (err) {
      alert(err.message || 'Failed to submit consultation request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consultation-page" style={{ padding: '48px 0 80px' }}>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage('')}
        />
      )}

      <div className="container">
        {/* Page Header */}
        <div className="section-header">
          <span className="section-tag">Telehealth Portal</span>
          <h1 className="section-title">Online Medicare Consultation</h1>
          <p className="section-subtitle">
            Connect face-to-face with certified physicians via encrypted video calls, voice calls, or instant medical messaging.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="filter-tabs" style={{ justifyContent: 'center', marginBottom: '36px' }}>
          <button
            className={`tab-btn ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveTab('request')}
          >
            <Video size={18} /> Request Consultation
          </button>
          <button
            className={`tab-btn ${activeTab === 'my-consultations' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('my-consultations');
              loadMyConsultations();
            }}
          >
            <Clock size={18} /> My Virtual Consultations ({myConsultations.length})
          </button>
        </div>

        {activeTab === 'request' ? (
          <div className="hero-grid" style={{ alignItems: 'flex-start' }}>
            {/* Consultation Request Form */}
            <div className="auth-card" style={{ maxWidth: '100%' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
                Consultation Request Form
              </h3>

              <form onSubmit={handleSubmit}>
                {/* Select Doctor */}
                <div className="form-group">
                  <label className="form-label">Select Specialist Doctor *</label>
                  <select
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

                {/* Consultation Type & Urgency */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Consultation Mode *</label>
                    <select
                      value={formData.consultationType}
                      onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                      className="form-select"
                    >
                      <option value="Video Call">High-Definition Video Call</option>
                      <option value="Audio Call">Direct Voice Call</option>
                      <option value="Live Chat">Encrypted Live Chat</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Urgency Level</label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      className="form-select"
                    >
                      <option value="Normal">Normal (Routine Care)</option>
                      <option value="Urgent">Urgent (Needs Attention Today)</option>
                      <option value="Immediate">Immediate Priority</option>
                    </select>
                  </div>
                </div>

                {/* Date & Time Slot */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Preferred Date *</label>
                    <input
                      type="date"
                      value={formData.consultationDate}
                      onChange={(e) => setFormData({ ...formData, consultationDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Time Slot *</label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="form-select"
                      required
                    >
                      {selectedDoctorObj?.availableTimeSlots?.map((slot, i) => (
                        <option key={i} value={slot}>
                          {slot}
                        </option>
                      ))}
                      {!selectedDoctorObj?.availableTimeSlots && (
                        <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Symptoms / Concerns */}
                <div className="form-group">
                  <label className="form-label">Describe Your Health Concerns / Symptoms *</label>
                  <textarea
                    rows={4}
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    placeholder="Provide details about your symptoms, duration, current medications, or allergies..."
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
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>Confirm Consultation Request</span>
                  )}
                </button>
              </form>
            </div>

            {/* Doctor Info Card Preview */}
            <div>
              {selectedDoctorObj && (
                <div className="doctor-card" style={{ padding: '28px' }}>
                  <div className="doctor-card-badge-row">
                    <span className="specialization-pill">{selectedDoctorObj.specialization}</span>
                    <span className="status-badge available-badge">Online Specialist</span>
                  </div>

                  <div className="doctor-card-header">
                    <img
                      src={selectedDoctorObj.image}
                      alt={selectedDoctorObj.name}
                      className="doctor-avatar-box"
                      style={{ width: '84px', height: '84px', borderRadius: 'var(--radius-md)' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedDoctorObj.name}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{selectedDoctorObj.qualifications}</p>
                      <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>
                        {selectedDoctorObj.experience} Years Experience
                      </div>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    {selectedDoctorObj.bio}
                  </p>

                  <div style={{ padding: '16px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', border: '1px solid #ccfbf1', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Consultation Fee:</span>
                      <strong style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>${selectedDoctorObj.consultationFee}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Telehealth Security:</span>
                      <strong style={{ color: 'var(--accent-green)', fontSize: '0.9rem' }}>256-bit Encrypted</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={16} className="trust-icon" />
                      <span>Instant digital room code generated upon booking</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={16} className="trust-icon" />
                      <span>Digital prescription available immediately after session</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* My Virtual Consultations Tab */
          <div>
            {!isAuthenticated ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ marginBottom: '12px' }}>Please Sign In to View Your Consultations</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Log in to your Medicare patient account to view your scheduled calls and digital prescriptions.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  Sign In Now
                </button>
              </div>
            ) : fetchingConsultations ? (
              <div className="loading-screen">
                <div className="spinner"></div>
                <p>Retrieving your online consultations...</p>
              </div>
            ) : myConsultations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <Video size={40} style={{ color: 'var(--text-light)', margin: '0 auto 16px' }} />
                <h3>No Online Consultations Found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                  You haven't requested any virtual appointments yet.
                </p>
                <button className="btn btn-primary" onClick={() => setActiveTab('request')}>
                  Request a Consultation
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myConsultations.map((item) => (
                  <div key={item._id} className="appointment-card">
                    <img
                      src={item.doctor?.image}
                      alt={item.doctor?.name}
                      className="appointment-doctor-img"
                    />

                    <div className="appointment-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4>{item.doctor?.name}</h4>
                        <span className={`appointment-status-pill status-${item.status}`}>
                          {item.status}
                        </span>
                        <span className="specialization-pill" style={{ fontSize: '0.75rem' }}>
                          {item.consultationType}
                        </span>
                      </div>

                      <div className="appointment-meta-row">
                        <div className="appointment-meta-item">
                          <Calendar size={16} />
                          <span>{item.consultationDate}</span>
                        </div>
                        <div className="appointment-meta-item">
                          <Clock size={16} />
                          <span>{item.timeSlot}</span>
                        </div>
                        <div className="appointment-meta-item">
                          <Shield size={16} />
                          <span>Priority: {item.urgency}</span>
                        </div>
                      </div>

                      <div className="appointment-symptoms">
                        <strong>Health Concern:</strong> {item.symptoms}
                      </div>

                      {item.prescription && (
                        <div style={{ marginTop: '8px', padding: '8px 12px', background: '#dcfce7', borderRadius: 'var(--radius-sm)', color: '#166534', fontSize: '0.88rem' }}>
                          <strong>Doctor's Prescription:</strong> {item.prescription}
                        </div>
                      )}
                    </div>

                    <div className="appointment-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveRoomConsultation(item)}
                      >
                        <Video size={16} /> Join Consultation Room
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Interactive Virtual Telehealth Room Modal */}
        <Modal
          isOpen={!!activeRoomConsultation}
          onClose={() => setActiveRoomConsultation(null)}
          title={`Virtual Medical Room - ${activeRoomConsultation?.consultationType || 'Telehealth'}`}
          maxWidth="720px"
        >
          {activeRoomConsultation && (
            <div>
              {/* Virtual Video Box Screen Simulation */}
              <div
                style={{
                  position: 'relative',
                  backgroundColor: '#0f172a',
                  borderRadius: 'var(--radius-lg)',
                  height: '320px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  overflow: 'hidden',
                  marginBottom: '20px',
                }}
              >
                <img
                  src={activeRoomConsultation.doctor?.image}
                  alt={activeRoomConsultation.doctor?.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.75)',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span className="status-dot"></span> Live Telehealth Session
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{activeRoomConsultation.doctor?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>{activeRoomConsultation.doctor?.specialization}</div>
                </div>

                {/* Patient Inset Preview */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    width: '100px',
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#1e293b',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  <span>You (Live)</span>
                </div>
              </div>

              {/* Consultation Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Meeting Room Link</span>
                  <a
                    href={activeRoomConsultation.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', wordBreak: 'break-all' }}
                  >
                    {activeRoomConsultation.meetingLink}
                  </a>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Consultation Status</span>
                  <span className={`appointment-status-pill status-${activeRoomConsultation.status}`}>
                    {activeRoomConsultation.status}
                  </span>
                </div>
              </div>

              {activeRoomConsultation.prescription && (
                <div style={{ padding: '14px', background: '#dcfce7', borderRadius: 'var(--radius-md)', marginBottom: '20px', color: '#166534' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '6px' }}>
                    <Pill size={18} /> Official Prescription:
                  </div>
                  <p style={{ fontSize: '0.92rem' }}>{activeRoomConsultation.prescription}</p>
                </div>
              )}

              <button
                className="btn btn-outline btn-block"
                onClick={() => setActiveRoomConsultation(null)}
              >
                Close Medical Room
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
