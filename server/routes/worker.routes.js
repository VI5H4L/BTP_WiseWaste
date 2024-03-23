const express = require("express");
const router = express.Router();
const { User } = require("../models/user.models");

const { ADMIN_EMAIL } = process.env;
router.route("/getworkers").get(async (req, res) => {
    try {
        const workers = await User.find({
            otpVerified: true,
            adminVerified: true,
            emailID: { $ne: ADMIN_EMAIL }
        });
        res.json(workers);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});


module.exports = router;
