const express = require('express');
const router = express.Router();

const { 
    verifyEmail, 
    verifyUserEmail 
} = require("../controllers/emailVerify.controllers");

const sendEmail = require("../utils/sendEmail");


const { REQUESTS_AUTH_EMAIL, ADMIN_EMAIL, LOCALHOST } = process.env;

router.route('/email_verify').post(async(req,res) =>{
    try{
        let { emailID } = req.body;
        
        const createdEmailVerificationOTP = await verifyEmail({emailID});

        res.status(200).json(createdEmailVerificationOTP);
    } catch(error)
    {
        res.status(400).send(error.message);
    }
});



router.route('/verify_email').post(async(req,res) => {
    try{
        console.log("success 11");
        let { emailID , otp } = req.body;
        console.log("success 21");
        if(!(emailID && otp))
        {
            throw Error("Empty otp details are not allowed");
            // res.json({ success: false, message: 'Empty otp details are not allowed' });
        }
        console.log("success 31");
        await verifyUserEmail({ emailID, otp });


        let approvalLink = `${LOCALHOST}/admin/approve?emailID=${emailID}`;
        let rejectLink = `${LOCALHOST}/admin/reject?emailID=${emailID}`;

        // send email to Admin
        const mailOptionsUser = {
            from: REQUESTS_AUTH_EMAIL,
            to: ADMIN_EMAIL,
            subject: `Approval Request for this email ${emailID}`,
            html: `A new worker has registered. <a href="${approvalLink}">Approve</a> or <a href="${rejectLink}">Reject</a>.`,
        };
        await sendEmail(mailOptionsUser);

        console.log(mailOptionsUser);
        console.log("success 41");
        res.status(200).json({ success: true, emailID, verified: true});
    } catch(error)
    {
        res.status(400).send(error.message);
    }
})

module.exports = router;