const cron = require('node-cron');
require("dotenv").config();
const mongoose = require("mongoose");
const {User} = require("../models/user.models");

const { BTP_URI } = process.env;

const connectToDB = async() => {
    try{
        await mongoose.connect(BTP_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB Connected");

        cron.schedule('*/5 * * * *', async () => {
            try {
                console.log("success 333");
              const expiredStudents = await User.find({
                verified: false,
                verificationExpiresAt: { $lt: new Date() },
              });
              console.log(expiredStudents);
              for (const student of expiredStudents) {
                // Delete the student's record or take necessary actions
                await User.deleteOne({ _id: student._id });
              }
            } catch (error) {
              console.error('Error deleting expired students:', error);
            }
        })
    }catch(error)
    {
        console.log(error);
    }
}

connectToDB();