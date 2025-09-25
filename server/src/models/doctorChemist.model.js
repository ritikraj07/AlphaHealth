const mongoose = require("mongoose");

const doctorChemistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["doctor", "chemist"], required: true },
    specialization: { type: String }, // only for doctors
    location: { type: String },
    hq: { type: mongoose.Schema.Types.ObjectId, ref: "Headquarter" },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DoctorChemist", doctorChemistSchema);
