const Joi = require('joi');
const Responses = require('../helpers/response');

const createEmployeeValidator = async (req, res, next) => {
    try {
        const bodySchema = Joi.object({
            employeeName: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).max(20).required(),
            employeeId: Joi.string().pattern(/^[a-zA-Z0-9\-\/]+$/).min(2).max(10).required(),
            email: Joi.string().email().min(3).max(30).required(),
            designation: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).max(20).required(),
            department: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).max(20).required(),
            unit: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).max(20).required()
        });

        const { error } = bodySchema.validate(req.body);
        if (error) {
            return Responses.errorResponse(req, res, "Validation Error: " + error.details[0].message, 400);
        }
        next();
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, "Validation Error: " + error.message, 400);
    }
};

// request otp validator
const requestOtpValidator = async (req, res, next) => {
    try {
        const otpSchema = Joi.object({
            email: Joi.string().email().min(3).max(30).required(),
        });
        await otpSchema.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, "Validation Error: " + error.message, 400);
    }
};

// verify otp validator
const verifyOtpValidator = async (req, res, next) => {
    try {
        const otpSchema = Joi.object({
            email: Joi.string().email().min(3).max(30).required(),
            otp: Joi.string().pattern(/^[0-9]+$/)
        });
        await otpSchema.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, "Validation Error: " + error.message, 400);
    }
};



module.exports = {
    createEmployeeValidator,
    requestOtpValidator,
    verifyOtpValidator
};
