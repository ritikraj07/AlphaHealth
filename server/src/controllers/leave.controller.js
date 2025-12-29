const Leave = require("../models/leave.model");


const ApplyLeave = async(req, res) => {
    try {
        const userId = req.userId;
        const { type, startDate, endDate, reason } = req.body;

        const leave = await Leave.create({
            employee: userId,
            type,
            startDate,
            endDate,
            reason,
            appliedOn: new Date(),
        });
        res.status(201).send({
            success: true,
            message: "Leave applied successfully",
            data: leave
        });
        
     }
    catch (error) {
         console.error("Error from ApplyLeave:", error);
        res.status(500).json({
            success: false,
            message: "Error from ApplyLeave",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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

module.exports = {
    ApplyLeave
}