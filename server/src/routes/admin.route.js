const {Router} = require("express");
const { loginAdmin } = require("../controllers/admin.controller");



const router = Router();


/********************************* POST RREQUESTS ****************************************/

router.post("/login", loginAdmin);

/********************************* GET RREQUESTS ****************************************/
/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/


module.exports = router;