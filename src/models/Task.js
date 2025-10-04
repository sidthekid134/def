// This is a placeholder for a future database model
// In the next stories, this will be replaced with an actual database model

/**
 * Task Model
 * 
 * Properties:
 * - id: unique identifier for the task
 * - title: title of the task (required)
 * - description: detailed description of the task (optional)
 * - status: current status of the task (pending, in-progress, completed)
 * - dueDate: date when the task is due (optional)
 * - createdAt: date when the task was created
 * - updatedAt: date when the task was last updated
 */

class Task {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.dueDate = data.dueDate;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // This class will be expanded with validation and database methods
  // in future implementations
}

module.exports = Task;