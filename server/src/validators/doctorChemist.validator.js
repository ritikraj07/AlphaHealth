const { body, validationResult } = require("express-validator");

const validateCreateDoctorChemist = [
  // Name validation
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s.]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Location must be between 3 and 100 characters")
    .matches(/^[^<>$%{}]+$/)
    .withMessage("Invalid characters in location"),

  body("specialization")
    .if(body("type").equals("doctor"))
    .trim()
    .notEmpty()
    .withMessage("Specialization is required for doctors")
    .isLength({ min: 2, max: 50 })
    .withMessage("Specialization must be between 2 and 50 characters"),

  body("hq").isMongoId().withMessage("Invalid headquarter ID"),

  body("type").isIn(["doctor", "chemist"]).withMessage("Invalid type"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be between 10 and 15 digits")
    .matches(/^\d+$/)
    .withMessage("Phone number can only contain digits"),

  body("potential")
    .trim()
    .notEmpty()
    .withMessage("Potential is required")
    .isIn(["medium", "low", "high"])
    .withMessage('Potential must be "medium", "low", or "high"'),

  body("frequency")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Frequency must be a non-negative number"),

  body("addedBy.id").isMongoId().withMessage("Invalid addedBy ID"),

  body("addedBy.role")
    .isIn(["admin", "employee", "manager"])
    .withMessage("Invalid addedBy role"),

  body("addedBy.model")
    .isIn(["Admin", "Employee"])
    .withMessage("Invalid addedBy model"),
  body("approvedBy.id")
    .optional() // Only if it's present
    .isMongoId()
    .withMessage("Invalid approvedBy ID"),

  body("approvedBy.role")
    .optional()
    .isIn(["admin", "employee"])
    .withMessage("Invalid approvedBy role"),

  body("approvedBy.model")
    .optional()
    .isIn(["Admin", "Employee"])
    .withMessage("Invalid approvedBy model"),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    console.log("errors", errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((error) => ({
          field: error.path,
          message: error.msg,
        })),
      });
    }
    next();
  },
];

module.exports = { validateCreateDoctorChemist };
