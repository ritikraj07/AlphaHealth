const express = require("express");
const { getDashboardAnalytics } = require("../controllers/analytics.controller");
const { verifyToken } = require("../validators/auth.validator");


const router = express.Router();

router.get("/dashboard-analytics", verifyToken, getDashboardAnalytics);




module.exports = router;