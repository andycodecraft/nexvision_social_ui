const express = require('express');
const cors = require('cors');
require('dotenv').config();


const bodyParser = require('body-parser');
const brokerRoutes = require('./database/routes/user.routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', brokerRoutes);

module.exports = app;