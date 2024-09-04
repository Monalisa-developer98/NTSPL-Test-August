const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const validator = require('../validators/employeeValidator');
const authMiddleware = require("../middlewares/authMiddleware");

//create employee
router.post('/employees', 
    validator.createEmployeeValidator, 
    employeeController.createEmployee
)

// list employee
router.get('/employees', authMiddleware.verifyUserToken, employeeController.listEmployee);

// activate employee
router.post('/activate/:employeeId', authMiddleware.verifyUserToken, employeeController.activateEmployee);

// dectivate employee
router.post('/deactivate/:employeeId', authMiddleware.verifyUserToken, employeeController.deactivateEmployee);

module.exports = router;