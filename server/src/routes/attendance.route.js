const {Router} = require('express');
const { MarkAttendance } = require('../controllers/attendance.controller');
const { verifyToken } = require('../validators/auth.validator');
const router = Router();


/********************************* POST RREQUESTS ****************************************/
// !! what if not logged in or not press the button

router.post("/",verifyToken, MarkAttendance)

/********************************* GET RREQUESTS ****************************************/

/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;