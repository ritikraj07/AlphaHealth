const {Router} = require("express");
const { createAdmin } = require("../controllers/admin.controller");
const { validateCreateAdmin } = require("../middlewares");

const router = Router();


/********************************* POST RREQUESTS ****************************************/
router.post("/create", validateCreateAdmin, createAdmin);



/********************************* GET RREQUESTS ****************************************/
/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/


module.exports = router;