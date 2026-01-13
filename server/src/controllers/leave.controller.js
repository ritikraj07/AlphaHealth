const Employee = require("../models/employee.model");
const Leave = require("../models/leave.model");


const ApplyLeave = async(req, res) => {
    try {
        const userId = req.userId;
        const { type, startDate, endDate, reason, isHalfDay, halfType } = req.body;
        // startDate = new Date(startDate);
        // endDate = new Date(finalEndDate);


        // console.log({ type, startDate, endDate, reason, isHalfDay, halfType } )

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
     * !!! right now assuming admin
     */
    try {
        
        const { leaveId, status, approvedBy, userId } = req.body;
          
        
        if (!leaveId || !status) {
            return res.status(400).json({
            success: false,
            message: "leaveId and status are required",
            });
        }

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
            success: false,
            message: "Invalid status value",
            });
        }

        // Step 1: Fetch leave
        const leave = await Leave.findById(leaveId);
        if (!leave) {
        return res.status(404).json({
            success: false,
            message: "Leave not found",
        });
        }

        // Step 2: Prevent re-approval
        if (leave.status !== "pending") {
        return res.status(400).json({
            success: false,
            message: `Leave already ${leave.status}`,
        });
            
        }

        if(leave.approvedBy){
            return res.status(400).json({
                success: false,
                message: "Leave already approved",
            });
        }

        if (approvedBy === 'Admin') { }
        else if (approvedBy === 'Employee') {
             const employee = await Employee.findById(userId);

            if (!employee) {
                return res.status(404).json({ success: false, message: "Manager not found" });
            }

            // Manager condition: employee.manager == approverId
            if (String(employee.manager) !== String(userId)) {
                return res.status(403).json({
                success: false,
                message: "Not authorized - only employee's manager can approve",
                });
            }
        }else {
            return res.status(403).json({
                success: false,
                message: "Not authorized to approve leave",
            });
            }
        

        // Step 3: Update leave status
        leave.status = status;
        leave.approvedBy = approvedBy;
        await leave.save();

        // Step 4: Send notification to employee
        res.status(200).send({
            success: true,
            message: "Leave status updated successfully",
            data: leave,
        });




        
    } catch (error) {
        
        console.error("Leave Approve Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while approving leave",
    });
  
    }
}

const GetLeaveDetails = async (req, res) => {
  try {
    const userId = req.prams.id;
    const { status } = req.query; // e.g. /leave/me?status=pending

    let filter = { employee: userId };
    if (status) filter.status = status;

    const leaves = await Leave.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Leave history fetched successfully",
      count: leaves.length,
      data: leaves,
    });

  } catch (error) {
    console.error("Get My Leave Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching leave history",
    });
  }
};


module.exports = {
    ApplyLeave,
    LeaveApprove,
    GetLeaveDetails
}