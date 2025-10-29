const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    plan: [{ type: mongoose.Schema.Types.ObjectId, ref: "DoctorChemist" }],
    remarks: { type: String },
    status: { type: String, enum: ["present", "absent", "leave"], default: "present" },
    startLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    endLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;