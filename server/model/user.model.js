const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: {
        type: String,
        enum: ["employee", "manager", "hr", "admin"],
        default: "employee"
    },
    hq: { type: mongoose.Schema.Types.ObjectId, ref: "Headquarter" },
    leavesTaken: {
        sick: { type: Number, default: 0 },
        casual: { type: Number, default: 0 },
        earned: { type: Number, default: 0 },
        public: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
