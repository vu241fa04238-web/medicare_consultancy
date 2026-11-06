const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Patient routes
router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/cancel', protect, cancelAppointment);

// Admin routes
router.get('/', protect, adminOnly, getAllAppointments);
router.put('/:id/status', protect, adminOnly, updateAppointmentStatus);

module.exports = router;
