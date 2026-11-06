import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';
import {
  Shield,
  User,
  Calendar,
  Clock,
  Heart,
  Plus,
  Trash,
  Edit,
  CheckCircle,
  AlertCircle,
  Video,
  Search,
  DollarSign,
  Award,
} from '../components/Icons';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'doctors', 'patients', 'consultations'
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Tab Data States
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Search & Filter
  const [appointmentFilter, setAppointmentFilter] = useState('All');
  const [appointmentSearch, setAppointmentSearch] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Doctor Modal (Create / Edit)
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'Cardiologist',
    qualifications: '',
    experience: '',
    consultationFee: '',
    bio: '',
    image: '',
    clinicAddress: '',
  });

  // Appointment Status Modal
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Confirmed');
  const [statusNotes, setStatusNotes] = useState('');

  // Prescription / Consultation Modal
  const [consultModal, setConsultModal] = useState(null);
  const [consultPrescription, setConsultPrescription] = useState('');
  const [consultNotes, setConsultNotes] = useState('');
  const [consultStatus, setConsultStatus] = useState('Scheduled');

  // 1. Fetch Stats
  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.getAdminStats();
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // 2. Fetch Active Tab Data
  const loadTabData = async () => {
    try {
      setLoadingData(true);
      if (activeTab === 'appointments') {
        const res = await api.getAllAppointments({
          status: appointmentFilter,
          search: appointmentSearch,
        });
        setAppointments(res.appointments || []);
      } else if (activeTab === 'doctors') {
        const res = await api.getDoctors();
        setDoctors(res.doctors || []);
      } else if (activeTab === 'patients') {
        const res = await api.getAdminPatients();
        setPatients(res.patients || []);
      } else if (activeTab === 'consultations') {
        const res = await api.getAllConsultations();
        setConsultations(res.consultations || []);
      }
    } catch (err) {
      console.error('Failed to load tab data', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadTabData();
  }, [activeTab, appointmentFilter, appointmentSearch]);

  // Handle Doctor Add/Edit Submit
  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await api.updateDoctor(editingDoctor._id, doctorForm);
        setToastMessage(`Doctor ${doctorForm.name} updated successfully!`);
      } else {
        await api.createDoctor(doctorForm);
        setToastMessage(`Doctor ${doctorForm.name} added successfully!`);
      }
      setToastType('success');
      setDoctorModalOpen(false);
      setEditingDoctor(null);
      loadTabData();
      loadStats();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleOpenEditDoctor = (doc) => {
    setEditingDoctor(doc);
    setDoctorForm({
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      specialization: doc.specialization,
      qualifications: doc.qualifications,
      experience: doc.experience,
      consultationFee: doc.consultationFee,
      bio: doc.bio || '',
      image: doc.image || '',
      clinicAddress: doc.clinicAddress || '',
    });
    setDoctorModalOpen(true);
  };

  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove Dr. ${name}?`)) return;
    try {
      await api.deleteDoctor(id);
      setToastMessage('Doctor removed successfully');
      setToastType('success');
      loadTabData();
      loadStats();
    } catch (err) {
      alert(err.message || 'Failed to delete doctor');
    }
  };

  // Handle Appointment Status Update
  const handleUpdateAppointmentStatus = async () => {
    if (!statusModalApp) return;
    try {
      await api.updateAppointmentStatus(statusModalApp._id, newStatus, statusNotes);
      setToastMessage(`Appointment marked as ${newStatus}`);
      setToastType('success');
      setStatusModalApp(null);
      loadTabData();
      loadStats();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Handle Consultation Status & Prescription Submit
  const handleSaveConsultation = async () => {
    if (!consultModal) return;
    try {
      await api.updateConsultation(consultModal._id, {
        status: consultStatus,
        prescription: consultPrescription,
        doctorNotes: consultNotes,
      });
      setToastMessage('Consultation and prescription updated!');
      setToastType('success');
      setConsultModal(null);
      loadTabData();
    } catch (err) {
      alert(err.message || 'Failed to update consultation');
    }
  };

  // Delete Patient
  const handleDeletePatient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove patient ${name} and their records?`)) return;
    try {
      await api.deletePatient(id);
      setToastMessage('Patient account removed successfully');
      setToastType('success');
      loadTabData();
      loadStats();
    } catch (err) {
      alert(err.message || 'Failed to remove patient');
    }
  };

  return (
    <div className="admin-page" style={{ padding: '40px 0 80px' }}>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}

      <div className="container">
        {/* Admin Header Banner */}
        <div className="admin-header-banner" style={{ padding: '32px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>
                <Shield size={16} /> Medicare Control Center
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Master Dashboard</h1>
              <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                Manage hospital doctors, patient appointments, telehealth consultations, and clinic statistics.
              </p>
            </div>

            <button
              className="btn btn-primary"
              style={{ backgroundColor: '#ffffff', color: 'var(--primary)', boxShadow: 'var(--shadow-md)' }}
              onClick={() => {
                setEditingDoctor(null);
                setDoctorForm({
                  name: '',
                  email: '',
                  phone: '',
                  specialization: 'Cardiologist',
                  qualifications: '',
                  experience: '',
                  consultationFee: '',
                  bio: '',
                  image: '',
                  clinicAddress: '',
                });
                setDoctorModalOpen(true);
              }}
            >
              <Plus size={18} /> Add New Doctor
            </button>
          </div>
        </div>

        {/* 4 Key Statistics Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{stats?.totalDoctors || 0}</div>
              <div className="admin-stat-title">Active Doctors</div>
            </div>
            <div className="admin-stat-icon-box" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Heart size={26} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{stats?.totalPatients || 0}</div>
              <div className="admin-stat-title">Registered Patients</div>
            </div>
            <div className="admin-stat-icon-box" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <User size={26} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{stats?.totalAppointments || 0}</div>
              <div className="admin-stat-title">Total Appointments</div>
            </div>
            <div className="admin-stat-icon-box" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
              <Calendar size={26} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">${stats?.totalRevenue || 0}</div>
              <div className="admin-stat-title">Consultation Revenue</div>
            </div>
            <div className="admin-stat-icon-box" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
              <Clock size={26} />
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="filter-tabs" style={{ marginBottom: '28px' }}>
          <button
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={18} /> Manage Appointments ({stats?.totalAppointments || appointments.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <Heart size={18} /> Manage Doctors ({stats?.totalDoctors || doctors.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <User size={18} /> Registered Patients ({stats?.totalPatients || patients.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'consultations' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            <Video size={18} /> Online Consultations ({stats?.totalConsultations || consultations.length})
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: MANAGE APPOINTMENTS                                     */}
        {/* ============================================================== */}
        {activeTab === 'appointments' && (
          <div>
            {/* Filter toolbar */}
            <div className="toolbar-card" style={{ marginBottom: '20px' }}>
              <div className="toolbar-grid" style={{ gridTemplateColumns: '2fr 1fr auto' }}>
                <div className="form-input-wrapper">
                  <Search size={18} className="form-input-icon" />
                  <input
                    type="text"
                    value={appointmentSearch}
                    onChange={(e) => setAppointmentSearch(e.target.value)}
                    placeholder="Search by patient name, doctor, or symptom..."
                    className="form-input form-input-with-icon"
                  />
                </div>

                <select
                  value={appointmentFilter}
                  onChange={(e) => setAppointmentFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending Confirmation</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setAppointmentSearch('');
                    setAppointmentFilter('All');
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {loadingData ? (
              <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 'var(--radius-lg)' }}>
                <h3>No Appointments Found</h3>
                <p style={{ color: 'var(--text-muted)' }}>No records match your filters.</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date & Slot</th>
                      <th>Fee</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <strong>{app.patientName}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {app.patientPhone} | {app.patientAge}y ({app.patientGender})
                          </div>
                        </td>
                        <td>
                          <div className="table-user-cell">
                            <img
                              src={app.doctor?.image}
                              alt={app.doctor?.name}
                              className="table-avatar-img"
                            />
                            <div>
                              <strong>{app.doctor?.name}</strong>
                              <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                                {app.doctor?.specialization}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>{app.appointmentDate}</strong>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{app.timeSlot}</div>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--primary)' }}>${app.fee}</strong>
                        </td>
                        <td>
                          <span className={`appointment-status-pill status-${app.status}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setStatusModalApp(app);
                              setNewStatus(app.status);
                              setStatusNotes(app.notes || '');
                            }}
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MANAGE DOCTORS                                          */}
        {/* ============================================================== */}
        {activeTab === 'doctors' && (
          <div>
            {loadingData ? (
              <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading doctors...</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Specialty & Experience</th>
                      <th>Fee</th>
                      <th>Contact</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doc) => (
                      <tr key={doc._id}>
                        <td>
                          <div className="table-user-cell">
                            <img src={doc.image} alt={doc.name} className="table-avatar-img" />
                            <div>
                              <strong>{doc.name}</strong>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{doc.qualifications}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="specialization-pill">{doc.specialization}</span>
                          <div style={{ fontSize: '0.82rem', marginTop: '4px', color: 'var(--text-muted)' }}>
                            {doc.experience} Years of Practice
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>${doc.consultationFee}</strong>
                        </td>
                        <td>
                          <div>{doc.email}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{doc.phone}</div>
                        </td>
                        <td>
                          <span className="status-badge available-badge">Active</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleOpenEditDoctor(doc)}
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteDoctor(doc._id, doc.name)}
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: REGISTERED PATIENTS                                     */}
        {/* ============================================================== */}
        {activeTab === 'patients' && (
          <div>
            {loadingData ? (
              <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading registered patients...</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Email & Phone</th>
                      <th>Age / Gender</th>
                      <th>Blood Group</th>
                      <th>Appointments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <strong>{p.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Joined {new Date(p.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div>{p.email}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.phone}</div>
                        </td>
                        <td>
                          {p.age}y / {p.gender}
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            {p.bloodGroup || 'Unknown'}
                          </span>
                        </td>
                        <td>
                          <span className="specialization-pill">
                            {p.appointmentCount || 0} Bookings
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeletePatient(p._id, p.name)}
                          >
                            <Trash size={14} /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: ONLINE CONSULTATIONS                                    */}
        {/* ============================================================== */}
        {activeTab === 'consultations' && (
          <div>
            {loadingData ? (
              <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading consultations...</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date / Slot</th>
                      <th>Mode</th>
                      <th>Status</th>
                      <th>Prescription & Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultations.map((c) => (
                      <tr key={c._id}>
                        <td>
                          <strong>{c.user?.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.user?.phone}</div>
                        </td>
                        <td>
                          <strong>{c.doctor?.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{c.doctor?.specialization}</div>
                        </td>
                        <td>
                          <strong>{c.consultationDate}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.timeSlot}</div>
                        </td>
                        <td>
                          <span className="specialization-pill">{c.consultationType}</span>
                        </td>
                        <td>
                          <span className={`appointment-status-pill status-${c.status}`}>
                            {c.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setConsultModal(c);
                              setConsultStatus(c.status);
                              setConsultPrescription(c.prescription || '');
                              setConsultNotes(c.doctorNotes || '');
                            }}
                          >
                            Prescribe / Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Doctor Create / Edit Modal */}
        <Modal
          isOpen={doctorModalOpen}
          onClose={() => setDoctorModalOpen(false)}
          title={editingDoctor ? 'Edit Doctor Details' : 'Add New Doctor to Medicare'}
        >
          <form onSubmit={handleDoctorSubmit}>
            <div className="form-group">
              <label className="form-label">Doctor Full Name *</label>
              <input
                type="text"
                value={doctorForm.name}
                onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                placeholder="e.g. Dr. Sarah Jenkins"
                className="form-input"
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  value={doctorForm.email}
                  onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                  placeholder="doctor@medicare.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  value={doctorForm.phone}
                  onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <select
                  value={doctorForm.specialization}
                  onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                  className="form-select"
                  required
                >
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Ophthalmologist">Ophthalmologist</option>
                  <option value="Dentist">Dentist</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Qualifications *</label>
                <input
                  type="text"
                  value={doctorForm.qualifications}
                  onChange={(e) => setDoctorForm({ ...doctorForm, qualifications: e.target.value })}
                  placeholder="e.g. MD, FACC - Harvard"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Experience (Years) *</label>
                <input
                  type="number"
                  value={doctorForm.experience}
                  onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                  min="0"
                  placeholder="10"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Fee ($) *</label>
                <input
                  type="number"
                  value={doctorForm.consultationFee}
                  onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })}
                  min="0"
                  placeholder="100"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Doctor Avatar Image URL</label>
              <input
                type="url"
                value={doctorForm.image}
                onChange={(e) => setDoctorForm({ ...doctorForm, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Clinic / Hospital Suite Address</label>
              <input
                type="text"
                value={doctorForm.clinicAddress}
                onChange={(e) => setDoctorForm({ ...doctorForm, clinicAddress: e.target.value })}
                placeholder="e.g. Medicare Pavilion, Suite 402"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Doctor Bio & Speciality Overview</label>
              <textarea
                rows={3}
                value={doctorForm.bio}
                onChange={(e) => setDoctorForm({ ...doctorForm, bio: e.target.value })}
                className="form-textarea"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              {editingDoctor ? 'Save Changes' : 'Add Doctor'}
            </button>
          </form>
        </Modal>

        {/* Appointment Status Modal */}
        <Modal
          isOpen={!!statusModalApp}
          onClose={() => setStatusModalApp(null)}
          title="Update Appointment Status"
        >
          {statusModalApp && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <p>
                  Patient: <strong>{statusModalApp.patientName}</strong>
                </p>
                <p>
                  Doctor: <strong>{statusModalApp.doctor?.name}</strong>
                </p>
                <p>
                  Scheduled: <strong>{statusModalApp.appointmentDate} ({statusModalApp.timeSlot})</strong>
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Internal Clinic Remark / Note</label>
                <textarea
                  rows={3}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g. Confirmed with patient, bring lab tests..."
                  className="form-textarea"
                ></textarea>
              </div>

              <button className="btn btn-primary btn-block" onClick={handleUpdateAppointmentStatus}>
                Update Appointment
              </button>
            </div>
          )}
        </Modal>

        {/* Consultation Prescription Modal */}
        <Modal
          isOpen={!!consultModal}
          onClose={() => setConsultModal(null)}
          title="Doctor Consultation & Prescription"
        >
          {consultModal && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <p>
                  Patient: <strong>{consultModal.user?.name}</strong> ({consultModal.user?.email})
                </p>
                <p>
                  Symptoms: <em>"{consultModal.symptoms}"</em>
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  value={consultStatus}
                  onChange={(e) => setConsultStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="Requested">Requested</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Official Prescription / Recommended Medicine</label>
                <textarea
                  rows={4}
                  value={consultPrescription}
                  onChange={(e) => setConsultPrescription(e.target.value)}
                  placeholder="e.g. Paracetamol 500mg, rest for 2 days..."
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Doctor Notes / Follow-up Guidance</label>
                <textarea
                  rows={2}
                  value={consultNotes}
                  onChange={(e) => setConsultNotes(e.target.value)}
                  placeholder="Internal notes or patient advice..."
                  className="form-textarea"
                ></textarea>
              </div>

              <button className="btn btn-primary btn-block" onClick={handleSaveConsultation}>
                Save Prescription & Update
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
