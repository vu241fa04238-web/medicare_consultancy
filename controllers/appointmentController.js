const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
const bookAppointment = async (req, res, next) => {
  try {
    const {
      doctorId,
      patientName,
      patientPhone,
      patientEmail,
      patientAge,
      patientGender,
      appointmentDate,
      timeSlot,
      appointmentType,
      symptoms,
      paymentStatus,
    } = req.body;

    // Validate required fields
    if (
      !doctorId ||
      !patientName ||
      !patientPhone ||
      !patientEmail ||
      !patientAge ||
      !patientGender ||
      !appointmentDate ||
      !timeSlot ||
      !symptoms
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields to book an appointment.',
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Selected doctor could not be found.',
      });
    }

    // Check for duplicate booking for same doctor, date and slot
    const existingBooking = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      status: { $in: ['Pending', 'Confirmed'] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked for this doctor. Please select another slot or date.',
      });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      doctor: doctorId,
      patientName,
      patientPhone,
      patientEmail,
      patientAge: Number(patientAge),
      patientGender,
      appointmentDate,
      timeSlot,
      appointmentType: appointmentType || 'In-Clinic',
      symptoms,
      fee: doctor.consultationFee,
      status: 'Pending',
      paymentStatus: paymentStatus || 'Pending',
    });

    const populatedAppointment = await Appointment.findById(appointment._id).populate(
      'doctor',
      'name specialization qualifications consultationFee image clinicAddress phone'
    );

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! Our medical team will review and confirm it shortly.',
      appointment: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's appointments
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('doctor', 'name specialization qualifications consultationFee image clinicAddress phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'name specialization qualifications consultationFee image clinicAddress phone')
      .populate('user', 'name email phone');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // Allow user who booked it or admin
    if (
      appointment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this appointment.',
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment (Patient)
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // Ensure user owns appointment or is admin
    if (
      appointment.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment.',
      });
    }

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This appointment is already cancelled.',
      });
    }

    if (appointment.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed appointments cannot be cancelled.',
      });
    }

    appointment.status = 'Cancelled';
    appointment.notes = req.body.reason ? `Cancelled by patient: ${req.body.reason}` : 'Cancelled by patient';
    await appointment.save();

    const updated = await Appointment.findById(appointment._id).populate(
      'doctor',
      'name specialization qualifications consultationFee image clinicAddress phone'
    );

    res.status(200).json({
      success: true,
      message: 'Appointment has been cancelled successfully.',
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
const getAllAppointments = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    let appointments = await Appointment.find(query)
      .populate('doctor', 'name specialization qualifications consultationFee image')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      appointments = appointments.filter((app) => {
        const patientNameMatch = app.patientName?.toLowerCase().includes(term);
        const doctorNameMatch = app.doctor?.name?.toLowerCase().includes(term);
        const symptomMatch = app.symptoms?.toLowerCase().includes(term);
        return patientNameMatch || doctorNameMatch || symptomMatch;
      });
    }

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Admin: Confirm, Cancel, Complete)
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, notes, paymentStatus } = req.body;

    if (!['Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment status provided.',
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    if (paymentStatus) appointment.paymentStatus = paymentStatus;

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('doctor', 'name specialization qualifications consultationFee image')
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};
