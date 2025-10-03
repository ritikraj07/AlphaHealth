const {Router} = require('express');
const { createUser } = require('../controllers/user.controller');
const { validateCreateUser } = require('../middlewares');
const router = Router();


/********************************* POST RREQUESTS ****************************************/

router.post('/create-user',validateCreateUser, createUser);

/********************************* GET RREQUESTS ****************************************/

router.get('/all-users', async (req, res) => {   
    res.send("Get All Users")
})

/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
router.delete('/delete-user', async (req, res) => {
    res.send("Delete User")
})
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;