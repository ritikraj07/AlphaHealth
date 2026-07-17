const mongoose = require("mongoose");

const doctorChemistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      // unique: false, // change to true if business rule allows
      // sparse: true,
    },

    type: {
      type: String,
      enum: ["doctor", "chemist"],
      required: true,
    },

    specialization: {
      type: String,
      required: function () {
        return this.type === "doctor";
      },
    },

    location: {
      type: String,
    },

    hq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Headquarter",
    },

    potential: {
      type: String,
      enum: ["medium", "low", "high"],
      default: "high",
    },

    frequency: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    approvedBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "approvedBy.model",
      },
      role: {
        type: String,
      },
      model: {
        type: String,
        enum: ["Admin", "Employee"],
      },
    },

    addedBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "addedBy.model",
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      model: {
        type: String,
        enum: ["Admin", "Employee"],
        required: true,
      },
    },
    phone: {
      type: String,
      
      // maxlength: 10,
      // minlength: 10,
      // unique: true
    },
  },
  { timestamps: true },
);

// Ensure approvedBy fields only exist if approved
doctorChemistSchema.pre("save", function (next) {
  if (!this.isApproved) {
    this.approvedBy = undefined;
  }
  next();
});

module.exports = mongoose.model("DoctorChemist", doctorChemistSchema);
