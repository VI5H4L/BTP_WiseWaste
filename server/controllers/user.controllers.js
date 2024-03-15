const expressAsyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();
const {ADMIN_EMAIL} = process.env;
const {
    User,
    OTP
} = require("../models/user.models")
const {
    hashData,
    verifyHashedData    
} = require("../utils/hashPassword");
const createToken = require("../utils/createToken");
// const auth = require("../middleware/auth");
const { verifyEmail } = require("../controllers/emailVerify.controllers");
const verificationExpiresAt = new Date();


//Signup
const newRegisterUser = expressAsyncHandler(async (req, res) => {
    try{
        let {fullName, emailID, password} = req.body;
        // fullName = fullName.trim();
        // emailID = emailID.trim();
        // password = password.trim();
        console.log(fullName);
        console.log(emailID);
        console.log(password);
        
        // const domain = emailID.substring(emailID.length - 12);
        // console.log(domain);


        if(!(fullName && emailID && password))
        {
            // throw Error("Empty input fields!");
            res.json({ success: false, message: 'Empty input fields!' });
        }else if(password.length<8)
        {
            // throw Error("Password is too short!");
            res.json({ success: false, message: 'Password is too short!' });
        }else{

            console.log("success 1");
            // good credentials, create new user
            const existingUser = await User.findOne({emailID});
            const existingUserOTP = await OTP.findOne({emailID});
            console.log("sucess 2");
            //Checking if user already exists
            if(existingUser){
                if(existingUser.otpVerified===false){
                    await User.deleteOne({ _id: existingUser._id });
                    await OTP.deleteOne({ _id: existingUserOTP._id });
                }
                else{
                    if(existingUser.adminVerified===true){
                        res.json({ success: false, message: 'Admin has already approved your request', code:"admindone" });
                        throw Error("User already Approved");
                    }
                    else{
                            res.json({ success: false, message: 'Wait for Admin response', code:"adminres" });
                            throw Error("User with the provided email already exists");
                    }
                }
            }

            // hash password
            console.log(verificationExpiresAt);
            const hasedPassword = await hashData(password);
            const newUser = new User({
                fullName,
                emailID,
                password: hasedPassword,
                verificationExpiresAt,
            });

            //save user
            const newusers = await newUser.save();
            console.log("SignUp Success");
            console.log(newusers);
            await verifyEmail(emailID, fullName);
            res.status(200).json({success: true, newusers});
        }
    }catch (error)
    {
        res.status(400).send(error.message);
    }
});


// Signin or Login
const authUser = expressAsyncHandler(async (req,res) => {
    try{
        let {emailID, password} = req.body;
        // emailID = emailID.trim();
        // password = password.trim();

        if(!(emailID && password))
        {
            // throw Error("Empty credentials supplied!");
            res.json({ success: false, message: 'Empty credentials supplied!' });
        }


        const fetchUser = await User.findOne({ emailID });

        if(!fetchUser)
        {
            // throw Error("Invalid collegeEmailID enerted!");
            res.json({ success: false, message: 'Invalid email id entered!' });
        }

        if(!fetchUser.otpVerified || !fetchUser.adminVerified)
        {
            // throw Error("Email hasn't been verified yet. Check your inbox.");
            res.json({ success: false, message: "Email hasn't been verified yet" });
        }
        const hashedPassword = fetchUser.password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);

        if(!passwordMatch)
        {
            // throw Error("Invalid password entered!");
            res.json({ success: false, message: "Invalid password entered!" });
        }

        // create user token
        const tokenData = {userID: fetchUser._id, emailID};
        const token = await createToken(tokenData);

        //assign user token
        fetchUser.token = token;
        console.log("Login Sucess1");
        if(emailID===ADMIN_EMAIL)
        {
            res.status(200).json({success: true, role: 'admin', user: fetchUser});
            console.log(fetchUser);
            
        }else
        {
            res.status(200).json({success: true, role: 'worker', user: fetchUser});
            console.log(fetchUser);
        }
        
    }catch(error)
    {
        res.status(400).send(error.message);
    }
})

const checkingForUser = expressAsyncHandler(async (req, res) => {
    res.status(200).send(`You're in the private territory of ${req.currentUser.emailID}`);
});

module.exports = {newRegisterUser, authUser, checkingForUser};