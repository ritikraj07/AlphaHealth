const Admin = require("../models/admin.model");
const Attendance = require("../models/attendance.model");
const DoctorChemist = require("../models/doctorChemist.model");
const Employee = require("../models/employee.model");
const Headquarter = require("../models/headquater.model");
const Leave = require("../models/leave.model");
const { hashPassword, comparePassword } = require("../utils/auth");
const emailVerifier = require("../utils/emailVerifier");
const logger = require("../utils/logger");
const Mail = require("../utils/mail");
const { createToken } = require("../validators/auth.validator");



/**
 * Creates a new admin in the system
 * 
 * @route POST /api/admin/setup
 * @access Private (Setup token required)
 * 
 * @param {Object} req.body - Request body containing email, name, and password
 * @param {string} req.body.email - Unique email address for authentication
 * @param {string} req.body.name - Super admin's full name
 * @param {string} req.body.password - Super admin's password
 * 
 * @returns {Promise<Object>} - Response containing success, message, and data (name, email, role, and token)
 * @throws {Error} - Admin creation error
 */
const createAdmin = async (req, res) => {
   let requestId = req.requestId || Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  try {
    const { name, email, password } = req.body;

    // Email verification
    const emailCheck = await emailVerifier.verifyEmail(email);
    if (!emailCheck.valid) {
       logger.logInfo('Email validation failed', {
        requestId,
        email,
        reason: emailCheck.reason,
        endpoint: req.originalUrl,
      });
      

      return res.status(400).json({
        success: false,
        message: "Email validation failed",
        error: process.env.NODE_ENV === 'development' ? emailCheck.reason : undefined,
        errorId: requestId,  
      });
    }

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({
      role: { $in: ["admin", "superadmin"] },
    });
   
      
    if (existingAdmin) {

       logger.logInfo('Admin already exists attempt', {
        requestId,
        attemptedEmail: email,
        existingAdminId: existingAdmin._id,
        endpoint: req.originalUrl,
      });
      
      return res.status(409).json({
        success: false,
        message: "Admin user already exists. Use regular admin creation routes.",
        errorId: requestId,  
      });
    }

    //  Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: "admin", 
    });

    const savedAdmin = await admin.save();

    // Generate token for immediate login
    
    const token = createToken(savedAdmin._id);

    // Remove password from response
    const adminResponse = savedAdmin.toObject();
    delete adminResponse.password;
    adminResponse.token = token;

    res.json({
      success: true,
      message: "Admin created successfully!",
      data: adminResponse,
      // Don't include email verification details in production
      ...(process.env.NODE_ENV === 'development' && { emailVerification: emailCheck }),
      
    });

    console.log("Admin creation email sent successfully");
    // Async email sending (don't block response)
    setTimeout(async () => {
      try {
        const mailer = new Mail();
        await mailer.sendAdminCreationEmail({
          name: savedAdmin.name,
          email: savedAdmin.email,
          role: savedAdmin.role,
        });

        logger.logInfo('Admin creation email sent', {
          requestId,
          adminId: savedAdmin._id,
          email: savedAdmin.email,
        });
      } catch (emailError) {
        // Log email error separately
        logger.logError(emailError, {
          requestId,
          adminId: savedAdmin._id,
          context: 'admin_creation_email',
          email: savedAdmin.email,
          severity: 'MEDIUM', // Not critical, admin was created
        });

        //TODO Optionally: Queue for retry or send to dead-letter queue
      }
    }, 0); // Process in next tick
  }catch (error) {
    // Log the error with context
    logger.logError(error, {
      requestId,
      endpoint: '/api/admin/setup',
      body: { 
        email: req.body.email, 
        name: req.body.name 
      },
      userId: req.user?._id || 'anonymous',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'HIGH',
    });

    // Handle specific error types
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      // Include error ID for support requests
      errorId: requestId,
      // Only show detailed error in development
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message,
        stack: error.stack 
      }),
    });
  }
};

/**
 * Login admin
 * @param {Object} req.body - Request body containing email and password
 * @returns {Promise<Object>} - Response containing success, message, and data (name, email, role, and token)
 * @throws {Error} - Login admin error
 */
const loginAdmin = async (req, res) => {
      
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await comparePassword(password, admin.password);
    console.log("Password match:", passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(admin._id);
    res.json({
      success: true,
      message: "Admin logged in successfully",
      data: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
        _id: admin._id,
        token,
      },
    });
  } catch (error) {
    console.error("Login admin error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/***
 * What i need in admin dashboard
 * 1. Employee stats
 * 2. Doctor / Chemist stats
 *  
 */
const GetAdminDashboard = async (req, res) => {
  try {
    const adminId = req.userId;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    /* ================= EMPLOYEE STATS ================= */
    const employeeStats = await Employee.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    const employeeSummary = {
      total: 0,
      managers: 0,
      hr: 0,
      employees: 0,
    };

    employeeStats.forEach(item => {
      employeeSummary.total += item.count;

      if (item._id === "manager") employeeSummary.managers = item.count;
      if (item._id === "hr") employeeSummary.hr = item.count;
      if (item._id === "employee") employeeSummary.employees = item.count;
    });

    /* ================= DOCTOR / CHEMIST ================= */
    const doctorChemistStats = await DoctorChemist.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    const doctorSummary = {
      doctors: 0,
      chemists: 0
    };

    doctorChemistStats.forEach(item => {
      if (item._id === "doctor") doctorSummary.doctors = item.count;
      if (item._id === "chemist") doctorSummary.chemists = item.count;
    });

    /* ================= LEAVE STATS ================= */
    const leaveByType = await Leave.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    const leaveStatus = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const leaveSummary = {
      pending: 0,
      approved: 0,
      rejected: 0,
      byType: {}
    };

    leaveStatus.forEach(item => {
      leaveSummary[item._id] = item.count;
    });

    leaveByType.forEach(item => {
      leaveSummary.byType[item._id] = item.count;
    });

    /* ================= HQ DISTRIBUTION ================= */
    const hqDistribution = await Employee.aggregate([
      {
        $group: {
          _id: "$hq",
          employeeCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "headquarters",
          localField: "_id",
          foreignField: "_id",
          as: "hq"
        }
      },
      { $unwind: "$hq" },
      {
        $project: {
          _id: 0,
          hqId: "$hq._id",
          name: "$hq.name",
          employeeCount: 1
        }
      }
    ]);

    const totalEmployees = employeeSummary.total || 1;
    const hqWithPercentage = hqDistribution.map(hq => ({
      ...hq,
      percentage: Math.round((hq.employeeCount / totalEmployees) * 100)
    }));

    /* ================= ATTENDANCE ================= */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const presentToday = await Attendance.countDocuments({
      date: today,
      status: "present"
    });

    /* ================= FINAL RESPONSE ================= */
    res.json({
      success: true,
      message: "Admin Dashboard Fetched Successfully",
      data: {
        employees: employeeSummary,
        doctors: doctorSummary,
        leaves: leaveSummary,
        hqDistribution: hqWithPercentage,
        attendance: {
          presentToday
        }
      }
    });

  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const GetAdminProfile = async (req, res) => {
  try { 
    let adminId = req.userId;
    const admin = await Admin.findById(adminId).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Admin Profile Fetched Successfully",
      data: admin
    });
  } catch (error) {
      console.error("Admin Profile Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",

      })
    }
 }

  


module.exports = { createAdmin, loginAdmin, GetAdminDashboard, GetAdminProfile };
