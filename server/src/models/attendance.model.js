const mongoose = require("mongoose");


const attendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    plan: [{ type: mongoose.Schema.Types.ObjectId, ref: "DoctorChemist" }], // morning plan
    remarks: { type: String },
    status: { type: String, enum: ["present", "absent", "leave"], default: "present" }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
