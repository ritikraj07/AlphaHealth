const HeadQuarter = require("../models/headquater.model");

/**
 * Creates a new headquarter in the system
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Headquarter name
 * @param {string} req.body.region - Geographical region served by this headquarter
 * @param {Object} req.body.createdBy - Creator of this headquarter
 * @param {string} req.body.createdBy.id - Creator's document ID
 * @param {string} req.body.createdBy.role - Creator's role (admin/employee)
 * 
 * @param {Object} res - Express response object
 * 
 * @returns {Promise<ApiResponse>} Created headquarter data
 * 
 * @example
 * // Request
 * POST /api/headquarters
 * {
 *   "name": "Delhi Central Office",
 *   "region": "North India",
 *   "createdBy": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "role": "admin"
 *   }
 * }
 * 
 * // Response
 * {
 *   "success": true,
 *   "message": "Headquarter created successfully",
 *   "data": {
 *     "_id": "507f1f77bcf86cd799439012",
 *     "name": "Delhi Central Office",
 *     "region": "North India",
 *     "createdBy": {
 *       "id": "507f1f77bcf86cd799439011",
 *       "role": "admin",
 *       "model": "Admin"
 *     }
 *   }
 * }
 */
const createHeadQuarter = async (req, res) => {
    try {
        const { name, region, createdBy } = req.body;
        
        // Validate required fields
        if (!name || !region || !createdBy || !createdBy.id || !createdBy.role) {
            return res.status(400).send({
                success: false,
                message: "Name, region, and createdBy (with id and role) are required fields"
            });
        }

        // Validate role
        if (!['admin', 'employee'].includes(createdBy.role.toLowerCase())) {
            return res.status(400).send({
                success: false,
                message: "Role must be either 'admin' or 'employee'"
            });
        }

        // Check if headquarter with same name already exists
        const existingHQ = await HeadQuarter.findOne({ name });
        if (existingHQ) {
            return res.status(400).send({
                success: false,
                message: "Headquarter with this name already exists"
            });
        }

        // Determine the model based on role
        const creatorModel = createdBy.role.toLowerCase() === 'admin' ? 'Admin' : 'Employee';

        const headquarter = new HeadQuarter({ 
            name, 
            region, 
            createdBy: {
                id: createdBy.id,
                role: createdBy.role,
                model: creatorModel
            }
        });

        await headquarter.save();

        res.status(201).send({
            success: true,
            message: "Headquarter created successfully",
            data: headquarter
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    } 
}

/**
 * Retrieves all headquarter locations from the database
 * 
 * @route GET /api/headquarters
 * @access Public
 * 
 * @returns {Promise<ApiResponse>} List of headquarter objects with populated createdBy fields
 * 
 * @example
 * // Response
 * {
 *   "success": true,
 *   "message": "Headquarters fetched successfully",
 *   "data": [
 *     {
 *       "_id": "507f1f77bcf86cd799439011",
 *       "name": "Delhi Central Office",
 *       "region": "North India",
 *       "createdBy": {
 *         "id": "507f1f77bcf86cd799439012",
 *         "name": "John Doe",
 *         "email": "john.doe@company.com",
 *         "role": "employee"
 *       }
 *     },
 *     ...
 *   ]
 * }
 */
const getHeadQuarters = async (req, res) => {
    try { 
        const headquarters = await HeadQuarter.find({})
            .populate('createdBy', 'name email role');

        res.send({
            success: true,
            message: "Headquarters fetched successfully",
            data: headquarters
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = { createHeadQuarter, getHeadQuarters };