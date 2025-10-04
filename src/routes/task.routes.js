/**
 * Task routes
 */

const express = require('express');
const taskController = require('../controllers/task.controller');
const { taskValidationRules } = require('../middleware/validation');

const router = express.Router();

/**
 * @route GET /api/tasks
 * @description Get all tasks with filtering and pagination
 * @access Public
 */
router.get('/', taskController.getAllTasks);

/**
 * @route GET /api/tasks/:id
 * @description Get task by ID
 * @access Public
 */
router.get('/:id', taskController.getTaskById);

/**
 * @route POST /api/tasks
 * @description Create a new task
 * @access Public
 */
router.post('/', taskValidationRules, taskController.createTask);

/**
 * @route PUT /api/tasks/:id
 * @description Update a task by ID
 * @access Public
 */
router.put('/:id', taskValidationRules, taskController.updateTask);

/**
 * @route DELETE /api/tasks/:id
 * @description Soft delete a task by ID
 * @access Public
 */
router.delete('/:id', taskController.deleteTask);

/**
 * @route DELETE /api/tasks/:id/permanent
 * @description Permanently delete a task by ID (for admin purposes)
 * @access Public
 */
router.delete('/:id/permanent', taskController.permanentDeleteTask);

module.exports = router;