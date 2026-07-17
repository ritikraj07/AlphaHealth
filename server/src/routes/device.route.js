const { Router } = require('express');
const {registerDevice} = require('../controllers/device.controller');
const { verifyToken } = require('../validators/auth.validator');
const router = Router();


router.post("/", registerDevice);



module.exports = router
