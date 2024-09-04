const Employee = require('../models/employeeSchema');
const OTP = require('../models/otpModel');
const authMiddleware = require('../middlewares/authMiddleware');
const emailService = require('./emailService');

const OTP_EXPIRATION_TIME = 5 * 60 * 1000; 

const verifyEmail = async (email) => {
    return await Employee.findOne({ email });
}

// request-otp
const requestOTP = async (email) => {
    const employee = await verifyEmail(email);
    if (!employee) {
        return { employeeNotFound: true };
    }

    let otpRecord = await OTP.findOne({ email });
    if(otpRecord && otpRecord.attempts >= 3){
        return { maxAttemptsExceeded: true };
    }
    const now = Date.now();

    const otp = generateOTP();
    if (otpRecord) {
        otpRecord.otp = otp;
        otpRecord.attempts += 1;
        otpRecord.createdAt = now;
        await otpRecord.save();
    } else {
        otpRecord = new OTP({ email, otp, attempts: 1, createdAt: now });
        await otpRecord.save();
    }

    const emailSubject = 'Your OTP for Verification';
    const mailData = `<p>Your OTP for Verification is <strong>${otp}</strong></p>. It will expire in 15 minutes.`;

    await emailService.sendMail(email, emailSubject, mailData);
    return { otp: otp, attempts: otpRecord.attempts, otpSent: true };
}
const generateOTP = () => {
    const otpLength = 6;
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};


const verifyOTP = async (email, otp) => {
    try{
        const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
        return { otpNotFound: true };
    }

    const now = Date.now();
    if (now - otpRecord.createdAt > OTP_EXPIRATION_TIME) {
        return { otpExpired: true };
    }
    if (otpRecord.otp !== otp) {
        return { invalidOtp: true };
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
        return { employeeNotFound: true };
    }

    employee.isAuthenticated = true;
    await employee.save();

    const token = await authMiddleware.generateUserToken({employeeId:employee.employeeId});

    await OTP.deleteOne({ email });
    return { token, employee };
    } catch(error){
        return { error: error.message };
    }
};

module.exports = {
    requestOTP, verifyOTP
}
