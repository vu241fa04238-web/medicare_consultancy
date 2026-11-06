import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DoctorCard } from '../components/DoctorCard';
import { Modal } from '../components/Modal';
import {
  Search,
  Star,
  Clock,
  Calendar,
  Video,
  MapPin,
  Award,
  Filter,
  CheckCircle,
  X,
} from '../components/Icons';

export const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'All');
  const [minExperience, setMinExperience] = useState('');
  const [maxFee, setMaxFee] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const navigate = useNavigate();

  // Load specializations on mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.getSpecializations();
        if (res.specializations) {
          setSpecializations(res.specializations);
        }
      } catch (err) {
        console.error('Failed to load specializations', err);
      }
    };
    fetchSpecializations();
  }, []);

  // Fetch doctors whenever filters change
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await api.getDoctors({
          search,
          specialization,
          minExperience,
          maxFee,
          availableOnly: availableOnly ? 'true' : '',
        });
        setDoctors(data.doctors || []);
      } catch (err) {
        console.error('Failed to fetch doctors', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchDoctors();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, specialization, minExperience, maxFee, availableOnly]);

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('All');
    setMinExperience('');
    setMaxFee('');
    setAvailableOnly(false);
    setSearchParams({});
  };

  return (
    <div className="doctors-page" style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-header">
          <span className="section-tag">Medicare Medical Directory</span>
          <h1 className="section-title">Certified Medical Specialists</h1>
          <p className="section-subtitle">
            Find and consult highly qualified doctors across multiple specialties. Search by department, clinical experience, or name.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="toolbar-card">
          <div className="toolbar-grid">
            {/* Search Input */}
            <div className="form-input-wrapper">
              <Search size={18} className="form-input-icon" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by doctor name, specialty, or clinic..."
                className="form-input form-input-with-icon"
              />
            </div>

            {/* Specialization Filter */}
            <div>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="form-select"
              >
                <option value="All">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Consultation Fee */}
            <div>
              <select
                value={maxFee}
                onChange={(e) => setMaxFee(e.target.value)}
                className="form-select"
              >
                <option value="">Any Consultation Fee</option>
                <option value="80">Under $80</option>
                <option value="100">Under $100</option>
                <option value="130">Under $130</option>
                <option value="160">Under $160</option>
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <button
                type="button"
                className="btn btn-outline btn-block"
                onClick={handleResetFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Quick Specialization Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>
              Quick Filters:
            </span>
            <button
              type="button"
              onClick={() => setSpecialization('All')}
              className={`btn btn-sm ${specialization === 'All' ? 'btn-primary' : 'btn-outline'}`}
            >
              All
            </button>
            {specializations.slice(0, 6).map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => setSpecialization(spec)}
                className={`btn btn-sm ${specialization.toLowerCase() === spec.toLowerCase() ? 'btn-primary' : 'btn-outline'}`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid / Results */}
        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Searching specialist physicians...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-alt)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Search size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
              No Doctors Found
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px' }}>
              We could not find any doctors matching your current search criteria. Try clearing some filters.
            </p>
            <button className="btn btn-primary" onClick={handleResetFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Showing <strong>{doctors.length}</strong> certified doctors
              </span>
            </div>

            <div className="services-grid">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onViewProfile={(doc) => setSelectedDoctor(doc)}
                />
              ))}
            </div>
          </>
        )}

        {/* Doctor Details Modal */}
        <Modal
          isOpen={!!selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          title={selectedDoctor?.name || 'Doctor Profile'}
        >
          {selectedDoctor && (
            <div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  style={{ width: '92px', height: '92px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedDoctor.name}</h4>
                  <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                    {selectedDoctor.specialization}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {selectedDoctor.qualifications}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontWeight: 700 }}>{selectedDoctor.rating}</span>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
                      ({selectedDoctor.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <h5 style={{ fontWeight: 700, marginBottom: '6px' }}>Doctor Biography & Background</h5>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {selectedDoctor.bio}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Experience</span>
                  <strong>{selectedDoctor.experience} Years</strong>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Fee</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>${selectedDoctor.consultationFee}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontWeight: 700, marginBottom: '6px' }}>Clinic Location</h5>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {selectedDoctor.clinicAddress}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h5 style={{ fontWeight: 700, marginBottom: '8px' }}>Available Consultation Days</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedDoctor.availableDays?.map((day, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  className="btn btn-outline btn-block"
                  onClick={() => {
                    const id = selectedDoctor._id;
                    setSelectedDoctor(null);
                    navigate(`/consultation?doctorId=${id}`);
                  }}
                >
                  <Video size={18} /> Online Consultation
                </button>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => {
                    const id = selectedDoctor._id;
                    setSelectedDoctor(null);
                    navigate(`/book-appointment?doctorId=${id}`);
                  }}
                >
                  <Calendar size={18} /> Book In-Clinic Visit
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
