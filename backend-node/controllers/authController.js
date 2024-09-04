const authService = require('../services/authService');
const Responses = require('../helpers/response');
const messages = require('../constants/constMessages');

const requestOtp = async (req, res) => {
    try {
        const { email } = req.body; 
        const result = await authService.requestOTP(email);
        if (result?.employeeNotFound) {
            return Responses.failResponse(req, res, null, messages.employeeNotFound, 200);
        }
        if (result?.maxAttemptsExceeded) {
            return Responses.failResponse(req, res, null, messages.maxAttemptsExceeded, 429);
        }
        return Responses.successResponse(req, res, result, messages.otpSentSuccess, 201);
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, error);
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body; 
        const result = await authService.verifyOTP(email, otp);
        if (result?.otpNotFound) {
            return Responses.failResponse(req, res, null, messages.otpNotFound, 400);
        }
        if (result?.otpExpired) {
            return Responses.failResponse(req, res, null, messages.otpExpired, 400);
        }
        if (result?.invalidOtp) {
            return Responses.failResponse(req, res, null, messages.invalidOtp, 400);
        }
        return Responses.successResponse(req, res, result, messages.otpVerifiedSuccess, 200);
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, error);
    }
};
module.exports = {
    requestOtp, verifyOtp
}