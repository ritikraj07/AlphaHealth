const {Router} = require('express');
const { verifyToken } = require('../validators/auth.validator');
const {
  ApplyLeave,
  GetLeaveDetailsByEmployeeId,
  LeaveApprove,
  GetAppliedLeaves,
} = require("../controllers/leave.controller");
const router = Router();


/********************************* POST RREQUESTS ****************************************/
// apply for leave
router.post("/", verifyToken, ApplyLeave);

/********************************* GET RREQUESTS ****************************************/
router.get("/", verifyToken, GetAppliedLeaves);
router.get("/employee/:id", verifyToken, GetLeaveDetailsByEmployeeId);


/********************************* PATCH RREQUESTS ****************************************/

router.patch("/", verifyToken, LeaveApprove);

/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;