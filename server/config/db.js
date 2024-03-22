const cron = require('node-cron');
require("dotenv").config();
const mongoose = require("mongoose");
// const {User} = require("../models/user.models");
const {ManageZone} = require("../models/managezone.models");

const { BTP_URI } = process.env;

async function initManageZone() {
  const count = await ManageZone.countDocuments();
  if(count === 0) {
      const zone = new ManageZone({ zones: [] });
      await zone.save();
      // Creating Initial ManageZone document
  }
}

const connectToDB = async() => {
    try{
        await mongoose.connect(BTP_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB Connected");

        initManageZone();
        // cron.schedule('*/10 * * * *', async () => {
        //     try {
        //         console.log("success 333");
        //       const expiredStudents = await User.find({
        //         otpVerified: false,
        //         verificationExpiresAt: { $lt: new Date() },
        //       });
        //       console.log(expiredStudents);
        //       for (const student of expiredStudents) {
        //         // Delete the student's record or take necessary actions
        //         await User.deleteOne({ _id: student._id });
        //       }
        //     } catch (error) {
        //       console.error('Error deleting expired students:', error);
        //     }
        // })
    }catch(error)
    {
        console.log(error);
    }
}

connectToDB();