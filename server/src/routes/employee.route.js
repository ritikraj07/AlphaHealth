const {Router} = require('express');
const { createEmployee, getEmployee, getEmployeeById, updateEmployee, getManagerTeam, loginEmpoloyee } = require('../controllers/employee.controller');
const { validateCreateEmployee } = require('../middlewares');
const { verifyToken } = require('../validators/auth.validator');
const router = Router();


/********************************* POST RREQUESTS ****************************************/
router.post('/login', loginEmpoloyee); // employee login
router.post('/', validateCreateEmployee, verifyToken, createEmployee); // create employee


/********************************* GET RREQUESTS ****************************************/
router.get("/managerteam/:managerId", getManagerTeam)
router.get('/:id',verifyToken, getEmployeeById)
router.get('/',verifyToken, getEmployee)
/********************************* PATCH RREQUESTS ****************************************/
router.patch('/:id', verifyToken, updateEmployee)
/********************************* DELETE RREQUESTS ****************************************/

/********************************* PUT RREQUESTS ****************************************/

module.exports = router;