const mongoose = require("mongoose");

/**
 * POB (Proof of Business) Schema
 * 
 * Defines the data structure for tracking business transactions between employees
 * and healthcare professionals (doctors/chemists). Serves as evidence of business
 * activities and sales transactions in the field.
 * 
 * @schema POB
 * @property {ObjectId} _id - Auto-generated unique identifier
 * @property {ObjectId} employee - Employee who conducted the business transaction
 * @property {ObjectId} doctorChemist - Healthcare professional or pharmacy involved
 * @property {ObjectId} hq - Associated headquarter for organizational tracking
 * @property {Date} date - Date when the business transaction occurred
 * @property {string} product - Product name or category involved in transaction
 * @property {number} quantity - Number of units/products in the transaction
 * @property {number} value - Monetary value of the transaction
 * @property {Date} createdAt - Auto-generated document creation timestamp
 * @property {Date} updatedAt - Auto-generated last update timestamp
 */
const pobSchema = new mongoose.Schema({
  /**
   * Employee who conducted the business transaction
   * @type {ObjectId}
   * @ref User
   * @required
   * @description Field employee or sales representative who executed the transaction
   * @example "507f1f77bcf86cd799439011"
   */
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  
  /**
   * Healthcare professional or pharmacy involved in transaction
   * @type {ObjectId}
   * @ref DoctorChemist
   * @required
   * @description Doctor or chemist who received/purchased the products
   * @example "507f1f77bcf86cd799439012"
   */
  doctorChemist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorChemist",
    required: true,
  },
  
  /**
   * Associated headquarter for organizational tracking
   * @type {ObjectId}
   * @ref Headquarter
   * @description Headquarter that the employee belongs to, for regional reporting
   * @example "507f1f77bcf86cd799439013"
   */
  hq: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Headquarter" 
  },
  
  /**
   * Date when the business transaction occurred
   * @type {Date}
   * @default Date.now
   * @description Timestamp of the actual business transaction
   * @example "2024-01-15T10:30:00.000Z"
   */
  date: { 
    type: Date, 
    default: Date.now 
  },
  
  /**
   * Product name or category involved in transaction
   * @type {string}
   * @required
   * @description Name of the pharmaceutical product, medical equipment, or service
   * @example "Paracetamol 500mg", "Diabetes Test Strips", "Blood Pressure Monitor"
   */
  product: { 
    type: String, 
    required: true 
  },
  
  /**
   * Number of units/products in the transaction
   * @type {number}
   * @required
   * @description Quantity of products sold or demonstrated
   * @validation Should be positive number
   * @example 50, 100, 25.5 (if fractional quantities are allowed)
   */
  quantity: { 
    type: Number, 
    required: true 
  },
  
  /**
   * Monetary value of the transaction
   * @type {number}
   * @required
   * @description Total financial value of the business transaction
   * @validation Should be positive number, typically in base currency
   * @example 1500.75, 5000, 12500.50
   */
  value: { 
    type: Number, 
    required: true 
  }, // monetary value
}, {
  /**
   * Schema Options
   * @option timestamps - Automatically manage createdAt and updatedAt fields
   * @description Adds createdAt and updatedAt fields for audit tracking
   */
  timestamps: true
});

/**
 * POB (Proof of Business) Model
 * 
 * Mongoose model representing business transactions and sales evidence in the database.
 * Tracks field employee activities, sales performance, and business relationships with
 * healthcare professionals.
 * 
 * @model POB
 * @collection pobs - MongoDB collection name (auto-pluralized)
 * 
 * @method findByEmployee - Find all POB records for specific employee
 * @method findByDoctorChemist - Find all transactions with specific doctor/chemist
 * @method getSalesByHQ - Aggregate sales data by headquarter
 * @method getMonthlySales - Calculate monthly sales performance
 * @method findHighValueTransactions - Find transactions above specific value threshold
 */
const POB = mongoose.model("POB", pobSchema);

module.exports = POB;