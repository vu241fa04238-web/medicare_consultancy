const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide doctor email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide doctor phone number'],
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
      trim: true,
    },
    qualifications: {
      type: String,
      required: [true, 'Please provide qualifications'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: 0,
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please provide consultation fee'],
      min: 0,
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    availableTimeSlots: {
      type: [String],
      default: [
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:30 AM - 12:30 PM',
        '02:00 PM - 03:00 PM',
        '03:30 PM - 04:30 PM',
        '05:00 PM - 06:00 PM',
      ],
    },
    bio: {
      type: String,
      default: 'Experienced healthcare professional dedicated to delivering comprehensive and patient-centered medical care.',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    },
    clinicAddress: {
      type: String,
      default: 'Medicare Health Plaza, Suite 402, Medical District',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 48,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
