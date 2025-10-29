const express = require("express");
const path = require("path");
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express');
const apiDocument = require('./api-docs.json');
var cors = require('cors')
const app = express();


const routers = require("./src/routes/index");

app.use(cors())

// Serve static files from static folder
app.use('/static', express.static(path.join(__dirname, 'src/static')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev')); //! explor more about it https://www.npmjs.com/package/morgan
app.use('/api',routers);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocument));




app.get("/", (req, res) => {
    res.send("Hello There...");
})



module.exports = app;