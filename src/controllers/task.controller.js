/**
 * Task controller for handling task-related operations
 */

// In-memory tasks array (temporary until database is integrated)
let tasks = [
  {
    id: '1',
    title: 'Complete backend setup',
    description: 'Set up the Node.js and Express backend',
    status: 'in-progress',
    dueDate: '2023-12-31',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Get all tasks
 */
exports.getAllTasks = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * Get task by ID
 */
exports.getTaskById = (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id);
    
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
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * Create a new task
 */
exports.createTask = (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    
    // Basic validation
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a title for the task'
      });
    }
    
    // Create new task
    const newTask = {
      id: (tasks.length + 1).toString(),
      title,
      description: description || '',
      status: status || 'pending',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * Update a task by ID
 */
exports.updateTask = (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Update task
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      description: description !== undefined ? description : tasks[taskIndex].description,
      status: status || tasks[taskIndex].status,
      dueDate: dueDate || tasks[taskIndex].dueDate,
      updatedAt: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: tasks[taskIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * Delete a task by ID
 */
exports.deleteTask = (req, res) => {
  try {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Remove task
    tasks.splice(taskIndex, 1);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};