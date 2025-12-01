const Admin = require("../models/admin.model");
const { hashPassword, comparePassword } = require("../utils/auth");
const emailVerifier = require("../utils/emailVerifier");
const logger = require("../utils/logger");
const Mail = require("../utils/mail");
const { createToken } = require("../validators/auth.validator");



const createSuperAdmin = async (req, res) => {
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
      role: "superadmin", // First admin gets superadmin role
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

module.exports = { createSuperAdmin, loginAdmin };
