const Leave = require("../models/leave.model");


const ApplyLeave = async(req, res) => {
    try {
        const userId = req.userId;
        const { type, startDate, endDate, reason, isHalfDay, halfType } = req.body;
        // startDate = new Date(startDate);
        // endDate = new Date(finalEndDate);


        console.log({ type, startDate, endDate, reason, isHalfDay, halfType } )

         // ----- VALIDATIONS -----
            // 1. Required fields
            if (!type || !startDate || !reason) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            // 2. Sick/Casual leave cutoff 9 AM
            if ((type === "sick" || type === "casual")) {
                const now = new Date();
                const cutoff = new Date();
                cutoff.setHours(9, 0, 0, 0);
                if (now > cutoff) {
                    return res.status(400).json({ success: false, message: `${type === "sick" ? "Sick" : "Casual"} leave can only be applied before 9 AM` });
                }
            }

            // 3. Half-day validation
           if (isHalfDay) {
                if (!halfType || (halfType !== "first" && halfType !== "second")) {
                    return res.status(400).json({
                    success: false,
                    message: "Select a valid half-day type: first or second",
                    });
                }

                const start = new Date(startDate);
                const end = new Date(endDate);

                if (start.getTime() !== end.getTime()) {
                    return res.status(400).json({
                    success: false,
                    message: "End date must be the same as start date for half-day leave",
                    });
                }
           }
           else {
                if (!endDate) {
                    return res.status(400).json({
                    success: false,
                    message: "End date is required for full-day leave",
                    });
                }

                const start = new Date(startDate);
                const end = new Date(endDate);

                if (end.getTime() < start.getTime()) {
                    return res.status(400).json({
                    success: false,
                    message: "End date cannot be before start date",
                    });
                }
            }



        const leave = await Leave.create({
            employee: userId,
            type,
            startDate,
            endDate,
            reason,
            isHalfDay: !!isHalfDay,
            halfType: isHalfDay ? halfType : null,
            appliedOn: new Date(),
        });
        res.status(201).send({
            success: true,
            message: "Leave applied successfully",
            data: leave
        });
        
     }
    catch (error) {
        console.error("MongoDB Error:", error);

        if (error.name === "ValidationError") {
            // Example: required field missing
            return res.status(400).json({ success: false, message: error.message });
        }

        if (error.name === "MongoServerError" && error.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ success: false, message: "Duplicate record exists" });
        }

        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid ID or type" });
        }

        // Default fallback
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
}
}

const LeaveApprove = async (req, res) => {  
    /***
     * who can approve leave
     * admin can approve
     * and that employee manager
     */
    try {
        const {} = req.body;
    } catch (error) {
        
    }
}

const GetMyLeave = async (req, res) => {
    try{}catch(error){}
}

module.exports = {
    ApplyLeave
}