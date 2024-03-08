const expressAsyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();

const {User} = require("../models/user.models");
const {
    newOTPGenerator,            
    verifyOTPGenerated,
    deleteOTP    
} = require("../controllers/userOTP.controllers");

const verifyEmail = expressAsyncHandler(async(EmailID) => {
    try{
        if(!EmailID)
        {
            throw Error("An email is required!");
        }

        // check if an account exists
        const existingUser = await User.findOne({EmailID});
        if(!existingUser)
        {
            throw Error("There's no account for the provided email.");
        }


        const otpDetails = {
            EmailID,
            subject: "Email Verification",
            message: "Verify your email with the code below.",
            duration: 1,
        }
        const createdOTP = await newOTPGenerator(otpDetails);
        return createdOTP;
    }catch(error)
    {
        throw error;
    }
});


const verifyUserEmail = expressAsyncHandler(async({ EmailID, otp }) => {
    try{
        const validOTP = await verifyOTPGenerated({ EmailID, otp });
        console.log("success 5");
        if(!validOTP)
        {
            throw Error("Invalid code password. Check your inbox.");
        } 
        console.log("success 6");

        // now update user record to show verified.
        await User.updateOne({ EmailID }, { verified: true });

        await deleteOTP(EmailID);
        console.log("success 7");
        return;
    }catch(error)
    {
        throw error;
    }
});

module.exports = { verifyEmail, verifyUserEmail };