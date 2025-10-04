/**
 * Validation Middleware
 * 
 * This middleware validates request data for different endpoints
 * to ensure data consistency and proper error handling.
 */

const { ApiError } = require('./error.middleware');

/**
 * Validate task data for creation and updates
 */
exports.validateTaskData = (req, res, next) => {
  try {
    const { title, description, completed } = req.body;

    // Title validation
    if (req.method === 'POST' && (!title || title.trim() === '')) {
      return next(new ApiError(400, 'Task title is required'));
    }

    // Title length validation
    if (title && title.length > 100) {
      return next(new ApiError(400, 'Task title cannot exceed 100 characters'));
    }

    // Description length validation
    if (description && description.length > 500) {
      return next(new ApiError(400, 'Task description cannot exceed 500 characters'));
    }

    // Completed status validation
    if (completed !== undefined && typeof completed !== 'boolean') {
      return next(new ApiError(400, 'Completed status must be a boolean value'));
    }

    next();
  } catch (error) {
    next(new ApiError(500, 'Validation error: ' + error.message));
  }
};

/**
 * Validate task ID parameter
 */
exports.validateTaskId = (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ApiError(400, 'Task ID is required'));
    }

    // Check if ID is a valid numeric or string format
    // This is a simple check; in production, you might check against your DB's ID format
    if (isNaN(id) && !/^[a-zA-Z0-9]+$/.test(id)) {
      return next(new ApiError(400, 'Invalid task ID format'));
    }

    next();
  } catch (error) {
    next(new ApiError(500, 'Validation error: ' + error.message));
  }
};