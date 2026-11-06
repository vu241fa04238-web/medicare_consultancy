const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getPatients,
  deletePatient,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/patients', getPatients);
router.delete('/patients/:id', deletePatient);

module.exports = router;
