const mongoose = require("mongoose");

/**
 * Employee Model
 * 
 * Represents an employee within the organizational hierarchy. Supports complex reporting
 * structures where managers can be either Employees or Admins. Includes comprehensive
 * leave tracking, role-based permissions, and organizational context.
 * 
 * @version 1.0.0
 * @author Ritik Raj
 * @since 2025 NOVEMBER
 */
const employeeSchema = new mongoose.Schema({
    /**
     * Employee's full name
     * @required Must be between 2-50 characters
     * @indexed For search and sorting operations
     */
    name: { 
        type: String, 
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"],
        index: true
    },

    /**
     * Unique email address for authentication and communication
     * @required Must be unique across all employees
     * @indexed Critical for login and lookup operations
     * @lowercased Ensures case-insensitive uniqueness
     */
    email: { 
        type: String, 
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
        index: true
    },

    /**
     * Hashed password for authentication
     * @required Minimum 6 characters
     * @security Never returned in query results by default
     */
    password: { 
        type: String, 
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    }, 

    /**
     * Organizational role determining system permissions
     * @default "employee"
     * @enum Restricted to valid organizational roles
     */
    role: {
        type: String,
        enum: {
            values: ["employee", "manager"],
            message: "Role must be either 'employee' or 'manager'"
        },
        default: "employee",
        required: [true, "Role is required"],
        lowercase: true,
        trim: true,
        index: true
    },

    /**
     * Reference to the Headquarter location this employee belongs to
     * @required Every employee must be associated with a headquarter
     * @ref Headquarter
     */
    hq: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Headquarter",
        required: [true, "Headquarter is required"],
        index: true
    },

    /**
     * Leave tracking system recording various types of time off
     * @structure Nested object with categorized leave counters
     */
    leavesTaken: {
        /**
         * Sick leave count for health-related absences
         * @default 0
         * @min 0 Cannot be negative
         */
        sick: { 
            type: Number, 
            default: 0, 
            min: [0, "Sick leaves cannot be negative"] 
        },

        /**
         * Casual leave for personal time off
         * @default 0
         * @min 0 Cannot be negative
         */
        casual: { 
            type: Number, 
            default: 0, 
            min: [0, "Casual leaves cannot be negative"] 
        },

        /**
         * Earned leave accrued over time
         * @default 0
         * @min 0 Cannot be negative
         */
        earned: { 
            type: Number, 
            default: 0, 
            min: [0, "Earned leaves cannot be negative"] 
        },

        /**
         * Public holiday leave count
         * @default 0
         * @min 0 Cannot be negative
         */
        public: { 
            type: Number, 
            default: 0, 
            min: [0, "Public holidays cannot be negative"] 
        },
    },

    /**
     * Reporting manager reference using polymorphic pattern
     * @required Every employee must have a manager (can be Employee or Admin)
     * @polymorphic Uses refPath to dynamically reference different models
     */
    manager: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: null,
        index: true,
        refPath: 'managerModel'
    },

    /**
     * Specifies the model type for the manager reference
     * @required Determines which collection to query for manager details
     * @enum Restricted to valid manager types
     */
    managerModel: {
        type: String,
        required: true,
        enum: {
            values: ['Employee', 'Admin'],
            message: "Manager model must be either 'Employee' or 'Admin'"
        },
        default: 'Employee'
    }
}, {
    // Schema Options
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true } // Include virtuals in object output
});

// =============================================================================
// VIRTUAL FIELDS
// =============================================================================

/**
 * Computes total leaves taken across all categories
 * @virtual
 * @returns {number} Sum of all leave types
 * @example
 * const employee = await Employee.findById(id);
 * console.log(employee.totalLeavesTaken); // 15
 */
employeeSchema.virtual('totalLeavesTaken').get(function() {
    return this.leavesTaken.sick + 
           this.leavesTaken.casual + 
           this.leavesTaken.earned + 
           this.leavesTaken.public;
});

/**
 * Checks if employee has manager permissions
 * @virtual
 * @returns {boolean} True if role is 'manager'
 * @example
 * if (employee.isManager) {
 *   // Grant management access
 * }
 */
employeeSchema.virtual('isManager').get(function() {
    return this.role === 'manager';
});

/**
 * Indicates if this employee is managed by an Admin
 * @virtual
 * @returns {boolean} True if manager is an Admin
 */
employeeSchema.virtual('isManagedByAdmin').get(function() {
    return this.managerModel === 'Admin';
});

// =============================================================================
// INSTANCE METHODS
// =============================================================================

/**
 * Retrieves all employees who report directly to this employee
 * @async
 * @returns {Promise<Array<Employee>>} Array of team member documents
 * @throws {Error} If database query fails
 * @example
 * const manager = await Employee.findById(managerId);
 * const team = await manager.getTeamMembers();
 */
employeeSchema.methods.getTeamMembers = async function() {
    return await mongoose.model('Employee').find({ 
        manager: this._id,
        managerModel: 'Employee'
    });
};

/**
 * Checks if this employee can manage other employees
 * @returns {boolean} True if employee has management capabilities
 */
employeeSchema.methods.canManageEmployees = function() {
    return this.role === 'manager' || this.managerModel === 'Admin';
};

// =============================================================================
// MIDDLEWARE
// =============================================================================

/**
 * Pre-save validation hook for manager references
 * - Validates manager existence and role permissions
 * - Prevents circular references in management chain
 * - Ensures data integrity for organizational hierarchy
 * 
 * @hook pre-save
 * @throws {Error} When manager validation fails
 */
employeeSchema.pre('save', async function(next) {
    // Skip validation if manager fields unchanged
    if (!this.isModified('manager') && !this.isModified('managerModel')) {
        return next();
    }
    
    if (this.manager) {
        try {
            let managerDoc;
            
            if (this.managerModel === 'Employee') {
                managerDoc = await mongoose.model('Employee')
                    .findById(this.manager)
                    .select('role');
                    
                if (!managerDoc) {
                    throw new Error('Referenced manager employee not found');
                }
                
                if (managerDoc.role !== 'manager') {
                    throw new Error('Employee manager must have manager role');
                }
                
                // Prevent circular management references
                if (this._id && this._id.equals(this.manager)) {
                    throw new Error('Employee cannot be their own manager');
                }
                
            } else if (this.managerModel === 'Admin') {
                managerDoc = await mongoose.model('Admin').findById(this.manager);
                if (!managerDoc) {
                    throw new Error('Referenced admin manager not found');
                }
            }
            
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// =============================================================================
// INDEXES
// =============================================================================

/**
 * Performance optimization indexes for common query patterns
 * Review and update based on actual application query patterns
 */

// Single Field Indexes (defined in schema)
// - name, email, role, hq, manager

// Compound Indexes for complex queries
employeeSchema.index({ hq: 1, role: 1 });           // HQ-based role queries
employeeSchema.index({ manager: 1, role: 1 });      // Manager's team by role
employeeSchema.index({ hq: 1, manager: 1 });        // Organizational hierarchy
employeeSchema.index({ manager: 1, managerModel: 1 }); // Polymorphic reference queries
employeeSchema.index({ hq: 1, manager: 1, managerModel: 1 }); // Complex org queries

// Leave tracking indexes for reporting
employeeSchema.index({ 
    "leavesTaken.sick": 1, 
    "leavesTaken.casual": 1, 
    "leavesTaken.earned": 1 
});

// Text search index for name and email search
employeeSchema.index({ 
    name: 'text', 
    email: 'text' 
});

// =============================================================================
// MODEL EXPORT
// =============================================================================

/**
 * Employee Model
 * @class Employee
 * @type {mongoose.Model}
 */
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;