const mongoose = require("mongoose");

/**
 * Leave Schema
 * 
 * Defines the data structure for employee leave applications and approvals.
 * Manages the complete leave lifecycle from application to approval/rejection.
 * 
 * @schema Leave
 * @property {ObjectId} _id - Auto-generated unique identifier
 * @property {ObjectId} employee - Reference to the employee applying for leave
 * @property {string} type - Category of leave being applied for
 * @property {Date} startDate - Start date of the leave period
 * @property {Date} endDate - End date of the leave period
 * @property {string} status - Current status of the leave application
 * @property {Date} appliedOn - Timestamp when leave was applied
 * @property {ObjectId} approvedBy - Reference to the approver (Admin or Employee/Manager)
 */
const leaveSchema = new mongoose.Schema({
    /**
     * Employee applying for leave
     * @type {ObjectId}
     * @ref Employee
     * @required
     * @description Reference to the employee document of the leave applicant
     * @example "507f1f77bcf86cd799439011"
     */
    employee: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Employee", 
        required: true 
    },
    
    /**
     * Category of leave being applied for
     * @type {string}
     * @enum ["sick", "casual", "public"]
     * @required
     * @description Defines the type of leave with specific business rules
     * - "sick": Medical leave for health reasons
     * - "casual": Personal leave for casual purposes
     * - "public": Leave for public holidays or observed holidays
     */
    type: { 
        type: String, 
        enum: ["sick", "casual", "public", "earned","maternity", "paternity" ], 
        required: true 
    },
    
    /**
     * Start date of the leave period
     * @type {Date}
     * @required
     * @description First day of leave (inclusive)
     * @example "2024-01-15T00:00:00.000Z"
     * @validation Should be current or future date
     */
    startDate: { 
        type: Date, 
        required: true 
    },
    
    /**
     * End date of the leave period
     * @type {Date}
     * @required
     * @description Last day of leave (inclusive)
     * @example "2024-01-17T00:00:00.000Z"
     * @validation Should be after or equal to startDate
     */
    endDate: { 
        type: Date, 
        required: true 
    },
    reason: {
        type: String,
        required: true
    },
    
    /**
     * Current status of the leave application
     * @type {string}
     * @enum ["pending", "approved", "rejected"]
     * @default "pending"
     * @description Tracks the approval workflow state
     * - "pending": Awaiting manager/administrator approval
     * - "approved": Leave request has been approved
     * - "rejected": Leave request has been denied
     */
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
    },
    
    /**
     * Timestamp when leave application was submitted
     * @type {Date}
     * @default Date.now
     * @description Auto-generated timestamp of leave application submission
     * @example "2024-01-10T14:30:00.000Z"
     */
    appliedOn: { 
        type: Date, 
        default: Date.now 
    },
    
    /**
     * Administrator or Manager who approved/rejected the leave
     * @type {ObjectId}
     * @description Reference to the approving authority
     * @note Current schema has logical issue: "Employee" || "Admin" is JavaScript syntax, 
     *       not valid Mongoose syntax. Should use refPath for dynamic references.
     * @example "507f1f77bcf86cd799439012" (Admin ID)
     * @example "507f1f77bcf86cd799439013" (Employee/Manager ID)
     */
    approvedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: "approvedBy.model",
         model: { type: String, enum: ['Employee', 'Admin'] }
    }
}, {
    /**
     * Schema Options
     * @option timestamps - Automatically manage createdAt and updatedAt fields
     * @description Adds createdAt and updatedAt fields for audit tracking
     */
    timestamps: true
});

/**
 * Leave Model
 * 
 * Mongoose model representing employee leave applications in the database.
 * Manages the complete leave management workflow from application to resolution.
 * 
 * @model Leave
 * @collection leaves - MongoDB collection name (auto-pluralized)
 * 
 * @method findPendingLeaves - Find all leaves awaiting approval
 * @method getEmployeeLeaveHistory - Retrieve leave history for specific employee
 * @method calculateLeaveDuration - Compute number of leave days
 * @method findLeavesByDateRange - Find leaves within specific date range
 */
const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;