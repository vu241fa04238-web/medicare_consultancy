import React from 'react';
import { ServiceCard } from '../components/ServiceCard';
import {
  Heart,
  Activity,
  Stethoscope,
  Award,
  Shield,
  Pill,
  Eye,
  CheckCircle,
} from '../components/Icons';

export const ServicesPage = () => {
  const allServices = [
    {
      icon: Heart,
      title: 'Cardiology',
      specialization: 'Cardiologist',
      description: 'Advanced cardiovascular diagnosis, preventive heart care, hypertension control, ECG, and echocardiogram evaluations.',
      features: ['Coronary Risk Assessment', 'ECG & Echo Screenings', 'Blood Pressure Management'],
    },
    {
      icon: Activity,
      title: 'Neurology',
      specialization: 'Neurologist',
      description: 'Specialized diagnosis and treatment of headaches, migraines, neuropathic conditions, epilepsy, and neurological rehabilitation.',
      features: ['Chronic Migraine Care', 'Nerve Health Assessments', 'Cognitive Evaluations'],
    },
    {
      icon: Stethoscope,
      title: 'Pediatrics',
      specialization: 'Pediatrician',
      description: 'Compassionate pediatric healthcare from infancy through adolescence, including growth milestones and vaccination schedules.',
      features: ['Child Wellness Screenings', 'Vaccine Immunization', 'Pediatric Nutrition'],
    },
    {
      icon: Award,
      title: 'Dermatology',
      specialization: 'Dermatologist',
      description: 'Comprehensive clinical skincare, acne solutions, eczema management, allergy identification, and aesthetic skin health.',
      features: ['Acne & Scar Therapies', 'Allergy Screenings', 'Preventive Skin Exams'],
    },
    {
      icon: Pill,
      title: 'Orthopedics',
      specialization: 'Orthopedic Surgeon',
      description: 'Joint preservation, sports medicine, knee & hip arthroscopy, tendon repair, and fracture rehabilitation programs.',
      features: ['Joint Pain Solutions', 'Sports Injury Rehab', 'Posture & Spine Care'],
    },
    {
      icon: Shield,
      title: 'General Medicine',
      specialization: 'General Physician',
      description: 'Primary medical care, regular health checkups, chronic diabetes tracking, viral fever treatments, and preventive advice.',
      features: ['Annual Health Checkups', 'Diabetes & Thyroid Clinic', 'Preventive Health Plans'],
    },
    {
      icon: Eye,
      title: 'Ophthalmology',
      specialization: 'Ophthalmologist',
      description: 'Optical examinations, cataract consultations, digital screen strain therapies, and personalized vision correction guidance.',
      features: ['Refraction & Vision Exams', 'Digital Eye Strain Care', 'Glaucoma Screenings'],
    },
    {
      icon: Stethoscope,
      title: 'Dentistry',
      specialization: 'Dentist',
      description: 'Preventive dental hygiene, pain-free root canals, cosmetic teeth whitening, aligners, and comprehensive oral care.',
      features: ['Dental Cleanings', 'Cavity Fillings', 'Cosmetic Dental Makeovers'],
    },
  ];

  return (
    <div className="services-page" style={{ padding: '48px 0 80px' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Clinical Departments</span>
          <h1 className="section-title">World-Class Medical Services</h1>
          <p className="section-subtitle">
            Explore Medicare's full spectrum of certified healthcare services, led by board-certified specialists equipped with modern medical tools.
          </p>
        </div>

        <div className="services-grid">
          {allServices.map((service, idx) => (
            <ServiceCard key={idx} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
};
