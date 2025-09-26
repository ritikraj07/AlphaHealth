const {Router} = require('express');
const router = Router();


/********************************* POST RREQUESTS ****************************************/

router.post('/create-user', async (req, res) => {   
})

/********************************* GET RREQUESTS ****************************************/

router.get('/all-users', async (req, res) => {   
    res.send("Get All Users")
})

/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;