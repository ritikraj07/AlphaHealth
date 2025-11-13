const {Router} = require('express');
const { createEmployee, getEmployee, getEmployeeById, deleteEmployee, updateEmployee, getManagerTeam } = require('../controllers/employee.controller');
const { validateCreateEmployee } = require('../middlewares');
const { verifyToken } = require('../validators/auth.validator');
const router = Router();


/********************************* POST RREQUESTS ****************************************/

router.post('/',validateCreateEmployee, verifyToken, createEmployee);

/********************************* GET RREQUESTS ****************************************/
router.get("/managerteam/:managerId", getManagerTeam)
router.get('/:id', getEmployeeById)
router.get('/', getEmployee)
/********************************* PATCH RREQUESTS ****************************************/
router.patch('/', updateEmployee)
/********************************* DELETE RREQUESTS ****************************************/
router.delete('/', deleteEmployee)
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;