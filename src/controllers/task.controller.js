const Task = require('../models/task.model');

/**
 * Task Controller
 * 
 * Contains all the business logic for task operations
 */
const taskController = {
  /**
   * Get all tasks
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getAllTasks: (req, res, next) => {
    try {
      const tasks = Task.getAll();
      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get task by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getTaskById: (req, res, next) => {
    try {
      const { id } = req.params;
      const task = Task.findById(id);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  createTask: (req, res, next) => {
    try {
      const { title, description, completed } = req.body;
      
      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'Task title is required'
        });
      }
      
      const task = Task.create({ title, description, completed });
      
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  updateTask: (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const task = Task.update(id, updates);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  deleteTask: (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = Task.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = taskController;