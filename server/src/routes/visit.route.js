const express = require("express");
const router = express.Router();
const { verifyToken } = require("../validators/auth.validator");
const {
  createVisit,
  getMyVisits,
  getTeamVisits,
  deleteVisit,
} = require("../controllers/visit.controller");

router.post("/", verifyToken, createVisit);

router.get("/my", verifyToken, getMyVisits);

router.get("/team", verifyToken, getTeamVisits);

router.delete("/:id", verifyToken, deleteVisit);

module.exports = router;
