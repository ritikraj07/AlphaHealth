// middlewares/errorHandler.js
const logger = require('../utils/logger');
const Sentry = require('../config/sentry');

const errorHandler = (err, req, res, next) => {
  const requestId = req.requestId || Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  
  // Log error
  logger.logError(err, {
    requestId,
    endpoint: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    userId: req.user?._id,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Send to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(err);
  }

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Prepare response
  const response = {
    success: false,
    message: statusCode === 500 ? 'Internal server error' : err.message,
    errorId: requestId,
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.error = err.message;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;