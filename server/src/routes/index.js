const express = require('express');
const router = express.Router();

// Import all route files
const adminRoutes = require('./admin.route');
const employeeRoutes = require('./employee.route');
const pobRoutes = require('./pob.route');
const leaveRoutes = require('./leave.route');
const headquarterRoutes = require('./headquarter.route');

const doctorChemistRoutes = require('./doctorChemist.route');
const attendanceRoutes = require('./attendance.route');
const setupRoutes = require('./setup.route');
const productRoutes = require('./product.route');
const planRoutes = require('./plan.route');
const visitRoutes = require('./visit.route');
const analyticsRoutes = require('./analytics.route');
const deviceRoutes = require('./device.route');

router.use('/admin', adminRoutes);
router.use('/employee', employeeRoutes);
router.use('/pobs', pobRoutes);
router.use('/products', productRoutes);
router.use('/leaves', leaveRoutes);
router.use('/headquarters', headquarterRoutes);
router.use('/doctorChemists', doctorChemistRoutes);
router.use('/attendances', attendanceRoutes);
router.use('/setup', setupRoutes);
router.use('/plans', planRoutes);
router.use('/visits', visitRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/devices', deviceRoutes);

module.exports = router;
