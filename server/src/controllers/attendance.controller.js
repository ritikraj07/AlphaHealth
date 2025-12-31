const mongoose = require("mongoose");
const Attendance = require("../models/attendance.model");
const User = require("../models/employee.model");
const calculateWorkingTime = require("../utils/calculateWorkingHours");

/**
 * Marks attendance for a user.
 * 
 * @param {Object} req.body - Request body containing user ID, type (check-in/check-out), plan, remarks, and location.
 * @param {Response} res - Response object to return the HTTP response.
 * @returns {Promise<Response>} - Promise that resolves the HTTP response.
 * @throws {Error} - If the request body is invalid or if the attendance record cannot be saved.
 */

const MarkAttendance = async (req, res) => {
    // Start a new session to track transactions (remember money transactions type of transactions)
    const session = await mongoose.startSession();
    const userId = req.userId;
    
    try {
        // Start a transaction
        session.startTransaction();
        
        const { 
            type, // 'check-in' or 'check-out'
            location 
        } = req.body;

        

        // 1. Input validation
        if (!userId || !type) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "User ID and type (check-in/check-out) are required"
            });
        }

        if (!location || !location.coordinates || !Array.isArray(location.coordinates)) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Valid location with coordinates is required"
            });
        }

        if (type !== 'check-in' && type !== 'check-out') {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Type must be either 'check-in' or 'check-out'"
            });
        }
        

        // 2. Validate user exists
        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        
        // 3. Find today's attendance record
        let attendance = await Attendance.findOne({
            employee: userId,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        }).session(session);

        
        // 4. Handle check-in
        if (type === 'check-in') {
            if (attendance) {
                await session.abortTransaction();
                return res.status(409).json({
                    success: false,
                    message: "Check-in already recorded for today"
                });
            }

            // Create new attendance record
            attendance = new Attendance({
                employee: userId,
                date: today,
                startTime: new Date(),
                startLocation: {
                    type: 'Point',
                    coordinates: location.coordinates
                },
                status: "present"
            });

            await attendance.save({ session });

            await session.commitTransaction();

            return res.status(201).json({
                success: true,
                message: "Check-in recorded successfully",
                data: {
                    attendanceId: attendance._id,
                    date: attendance.date,
                    startTime: attendance.startTime,
                    location: attendance.startLocation
                }
            });
        }

        
        // 5. Handle check-out
        if (type === 'check-out') {
            if (!attendance) {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    message: "No check-in found for today. Please check-in first."
                });
            }

            if (attendance.endTime) {
                await session.abortTransaction();
                return res.status(409).json({
                    success: false,
                    message: "Check-out already recorded for today"
                });
            }

            // Update attendance with check-out details
            attendance.endTime = new Date();
            attendance.endLocation = {
                type: 'Point',
                coordinates: location.coordinates
            };

            // Calculate working hours
            const startTime = new Date(attendance.startTime);
            const endTime = new Date(attendance.endTime);
            const workingHours = calculateWorkingTime(startTime, endTime);

            // Add working hours to attendance
            // attendance.workingHours = parseFloat(workingHours.toFixed(2));

            

            await attendance.save({ session });
            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                message: "Check-out recorded successfully",
                data: {
                    attendanceId: attendance._id,
                    date: attendance.date,
                    startTime: attendance.startTime,
                    endTime: attendance.endTime,
                    workingHours: workingHours,
                    startLocation: attendance.startLocation,
                    endLocation: attendance.endLocation
                }
            });
        }

    } catch (error) {
        await session.abortTransaction();
        console.error("Error marking attendance:", error);

        // Handle specific MongoDB errors
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors
            });
        }

        // Handle geospatial validation errors
        if (error.message && error.message.includes('coordinates')) {
            return res.status(400).json({
                success: false,
                message: "Invalid location coordinates. Please provide [longitude, latitude]"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error while marking attendance",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        session.endSession();
    }
};



// Additional function to get today's attendance status
const GetTodayAttendance = async (req, res) => {
    try {
        const employeeId = req.userId;

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: "Employee ID is required",
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await Attendance.findOne({
            employee: employeeId,
            date: {
                $gte: today,
                $lt: endOfDay,
            },
        });

        // 🟡 No attendance today
        if (!attendance) {
            return res.status(200).json({
                success: true,
                data: {
                    workStarted: false,
                    workEnded: false,
                    workingHours: 0,
                    attendance: null,
                },
                message: "No attendance recorded for today",
            });
        }

        const workStarted = !!attendance.startTime;
        const workEnded = !!attendance.endTime;

        let workingHours = 0;

        if (workStarted) {
            workingHours = calculateWorkingTime(
                attendance.startTime,
                workEnded ? attendance.endTime : null
            );
        }

        return res.status(200).json({
            success: true,
            data: {
                workStarted,
                workEnded,
                workingHours,
                attendance,
            },
            message: "Today's attendance retrieved successfully",
        });

    } catch (error) {
        console.error("Error fetching today's attendance:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};


// Function to get attendance history
const GetAttendanceHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate, page = 1, limit = 30 } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const query = { user: userId };
        
        // Date range filter
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { date: -1 },
            populate: [
                { path: 'user', select: 'name email' },
                { path: 'plan', select: 'name type' }
            ]
        };

        const attendance = await Attendance.paginate(query, options);

        return res.status(200).json({
            success: true,
            data: attendance,
            message: "Attendance history retrieved successfully"
        });

    } catch (error) {
        console.error("Error fetching attendance history:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    MarkAttendance,
    GetTodayAttendance,
    GetAttendanceHistory
};