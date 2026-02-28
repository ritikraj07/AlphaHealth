const { Schema, model } = require("mongoose");

const visitSchema = new Schema(
  {
    // Employee who visited
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    // Linked plan (optional)
    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
    },

    // Doctor/Chemist visited
    doctorChemist: {
      type: Schema.Types.ObjectId,
      ref: "DoctorChemist",
      required: true,
    },

    // Visit date
    date: {
      type: Date,
      default: Date.now,
    },

    // If visit done jointly
    jointEmployees: [
      {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],

    // Notes from visit
    remark: {
      type: String,
    },

    // Whether order received during visit
    isOrderReceived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Visit = model("Visit", visitSchema);

module.exports = Visit;
