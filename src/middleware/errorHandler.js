/**
 * Global error handler middleware
 * Catches errors thrown in the application and sends a formatted response
 */
const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Custom error response
  res.status(status).json({
    success: false,
    error: {
      message,
      // Only show detailed error info in development
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err.details || {}
      })
    }
  });
};

module.exports = errorHandler;