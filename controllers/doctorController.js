const Doctor = require('../models/Doctor');

// @desc    Get all doctors with filtering and searching
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { search, specialization, minExperience, maxFee, availableOnly } = req.query;

    let query = {};

    // Search by name or specialization or qualifications
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { qualifications: { $regex: search, $options: 'i' } },
        { clinicAddress: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by specialization
    if (specialization && specialization !== 'All') {
      query.specialization = { $regex: new RegExp(`^${specialization}$`, 'i') };
    }

    // Filter by minimum experience
    if (minExperience) {
      query.experience = { $gte: Number(minExperience) };
    }

    // Filter by maximum fee
    if (maxFee) {
      query.consultationFee = { $lte: Number(maxFee) };
    }

    // Filter by availability
    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    const doctors = await Doctor.find(query).sort({ rating: -1, experience: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique specializations
// @route   GET /api/doctors/meta/specializations
// @access  Public
const getSpecializations = async (req, res, next) => {
  try {
    const specializations = await Doctor.distinct('specialization');
    res.status(200).json({
      success: true,
      specializations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new doctor (Admin)
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      qualifications,
      experience,
      consultationFee,
      availableDays,
      availableTimeSlots,
      bio,
      image,
      clinicAddress,
      rating,
    } = req.body;

    if (!name || !email || !phone || !specialization || !qualifications || experience === undefined || !consultationFee) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required doctor fields.',
      });
    }

    const doctorExists = await Doctor.findOne({ email: email.toLowerCase() });
    if (doctorExists) {
      return res.status(400).json({
        success: false,
        message: 'A doctor with this email already exists.',
      });
    }

    const doctor = await Doctor.create({
      name,
      email: email.toLowerCase(),
      phone,
      specialization,
      qualifications,
      experience: Number(experience),
      consultationFee: Number(consultationFee),
      availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableTimeSlots: availableTimeSlots || [
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:30 AM - 12:30 PM',
        '02:00 PM - 03:00 PM',
        '03:30 PM - 04:30 PM',
      ],
      bio: bio || undefined,
      image: image || undefined,
      clinicAddress: clinicAddress || undefined,
      rating: rating ? Number(rating) : 4.8,
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully!',
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor details (Admin)
// @route   PUT /api/doctors/:id
// @access  Private/Admin
const updateDoctor = async (req, res, next) => {
  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully!',
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a doctor (Admin)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    await doctor.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  getSpecializations,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
