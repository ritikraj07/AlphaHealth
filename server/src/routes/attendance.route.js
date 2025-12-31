const {Router} = require('express');
const { MarkAttendance, GetTodayAttendance } = require('../controllers/attendance.controller');
const { verifyToken } = require('../validators/auth.validator');
const router = Router();


/********************************* POST RREQUESTS ****************************************/
// !! what if not logged in or not press the button

router.post("/",verifyToken, MarkAttendance)

/********************************* GET RREQUESTS ****************************************/
router.get("/",verifyToken, GetTodayAttendance)
/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;