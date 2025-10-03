const { body, validationResult } = require('express-validator');
const Admin = require('../models/admin.model');

const validateCreateAdmin = [
  // Name validation
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Name can only contain letters and spaces'),

  // Email validation
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .custom(async (email) => {
      // Check if email already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        throw new Error('Email already exists');
      }
      return true;
    }),

  // Password validation
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  // Optional role validation (if you want to allow specifying role during creation)
  body('role')
    .optional()
    .isIn(['admin', 'superadmin']) // Add other roles if needed
    .withMessage('Invalid role'),

  // Leaves validation (optional fields)
  body('leavesTaken.sick')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sick leaves must be a non-negative number'),

  body('leavesTaken.casual')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Casual leaves must be a non-negative number'),

  body('leavesTaken.earned')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Earned leaves must be a non-negative number'),

  body('leavesTaken.public')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Public holidays must be a non-negative number'),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }
    next();
  }
];

module.exports = { validateCreateAdmin };