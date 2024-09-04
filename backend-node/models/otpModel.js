const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
    },
    otp: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 900 // 15 minutes
    },
    attempts: {
        type: Number,
        default: 0
    }
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP