require('dotenv').config();
require('./src/db/conn');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const routers = require('./src/routes/route')
const cookieParser = require('cookie-parser');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/', routers);


app.listen(PORT, () => console.log(`App is runing at port ${PORT}`));