const {Router} = require('express');
const { validateCreateDoctorChemist } = require('../validators/doctorChemist.validator');
const { createDoctorChemist, getAllDoctorChemist } = require('../controllers/doctorChemist.controller');
const { verifyToken } = require('../validators/auth.validator');
const router = Router();


/********************************* POST RREQUESTS ****************************************/

router.post('/',validateCreateDoctorChemist,verifyToken, createDoctorChemist)

/********************************* GET RREQUESTS ****************************************/

router.get('/all', getAllDoctorChemist)

/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;