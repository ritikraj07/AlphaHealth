const Admin = require('../models/admin.model');
const crypto = require('crypto');

/**
 * Generate a highly secure one-time setup token.
 * Best stored inside environment variable (.env)
 */
function generateSecureToken() {
  console.log('🔐 Generating setup token...');
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Middleware to validate setup token.
 * Token can be passed via ?token= OR Header: x-setup-token
 */
function validateSetupToken(req, res, next) {
    
    // Get token from query parameter or header
    const token = req.query.token || req.headers['x-setup-token'];
  
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Missing setup token'
    });
  }
  
  // In production, store this in environment variable after generation
  const validToken = process.env.SETUP_TOKEN || 'your-generated-token-here';
  
  if (token !== validToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or missing setup token'
    });
  }
  
  next();
}

// Check if setup is allowed (no admins exist yet)
async function isSetupAllowed() {

  // Delete all existing admins
  // !! Don't forget to remove this in production
    // await Admin.deleteMany({ role: { $in: ['admin'] } });
  const adminCount = await Admin.countDocuments({ 
    role: { $in: ['admin', 'superadmin'] } 
  });
  
  console.log('Admin count:', adminCount);
  return adminCount === 0;
}

module.exports = {
  generateSecureToken,
  validateSetupToken,
  isSetupAllowed
};