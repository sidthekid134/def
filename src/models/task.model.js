/**
 * Task Model - Mongoose schema for tasks
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Task title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Task description cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be either pending, in-progress, or completed'
      },
      default: 'pending'
    },
    dueDate: {
      type: Date,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Virtual field for id
taskSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Configure JSON conversion to include virtual fields
taskSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Pre-save hook to validate dueDate
taskSchema.pre('save', function(next) {
  if (this.dueDate && new Date(this.dueDate) < new Date()) {
    const error = new Error('Due date cannot be in the past');
    return next(error);
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;