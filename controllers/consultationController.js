const Consultation = require('../models/Consultation');
const Doctor = require('../models/Doctor');

// @desc    Request an online consultation
// @route   POST /api/consultations
// @access  Private
const requestConsultation = async (req, res, next) => {
  try {
    const { doctorId, consultationType, consultationDate, timeSlot, symptoms, urgency } = req.body;

    if (!doctorId || !consultationDate || !timeSlot || !symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctor, date, time slot, and health concerns.',
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    // Generate random meeting room ID
    const roomCode = `MC-${Math.floor(100000 + Math.random() * 900000)}`;
    const meetingLink = `https://medicare.telehealth.live/room/${roomCode}`;

    const consultation = await Consultation.create({
      user: req.user._id,
      doctor: doctorId,
      consultationType: consultationType || 'Video Call',
      consultationDate,
      timeSlot,
      symptoms,
      urgency: urgency || 'Normal',
      status: 'Requested',
      meetingLink,
    });

    const populated = await Consultation.findById(consultation._id).populate(
      'doctor',
      'name specialization qualifications consultationFee image'
    );

    res.status(201).json({
      success: true,
      message: 'Online consultation request submitted successfully!',
      consultation: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's online consultations
// @route   GET /api/consultations/my
// @access  Private
const getMyConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find({ user: req.user._id })
      .populate('doctor', 'name specialization qualifications consultationFee image clinicAddress phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single consultation
// @route   GET /api/consultations/:id
// @access  Private
const getConsultationById = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('doctor', 'name specialization qualifications consultationFee image clinicAddress phone')
      .populate('user', 'name email phone age gender');

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found.',
      });
    }

    if (
      consultation.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this consultation.',
      });
    }

    res.status(200).json({
      success: true,
      consultation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all consultations (Admin)
// @route   GET /api/consultations
// @access  Private/Admin
const getAllConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find()
      .populate('doctor', 'name specialization qualifications consultationFee image')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update consultation status / prescription (Admin)
// @route   PUT /api/consultations/:id
// @access  Private/Admin
const updateConsultation = async (req, res, next) => {
  try {
    const { status, prescription, doctorNotes, meetingLink } = req.body;

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found.',
      });
    }

    if (status) consultation.status = status;
    if (prescription !== undefined) consultation.prescription = prescription;
    if (doctorNotes !== undefined) consultation.doctorNotes = doctorNotes;
    if (meetingLink) consultation.meetingLink = meetingLink;

    await consultation.save();

    const updated = await Consultation.findById(consultation._id)
      .populate('doctor', 'name specialization qualifications consultationFee image')
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Consultation updated successfully!',
      consultation: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestConsultation,
  getMyConsultations,
  getConsultationById,
  getAllConsultations,
  updateConsultation,
};
