const express = require('express');
const app = express();

const employeeRouter = require('./employeeRouter');
const authRouter = require('./authRouter');

app.use('/auth', authRouter);
app.use('/', employeeRouter);

module.exports = app;