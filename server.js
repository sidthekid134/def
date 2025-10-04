const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import config
const config = require('./src/config/config');
const { connectDB } = require('./src/config/database');

const app = express();
const PORT = config.port;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Custom middleware
const requestLogger = require('./src/middleware/requestLogger');
app.use(requestLogger);

// Import routes
const taskRoutes = require('./src/routes/tasks');
const healthRoutes = require('./src/routes/health');

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/health', healthRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Task Management API' });
});

// Error handling middleware
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;