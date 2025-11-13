// models/headquarter.model.js
const mongoose = require("mongoose");

const hqSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    region: { type: String, required: true },
    createdBy: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'createdBy.model' },
        role: { type: String, required: true },
        model: { type: String, required: true, enum: ['Admin', 'Employee'] }
    },
    managers: [{ 
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
        role: { type: String, default: 'manager' }
    }],
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
}, {
    timestamps: true
});

const Headquarter = mongoose.model("Headquarter", hqSchema);
module.exports = Headquarter;