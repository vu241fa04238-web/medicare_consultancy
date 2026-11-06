const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  getSpecializations,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getDoctors);
router.get('/meta/specializations', getSpecializations);
router.get('/:id', getDoctorById);

// Admin-only doctor management routes
router.post('/', protect, adminOnly, createDoctor);
router.put('/:id', protect, adminOnly, updateDoctor);
router.delete('/:id', protect, adminOnly, deleteDoctor);

module.exports = router;
