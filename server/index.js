require("dotenv").config();
const express = require("express");


const app = express();
app.get("/", (req, res) => {
    res.send("Hello World");
})

const PORT = process.env.PORT || 8000
app.listen(8000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
