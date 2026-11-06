const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patientName: {
      type: String,
      required: [true, 'Please provide patient name'],
      trim: true,
    },
    patientPhone: {
      type: String,
      required: [true, 'Please provide patient phone number'],
    },
    patientEmail: {
      type: String,
      required: [true, 'Please provide patient email'],
    },
    patientAge: {
      type: Number,
      required: [true, 'Please provide patient age'],
    },
    patientGender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    appointmentDate: {
      type: String,
      required: [true, 'Please provide appointment date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please select a time slot'],
    },
    appointmentType: {
      type: String,
      enum: ['In-Clinic', 'Online Consultation'],
      default: 'In-Clinic',
    },
    symptoms: {
      type: String,
      required: [true, 'Please provide symptoms or reason for visit'],
    },
    fee: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
