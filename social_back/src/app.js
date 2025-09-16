const express = require('express');
const cors = require('cors');
require('dotenv').config();


const bodyParser = require('body-parser');
const userRoute = require('./database/routes/user.routes');
const collectionRoute = require('./database/routes/collection.routes');
const postRoute = require('./database/routes/post.routes');
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', userRoute);
app.use('/api/v1', collectionRoute);
app.use('/api/v1', postRoute);

module.exports = app;