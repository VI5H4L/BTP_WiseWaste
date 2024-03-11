const express = require('express');
const router = express.Router();

const { 
    newOTPGenerator,
    verifyOTPGenerated
} = require("../controllers/userOTP.controllers");



router.route('/getotp').post(async(req,res) =>{
    try{
        let { emailID, subject, message, duration } = req.body;
        
        const createdOTPRecord = await newOTPGenerator({emailID, subject, message, duration});

        res.status(200).json(createdOTPRecord)
    } catch(error)
    {
        res.status(400).send(error.message);
    }
});


router.route('/verify').post(async(req,res) =>{
    try{
        let { emailID, otp } = req.body;
        
        const validOTP = await verifyOTPGenerated({emailID,otp});
        res.status(200).json({valid: validOTP});
    } catch(error)
    {
        res.status(400).send(error.message);
    }
});


module.exports = router;