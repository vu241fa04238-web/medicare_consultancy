const express = require('express');
const router = express.Router();
const {
  requestConsultation,
  getMyConsultations,
  getConsultationById,
  getAllConsultations,
  updateConsultation,
} = require('../controllers/consultationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Patient routes
router.post('/', protect, requestConsultation);
router.get('/my', protect, getMyConsultations);
router.get('/:id', protect, getConsultationById);

// Admin routes
router.get('/', protect, adminOnly, getAllConsultations);
router.put('/:id', protect, adminOnly, updateConsultation);

module.exports = router;
