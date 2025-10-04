/**
 * Task Model - Simple representation of a Task
 * 
 * NOTE: This is a placeholder for a proper database model.
 * In a real application, this would be implemented using a database ORM
 * like Mongoose (for MongoDB) or Sequelize (for SQL databases).
 */

class Task {
  constructor(id, title, description = '', status = 'pending', dueDate = null) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status; // pending, in-progress, completed
    this.dueDate = dueDate;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Helper method to convert task to JSON object
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Task;