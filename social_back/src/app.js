const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();


const bodyParser = require('body-parser');
const userRoute = require('./database/routes/user.routes');
const collectionRoute = require('./database/routes/collection.routes');
const postRoute = require('./database/routes/post.routes');
const apiRoute = require('./database/routes/api.routes');
const app = express();
const specs = swaggerJsdoc({ apis: ['./routes/**/*.js'], definition: { openapi:'3.0.0', info:{title:'API',version:'1.0.0'} }});

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', userRoute);
app.use('/api/v1', collectionRoute);
app.use('/api/v1', postRoute);
app.use('/api/v1', apiRoute);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/swagger.json', (req,res)=>res.json(specs));

module.exports = app;