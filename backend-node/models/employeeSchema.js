const mongoose = require('mongoose');
const validator = require('validator');

const employeeSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true,
    },
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email. Please enter a valid email'
        },
        unique: true,
    },
    designation: {
        type: String,
        default: null
    },
    department: {
        type: String,
        default: null
    },
    unit: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isAuthenticated: {
        type: Boolean,
    }

}, {
    timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
