import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DoctorCard } from '../components/DoctorCard';
import { ServiceCard } from '../components/ServiceCard';
import { Modal } from '../components/Modal';
import {
  Heart,
  Calendar,
  Video,
  Shield,
  Clock,
  Star,
  CheckCircle,
  Activity,
  Award,
  Stethoscope,
  Pill,
  ArrowRight,
  Phone,
} from '../components/Icons';

export const HomePage = () => {
  const [popularDoctors, setPopularDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await api.getDoctors();
        if (data.doctors) {
          // Take top 4 doctors
          setPopularDoctors(data.doctors.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured doctors', err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const medicalServices = [
    {
      icon: Heart,
      title: 'Cardiology',
      specialization: 'Cardiologist',
      description: 'Comprehensive cardiovascular screening, blood pressure therapy, ECG monitoring, and preventive heart care.',
      features: ['Advanced ECG & Echo', 'Hypertension Clinic', 'Post-Op Heart Rehab'],
    },
    {
      icon: Activity,
      title: 'Neurology',
      specialization: 'Neurologist',
      description: 'Advanced brain and nerve diagnosis, migraine therapy, neuromuscular evaluations, and cognitive health.',
      features: ['Migraine Solutions', 'Nerve Conduction', 'Sleep & Stroke Care'],
    },
    {
      icon: Stethoscope,
      title: 'Pediatrics',
      specialization: 'Pediatrician',
      description: 'Dedicated healthcare for infants, children, and teens with developmental tracking and vaccination programs.',
      features: ['Newborn Assessments', 'Growth Monitoring', 'Immunization Hub'],
    },
    {
      icon: Award,
      title: 'Dermatology',
      specialization: 'Dermatologist',
      description: 'Clinical skincare, acne eradication, allergy diagnostics, aesthetic dermatology, and preventive checks.',
      features: ['Laser Skincare', 'Allergy Screenings', 'Psoriasis & Eczema'],
    },
    {
      icon: Shield,
      title: 'General Medicine',
      specialization: 'General Physician',
      description: 'First-line primary care, chronic illness control, seasonal fever treatments, and holistic wellness checks.',
      features: ['Routine Checkups', 'Diabetes Clinic', 'Infection Treatment'],
    },
    {
      icon: Pill,
      title: 'Orthopedics',
      specialization: 'Orthopedic Surgeon',
      description: 'Specialized joint restoration, sports injury rehabilitation, fracture recovery, and posture optimization.',
      features: ['Arthroscopy Care', 'Sports Recovery', 'Spine & Joint Health'],
    },
  ];

  const testimonials = [
    {
      name: 'Eleanor Vance',
      role: 'Cardiac Patient',
      comment: 'Booking an appointment was effortless. Dr. Vance was empathetic, listened to all my symptoms, and the digital consultation was crystal clear!',
      rating: 5,
    },
    {
      name: 'David Miller',
      role: 'Family Health Care',
      comment: 'Medicare is a lifesaver. We booked a pediatric consultation on a Sunday night and had prescription guidance within 15 minutes.',
      rating: 5,
    },
    {
      name: 'Sophia Adams',
      role: 'Dermatology Patient',
      comment: 'The dashboard is so modern and straightforward. I could track my scheduled dates, cancel or re-book with one click.',
      rating: 5,
    },
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Healthcare Banner */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge-pill">
                <Shield size={16} /> Certified Online Healthcare Network
              </div>
              <h1 className="hero-title">
                Your Health, Our Priority. <br />
                <span className="highlight-text">Consult Top Doctors</span> Online Anytime.
              </h1>
              <p className="hero-subtitle">
                Access verified medical specialists, schedule clinic appointments seamlessly, or connect through secure high-definition virtual consultations from the comfort of your home.
              </p>

              <div className="hero-cta-group">
                <Link to="/book-appointment" className="btn btn-primary btn-lg">
                  <Calendar size={20} />
                  <span>Book Appointment</span>
                </Link>
                <Link to="/consultation" className="btn btn-outline btn-lg">
                  <Video size={20} />
                  <span>Consult Online</span>
                </Link>
              </div>

              <div className="hero-trust-badges">
                <div className="trust-badge-item">
                  <CheckCircle size={18} className="trust-icon" />
                  <span>Verified Specialists</span>
                </div>
                <div className="trust-badge-item">
                  <CheckCircle size={18} className="trust-icon" />
                  <span>Instant Scheduling</span>
                </div>
                <div className="trust-badge-item">
                  <CheckCircle size={18} className="trust-icon" />
                  <span>Safe & Confidential</span>
                </div>
              </div>
            </div>

            <div className="hero-visual-card">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
                alt="Medicare Doctors Team"
                className="hero-main-img"
              />
              <div className="hero-floating-stat-card">
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Specialist Doctors</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">15K+</div>
                  <div className="stat-label">Happy Patients</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">4.9/5</div>
                  <div className="stat-label">Patient Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Statistics Counters */}
      <section className="stats-banner-section">
        <div className="container">
          <div className="stats-grid-row">
            <div className="stat-counter-card">
              <div className="stat-counter-icon">
                <Stethoscope size={24} />
              </div>
              <div>
                <div className="stat-counter-val">50+</div>
                <div className="stat-counter-text">Certified Doctors</div>
              </div>
            </div>
            <div className="stat-counter-card">
              <div className="stat-counter-icon">
                <Heart size={24} />
              </div>
              <div>
                <div className="stat-counter-val">15,000+</div>
                <div className="stat-counter-text">Recovered Patients</div>
              </div>
            </div>
            <div className="stat-counter-card">
              <div className="stat-counter-icon">
                <Video size={24} />
              </div>
              <div>
                <div className="stat-counter-val">8,500+</div>
                <div className="stat-counter-text">Virtual Consultations</div>
              </div>
            </div>
            <div className="stat-counter-card">
              <div className="stat-counter-icon">
                <Clock size={24} />
              </div>
              <div>
                <div className="stat-counter-val">24/7</div>
                <div className="stat-counter-text">Medical Emergency Desk</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Available Medical Services */}
      <section className="section-padding" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Medical Services</span>
            <h2 className="section-title">Comprehensive Healthcare Services</h2>
            <p className="section-subtitle">
              From routine wellness assessments to specialized treatments, our multidisciplinary team provides personalized medical attention.
            </p>
          </div>

          <div className="services-grid">
            {medicalServices.map((service, idx) => (
              <ServiceCard key={idx} {...service} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/services" className="btn btn-outline">
              <span>View All Medical Departments</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Popular Doctors Showcase */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Expert Physicians</span>
            <h2 className="section-title">Meet Our Popular Doctors</h2>
            <p className="section-subtitle">
              Consult with distinguished medical practitioners boasting decades of combined clinical excellence and patient-first care.
            </p>
          </div>

          {loadingDoctors ? (
            <div className="loading-screen">
              <div className="spinner"></div>
              <p>Loading certified doctors...</p>
            </div>
          ) : (
            <div className="services-grid">
              {popularDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onViewProfile={(doc) => setSelectedDoctor(doc)}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/doctors" className="btn btn-primary btn-lg">
              <span>Explore All Available Doctors</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Medicare */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="section-tag">Why Choose Medicare</span>
              <h2 className="section-title">The Smarter, Faster Way to Quality Medical Care</h2>
              <p className="hero-subtitle">
                We combine experienced doctors, intuitive appointment scheduling, and strict patient privacy protocols into one unified healthcare platform.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div className="stat-counter-icon" style={{ backgroundColor: '#ffffff' }}>
                    <Shield size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
                      100% Verified Specialists
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      Every medical professional on our platform undergoes strict credential verification and licensing background checks.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div className="stat-counter-icon" style={{ backgroundColor: '#ffffff' }}>
                    <Video size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
                      Telehealth Video & Audio Calls
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      Enjoy seamless encrypted remote consultations with digital prescriptions sent directly to your account.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div className="stat-counter-icon" style={{ backgroundColor: '#ffffff' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
                      No Long Hospital Queues
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      Choose your preferred day and time slot with instant status updates and appointment management.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
                alt="Medicare Technology"
                style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Patient Testimonials */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Patient Stories</span>
            <h2 className="section-title">Loved by Thousands of Patients</h2>
            <p className="section-subtitle">
              Read how Medicare has empowered individuals and families with timely medical advice and personalized care.
            </p>
          </div>

          <div className="services-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="service-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '16px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--text-main)', marginBottom: '20px', flex: 1, lineHeight: 1.6 }}>
                  "{t.comment}"
                </p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Doctor Profile Details Modal */}
      <Modal
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        title={selectedDoctor?.name || 'Doctor Profile'}
      >
        {selectedDoctor && (
          <div className="doctor-modal-detail">
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
              <img
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
                style={{ width: '90px', height: '90px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
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
                    ({selectedDoctor.reviewsCount} patient reviews)
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <h5 style={{ fontWeight: 700, marginBottom: '6px' }}>About Doctor</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {selectedDoctor.bio}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Clinical Experience</span>
                <strong>{selectedDoctor.experience} Years of Practice</strong>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Consultation Fee</span>
                <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>${selectedDoctor.consultationFee}</strong>
              </div>
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

            <div style={{ marginBottom: '24px' }}>
              <h5 style={{ fontWeight: 700, marginBottom: '8px' }}>Available Time Slots</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedDoctor.availableTimeSlots?.map((slot, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#f1f5f9',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                    }}
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
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
  );
};
