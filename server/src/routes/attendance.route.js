const {Router} = require('express');
const { MarkAttendance, GetTodayAttendance,
    GetAttendanceHistory,
    GetMyAttendanceHistory,
        GetMyEmployeeAttendanceHistory
} = require('../controllers/attendance.controller');
const { verifyToken } = require('../validators/auth.validator');
const router = Router();


/********************************* POST RREQUESTS ****************************************/
// !! what if not logged in or not press the button

router.post("/",verifyToken, MarkAttendance)

/********************************* GET RREQUESTS ****************************************/
router.get("/history", verifyToken, GetAttendanceHistory)
router.get("/myhistory", verifyToken, GetMyAttendanceHistory)
router.get("/myemployeehistory", verifyToken, GetMyEmployeeAttendanceHistory)
router.get("/",verifyToken, GetTodayAttendance)
/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;