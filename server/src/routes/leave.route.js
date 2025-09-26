const {Router} = require('express');
const router = Router();


/********************************* POST RREQUESTS ****************************************/

router.post("/apply", (req, res) => {
    res.send("Mark Leave")
})

/********************************* GET RREQUESTS ****************************************/

router.get("/all", (req, res) => {
    res.send("Mark Leave")
})

/********************************* PATCH RREQUESTS ****************************************/
/********************************* DELETE RREQUESTS ****************************************/
/********************************* PUT RREQUESTS ****************************************/

module.exports = router;