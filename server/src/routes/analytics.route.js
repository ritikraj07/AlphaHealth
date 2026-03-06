const express = require("express");
const { getDashboardAnalytics, getEmployeeDashboard } = require("../controllers/analytics.controller");
const { verifyToken } = require("../validators/auth.validator");


const router = express.Router();

router.get("/dashboard-analytics", verifyToken, getDashboardAnalytics);
router.get("/employee-dashboard", verifyToken, getEmployeeDashboard);




module.exports = router;