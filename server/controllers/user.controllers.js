const expressAsyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();
const {ADMIN_EMAIL, ADMIN_PASSWORD} = process.env;
const {
    User
} = require("../models/user.models")
const {
    hashData,
    verifyHashedData    
} = require("../utils/hashPassword");
const createToken = require("../utils/createToken");
const auth = require("../middleware/auth");
const { verifyEmail } = require("../controllers/emailVerify.controllers");
const verificationExpiresAt = new Date();


//Signup
const newRegisterUser = expressAsyncHandler(async (req, res) => {
    try{
        let {fullName, EmailID, password} = req.body;
        fullName = fullName.trim();
        EmailID = EmailID.trim();
        password = password.trim();

        const domain = EmailID.substring(EmailID.length - 12);
        console.log(domain);


        if(!(fullName && EmailID && password))
        {
            // throw Error("Empty input fields!");
            res.json({ success: false, message: 'Empty input fields!' });
        }else if(domain !== "gmail.com")
        {
            // throw Error("Only people belonging to LNMIIT Jaipur can register");
            res.json({ success: false, message: 'Only people belonging to LNMIIT Jaipur can register' });
        }else if(password.length<8)
        {
            // throw Error("Password is too short!");
            res.json({ success: false, message: 'Password is too short!' });
        }else{

            console.log("success 1");
            // good credentials, create new user
            const existingUser = await User.findOne({EmailID});
            console.log("sucess 2");
            //Checking if user already exists
            if(existingUser){
                // throw Error("User with the provided email already exists");
                res.json({ success: false, message: 'User with the provided email already exists' });
            }

            // hash password
            console.log(verificationExpiresAt);
            const hasedPassword = await hashData(password);
            const newUser = new User({
                fullName,
                EmailID,
                password: hasedPassword,
                verificationExpiresAt,
            });

            //save user
            const newusers = await newUser.save();
            console.log("SignUp Success");
            
            await verifyEmail(EmailID);
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
        let {EmailID, password} = req.body;
        EmailID = EmailID.trim();
        password = password.trim();

        if(!(EmailID && password))
        {
            // throw Error("Empty credentials supplied!");
            res.json({ success: false, message: 'Empty credentials supplied!' });
        }


        const fetchUser = await User.findOne({ EmailID });

        if(!fetchUser)
        {
            // throw Error("Invalid collegeEmailID enerted!");
            res.json({ success: false, message: 'Invalid collegeEmailID enerted!' });
        }

        if(!fetchUser.verified)
        {
            // throw Error("Email hasn't been verified yet. Check your inbox.");
            res.json({ success: false, message: "Email hasn't been verified yet. Check your inbox." });
        }
        const hashedPassword = fetchUser.password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);

        if(!passwordMatch)
        {
            // throw Error("Invalid password entered!");
            res.json({ success: false, message: "Invalid password entered!" });
        }

        // create user token
        const tokenData = {userID: fetchUser._id, EmailID};
        const token = await createToken(tokenData);

        //assign user token
        fetchUser.token = token;
        console.log("Login Sucess1");
        if(EmailID===ADMIN_EMAIL)
        {
            res.status(200).json({success: true, role: 'Admin', user: fetchUser});
            console.log(fetchUser);
            
        }else
        {
            res.status(200).json({success: true, role: 'user', user: fetchUser});
            console.log(fetchUser);
        }
        
    }catch(error)
    {
        res.status(400).send(error.message);
    }
})

const checkingForUser = expressAsyncHandler(async (req, res) => {
    res.status(200).send(`You're in the private territory of ${req.currentUser.EmailID}`);
});

module.exports = {newRegisterUser, authUser, checkingForUser};