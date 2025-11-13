const HeadQuarter = require("../models/headquater.model");

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