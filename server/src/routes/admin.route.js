const {Router} = require("express");
const { loginAdmin, GetAdminDashboard, GetAdminProfile } = require("../controllers/admin.controller");
const { verifyToken } = require("../validators/auth.validator");



const router = Router();


/********************************* POST RREQUESTS ****************************************/

router.post("/login", loginAdmin);

/********************************* GET RREQUESTS ****************************************/
router.get("/dashboard", verifyToken, GetAdminDashboard);
router.get("/", verifyToken, GetAdminProfile);

/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/


module.exports = router;