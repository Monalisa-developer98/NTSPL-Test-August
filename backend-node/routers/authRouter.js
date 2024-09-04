const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validator = require('../validators/employeeValidator');

//request otp
router.post('/request-otp', validator.requestOtpValidator, authController.requestOtp);

//verify otp
router.post('/verify-otp', validator.verifyOtpValidator, authController.verifyOtp);

module.exports = router;