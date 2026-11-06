import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  Stethoscope,
  Phone,
  Video,
} from '../components/Icons';

export const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppToCancel, setSelectedAppToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // View details modal
  const [viewModalApp, setViewModalApp] = useState(null);

  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.getMyAppointments();
      if (res.appointments) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenCancel = (app) => {
    setSelectedAppToCancel(app);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppToCancel) return;
    try {
      setCancelling(true);
      await api.cancelAppointment(selectedAppToCancel._id, cancelReason);
      setToastMessage('Appointment has been cancelled successfully.');
      setToastType('success');
      setCancelModalOpen(false);
      fetchAppointments();
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((app) => {
    if (activeFilter === 'All') return true;
    return app.status === activeFilter;
  });

  return (
    <div className="my-appointments-page" style={{ padding: '48px 0 80px' }}>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}

      <div className="container">
        {/* Header */}
        <div className="appointments-page-header">
          <div>
            <span className="section-tag">Patient Portal</span>
            <h1 className="section-title" style={{ marginBottom: '6px' }}>
              My Appointments
            </h1>
            <p className="section-subtitle">
              Manage your clinic consultations, view confirmation statuses, and download visit details.
            </p>
          </div>

          <Link to="/book-appointment" className="btn btn-primary">
            <Calendar size={18} /> Book New Appointment
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => {
            const count =
              status === 'All'
                ? appointments.length
                : appointments.filter((a) => a.status === status).length;
            return (
              <button
                key={status}
                className={`tab-btn ${activeFilter === status ? 'active' : ''}`}
                onClick={() => setActiveFilter(status)}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Appointment Cards List */}
        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading your appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
            }}
          >
            <Calendar size={48} style={{ color: 'var(--text-light)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
              No Appointments Found
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              {activeFilter === 'All'
                ? "You haven't booked any medical appointments yet."
                : `No appointments with status "${activeFilter}".`}
            </p>
            <Link to="/book-appointment" className="btn btn-primary">
              Book an Appointment Today
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredAppointments.map((app) => (
              <div key={app._id} className="appointment-card">
                <img
                  src={app.doctor?.image}
                  alt={app.doctor?.name}
                  className="appointment-doctor-img"
                />

                <div className="appointment-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h4>{app.doctor?.name}</h4>
                    <span className={`appointment-status-pill status-${app.status}`}>
                      {app.status}
                    </span>
                    <span className="specialization-pill" style={{ fontSize: '0.75rem' }}>
                      {app.doctor?.specialization}
                    </span>
                  </div>

                  <div className="appointment-meta-row">
                    <div className="appointment-meta-item">
                      <Calendar size={16} />
                      <span>{app.appointmentDate}</span>
                    </div>
                    <div className="appointment-meta-item">
                      <Clock size={16} />
                      <span>{app.timeSlot}</span>
                    </div>
                    <div className="appointment-meta-item">
                      <User size={16} />
                      <span>Patient: {app.patientName} ({app.patientGender}, {app.patientAge}y)</span>
                    </div>
                    <div className="appointment-meta-item">
                      <MapPin size={16} />
                      <span>{app.doctor?.clinicAddress || 'Medicare Main Center'}</span>
                    </div>
                  </div>

                  <div className="appointment-symptoms">
                    <strong>Reason for visit:</strong> {app.symptoms}
                  </div>

                  {app.notes && (
                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#0f766e', fontStyle: 'italic' }}>
                      Clinic remark: {app.notes}
                    </div>
                  )}
                </div>

                <div className="appointment-actions">
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>Fee</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ${app.fee}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setViewModalApp(app)}
                    >
                      Details
                    </button>

                    {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenCancel(app)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Details Modal */}
        <Modal
          isOpen={!!viewModalApp}
          onClose={() => setViewModalApp(null)}
          title="Appointment Summary"
        >
          {viewModalApp && (
            <div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                <img
                  src={viewModalApp.doctor?.image}
                  alt={viewModalApp.doctor?.name}
                  style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{viewModalApp.doctor?.name}</h4>
                  <div style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    {viewModalApp.doctor?.specialization}
                  </div>
                  <span className={`appointment-status-pill status-${viewModalApp.status}`}>
                    {viewModalApp.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Appointment ID:</span>
                  <strong style={{ fontFamily: 'monospace' }}>#{viewModalApp._id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Consultation Date:</span>
                  <strong>{viewModalApp.appointmentDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Time Slot:</span>
                  <strong>{viewModalApp.timeSlot}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Mode:</span>
                  <strong>{viewModalApp.appointmentType}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Patient Name:</span>
                  <strong>{viewModalApp.patientName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Patient Phone:</span>
                  <strong>{viewModalApp.patientPhone}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Consultation Fee:</span>
                  <strong style={{ color: 'var(--primary)' }}>${viewModalApp.fee}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h5 style={{ fontWeight: 700, marginBottom: '6px' }}>Reported Symptoms:</h5>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{viewModalApp.symptoms}</p>
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={() => setViewModalApp(null)}
              >
                Close Summary
              </button>
            </div>
          )}
        </Modal>

        {/* Cancellation Confirmation Modal */}
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title="Cancel Appointment"
        >
          {selectedAppToCancel && (
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                Are you sure you want to cancel your appointment with{' '}
                <strong>{selectedAppToCancel.doctor?.name}</strong> on{' '}
                <strong>{selectedAppToCancel.appointmentDate}</strong>?
              </p>

              <div className="form-group">
                <label className="form-label">Cancellation Reason (Optional)</label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Schedule conflict, feeling better..."
                  className="form-textarea"
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  onClick={() => setCancelModalOpen(false)}
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-block"
                  disabled={cancelling}
                  onClick={handleConfirmCancel}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
