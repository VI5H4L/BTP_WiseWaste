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

router.route("/allotzone").put(async (req, res) => {
    const { emailID } = req.query;
    const { zoneAlloted } = req.body;
    console.log(emailID);
    console.log(zoneAlloted);
  
    if (!emailID || !zoneAlloted) {
      return res.status(400).send('Email ID and new zone must be provided');
    }
  
    try {
      const updatedUser = await User.findOneAndUpdate(
        { emailID: emailID },
        { zoneAlloted: zoneAlloted },
        { new: true } // Returns the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).send('Worker not found');
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
  

module.exports = router;
