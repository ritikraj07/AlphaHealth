const jwt = require('jsonwebtoken');
const { JWT_Secret_Key } = require('../config');
const Admin = require('../models/admin.model');
const Employee = require('../models/employee.model');

const createToken = (id) => {
    return jwt.sign({ id }, JWT_Secret_Key);
}

const getUser = async (id) => {
  let user = await Admin.findById(id);
  if (!user) {
    user = await Employee.findById(id);
    }
    // console.log("Log from auth validator \n",id,"\n" ,user)
  return user;
};


const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).send({ 
                success: false,
                message: "Access denied. No token provided." 
            });
        }
        
        const decoded = jwt.verify(token, JWT_Secret_Key);
        req.userId = decoded.id; // Set user ID for later use
        // whole user at the bottom 43 line of the file
        
        const user = await getUser(decoded.id);
        if (!user) {
            return res.status(401).send({ 
                success: false,
                message: "Invalid token" 
            });
        }
        
        req.user = user;
        next(); // Call next middleware
        
    } catch (error) {
        return res.status(401).send({ 
            success: false,
            message: "Invalid token" 
        });
    }
}

module.exports = {
    createToken,
    verifyToken
}