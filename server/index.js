require("dotenv").config();
const app = require("./app");
const connectDatabase = require("./src/db");





const PORT = process.env.PORT || 8000

connectDatabase().then(() => {
  console.log("✅ MongoDB connected successfully.");
  // ✅ Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});