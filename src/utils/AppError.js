/**
 * Custom error class for application errors
 * Extends the built-in Error class with additional properties
 */
class AppError extends Error {
  constructor(message, statusCode, details = {}) {
    super(message);
    
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Indicates this is an expected operational error
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;