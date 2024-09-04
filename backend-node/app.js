const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 2121;
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database/dbConnection');
const mainRouter = require('./routers/indexRouter');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const corsOptions ={
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type", "Authorization"]
}
app.use(cors(corsOptions));

connectDB();

app.get('/', (req, res)=>{
    res.send('Welcome to Login Api!');
})
app.use('/api', mainRouter);

app.listen(port, (error)=>{
    if(error) throw error;
    console.info(`Server is running on port ${port}`)
})