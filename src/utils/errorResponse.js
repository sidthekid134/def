/**
 * Custom error class for API errors
 * Extends the built-in Error class
 */
class ErrorResponse extends Error {
  /**
   * Create a new error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {Object} details - Additional error details
   */
  constructor(message, statusCode, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = ErrorResponse;