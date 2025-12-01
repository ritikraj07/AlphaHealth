require('dotenv').config();

const appConfig = {
    DATA_BASE_URI: process.env.DATA_BASE_URI,
    PORT: process.env.PORT,
    JWT_Secret_Key: process.env.JWT_Secret_Key
};

// console.log("appConfig from config file", appConfig)

module.exports = appConfig; 