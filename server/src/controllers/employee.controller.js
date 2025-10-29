const { hashPassword } = require("../utils/auth");
const Employee = require("../models/employee.model");

const createEmployee = async (req, res) => {
    try {
        // Check if employee already exists
        let employee = await Employee.findOne({ email: req.body.email });
        if (employee) {
            return res.status(409).send({ message: "User already exists" });
        }
        
        let { name, email, password, role, hq, manager } = req.body;

        // Hash password
        let hashedPassword = await hashPassword(password);
        
        // Create new employee
        employee = new Employee({ 
            name, 
            email, 
            password: hashedPassword, 
            role, 
            hq,
            manager 
        });
        
        await employee.save();
        employee = employee.toObject();
        // Remove password from response
        delete employee.password;
        return res.status(201).send({ 
            success: true,
            message: "Employee created successfully",
            data: employee

        });
        
    } catch (error) {
        console.error("Create employee error:", error);
        return res.status(500).send({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
}

const getEmployee = async (req, res) => {
    try {
        const employees = await Employee.find({})
            .select('-password') // Exclude password
            .populate('manager', 'name email') // Populate manager name
            .populate('hq', 'name'); // Populate HQ name
            
        return res.status(200).send({
            success: true,
            data: employees
        });
    } catch (error) {
        console.error("Get employees error:", error);
        return res.status(500).send({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
}

module.exports = { createEmployee, getEmployee };