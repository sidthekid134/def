const express = require('express');
const taskController = require('../controllers/task.controller');

const router = express.Router();

/**
 * @route GET /api/tasks
 * @description Get all tasks
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
router.post('/', taskController.createTask);

/**
 * @route PUT /api/tasks/:id
 * @description Update a task by ID
 * @access Public
 */
router.put('/:id', taskController.updateTask);

/**
 * @route DELETE /api/tasks/:id
 * @description Delete a task by ID
 * @access Public
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;