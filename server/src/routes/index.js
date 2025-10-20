const express = require('express');
const router = express.Router();

// Import all route files
const adminRoutes = require('./admin.route');
const userRoutes = require('./employee.route');
const pobRoutes = require('./pob.route');
const leaveRoutes = require('./leave.route');
const headquarterRoutes = require('./headquarter.route');
const authRoutes = require('./auth.route');
const doctorChemistRoutes = require('./doctorChemist.route');
const attendanceRoutes = require('./attendance.route');

// Mount them
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/pobs', pobRoutes);
router.use('/leaves', leaveRoutes);
router.use('/headquarters', headquarterRoutes);
router.use('/auth', authRoutes);
router.use('/doctorChemists', doctorChemistRoutes);
router.use('/attendances', attendanceRoutes);

module.exports = router;
