
const Admin = require('../models/admin.model');
const { hashPassword } = require('../utils/auth'); // If you have password hashing

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, leavesTaken } = req.body;

    const adminData = {
      name,
      email,
      password: await hashPassword(password), // Hash password
      role: 'admin',
      leavesTaken: leavesTaken || {}
    };

    const admin = new Admin(adminData);
    const savedAdmin = await admin.save();

    // Remove password from response
    const adminResponse = savedAdmin.toObject();
    delete adminResponse.password;

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: adminResponse
    });

  } catch (error) {
    console.error('Error creating admin:', error);

    // Handle duplicate key error (fallback)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Handle validation errors from model
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


module.exports = {createAdmin}  