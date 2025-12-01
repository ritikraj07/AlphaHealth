const { hashPassword } = require("../utils/auth");
const Employee = require("../models/employee.model");
const Mail = require("../utils/mail");

/**
 *  
 * Employee Controller
 *  
 * Handles all business logic for employee management including
 * creation, retrieval, updates, and deletion of employee records.
 * 
 * @version 1.0.0
 * @since 2025 NOVEMBER
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Indicates if the request was successful
 * @property {string} message - Human-readable response message
 * @property {Object} [data] - Response data payload
 * @property {string} [error] - Error message if success is false
 */

/**
 * Creates a new employee in the system
 * 
 * @route POST /api/employees
 * @access Private (Admin/Manager)
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Employee's full name
 * @param {string} req.body.email - Employee's email address
 * @param {string} req.body.password - Employee's password
 * @param {string} req.body.role - Employee's role (employee/manager)
 * @param {string} req.body.hq - Headquarter ID
 * @param {string} req.body.manager - Manager ID
 * @param {string} [req.body.managerModel] - Manager model type (Employee/Admin)
 * 
 * @param {Object} res - Express response object
 * 
 * @returns {Promise<ApiResponse>} Created employee data
 * 
 * @example
 * // Request
 * POST /api/employees
 * {
 *   "name": "John Doe",
 *   "email": "john.doe@company.com",
 *   "password": "securePassword123",
 *   "role": "employee",
 *   "hq": "507f1f77bcf86cd799439011",
 *   "manager": "507f1f77bcf86cd799439012",
 *   "managerModel": "Employee"
 * }
 * 
 * // Response
 * {
 *   "success": true,
 *   "message": "Employee created successfully",
 *   "data": {
 *     "_id": "507f1f77bcf86cd799439013",
 *     "name": "John Doe",
 *     "email": "john.doe@company.com",
 *     "role": "employee",
 *     "hq": "507f1f77bcf86cd799439011",
 *     "manager": "507f1f77bcf86cd799439012",
 *     "managerModel": "Employee"
 *   }
 * }
 */


