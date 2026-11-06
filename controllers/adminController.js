const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();
    const totalConsultations = await Consultation.countDocuments();

    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'Confirmed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'Cancelled' });
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });

    // Calculate total consultation fee revenue
    const revenueAggregation = await Appointment.aggregate([
      { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$fee' } } },
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Recent 5 appointments
    const recentAppointments = await Appointment.find()
      .populate('doctor', 'name specialization image')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalConsultations,
        pendingAppointments,
        confirmedAppointments,
        cancelledAppointments,
        completedAppointments,
        totalRevenue,
      },
      recentAppointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered patients
// @route   GET /api/admin/patients
// @access  Private/Admin
const getPatients = async (req, res, next) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Attach appointment counts for each patient
    const patientsWithStats = await Promise.all(
      patients.map(async (patient) => {
        const appointmentCount = await Appointment.countDocuments({ user: patient._id });
        const consultationCount = await Consultation.countDocuments({ user: patient._id });
        return {
          ...patient.toObject(),
          appointmentCount,
          consultationCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: patientsWithStats.length,
      patients: patientsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a patient (Admin)
// @route   DELETE /api/admin/patients/:id
// @access  Private/Admin
const deletePatient = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be deleted.',
      });
    }

    await Appointment.deleteMany({ user: user._id });
    await Consultation.deleteMany({ user: user._id });
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Patient and associated records deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getPatients,
  deletePatient,
};
