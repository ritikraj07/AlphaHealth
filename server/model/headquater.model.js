const mongoose = require("mongoose");

const hqSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    region: { type: String },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Headquarter", hqSchema);
