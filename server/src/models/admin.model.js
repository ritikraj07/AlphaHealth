const {Schema, model} = require("mongoose");

/**
 * Admin Schema
 * 
 * Defines the data structure and validation rules for administrator accounts in the system.
 * Administrators have elevated privileges and manage system-wide operations.
 * 
 * @schema Admin
 * @property {ObjectId} _id - Auto-generated unique identifier
 * @property {string} name - Administrator's full name
 * @property {string} email - Unique email address for authentication
 * @property {string} password - Hashed password for security
 * @property {string} role - Fixed role identifier, always "admin"
 * @property {Object} leavesTaken - Track various types of leaves taken
 * @property {Date} createdAt - Auto-generated document creation timestamp
 * @property {Date} updatedAt - Auto-generated last update timestamp
 */
const adminSchem = new Schema({
    /**
     * Administrator's full name
     * @type {string}
     * @required
     * @validation
     * - Minimum length: 2 characters
     * - Maximum length: 50 characters
     * - Automatically trimmed of whitespace
     */
    name: { 
        type: String, 
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    
    /**
     * Unique email address for authentication and communication
     * @type {string}
     * @required
     * @unique
     * @validation
     * - Must be a valid email format
     * - Automatically converted to lowercase
     * - Automatically trimmed of whitespace
     * - Unique across all admin documents
     */
    email: { 
        type: String, 
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    
    /**
     * Securely hashed password for authentication
     * @type {string}
     * @required
     * @validation
     * - Minimum length: 6 characters
     * - Should be hashed before saving to database
     */
    password: { 
        type: String, 
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    }, 
    
    /**
     * Role identifier for access control
     * @type {string}
     * @default "admin"
     * @validation
     * - Fixed value: must always be "admin"
     * - Cannot be modified after creation
     * - Used for permission and authorization checks
     */
    role: {
        type: String,
        default: "admin",
        validate: {
            validator: function (value) {
                return value === "admin";
            },
            message: "Role must be 'admin'"
        }
    },
    
    /**
     * Leave tracking for administrative personnel
     * @type {Object}
     * @property {number} sick - Sick leaves taken (default: 0, min: 0)
     * @property {number} casual - Casual leaves taken (default: 0, min: 0)
     * @property {number} earned - Earned leaves taken (default: 0, min: 0)
     * @property {number} public - Public holidays taken (default: 0, min: 0)
     */
    leavesTaken: {
        sick: { type: Number, default: 0, min: 0 },
        casual: { type: Number, default: 0, min: 0 },
        earned: { type: Number, default: 0, min: 0 },
        public: { type: Number, default: 0, min: 0 },
    },
    
}, {
    /**
     * Schema options
     * @option timestamps - Automatically manage createdAt and updatedAt fields
     */
    timestamps: true
})

/**
 * Admin Model
 * 
 * Mongoose model representing administrators in the database.
 * Provides methods for CRUD operations and data validation.
 * 
 * @model Admin
 * @collection admins - MongoDB collection name (auto-pluralized)
 */
const Admin = model("Admin", adminSchem);

module.exports = Admin;