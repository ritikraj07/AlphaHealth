const {Router} = require('express');
const { createEmployee, getEmployee } = require('../controllers/employee.controller');
const { validateCreateEmployee } = require('../middlewares');
const { verifyToken } = require('../validators/auth.validator');
const router = Router();


/********************************* POST RREQUESTS ****************************************/

router.post('/create',validateCreateEmployee, verifyToken, createEmployee);

/********************************* GET RREQUESTS ****************************************/

router.get('/all', getEmployee)

/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
router.delete('/delete', async (req, res) => {
    res.send("Delete User")
})
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;