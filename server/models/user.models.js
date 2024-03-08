const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const UserSchema = new Schema({
    fullName:{
        type: String,
        required: true,
    },
    EmailID:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    token:{
        type: String,
    },
    verified:{
        type: Boolean,
        default: false,
    },
    verificationExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 1000),
    }
});

const OTPSchema = new Schema({
    EmailID:{
        type: String,
        unique: true,
    },
    otp:{
        type: String,
    },
    createdAt:{
        type:Date,
    },
    expiresAt:{
        type:Date,
    }
})

const User = mongoose.model('user', UserSchema);
const OTP = mongoose.model('OTP', OTPSchema);
module.exports = {User, OTP};