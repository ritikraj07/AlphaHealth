const {Router} = require('express');
const { validateCreateDoctorChemist } = require('../validators/doctorChemist.validator');
const { createDoctorChemist, getAllDoctorChemist, approveDoctorChemist, deleteDoctorChemist } = require('../controllers/doctorChemist.controller');
const { verifyToken } = require('../validators/auth.validator');
const router = Router();


/********************************* POST RREQUESTS ****************************************/

router.post('/',validateCreateDoctorChemist,verifyToken, createDoctorChemist)

/********************************* GET RREQUESTS ****************************************/

router.get('/', verifyToken ,getAllDoctorChemist)

/********************************* PATCH RREQUESTS ****************************************/
router.patch('/approve', verifyToken, approveDoctorChemist);
/********************************* DELETE RREQUESTS ****************************************/
router.delete('/delete/:id', verifyToken, deleteDoctorChemist)
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;