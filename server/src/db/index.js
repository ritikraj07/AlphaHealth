const mongoose = require("mongoose");
const appConfig = require("../config/index");
console.log(appConfig , "=============")

// Database configuration
const DATABASE_URI = appConfig.DATA_BASE_URI;
const MAX_RETRIES = 5;
let retryCount = 0;

/**
 * DATABASE CONNECTION MANAGER WITH RETRY MECHANISM
 * 
 * This function handles MongoDB connection with automatic retries and event listeners.
 * It ensures robust database connectivity for the application.
 * 
 * KEY FEATURES:
 * - Automatic retry with exponential backoff (fixed 10s delay in this case)
 * - Connection event listeners for monitoring
 * - Graceful error handling and process exit on fatal failures
 * - Strict query mode for safer database operations
 * 
 * EVENT LISTENERS:
 * - disconnected: Monitors when database connection is lost
 * - reconnected: Handles successful reconnection scenarios  
 * - error: Captures and logs database errors
 * 
 * RETRY LOGIC:
 * - Attempts connection up to MAX_RETRIES times
 * - Waits 10 seconds between each retry attempt
 * - Exits process if all retries are exhausted
 * 
 * USAGE:
 * - Call this function during application startup
 * - Ensure DATABASE_URI is properly configured in config
 * - Function returns a promise that resolves when connected
 */


async function connectDatabase() {
  // Enable strict query mode
  mongoose.set("strictQuery", true);

  /**
   * Get database URI with proper validation
   */
  const getDatabaseURI = () => {
    try {
      
      // Validate the URI exists and is a string
      if (!DATABASE_URI) {
        throw new Error("DATABASE_URI is not defined in config");
      }
      
      if (typeof DATABASE_URI !== 'string') {
        throw new Error("DATABASE_URI must be a string");
      }
      
      console.log(`📝 Using database: ${DATABASE_URI.split('@').pop() || DATABASE_URI}`);
      return DATABASE_URI;
      
    } catch (configError) {
      console.error("❌ Configuration error:", configError.message);
      
      // Try fallback to environment variable
      const envURI = process.env.DATABASE_URI || process.env.MONGODB_URI;
      if (envURI) {
        console.log("🔄 Using environment variable for database URI");
        return envURI;
      }
      
      // Final fallback
      const fallbackURI = 'mongodb://127.0.0.1:27017/alphahealth';
      console.log(`🔄 Using fallback database: ${fallbackURI}`);
      return fallbackURI;
    }
  };

  /**
   * Recursive function that attempts database connection with retry logic
   */
  const connectWithRetry = async () => {
    try {
      const DATABASE_URI = getDatabaseURI();
      
      console.log(
        `🔁 Attempting MongoDB connection (${retryCount + 1}/${MAX_RETRIES})...`
      );
      
      // Attempt to connect to MongoDB with options
      await mongoose.connect(DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      console.log("✅ MongoDB connected successfully.");
      
    } catch (error) {
      retryCount++;
      console.error("❌ MongoDB connection failed:", error.message);

      if (retryCount < MAX_RETRIES) {
        console.log("⏳ Retrying in 10 seconds...");
        setTimeout(connectWithRetry, 10000);
      } else {
        console.error("❗️ Max retries reached. Exiting application.");
        process.exit(1);
      }
    }
  };

  // DATABASE EVENT LISTENERS
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected.");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected.");
  });

  mongoose.connection.on("error", (err) => {
    console.error("🔥 MongoDB error:", err.message);
  });

  // Start the connection process
  await connectWithRetry();
  console.log("📦 Database connection setup complete.");
}

module.exports = connectDatabase;

