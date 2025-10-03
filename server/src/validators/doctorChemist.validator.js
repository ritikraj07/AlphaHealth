const { body, validationResult } = require('express-validator');

const validateCreateDoctorChemist = [
    // Name validation
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('Name can only contain letters and spaces'),
    
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
        
    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required")
        .isLength({ min: 10, max: 100 })
        .withMessage("Location must be between 10 and 100 characters")
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage("Location can only contain letters and spaces"),
    
    body("specialization")
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage("Specialization must be between 2 and 50 characters"),

    body("hq")
        .isMongoId()
        .withMessage("Invalid headquarter ID"),
    
    body("type")
        .isIn(["doctor", "chemist"])
        .withMessage("Invalid type"),
    
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

module.exports = { validateCreateDoctorChemist };