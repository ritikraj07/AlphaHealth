// models/headquarter.model.js
const mongoose = require("mongoose");

/**
 * Headquarter Schema
 * 
 * Defines the data structure for organizational headquarters that manage regions,
 * employees, and operations. Supports flexible creator tracking and hierarchical management.
 * 
 * @schema Headquarter
 * @property {ObjectId} _id - Auto-generated unique identifier
 * @property {string} name - Unique name identifier for the headquarter
 * @property {string} region - Geographical region served by this headquarter
 * @property {Object} createdBy - Complex object tracking who created this headquarter
 * @property {Object[]} managers - Array of managerial staff assigned to this headquarter
 * @property {ObjectId[]} employees - Array of employees assigned to this headquarter
 * @property {Date} createdAt - Auto-generated document creation timestamp
 * @property {Date} updatedAt - Auto-generated last update timestamp
 */
const hqSchema = new mongoose.Schema({
    /**
     * Unique name identifier for the headquarter
     * @type {string}
     * @required
     * @unique
     * @description Distinct name used to identify the headquarter location
     * @example "Delhi Central Office", "Mumbai West Branch", "Bangalore South HQ"
     */
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    
    /**
     * Geographical region served by this headquarter
     * @type {string}
     * @required
     * @description Defines the operational territory or geographical area
     * @example "North India", "Western Region", "Delhi NCR", "Karnataka"
     */
    region: { 
        type: String, 
        required: true 
    },
    
    /**
     * Complex object tracking the creator of this headquarter
     * @type {Object}
     * @required
     * @property {ObjectId} id - Reference to the creator's document ID
     * @property {string} role - Role of the creator at time of creation
     * @property {string} model - Model type of the creator (Admin or Employee)
     * @description Uses refPath for dynamic model reference based on creator type
     */
    createdBy: {
        id: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            refPath: 'createdBy.model' 
        },
        role: { 
            type: String, 
            required: true 
        },
        model: { 
            type: String, 
            required: true, 
            enum: ['Admin', 'Employee'] 
        }
    },
    
    /**
     * Array of managerial staff assigned to this headquarter
     * @type {Object[]}
     * @description Managers with specific roles and responsibilities for this location
     * @property {ObjectId} id - Reference to Employee document
     * @property {string} role - Managerial role (default: 'manager')
     * @example [{ id: "507f1f77bcf86cd799439011", role: "regional_manager" }]
     */
    managers: [{ 
        id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Employee' 
        },
        role: { 
            type: String, 
            default: 'manager' 
        }
    }],
    
    /**
     * Array of employees assigned to this headquarter
     * @type {ObjectId[]}
     * @ref Employee
     * @description All employees who report to this headquarter location
     * @example ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
     */
    employees: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee' 
    }]
}, {
    /**
     * Schema Options
     * @option timestamps - Automatically manage createdAt and updatedAt fields
     * @description Adds createdAt and updatedAt fields for audit tracking and change monitoring
     */
    timestamps: true
});

/**
 * Headquarter Model
 * 
 * Mongoose model representing organizational headquarters in the database.
 * Serves as the central organizational unit for regional management, employee assignment,
 * and operational hierarchy.
 * 
 * @model Headquarter
 * @collection headquarters - MongoDB collection name (auto-pluralized)
 * 
 * @method findByRegion - Find headquarters by geographical region
 * @method getHQByManager - Find headquarters managed by specific employee
 * @method getEmployeeCount - Aggregate employee counts per headquarter
 * @method findHQByCreator - Find headquarters created by specific admin/employee
 */
const Headquarter = mongoose.model("Headquarter", hqSchema);

module.exports = Headquarter;