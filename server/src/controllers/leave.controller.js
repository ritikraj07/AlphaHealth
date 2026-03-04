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
           if (type === "sick" || type === "casual") {
             const now = new Date();

             // Create today 9 AM
             const todayEnd = new Date();
             todayEnd.setHours(LEAVE_WINDOW_END_HOUR, 0, 0, 0);

             // Create yesterday 8 PM
             const yesterdayStart = new Date();
             yesterdayStart.setDate(yesterdayStart.getDate() - 1);
             yesterdayStart.setHours(LEAVE_WINDOW_START_HOUR, 0, 0, 0);

             const isWithinWindow = now >= yesterdayStart && now <= todayEnd;

             if (!isWithinWindow) {
               return res.status(400).json({
                 success: false,
                 message: `Sick/Casual leave can only be applied between ${LEAVE_WINDOW_START_HOUR}:00 (previous day) and ${LEAVE_WINDOW_END_HOUR}:00 (today).`,
               });
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
  try {
    const { leaveId, status, approvedBy, userId } = req.body;

    if (!leaveId || !status || !approvedBy?.model || !approvedBy?.id) {
      return res.status(400).json({
        success: false,
        message: "leaveId, status and approvedBy are required",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // 1️⃣ Fetch leave with employee
    const leave = await Leave.findById(leaveId).populate("employee");
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // 2️⃣ Prevent re-approval
    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Leave already ${leave.status}`,
      });
    }

    // 3️⃣ Authorization check
    if (approvedBy.model === "Admin") {
      // Admin can approve anything
    } else if (approvedBy.model === "Employee") {
      const manager = await Employee.findById(userId);

      if (!manager) {
        return res.status(404).json({
          success: false,
          message: "Manager not found",
        });
      }

      // Check if approver is the employee's manager
      if (
        String(leave.employee.manager) !== String(manager._id) ||
        leave.employee.managerModel !== "Employee"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to approve this leave",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid approver type",
      });
    }

    // 4️⃣ Update leave
    leave.status = status;
    leave.approvedBy = {
      id: approvedBy.id,
      model: approvedBy.model,
    };

    await leave.save();

    // 5️⃣ Update employee leave count (only if approved)
    if (status === "approved") {
      const days = leave.isHalfDay
        ? 0.5
        : Math.ceil(
            (leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24) + 1,
          );

      await Employee.findByIdAndUpdate(leave.employee._id, {
        $inc: {
          [`leavesTaken.${leave.type}`]: days,
        },
      });
      }
      

    return res.status(200).json({
      success: true,
      message: `Leave ${status} successfully`,
      data: leave,
    });
  } catch (error) {
    console.error("[LEAVE_APPROVE_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while approving leave",
    });
  }
};


const GetLeaveDetailsByEmployeeId = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employee id is required",
      });
    }

    const filter = { employee: id };
    if (status) filter.status = status;

    const leaves = await Leave.find(filter)
      .select("-__v -updatedAt -employee")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Leave history fetched successfully",
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    console.error("[GET_LEAVE_BY_EMPLOYEE_ID_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching leave history",
    });
  }
};


const GetAppliedLeaves = async (req, res) => {
  try {
    const { status, type, hq, name, role, page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(parseInt(page, 10), 1);
    const limitNumber = Math.max(parseInt(limit, 10), 1);
    const skip = (pageNumber - 1) * limitNumber;

    // ===============================
    // Leave-level filter
    // ===============================
    const leaveFilter = {};
    if (status) leaveFilter.status = status;
    if (type) leaveFilter.type = type;

    // ===============================
    // Employee-level filter (for populate match)
    // ===============================
    const employeeMatch = {};

    if (hq) employeeMatch.hq = hq;
    if (role) employeeMatch.role = role;

    if (name) {
      employeeMatch.name = {
        $regex: name,
        $options: "i", // case-insensitive
      };
    }

    // ===============================
    // Query
    // ===============================
    const [leaves, total] = await Promise.all([
      Leave.find(leaveFilter)
        .populate({
          path: "employee",
          select: "name role designation hq",
          match: employeeMatch,
          populate: {
            path: "hq",
            select: "name region",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Leave.countDocuments(leaveFilter),
    ]);

    // Remove records where populate failed due to match
    const filteredLeaves = leaves.filter((l) => l.employee);

    return res.status(200).json({
      success: true,
      message: "Leaves fetched successfully",
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
      count: filteredLeaves.length,
      data: filteredLeaves,
    });
  } catch (err) {
    console.error("[GET_APPLIED_LEAVES_ERROR]", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leave records",
    });
  }
};



module.exports = {
  ApplyLeave,
  LeaveApprove,
  GetLeaveDetailsByEmployeeId,
  GetAppliedLeaves,
};