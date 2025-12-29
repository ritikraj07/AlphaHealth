const mongoose = require("mongoose");

/**
 * Attendance Schema
 * 
 * Defines the data structure for tracking employee attendance with geolocation validation.
 * Supports check-in/check-out functionality with location tracking and daily visit planning.
 * 
 * @schema Attendance
 * @property {ObjectId} _id - Auto-generated unique identifier
 * @property {ObjectId} employee - Reference to the User who marked attendance
 * @property {Date} date - The calendar date for attendance tracking
 * @property {Date} startTime - Check-in timestamp when employee starts work
 * @property {Date} endTime - Check-out timestamp when employee ends work
 * @property {string} status - Attendance status (present/absent/leave)
 * @property {Object} startLocation - Geolocation coordinates at check-in
 * @property {Object} endLocation - Geolocation coordinates at check-out
 * @property {Date} createdAt - Auto-generated document creation timestamp
 * @property {Date} updatedAt - Auto-generated last update timestamp
 */
const attendanceSchema = new mongoose.Schema({
    /**
     * Reference to the employee/user who marked attendance
     * @type {ObjectId}
     * @ref User
     * @required
     * @description Links to the User model for employee information
     */
    employee: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Employee", 
        required: true 
    },
    
    /**
     * Calendar date for attendance record
     * @type {Date}
     * @required
     * @description Used to group and query attendance by date
     * @example "2024-01-15T00:00:00.000Z"
     */
    date: { 
        type: Date, 
        required: true 
    },
    
    /**
     * Check-in timestamp when employee starts work
     * @type {Date}
     * @description Recorded when employee marks attendance as "check-in"
     * @example "2024-01-15T09:00:00.000Z"
     */
    startTime: { 
        type: Date 
    },
    
    /**
     * Check-out timestamp when employee ends work
     * @type {Date}
     * @description Recorded when employee marks attendance as "check-out"
     * @example "2024-01-15T18:00:00.000Z"
     */
    endTime: { 
        type: Date 
    },
    
    

    
    /**
     * Attendance status for the day
     * @type {string}
     * @enum ["present", "absent", "leave"]
     * @default "present"
     * @description Tracks the overall attendance status
     * - "present": Employee is working
     * - "absent": Employee is not working without approval
     * - "leave": Employee is on approved leave
     */
    status: { 
        type: String, 
        enum: ["present", "absent", "leave"], 
        default: "present" 
    },
    
    /**
     * Geolocation coordinates recorded at check-in time
     * @type {Object}
     * @required
     * @property {string} type - GeoJSON type (always 'Point')
     * @property {number[]} coordinates - [longitude, latitude] array
     * @description MongoDB GeoJSON format for spatial queries and validation
     * @example { type: "Point", coordinates: [77.2311, 28.6517] }
     */
    startLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    
    /**
     * Geolocation coordinates recorded at check-out time
     * @type {Object}
     * @required
     * @property {string} type - GeoJSON type (always 'Point')
     * @property {number[]} coordinates - [longitude, latitude] array
     * @description MongoDB GeoJSON format for spatial queries and validation
     * @example { type: "Point", coordinates: [77.1025, 28.5355] }
     */
    endLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, {
    /**
     * Schema Options
     * @option timestamps - Automatically manage createdAt and updatedAt fields
     */
    timestamps: true
});

/**
 * Attendance Model
 * 
 * Mongoose model representing employee attendance records in the database.
 * Provides methods for CRUD operations, geospatial queries, and attendance analytics.
 * 
 * @model Attendance
 * @collection attendances - MongoDB collection name (auto-pluralized)
 * 
 * @method calculateWorkingHours - Computes duration between startTime and endTime
 * @method findNearbyAttendances - Geospatial query for attendances in area
 * @method getEmployeeMonthlyReport - Aggregates attendance data per employee per month
 */
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;