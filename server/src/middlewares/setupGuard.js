const { isSetupAllowed } = require('../utils/setupSecurity');

// Prevent setup after first admin is created
const setupGuard = async (req, res, next) => {
    const setupAllowed = await isSetupAllowed();
    
    if (!setupAllowed && process.env.NODE_ENV === 'production') {
        return res.status(403).json({
            success: false,
            message: 'Admin setup is no longer available'
        });
    }
    next();

};

module.exports = { setupGuard };