const jwt = require('jsonwebtoken');
const { JWT_Secret_Key } = require('../config');

const createToken = (id) => {
    return jwt.sign({ id }, JWT_Secret_Key);
}

const verifyToken = (req, res, next) => {
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