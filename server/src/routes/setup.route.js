const { Router } = require('express');
const path = require('path');
const fs = require('fs');

const Admin = require('../models/admin.model');
const { setupGuard } = require('../middlewares/setupGuard');
const { generateSecureToken, validateSetupToken } = require('../utils/setupSecurity');

const { hashPassword } = require('../utils/auth');
const { createAdmin } = require('../controllers/admin.controller');
const emailVerifier = require('../utils/emailVerifier');

const router = Router();

/**
 * Checks if the current environment is development and allows the
 * request to proceed if true. Otherwise, it returns a 403
 * response with a message indicating that the admin setup is only
 * available in development environment.
 * @function developmentOnly
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {function} next - Express next function
 */
const developmentOnly = (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'Admin setup is only available in development environment'
    });
  }
  next();
};

// Generate setup token (one-time use)
router.get('/generate-token', (req, res) => {
    const token = generateSecureToken();
    console.log('🔐 SETUP TOKEN GENERATED:');
    console.log('📝 Token:', token);
    console.log('🔗 Setup URL:', `http://localhost:${process.env.PORT || 8000}/api/setup/admin-setup?token=${token}`);
    console.log('⚠️  Save this token securely!');
    
    res.json({
        success: true,
        message: 'Setup token generated. Check server console for details.',
        token: process.env.NODE_ENV === 'development' ? token : undefined,
        setupUrl: process.env.NODE_ENV === 'development' ? 
            `http://localhost:${process.env.PORT || 8000}/api/setup/admin-setup?token=${token}` : undefined
    });
});



// Serve static setup files 
// act as middleware to serve static files
router.use('/static', (req, res) => {
    const filePath = path.join(__dirname, '../views/setup', req.path);
    
    // Security: Only allow specific files
    const allowedFiles = ['setup.css', 'setup.js'];
    if (!allowedFiles.includes(path.basename(req.path))) {
        return res.status(404).send('File not found');
    }
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Admin setup page
router.get('/admin-setup',setupGuard, validateSetupToken, (req, res) => {
     const setupPagePath = path.join(__dirname, '../views/setup/admin-setup.html');
    res.sendFile(setupPagePath);
});

// Verify email
router.post('/verify-email', developmentOnly, validateSetupToken, async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                valid: false,
                reason: 'Email is required'
            });
        }

        const verification = await emailVerifier.verifyEmail(email);
        
        res.json({
            success: true,
            ...verification
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            valid: false,
            reason: 'Verification service error'
        });
    }
});

// Create admin endpoint
router.post('/create-admin',  setupGuard, validateSetupToken,  createAdmin);

module.exports = router;