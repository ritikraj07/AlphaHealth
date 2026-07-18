const {Router} = require('express');
const { createEmployee, getEmployee, getEmployeeById, updateEmployee,
    getManagerTeam, loginEmpoloyee, sendPasswordResetMail, updatePassword, forgotPassword } = require('../controllers/employee.controller');
const { validateCreateEmployee } = require('../middlewares');
const { verifyToken } = require('../validators/auth.validator');
const path = require('path');
const router = Router();


/********************************* POST RREQUESTS ****************************************/
router.post("/reset-password", verifyToken, sendPasswordResetMail);
router.post("/forgot-password", forgotPassword);
router.post('/login', loginEmpoloyee); // employee login
router.post('/', validateCreateEmployee, verifyToken, createEmployee); // create employee



/********************************* GET RREQUESTS ****************************************/
router.get("/managerteam/:managerId", getManagerTeam)
router.get("/set-new-password", (req, res) => {
    const passwordSetupScreen = path.join(__dirname, '../views/password/updatePassword.html');
    res.sendFile(passwordSetupScreen);
});


router.get('/:id',verifyToken, getEmployeeById)
router.get('/', verifyToken, getEmployee)
/********************************* PATCH RREQUESTS ****************************************/
router.patch('/update-password', verifyToken, updatePassword)
router.patch('/:id', verifyToken, updateEmployee)
/********************************* DELETE RREQUESTS ****************************************/

/********************************* PUT RREQUESTS ****************************************/

module.exports = router;