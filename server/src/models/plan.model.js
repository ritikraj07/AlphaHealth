const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * PLAN SCHEMA
 *
 * Represents a planned visit created by employee/manager/admin.
 * Used for discipline tracking and coverage analysis.
 *
 * Plan = "I will visit this doctor on this date"
 *
 * Important:
 * - Plan does NOT mean visit happened.
 * - Visit model will confirm actual visit.
 */

const planSchema = new Schema(
  {
    // Employee who created the plan
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    // Doctor or Chemist to be visited
    doctorChemist: {
      type: Schema.Types.ObjectId,
      ref: "DoctorChemist",
      required: true,
    },

    // Date of planned visit
    date: {
      type: Date,
      required: true,
    },

    // Focus products for discussion (optional)
    productFocus: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // If visit is planned jointly
    jointEmployees: [
      {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],

    // Plan status
    // planned | completed | missed
    status: {
      type: String,
      enum: ["planned", "completed", "missed"],
      default: "planned",
    },

    // Manager remarks (optional)
    remark: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);



const Plan = model("Plan", planSchema);

module.exports = Plan;