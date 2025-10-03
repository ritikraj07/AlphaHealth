// middlewares/validation.js
const { body, validationResult } = require('express-validator');

const validateCreateUser = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    body('role')
        .optional()
        .isIn(['employee', 'manager', 'admin'])
        .withMessage('Invalid role'),
    
    body('hq')
        .isMongoId()
        .withMessage('Invalid headquarter ID'),
    
    // Check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = { validateCreateUser };