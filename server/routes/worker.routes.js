const express = require("express");
const router = express.Router();
const { User } = require("../models/user.models");

const { ADMIN_EMAIL } = process.env;
router.route("/getworkers").get(async (req, res) => {
    try {
        let query = {
            otpVerified: true,
            adminVerified: true,
            emailID: { $ne: ADMIN_EMAIL }
        };

        // Check if zoneAlloted is provided in the query parameters
        if (req.query.zoneAlloted) {
            query.zoneAlloted = req.query.zoneAlloted;
        }
        if(req.query.zoneAlloted==="Not Alloted Zones"){
            console.log("yes");
            query.zoneAlloted = "";
        }

        const workers = await User.find(query);
        res.json(workers);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});


module.exports = router;
