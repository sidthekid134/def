// In-memory store for tasks (will be replaced with a database in future stories)
let tasks = [];
let nextId = 1;

// Get all tasks
const getAllTasks = (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
};

// Get single task by id
const getTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task not found with id ${id}`
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
};

// Create a new task
const createTask = (req, res) => {
  const { title, description, status = 'pending', dueDate } = req.body;

  // Basic validation
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  const newTask = {
    id: nextId++,
    title,
    description,
    status,
    dueDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask
  });
};

// Update a task
const updateTask = (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Task not found with id ${id}`
    });
  }

  const { title, description, status, dueDate } = req.body;
  const updatedTask = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    status: status || tasks[taskIndex].status,
    dueDate: dueDate || tasks[taskIndex].dueDate,
    updatedAt: new Date().toISOString()
  };

  tasks[taskIndex] = updatedTask;

  res.status(200).json({
    success: true,
    data: updatedTask
  });
};

// Delete a task
const deleteTask = (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Task not found with id ${id}`
    });
  }

  tasks.splice(taskIndex, 1);

  res.status(200).json({
    success: true,
    message: `Task with id ${id} deleted successfully`
  });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};