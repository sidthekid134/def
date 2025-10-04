/**
 * Tests for the Task Controller
 */

const request = require('supertest');
const mongoose = require('mongoose');
const dbHandler = require('./setup');
const app = require('../server');
const Task = require('../src/models/task.model');

// Connect to a new in-memory database before running any tests
beforeAll(async () => await dbHandler.connect());

// Clear all test data after each test
afterEach(async () => await dbHandler.clearDatabase());

// Close database connection after all tests
afterAll(async () => await dbHandler.closeDatabase());

describe('Task API', () => {
  /**
   * Test the GET all tasks route
   */
  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      // Create sample tasks
      await Task.create([
        {
          title: 'Test Task 1',
          description: 'Test Description 1',
          status: 'pending'
        },
        {
          title: 'Test Task 2',
          description: 'Test Description 2',
          status: 'in-progress'
        }
      ]);

      // Make request
      const response = await request(app).get('/api/tasks');

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('title', 'Test Task 1');
      expect(response.body.data[1]).toHaveProperty('title', 'Test Task 2');
    });

    it('should filter tasks by status', async () => {
      // Create sample tasks with different statuses
      await Task.create([
        {
          title: 'Test Task 1',
          description: 'Test Description 1',
          status: 'pending'
        },
        {
          title: 'Test Task 2',
          description: 'Test Description 2',
          status: 'in-progress'
        },
        {
          title: 'Test Task 3',
          description: 'Test Description 3',
          status: 'completed'
        }
      ]);

      // Make request with status filter
      const response = await request(app).get('/api/tasks?status=completed');

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('title', 'Test Task 3');
      expect(response.body.data[0]).toHaveProperty('status', 'completed');
    });
  });

  /**
   * Test the GET task by ID route
   */
  describe('GET /api/tasks/:id', () => {
    it('should get a task by ID', async () => {
      // Create a sample task
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending'
      });

      // Make request
      const response = await request(app).get(`/api/tasks/${task.id}`);

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('title', 'Test Task');
      expect(response.body.data).toHaveProperty('description', 'Test Description');
      expect(response.body.data).toHaveProperty('status', 'pending');
    });

    it('should return 404 if task not found', async () => {
      // Generate a valid but non-existent task ID
      const nonExistentId = new mongoose.Types.ObjectId();

      // Make request
      const response = await request(app).get(`/api/tasks/${nonExistentId}`);

      // Assertions
      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid ID format', async () => {
      // Make request with invalid ID
      const response = await request(app).get('/api/tasks/invalidId');

      // Assertions
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid task ID format');
    });
  });

  /**
   * Test the POST create task route
   */
  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      // Task data
      const taskData = {
        title: 'New Task',
        description: 'New Task Description',
        status: 'pending',
        dueDate: '2025-12-31'
      };

      // Make request
      const response = await request(app)
        .post('/api/tasks')
        .send(taskData);

      // Assertions
      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('title', taskData.title);
      expect(response.body.data).toHaveProperty('description', taskData.description);
      expect(response.body.data).toHaveProperty('status', taskData.status);

      // Verify task was saved to database
      const task = await Task.findById(response.body.data.id);
      expect(task).toBeTruthy();
      expect(task.title).toBe(taskData.title);
    });

    it('should return validation errors for invalid data', async () => {
      // Invalid task data - missing required title
      const invalidTaskData = {
        description: 'Task without title',
        status: 'invalid-status'  // Invalid status value
      };

      // Make request
      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTaskData);

      // Assertions
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBeTruthy();
    });
  });

  /**
   * Test the PUT update task route
   */
  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      // Create a sample task
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending'
      });

      // Update data
      const updateData = {
        title: 'Updated Task',
        status: 'in-progress'
      };

      // Make request
      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send(updateData);

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('title', updateData.title);
      expect(response.body.data).toHaveProperty('status', updateData.status);
      expect(response.body.data).toHaveProperty('description', 'Test Description'); // Unchanged field

      // Verify task was updated in database
      const updatedTask = await Task.findById(task.id);
      expect(updatedTask.title).toBe(updateData.title);
      expect(updatedTask.status).toBe(updateData.status);
    });

    it('should return 404 if task not found', async () => {
      // Generate a valid but non-existent task ID
      const nonExistentId = new mongoose.Types.ObjectId();

      // Make request
      const response = await request(app)
        .put(`/api/tasks/${nonExistentId}`)
        .send({ title: 'Updated Title' });

      // Assertions
      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Task not found');
    });
  });

  /**
   * Test the DELETE task route
   */
  describe('DELETE /api/tasks/:id', () => {
    it('should soft delete a task by ID', async () => {
      // Create a sample task
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending'
      });

      // Make delete request
      const response = await request(app).delete(`/api/tasks/${task.id}`);

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task was marked as deleted in the database
      const deletedTask = await Task.findById(task.id);
      expect(deletedTask).toBeTruthy();
      expect(deletedTask.isDeleted).toBe(true);
      
      // Verify task doesn't appear in regular GET requests
      const getAllResponse = await request(app).get('/api/tasks');
      expect(getAllResponse.body.count).toBe(0);
      expect(getAllResponse.body.data).toHaveLength(0);
    });

    it('should return 404 if task not found', async () => {
      // Generate a valid but non-existent task ID
      const nonExistentId = new mongoose.Types.ObjectId();

      // Make request
      const response = await request(app).delete(`/api/tasks/${nonExistentId}`);

      // Assertions
      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Task not found');
    });
  });

  /**
   * Test the permanent DELETE task route
   */
  describe('DELETE /api/tasks/:id/permanent', () => {
    it('should permanently delete a task by ID', async () => {
      // Create a sample task
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending'
      });

      // Make delete request
      const response = await request(app).delete(`/api/tasks/${task.id}/permanent`);

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task permanently deleted');

      // Verify task was actually deleted from the database
      const deletedTask = await Task.findById(task.id);
      expect(deletedTask).toBeNull();
    });
  });
});