const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medicare_consultancy';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for seeding.');

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Consultation.deleteMany({});
    console.log('Previous records cleared.');

    // 1. Seed Users (Admin & Patient)
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const patientPasswordHash = await bcrypt.hash('patient123', 10);

    const admin = await User.create({
      name: 'Dr. Arthur Harris (Chief Admin)',
      email: 'admin@medicare.com',
      password: adminPasswordHash,
      phone: '+1 800-555-0199',
      age: 45,
      gender: 'Male',
      role: 'admin',
      bloodGroup: 'O+',
      address: 'Medicare Central Hospital, Administrative Wing',
    });

    const patient = await User.create({
      name: 'Sarah Jenkins',
      email: 'patient@medicare.com',
      password: patientPasswordHash,
      phone: '+1 555-014-8832',
      age: 29,
      gender: 'Female',
      role: 'patient',
      bloodGroup: 'A+',
      address: '742 Evergreen Terrace, Springfield',
      emergencyContact: '+1 555-019-9944',
    });

    console.log('Seeded Users:');
    console.log('  Admin: admin@medicare.com / admin123');
    console.log('  Patient: patient@medicare.com / patient123');

    // 2. Seed Doctors
    const doctorsData = [
      {
        name: 'Dr. Olivia Vance',
        email: 'olivia.vance@medicare.com',
        phone: '+1 555-234-1101',
        specialization: 'Cardiologist',
        qualifications: 'MD, FACC - Harvard Medical School',
        experience: 14,
        consultationFee: 120,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableTimeSlots: [
          '09:00 AM - 10:00 AM',
          '10:30 AM - 11:30 AM',
          '02:00 PM - 03:00 PM',
          '03:30 PM - 04:30 PM',
        ],
        bio: 'Dr. Olivia Vance is a board-certified Cardiologist with over 14 years of clinical experience in non-invasive cardiology, preventive heart care, and hypertension management.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        clinicAddress: 'Heart & Vascular Pavilion, Suite 101, New York',
        rating: 4.9,
        reviewsCount: 128,
        isAvailable: true,
      },
      {
        name: 'Dr. Marcus Reynolds',
        email: 'marcus.reynolds@medicare.com',
        phone: '+1 555-234-1102',
        specialization: 'Neurologist',
        qualifications: 'MD, PhD (Neuroscience) - Johns Hopkins',
        experience: 18,
        consultationFee: 150,
        availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
        availableTimeSlots: [
          '10:00 AM - 11:00 AM',
          '11:30 AM - 12:30 PM',
          '04:00 PM - 05:00 PM',
          '05:30 PM - 06:30 PM',
        ],
        bio: 'Senior consultant neurologist specializing in chronic migraine therapies, cognitive neuroscience, neurological diagnostics, and nerve health care.',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        clinicAddress: 'Brain & Spine Institute, 4th Floor, Boston',
        rating: 4.9,
        reviewsCount: 164,
        isAvailable: true,
      },
      {
        name: 'Dr. Sophia Martinez',
        email: 'sophia.martinez@medicare.com',
        phone: '+1 555-234-1103',
        specialization: 'Dermatologist',
        qualifications: 'MD, FAAD - Stanford Medicine',
        experience: 11,
        consultationFee: 95,
        availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableTimeSlots: [
          '09:30 AM - 10:30 AM',
          '11:00 AM - 12:00 PM',
          '02:30 PM - 03:30 PM',
          '04:00 PM - 05:00 PM',
        ],
        bio: 'Expert dermatologist dedicated to clinical skincare, allergy treatment, acne resolutions, laser therapy, and preventive skin cancer screenings.',
        image: 'https://images.unsplash.com/photo-1594824813571-638f026361ab?auto=format&fit=crop&w=600&q=80',
        clinicAddress: 'GlowSkin Clinic, Suite 210, San Francisco',
        rating: 4.8,
        reviewsCount: 92,
        isAvailable: true,
      },
      {
        name: 'Dr. Ethan Walker',
        email: 'ethan.walker@medicare.com',
        phone: '+1 555-234-1104',
        specialization: 'Pediatrician',
        qualifications: 'MD, FAAP - Columbia University',
        experience: 12,
        consultationFee: 85,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
        availableTimeSlots: [
          '08:30 AM - 09:30 AM',
          '10:00 AM - 11:00 AM',
          '01:30 PM - 02:30 PM',
          '03:00 PM - 04:00 PM',
        ],
        bio: 'Warm and compassionate child healthcare specialist focusing on infant development, pediatric nutrition, immunizations, and pediatric wellness.',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
        clinicAddress: 'Little Steps Child Care Center, Suite 12, Chicago',
        rating: 4.9,
        reviewsCount: 140,
        isAvailable: true,
      },
      {
        name: 'Dr. James Anderson',
        email: 'james.anderson@medicare.com',
        phone: '+1 555-234-1105',
        specialization: 'Orthopedic Surgeon',
        qualifications: 'MS (Ortho), Fellowship in Sports Medicine - Oxford',
        experience: 16,
        consultationFee: 135,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: [
          '09:00 AM - 10:00 AM',
          '11:00 AM - 12:00 PM',
          '02:00 PM - 03:00 PM',
          '04:00 PM - 05:00 PM',
        ],
        bio: 'Orthopedic specialist in joint preservation, sports injuries, knee and hip arthroscopy, and advanced musculoskeletal rehabilitation.',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
        clinicAddress: 'Orthopedic & Joint Center, Level 2, Dallas',
        rating: 4.7,
        reviewsCount: 88,
        isAvailable: true,
      },
      {
        name: 'Dr. Emily Chen',
        email: 'emily.chen@medicare.com',
        phone: '+1 555-234-1106',
        specialization: 'General Physician',
        qualifications: 'MBBS, MD (Internal Medicine) - Yale University',
        experience: 9,
        consultationFee: 70,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        availableTimeSlots: [
          '09:00 AM - 10:00 AM',
          '10:30 AM - 11:30 AM',
          '01:00 PM - 02:00 PM',
          '02:30 PM - 03:30 PM',
          '05:00 PM - 06:00 PM',
        ],
        bio: 'Primary care physician providing holistic healthcare, diabetic management, lifestyle counseling, routine health screenings, and acute illness treatment.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        clinicAddress: 'Medicare Community Health Wing, Seattle',
        rating: 4.9,
        reviewsCount: 210,
        isAvailable: true,
      },
      {
        name: 'Dr. David Kim',
        email: 'david.kim@medicare.com',
        phone: '+1 555-234-1107',
        specialization: 'Ophthalmologist',
        qualifications: 'MD, FACS - UCLA School of Medicine',
        experience: 15,
        consultationFee: 110,
        availableDays: ['Tuesday', 'Thursday', 'Friday'],
        availableTimeSlots: [
          '10:00 AM - 11:00 AM',
          '11:30 AM - 12:30 PM',
          '03:00 PM - 04:00 PM',
        ],
        bio: 'Eye care physician specializing in comprehensive optical exams, retinal evaluations, cataract consultations, and computer vision strain therapies.',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
        clinicAddress: 'VisionCare Eye Center, Suite 504, Los Angeles',
        rating: 4.8,
        reviewsCount: 76,
        isAvailable: true,
      },
      {
        name: 'Dr. Rachel Patel',
        email: 'rachel.patel@medicare.com',
        phone: '+1 555-234-1108',
        specialization: 'Dentist',
        qualifications: 'DDS, MS (Orthodontics) - NYU Dentistry',
        experience: 10,
        consultationFee: 80,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
        availableTimeSlots: [
          '09:00 AM - 10:00 AM',
          '10:30 AM - 11:30 AM',
          '01:30 PM - 02:30 PM',
          '03:30 PM - 04:30 PM',
        ],
        bio: 'Dedicated dental surgeon providing smile makeovers, dental hygiene, pain-free root canals, aligners, and comprehensive oral examinations.',
        image: 'https://images.unsplash.com/photo-1594824813571-638f026361ab?auto=format&fit=crop&w=600&q=80',
        clinicAddress: 'BrightSmile Dental Studio, Suite 305, Austin',
        rating: 4.9,
        reviewsCount: 112,
        isAvailable: true,
      },
    ];

    const createdDoctors = await Doctor.insertMany(doctorsData);
    console.log(`Seeded ${createdDoctors.length} specialist doctors.`);

    // 3. Seed Sample Appointments for Sarah Jenkins
    const today = new Date();
    const futureDate1 = new Date(today);
    futureDate1.setDate(today.getDate() + 3);
    const dateStr1 = futureDate1.toISOString().split('T')[0];

    const futureDate2 = new Date(today);
    futureDate2.setDate(today.getDate() + 7);
    const dateStr2 = futureDate2.toISOString().split('T')[0];

    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 10);
    const dateStrPast = pastDate.toISOString().split('T')[0];

    await Appointment.create([
      {
        user: patient._id,
        doctor: createdDoctors[0]._id, // Dr. Olivia Vance (Cardio)
        patientName: patient.name,
        patientPhone: patient.phone,
        patientEmail: patient.email,
        patientAge: patient.age,
        patientGender: patient.gender,
        appointmentDate: dateStr1,
        timeSlot: '10:30 AM - 11:30 AM',
        appointmentType: 'In-Clinic',
        symptoms: 'Mild chest tightness after high intensity workout, routine cardiovascular screening.',
        fee: createdDoctors[0].consultationFee,
        status: 'Confirmed',
        paymentStatus: 'Paid',
        notes: 'Confirmed by Medicare receptionist. Bring previous ECG report if available.',
      },
      {
        user: patient._id,
        doctor: createdDoctors[2]._id, // Dr. Sophia Martinez (Dermatology)
        patientName: patient.name,
        patientPhone: patient.phone,
        patientEmail: patient.email,
        patientAge: patient.age,
        patientGender: patient.gender,
        appointmentDate: dateStr2,
        timeSlot: '02:30 PM - 03:30 PM',
        appointmentType: 'Online Consultation',
        symptoms: 'Seasonal dry skin allergy on forearms, itching sensation.',
        fee: createdDoctors[2].consultationFee,
        status: 'Pending',
        paymentStatus: 'Pending',
        notes: 'Awaiting doctor confirmation.',
      },
      {
        user: patient._id,
        doctor: createdDoctors[5]._id, // Dr. Emily Chen (General Physician)
        patientName: patient.name,
        patientPhone: patient.phone,
        patientEmail: patient.email,
        patientAge: patient.age,
        patientGender: patient.gender,
        appointmentDate: dateStrPast,
        timeSlot: '09:00 AM - 10:00 AM',
        appointmentType: 'In-Clinic',
        symptoms: 'Annual health checkup and blood pressure monitoring.',
        fee: createdDoctors[5].consultationFee,
        status: 'Completed',
        paymentStatus: 'Paid',
        notes: 'Vitals normal. Recommended maintaining hydration and 30-minute daily walking.',
      },
    ]);
    console.log('Seeded sample appointments.');

    // 4. Seed Online Consultation
    await Consultation.create([
      {
        user: patient._id,
        doctor: createdDoctors[1]._id, // Dr. Marcus Reynolds (Neurology)
        consultationType: 'Video Call',
        consultationDate: dateStr1,
        timeSlot: '11:30 AM - 12:30 PM',
        symptoms: 'Frequent tension headaches in late afternoons after screen exposure.',
        urgency: 'Normal',
        status: 'Scheduled',
        meetingLink: 'https://medicare.telehealth.live/room/MC-482910',
        doctorNotes: 'Scheduled with Dr. Reynolds. Please join the video room 5 minutes prior.',
      },
      {
        user: patient._id,
        doctor: createdDoctors[5]._id, // Dr. Emily Chen
        consultationType: 'Live Chat',
        consultationDate: dateStrPast,
        timeSlot: '01:00 PM - 02:00 PM',
        symptoms: 'Seasonal flu symptoms, low-grade fever.',
        urgency: 'Normal',
        status: 'Completed',
        meetingLink: 'https://medicare.telehealth.live/room/MC-102943',
        prescription: 'Paracetamol 500mg twice daily for 3 days; Vitamin C 500mg daily; Warm fluids.',
        doctorNotes: 'Patient recovered well. Follow-up concluded.',
      },
    ]);
    console.log('Seeded sample online consultations.');

    console.log('\n Medicare Database successfully seeded with rich healthcare data!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
