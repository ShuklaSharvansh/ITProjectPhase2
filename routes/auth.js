const express = require("express");
const authcontroller = require('../controllers/auth');
const router = express.Router();

router.post("/signup", authcontroller.register);
router.post('/login', authcontroller.login);
router.get('/logout', authcontroller.logout);


module.exports = router;  