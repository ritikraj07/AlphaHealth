const mongoose = require("mongoose");

const pobSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorChemist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorChemist",
    required: true,
  },
  hq: { type: mongoose.Schema.Types.ObjectId, ref: "Headquarter" },
  date: { type: Date, default: Date.now },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  value: { type: Number, required: true }, // monetary value
});

module.exports = mongoose.model("POB", pobSchema);
