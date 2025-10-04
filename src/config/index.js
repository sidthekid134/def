/**
 * Application configuration
 * 
 * This file centralizes all configuration variables and provides
 * appropriate defaults for development environments.
 */

require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug'
};

module.exports = config;