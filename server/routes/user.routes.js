const express = require('express');
const router = express.Router();

const { 
    newRegisterUser,
    authUser,
    checkingForUser,
} = require("../controllers/user.controllers");
const {verifyToken} = require("../middleware/auth");

router.route('/signup').post(newRegisterUser);
router.route('/login').post(authUser);
router.route('/privateData').get(verifyToken,checkingForUser);

module.exports = router;