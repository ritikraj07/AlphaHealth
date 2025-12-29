const DoctorChemist = require("../models/doctorChemist.model");

const createDoctorChemist = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, type, specialization, location, hq, addedBy, email } = req.body; 

        const doctorChemist = await DoctorChemist.create({
            name,
            type,
            specialization,
            location,
            hq,
            addedBy,
            email 
        });
        
        res.status(201).json({
            success: true,
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully`,
            data: doctorChemist
        });
    } catch (error) {
        console.error("Error creating doctor/chemist:", error);
        res.status(500).json({
            success: false,
            message: "Error creating doctor chemist",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

const getAllDoctorChemist = async (req, res) => {
    res.send("Get All Doctor Chemist")
}

const deleteDoctorChemist = async (req, res) => {
    res.send("Delete Doctor Chemist")
}

module.exports = {
    createDoctorChemist,
    getAllDoctorChemist,
    deleteDoctorChemist
}