const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { validateTaskData, validateTaskId } = require('../middlewares/validation.middleware');

// GET all tasks
router.get('/', taskController.getAllTasks);

// GET task by id
router.get('/:id', validateTaskId, taskController.getTaskById);

// POST new task
router.post('/', validateTaskData, taskController.createTask);

// PUT update task
router.put('/:id', [validateTaskId, validateTaskData], taskController.updateTask);

// DELETE task
router.delete('/:id', validateTaskId, taskController.deleteTask);

module.exports = router;