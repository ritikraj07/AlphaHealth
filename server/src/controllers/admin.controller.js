const Admin = require("../models/admin.model");
const { hashPassword, comparePassword } = require("../utils/auth");
const emailVerifier = require("../utils/emailVerifier");
const Mail = require("../utils/mail");
const { createToken } = require("../validators/auth.validator");

const createSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email verification
    const emailCheck = await emailVerifier.verifyEmail(email);
    if (!emailCheck.valid) {
      return res.status(400).json({
        success: false,
        message: "Email validation failed",
        error: emailCheck.reason,
      });
    }

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({
      role: { $in: ["admin", "superadmin"] },
    });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message:
          "Admin user already exists. Use regular admin creation routes.",
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
    const { createToken } = require("../validators/auth.validator");
    const token = createToken(savedAdmin._id);

    // Remove password from response
    const adminResponse = savedAdmin.toObject();
    delete adminResponse.password;
    adminResponse.token = token;

    res.json({
      success: true,
      message: "Superadmin created successfully!",
      data: adminResponse,
      emailVerification: emailCheck, // Include verification info
    });

    console.log("Admin creation email sent successfully");
    const mailer = new Mail();
    try {
      await mailer.sendAdminCreationEmail({
        name: savedAdmin.name,
        email: savedAdmin.email,
        role: savedAdmin.role,
      });

      console.log("Admin creation email sent successfully");
    } catch (emailError) {
      console.error("Failed to send admin creation email:", emailError);
      // Don't fail the request if email fails
    }
  } catch (error) {
    console.error("Setup error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

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
