const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import configuration
const config = require('./src/config/config');

// Initialize Express app
const app = express();
const PORT = config.port;

// Middleware
app.use(cors(config.corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Import routes
const taskRoutes = require('./src/routes/task.routes');

// API routes
app.use(`${config.apiPrefix}/tasks`, taskRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Task Management API',
    version: '1.0.0'
  });
});

// Import error handling middleware
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;