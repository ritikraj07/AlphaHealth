const express = require("express");
const router = express.Router();
const { verifyToken } = require("../validators/auth.validator");
const {
  createPOB,
  getMyPOB,
  getTeamPOB,
  deletePOB,
} = require("../controllers/pob.controller");

router.post("/", verifyToken, createPOB);

router.get("/my", verifyToken, getMyPOB);

router.get("/team", verifyToken, getTeamPOB);

router.delete("/:id", verifyToken, deletePOB);

module.exports = router;
