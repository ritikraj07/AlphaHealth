// ===============================================
// 🌍 Load Environment Variables (.env file)
// ===============================================
// Allows us to use process.env.PORT, DB_URL etc.
require("dotenv").config();


// ===============================================
// 📥 Import Express App
// ===============================================
// app.js contains middleware, routes, swagger setup etc.
const app = require("./app");


// ===============================================
// 🔗 Import Database Connection Function
// ===============================================
// connectDatabase() will connect to MongoDB
const connectDatabase = require("./src/db");




// ===============================================
// ⚙️ Server PORT Configuration
// ===============================================
// First try PORT from .env file, else use default 8000
const PORT = process.env.PORT || 8000;




// ===============================================
// 🚀 CONNECT DATABASE & START SERVER
// ===============================================
// We connect to DB first, and only then start server
// → prevents server from running without database
connectDatabase().then(() => {

  console.log("✅ MongoDB connected successfully.");

  // If database connected → Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

});
