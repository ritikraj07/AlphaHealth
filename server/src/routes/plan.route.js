const express = require("express");
const router = express.Router();
const { verifyToken } = require("../validators/auth.validator");
const {
  createPlan,
  getMyPlans,
  getTeamPlans,
  updatePlanStatus,
  deletePlan,
  getPlans,
} = require("../controllers/plan.controller");

// Create new plan
router.post("/", verifyToken, createPlan);

// ?#TODO : Get all plans
router.get("/", verifyToken, getPlans);

// Get logged-in user's plans
router.get("/my", verifyToken, getMyPlans);

//? TODO Manager/Admin: get team plans
router.get("/team", verifyToken, getTeamPlans);

// Update plan status (planned → completed/missed)
router.patch("/:id/status", verifyToken, updatePlanStatus);

// // Delete plan (admin only recommended)
router.delete("/:id", verifyToken, deletePlan);

module.exports = router;
