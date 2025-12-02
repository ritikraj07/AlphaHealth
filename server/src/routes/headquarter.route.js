const {Router} = require('express');
const { createHeadQuarter, getHeadQuarters } = require('../controllers/headquater.controller');
const { verifyToken } = require('../validators/auth.validator');
const router = Router();


/********************************* POST RREQUESTS ****************************************/
router.post("/",verifyToken, createHeadQuarter);
/********************************* GET RREQUESTS ****************************************/
router.get("/",getHeadQuarters)
/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;