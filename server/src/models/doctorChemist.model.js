const mongoose = require("mongoose");

/**
 * DoctorChemist Schema
 * 
 * Defines the data structure for storing healthcare professionals (doctors) and chemists (pharmacies)
 * in the system. This schema supports tracking medical professionals and pharmacies for field employee visits.
 * 
 * @schema DoctorChemist
 * @property {ObjectId} _id - Auto-generated unique identifier
 * @property {string} name - Name of the doctor or chemist
 * @property {string} type - Classification as either doctor or chemist
 * @property {string} specialization - Medical specialization (doctors only)
 * @property {string} location - Physical address or area of practice
 * @property {ObjectId} hq - Associated headquarter for organizational grouping
 * @property {ObjectId} addedBy - User who added this record to the system
 * @property {Date} createdAt - Auto-generated document creation timestamp
 * @property {Date} updatedAt - Auto-generated last update timestamp
 */
const doctorChemistSchema = new mongoose.Schema(
  {
    /**
     * Name of the doctor or chemist business
     * @type {string}
     * @required
     * @description Full name of the healthcare professional or name of the pharmacy
     * @example "Dr. Rajesh Kumar", "MedPlus Pharmacy", "Apollo Pharmacy"
     */
    name: { 
      type: String, 
      required: true 
    },
    
    /**
     * Classification type of the entity
     * @type {string}
     * @enum ["doctor", "chemist"]
     * @required
     * @description Determines whether this is a medical professional or pharmacy
     * - "doctor": Medical practitioner with specialization
     * - "chemist": Pharmacy or drug store
     */
    type: { 
      type: String, 
      enum: ["doctor", "chemist"], 
      required: true 
    },
    
    /**
     * Medical specialization field
     * @type {string}
     * @description Required for doctors, optional for chemists
     * @example "Cardiologist", "Dermatologist", "Pediatrician"
     * @conditionallyRequired Only applicable when type is "doctor"
     */
    specialization: { 
      type: String 
    },
    
    /**
     * Physical location or address
     * @type {string}
     * @description Practice address for doctors or store location for chemists
     * @example "123 Medical Street, Health City", "MG Road, Bengaluru"
     */
    location: { 
      type: String 
    },
    
    /**
     * Associated headquarter for organizational management
     * @type {ObjectId}
     * @ref Headquarter
     * @description Links to the Headquarter model for regional grouping and access control
     * @example "507f1f77bcf86cd799439011"
     */
    hq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Headquarter",
    },
    
    /**
     * User who created this record
     * @type {ObjectId}
     * @ref User
     * @description Tracks which employee or admin added this doctor/chemist to the system
     * @example "507f1f77bcf86cd799439012"
     */
    addedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employee" || "Admin"
    },
  },
  {
    /**
     * Schema Options
     * @option timestamps - Automatically manage createdAt and updatedAt fields
     * @description Adds createdAt and updatedAt fields for audit tracking
     */
    timestamps: true,
  }
);

/**
 * DoctorChemist Model
 * 
 * Mongoose model representing healthcare professionals and pharmacies in the database.
 * Used for managing field employee visit plans and healthcare network tracking.
 * 
 * @model DoctorChemist
 * @collection doctorchemists - MongoDB collection name (auto-pluralized)
 * 
 * @method findBySpecialization - Find doctors by medical specialization
 * @method findByHeadquarter - Find doctors/chemists by associated headquarter
 * @method getChemistsNearLocation - Find chemists in specific areas (when location data enhanced)
 */
const DoctorChemist = mongoose.model("DoctorChemist", doctorChemistSchema);

module.exports = DoctorChemist;