// ================================
// 🧠 BASIC IMPORTS (Core Modules)
// ================================
const express = require("express");  // Main framework to handle server and routing
const path = require("path");        // Helps work with file & folder paths

// ================================
// 📦 THIRD PARTY PACKAGES
// ================================
const morgan = require('morgan');                     // Logs HTTP requests in terminal (helps debugging)
const swaggerUi = require('swagger-ui-express');      // For API documentation
const apiDocument = require('./api-docs.json');       // Generated Swagger JSON file
const helmet = require('helmet');                     // Adds security headers (protects server)
const { v4: uuidv4 } = require('uuid');               // Generates unique IDs (for tracking requests)
var cors = require('cors');                           // Allows API access from different domains

// ================================
// 🚀 CREATE EXPRESS APP
// ================================
const app = express();

// ================================
// 📁 IMPORT ROUTES
// ================================
const routers = require("./src/routes/index");



// ===================================================
// 🔐 1. SECURITY MIDDLEWARES (SHOULD ALWAYS BE FIRST)
// ===================================================
app.use(helmet());  // Protects app by setting secure HTTP headers
app.use(cors());    // Allows cross-origin resource sharing



// ===================================================
// 🆔 MIDDLEWARE — Generate & Attach Unique Request ID
// ===================================================
app.use((req, res, next) => {

  // Create a unique ID for every API request
  req.requestId = uuidv4();
  
  // Also send it back in response headers (helpful for debugging and tracking logs)
  res.setHeader('X-Request-ID', req.requestId);
  
  next(); // Move forward to next middleware/route
});



// ===================================================
// 🗂 STATIC FILES + BODY PARSERS
// ===================================================
app.use('/static', express.static(path.join(__dirname, 'src/static')));
// Example: http://localhost:5000/static/image.png

app.use(express.urlencoded({ extended: false })); // Handles form-data (URL encoded)
app.use(express.json());                          // Converts JSON body → req.body



// ===================================================
// 📝 MORGAN LOGGER
// ===================================================
app.use(morgan('dev')); 
// Logs requests like: GET /api/users 200 12ms
// Good for debugging while developing



// ===================================================
// 🌐 ROUTES (MAIN API)
// ===================================================
app.use('/api', routers); // All routes will start with /api
// Example: /api/auth/login, /api/users, /api/admin ...



// ===================================================
// 📚 SWAGGER DOCUMENTATION ROUTE
// ===================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocument));
// Visit this in browser 👉 http://localhost:5000/api-docs



// ===================================================
// 🔥 DEFAULT HOME ROUTE
// ===================================================
app.get("/", (req, res) => {
    res.send("Hello There... 👋");
});



// ===================================================
// 📤 EXPORT APP (Used in server.js / index.js)
// ===================================================
module.exports = app;
