/**
 * Task controller for handling task-related operations
 * Implements CRUD operations for tasks using Mongoose
 */

const Task = require('../models/task.model');
const { validationResult } = require('express-validator');

/**
 * Get all tasks
 * @route GET /api/tasks
 */
exports.getAllTasks = async (req, res, next) => {
  try {
    // Query parameters for filtering and pagination
    const { status, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build the filter query
    const filter = { isDeleted: false };
    if (status) {
      filter.status = status;
    }

    // Build the sort query
    const sortQuery = {};
    sortQuery[sortBy] = order === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const tasks = await Task.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));
      
    // Count total documents for pagination info
    const count = await Task.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get task by ID
 * @route GET /api/tasks/:id
 */
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format'
      });
    }
    next(error);
  }
};

/**
 * Create a new task
 * @route POST /api/tasks
 */
exports.createTask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { title, description, status, dueDate } = req.body;
    
    // Create new task
    const newTask = new Task({
      title,
      description,
      status,
      dueDate
    });
    
    // Save to database
    await newTask.save();
    
    res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        errors: messages
      });
    }
    next(error);
  }
};

/**
 * Update a task by ID
 * @route PUT /api/tasks/:id
 */
exports.updateTask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { title, description, status, dueDate } = req.body;
    
    // Find task and update it
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { 
        title, 
        description, 
        status, 
        dueDate 
      },
      { 
        new: true,     // Return updated document
        runValidators: true  // Run schema validators
      }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        errors: messages
      });
    }
    
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format'
      });
    }
    
    next(error);
  }
};

/**
 * Delete a task by ID (soft delete)
 * @route DELETE /api/tasks/:id
 */
exports.deleteTask = async (req, res, next) => {
  try {
    // Soft delete by setting isDeleted flag to true
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {}
    });
  } catch (error) {
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format'
      });
    }
    
    next(error);
  }
};

/**
 * Hard delete a task by ID (for admin purposes or cleanup jobs)
 * @route DELETE /api/tasks/:id/permanent
 */
exports.permanentDeleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Task permanently deleted',
      data: {}
    });
  } catch (error) {
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format'
      });
    }
    
    next(error);
  }
};