require('dotenv').config();

const appConfig = {
    DATA_BASE_URI: process.env.DATA_BASE_URI,
    PORT: process.env.PORT
};

module.exports = appConfig; 