const createEmployee = async (req, res) => {
    try {
        // Check if employee already exists
        const { name, email, password, role, hq, manager, managerModel = 'Employee' } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role || !hq || !manager) {
            return res.status(400).send({
                success: false,
                message: "All fields are required: name, email, password, role, hq, manager"
            });
        }

         // Check if employee already exists
        const existingEmployee = await Employee.findOne({ email: email.toLowerCase() });
        if (existingEmployee) {
            return res.status(409).send({ 
                success: false,
                message: "Employee with this email already exists" 
            });
        }
        
        

        // Validate role
        const validRoles = ['employee', 'manager'];
        if (!validRoles.includes(role.toLowerCase())) {
            return res.status(400).send({
                success: false,
                message: "Role must be either 'employee' or 'manager'"
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        
       // Create new employee
        const employee = new Employee({ 
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: role.toLowerCase(),
            hq,
            manager,
            managerModel
        });
        
        await employee.save();

         // Convert to object and remove sensitive data
        const employeeResponse = employee.toObject();
        // delete employeeResponse.password;

        console.log("Employee created successfully:", employeeResponse);

        const mailer = new Mail();

        try { 
            await mailer.sendEmployeeCreationEmail(employeeResponse, password);
            console.log("Email sent successfully");
        } catch (error) {
            console.error("Email sending error:", error);
        }

        return res.status(201).send({ 
            success: true,
            message: "Employee created successfully",
            data: employeeResponse
        });
        
    } catch (error) {
        console.error("Create employee error:", error);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(409).send({
                success: false,
                message: "Employee with this email already exists"
            });
        }
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({
                success: false,
                message: "Validation failed",
                errors: errors
            });
        }
       return res.status(500).send({ 
            success: false,
            message: "Internal server error while creating employee",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Retrieves all employees with optional filtering and pagination
 * 
 * @route GET /api/employees
 * @access Private (Admin/Manager)
 * 
 * @param {Object} req - Express request object
 * @param {Object} [req.query] - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of records per page
 * @param {string} [req.query.role] - Filter by role (employee/manager)
 * @param {string} [req.query.hq] - Filter by headquarter ID
 * @param {string} [req.query.search] - Search in name and email
 * 
 * @param {Object} res - Express response object
 * 
 * @returns {Promise<ApiResponse>} Paginated list of employees
 * 
 * @example
 * // Request
 * GET /api/employees?page=1&limit=10&role=employee&hq=507f1f77bcf86cd799439011
 * 
 * // Response
 * {
 *   "success": true,
 *   "message": "Employees retrieved successfully",
 *   "data": {
 *     "employees": [...],
 *     "pagination": {
 *       "page": 1,
 *       "limit": 10,
 *       "totalPages": 5,
 *       "totalEmployees": 48,
 *       "hasNext": true,
 *       "hasPrev": false
 *     }
 *   }
 * }
 */

const getEmployee = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 30,
            name,
            email,
            role,
            hq,
            manager,
        } = req.query;

        // Build query object
        const query = {
            ...(name && { name: { $regex: name, $options: 'i' } }),
            ...(email && { email: { $regex: email, $options: 'i' } }),
            ...(role && { role: role.toLowerCase() }),
            ...(hq && { hq: hq }),
            ...(manager && { manager: manager }),
        };

        // Convert to numbers and calculate skip
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute queries in parallel
        const [employees, totalCount] = await Promise.all([
            Employee.find(query)
                .select('-password')
                .populate('manager', 'name email role')
                .populate('hq', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Employee.countDocuments(query)
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limitNum);

        return res.status(200).send({
            success: true,
            message: "Employees retrieved successfully",
            data: {
                employees,
                pagination: {
                    currentPage: pageNum,
                    pageSize: limitNum,
                    totalEmployees: totalCount,
                    totalPages: totalPages,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1
                }
            }
        });

    } catch (error) {
        console.error("Get employees error:", error);
        return res.status(500).send({ 
            success: false,
            message: "Internal server error while retrieving employees",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Retrieves a single employee by ID
 * 
 * @route GET /api/employees/:id
 * @access Private (Admin/Manager/Owner)
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Employee ID
 * 
 * @param {Object} res - Express response object
 * 
 * @returns {Promise<ApiResponse>} Employee data
 */
const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id)
            .select('-password')
            .populate('manager', 'name email role')
            .populate('hq', 'name address')
            .lean();

        if (!employee) {
            return res.status(404).send({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Employee retrieved successfully",
            data: employee
        });

    } catch (error) {
        console.error("Get employee by ID error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).send({
                success: false,
                message: "Invalid employee ID format"
            });
        }

        return res.status(500).send({ 
            success: false,
            message: "Internal server error while retrieving employee",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Updates an existing employee
 * 
 * @route PUT /api/employees/:id
 * @access Private (Admin/Manager/Owner)
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Employee ID
 * @param {Object} req.body - Fields to update
 * 
 * @param {Object} res - Express response object
 * 
 * @returns {Promise<ApiResponse>} Updated employee data
 */
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Remove restricted fields
        delete updates.password;
        delete updates.email; // Email updates should be separate process

        // Hash password if provided in separate field
        if (updates.newPassword) {
            updates.password = await hashPassword(updates.newPassword);
            delete updates.newPassword;
        }

        const employee = await Employee.findByIdAndUpdate(
            id,
            { $set: updates },
            { 
                new: true, 
                runValidators: true,
                context: 'query'
            }
        ).select('-password');

        if (!employee) {
            return res.status(404).send({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Employee updated successfully",
            data: employee
        });

    } catch (error) {
        console.error("Update employee error:", error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({
                success: false,
                message: "Validation failed",
                errors: errors
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).send({
                success: false,
                message: "Invalid employee ID format"
            });
        }

        return res.status(500).send({ 
            success: false,
            message: "Internal server error while updating employee",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Deletes an employee (soft delete)
 * 
 * @route DELETE /api/employees/:id
 * @access Private (Admin)
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Employee ID
 * 
 * @param {Object} res - Express response object
 * 
 * @returns {Promise<ApiResponse>} Success message
 */
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            return res.status(404).send({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (error) {
        console.error("Delete employee error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).send({
                success: false,
                message: "Invalid employee ID format"
            });
        }

        return res.status(500).send({ 
            success: false,
            message: "Internal server error while deleting employee",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Gets team members for a specific manager
 * 
 * @route GET /api/employees/manager/:managerId/team
 * @access Private (Admin/Manager)
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.managerId - Manager ID
 * 
 * @param {Object} res - Express response object
 * 
 * @returns {Promise<ApiResponse>} List of team members
 */
const getManagerTeam = async (req, res) => {
    try {
        const { managerId } = req.params;

        const teamMembers = await Employee.find({ 
            manager: managerId,
            managerModel: 'Employee'
        })
        .select('-password')
        .populate('hq', 'name')
        .lean();

        return res.status(200).send({
            success: true,
            message: "Team members retrieved successfully",
            data: teamMembers
        });

    } catch (error) {
        console.error("Get manager team error:", error);
        return res.status(500).send({ 
            success: false,
            message: "Internal server error while retrieving team members",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};




module.exports = { createEmployee, getEmployee,   getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getManagerTeam };