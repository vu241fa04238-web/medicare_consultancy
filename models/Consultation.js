const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
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
    consultationType: {
      type: String,
      enum: ['Video Call', 'Audio Call', 'Live Chat'],
      default: 'Video Call',
    },
    consultationDate: {
      type: String,
      required: [true, 'Please select consultation date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please select a time slot'],
    },
    symptoms: {
      type: String,
      required: [true, 'Please describe your symptoms and concerns'],
    },
    urgency: {
      type: String,
      enum: ['Normal', 'Urgent', 'Immediate'],
      default: 'Normal',
    },
    status: {
      type: String,
      enum: ['Requested', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Requested',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    prescription: {
      type: String,
      default: '',
    },
    doctorNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Consultation', consultationSchema);
