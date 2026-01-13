const {Router} = require('express');
const { validateCreateDoctorChemist } = require('../validators/doctorChemist.validator');
const { createDoctorChemist, getAllDoctorChemist, approveDoctorChemist } = require('../controllers/doctorChemist.controller');
const { verifyToken } = require('../validators/auth.validator');
const router = Router();


/********************************* POST RREQUESTS ****************************************/

router.post('/',validateCreateDoctorChemist,verifyToken, createDoctorChemist)

/********************************* GET RREQUESTS ****************************************/

router.get('/all', verifyToken ,getAllDoctorChemist)

/********************************* PATCH RREQUESTS ****************************************/
router.patch('/approve', verifyToken, approveDoctorChemist);
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;