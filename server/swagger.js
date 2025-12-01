const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Alphahealth',
        description: 'Alphahealth API Documentation'
    },
    host: 'localhost:3000'
};

const outputFile = './api-docs.json';
const routes = ['./src/routes/index.js'];



swaggerAutogen(outputFile, routes, doc);



