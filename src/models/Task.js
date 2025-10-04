const mongoose = require('mongoose');
const config = require('../config/config');

/**
 * Task Schema
 * 
 * Properties:
 * - title: title of the task (required)
 * - description: detailed description of the task (optional)
 * - status: current status of the task (pending, in-progress, completed)
 * - dueDate: date when the task is due (optional)
 * - createdAt: date when the task was created
 * - updatedAt: date when the task was last updated
 */
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Task title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    default: '',
    maxlength: [500, 'Task description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: config.taskStatuses,
      message: 'Status must be one of: ' + config.taskStatuses.join(', ')
    },
    default: config.defaultTaskStatus
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // Due date can be null or must be in the future
        return value === null || value > new Date();
      },
      message: 'Due date must be in the future'
    }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Add any pre/post hooks here if needed

// Create static methods for common operations
TaskSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;