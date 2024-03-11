const express = require('express');
const router = express.Router();
const {
    User
} = require("../models/user.models")

const sendEmail = require("../utils/sendEmail");
const { AUTH_EMAIL} = process.env;

router.route('/approve').get(async(req,res) =>{
    try{
        let emailID = req.query.emailID;
        console.log("Approved");
        console.log(emailID);
        const existingUser = await User.findOne({emailID});
        if(existingUser)
        {
            console.log(existingUser);
            existingUser.adminVerified = true;
            // now update user record to show verified.
            await User.updateOne({ emailID }, { adminVerified: true });
            console.log(existingUser);
            // send email to Admin
            const mailOptionsUser = {
                from: AUTH_EMAIL,
                to: emailID,
                subject: "Request Approved by Admin",
                html: `Now you can successfully login to WiseWaste using registered email ${emailID}.`,
            };
            await sendEmail(mailOptionsUser);
        }else{
            
            // throw Error("User with the provided email already exists");
            res.json({ success: false, message: 'Error come in Approved part of verified email by adimn of user' });
        }
        res.send( `<h1>Request Approved!</h1>
        <p>Request is Approved by the admin.</p>`);
    } catch(error)
    {
        res.status(400).send(error.message);
    }
});

router.route('/reject').get(async(req,res) =>{
    try{
        let emailID = req.query.emailID;
        console.log("Reject");
        console.log(emailID);
        const existingUser = await User.findOne({emailID});
        if(existingUser)
        {
            console.log(existingUser);
            existingUser.adminVerified = false;
            // now update user record to show verified.
            await User.updateOne({ emailID }, { adminVerified: false });
            console.log(existingUser);
            // send email to Admin
            const mailOptionsUser = {
                from: AUTH_EMAIL,
                to: emailID,
                subject: "Request Rejected by Admin",
                html: "Your request has been Rejected by the Admin.",
            };
            await sendEmail(mailOptionsUser);
        }else{
            
            // throw Error("User with the provided email already exists");
            res.json({ success: false, message: 'Error come in Rejected part of verified email by adimn of user' });
        }
        // res.json({ success: true, message: 'User is Rejected by the admin.' });
        res.send( `<h1>Request Rejected!</h1>
        <p>Request is Rejected by the admin.</p>`);
    } catch(error)
    {
        res.status(400).send(error.message);
    }
});

module.exports = router;