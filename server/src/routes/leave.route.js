const {Router} = require('express');
const { verifyToken } = require('../validators/auth.validator');
const { ApplyLeave } = require('../controllers/leave.controller');
const router = Router();


/********************************* POST RREQUESTS ****************************************/
// apply for leave
router.post("/", verifyToken, ApplyLeave);

/********************************* GET RREQUESTS ****************************************/

router.get("/all", (req, res) => {
    res.send("Mark Leave")
})

/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;