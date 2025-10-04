// Configuration for the application
// This will be expanded in future stories with database configs, etc.

const config = {
  // Server config
  port: process.env.PORT || 3000,
  
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // API versioning
  apiVersion: process.env.API_VERSION || 'v1',
  
  // Task default values
  defaultTaskStatus: 'pending',
  
  // Allowed task statuses
  taskStatuses: ['pending', 'in-progress', 'completed']
};

module.exports = config;