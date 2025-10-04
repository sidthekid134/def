/**
 * Custom request logger middleware
 * Logs information about incoming requests
 */
const requestLogger = (req, res, next) => {
  const start = new Date();
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  
  // Add response finish listener to log response details
  res.on('finish', () => {
    const duration = new Date() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

module.exports = requestLogger;