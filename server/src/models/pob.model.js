const mongoose = require("mongoose");


const pobSchema = new mongoose.Schema(
  {
    /**
     * Main employee who created the POB entry
     * (usually the logged-in employee)
     */
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    /**
     * If order was generated from a visit,
     * link that visit here.
     * (Helps calculate conversion rate)
     */
    visit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
    },

    /**
     * Joint contributors for this POB.
     * Used if multiple employees worked together.
     * Percentage defines credit split for incentives.
     */
    pobContributors: [
      {
        employee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
        },
        percentage: {
          type: Number,
          min: 0,
          max: 100,
        },
      },
    ],

    /**
     * Doctor or Chemist who placed the order
     */
    doctorChemist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorChemist",
      required: true,
    },

    /**
     * Headquarter reference
     */
    hq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Headquarter",
    },

    /**
     * Order date
     */
    date: {
      type: Date,
      default: Date.now,
    },

    /**
     * List of products included in this POB
     * (One POB can contain multiple products)
     */
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        amount: {
          type: Number,
          required: true,
        }, // flexible client pricing
      },
    ],

    /**
     * Total order value
     * Can be auto-calculated from products array
     */
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


const POB = mongoose.model("POB", pobSchema);

module.exports = POB;