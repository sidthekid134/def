const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * @returns {Promise} Mongoose connection
 */
const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanagement';
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDB
};