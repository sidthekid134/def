/**
 * Task Model
 * 
 * This is a placeholder for a database model.
 * In a real implementation, this would be replaced with an actual database model
 * using a library like Mongoose (MongoDB), Sequelize (SQL), etc.
 */

// In-memory storage for development
let tasks = [];
let nextId = 1;

class Task {
  constructor(data) {
    this.id = data.id || nextId++;
    this.title = data.title;
    this.description = data.description || '';
    this.completed = data.completed || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // CRUD methods
  static getAll() {
    return tasks;
  }

  static findById(id) {
    return tasks.find(task => task.id.toString() === id.toString());
  }

  static create(data) {
    const task = new Task(data);
    tasks.push(task);
    return task;
  }

  static update(id, data) {
    const taskIndex = tasks.findIndex(task => task.id.toString() === id.toString());
    if (taskIndex === -1) return null;

    const task = tasks[taskIndex];
    const updatedTask = {
      ...task,
      ...data,
      updatedAt: new Date()
    };
    
    tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  static delete(id) {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id.toString() !== id.toString());
    return tasks.length !== initialLength;
  }
}

module.exports = Task;