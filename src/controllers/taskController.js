const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Get all tasks
 * @route   GET /api/tasks
 * @access  Public
 */
const getAllTasks = asyncHandler(async (req, res) => {
  // Add filtering options based on query parameters
  let query = {};
  
  // Filter by status if provided
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  // Build query
  const tasks = await Task.find(query).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

/**
 * Get single task by id
 * @route   GET /api/tasks/:id
 * @access  Public
 */
const getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * Create a new task
 * @route   POST /api/tasks
 * @access  Public
 */
const createTask = asyncHandler(async (req, res) => {
  // Validation is handled by Mongoose schema
  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

/**
 * Update a task
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
const updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${req.params.id}`, 404));
  }

  // Update and return new version with validation
  task = await Task.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    {
      new: true, // Return updated document
      runValidators: true // Run the validators
    }
  );

  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
const deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${req.params.id}`, 404));
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: `Task with id ${req.params.id} deleted successfully`
  });
});

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};