// utils/logger.js
const fs = require('fs');
const path = require('path');

class Logger {
  /**
   * Constructor for Logger class.
   * Sets up the logs directory and ensures it exists.
   */
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    this.ensureLogsDirectory();
  }

  /**
   * Ensures that the logs directory exists. If it does not, create it
   * recursively.
   * 
   * @returns {void}
   */
  ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Generates a file path for an error log file.
   * The file name is of the format "error-YYYY-MM-DD.log".
   * 
   * @returns {string} The file path for the error log file.
   */
  getLogFilePath() {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.logsDir, `error-${date}.log`);
  }

  /**
   * Logs an error to the error log file with additional context.
   * 
   * @param {Error} error - The error object to log.
   * @param {Object} [context={}] - Additional context to log with the error.
   * 
   * @example
   * const error = new Error('Something went wrong');
   * const context = { foo: 'bar' };
   * logger.logError(error, context);
   */
  logError(error, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: 'ERROR',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
      },
      context,
      environment: process.env.NODE_ENV,
    };

    // Write to file
    const logString = JSON.stringify(logEntry) + ',\n';
    fs.appendFileSync(this.getLogFilePath(), logString);

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', logEntry);
    }
    // TODO: NEED TO KNOW HOW TO ADD LOGGING TO SENTRY
    // TODO: Integrate with error monitoring service (Sentry, etc.)
  }

  logInfo(message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: 'INFO',
      message,
      data,
      environment: process.env.NODE_ENV,
    };

    const logString = JSON.stringify(logEntry) + ',\n';
    const infoLogPath = path.join(this.logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(infoLogPath, logString);
  }
}

module.exports = new Logger();