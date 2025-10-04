/**
 * Task Endpoints Tests
 * 
 * Tests for all task management endpoints
 */

const request = require('supertest');
const app = require('../server');
const Task = require('../src/models/task.model');

// Mock data
const taskData = {
  title: 'Test Task',
  description: 'This is a test task',
  completed: false
};

// Clear tasks before each test
beforeEach(() => {
  // Since we're using in-memory storage, we can clear tasks by modifying the Task module
  // In a real application with a database, you'd use a test database and clear it
  Object.getOwnPropertyNames(Task).forEach(prop => {
    if (prop === 'prototype' || prop === 'name' || prop === 'length') return;
    if (typeof Task[prop] === 'function') return;
    delete Task[prop];
  });
  
  // Reset in-memory tasks
  Task.tasks = [];
  Task.nextId = 1;
});

describe('Task API Endpoints', () => {
  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .expect(200);
      
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    it('should return all tasks', async () => {
      // Create a task first
      Task.create(taskData);
      
      const res = await request(app)
        .get('/api/tasks')
        .expect(200);
      
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0]).toHaveProperty('title', taskData.title);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .get('/api/tasks/999')
        .expect(404);
      
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });

    it('should return a task by ID', async () => {
      // Create a task first
      const task = Task.create(taskData);
      
      const res = await request(app)
        .get(`/api/tasks/${task.id}`)
        .expect(200);
      
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id', task.id);
      expect(res.body.data).toHaveProperty('title', taskData.title);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);
      
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('title', taskData.title);
      expect(res.body.data).toHaveProperty('description', taskData.description);
      expect(res.body.data).toHaveProperty('completed', taskData.completed);
      
      // Check that ID was assigned
      expect(res.body.data).toHaveProperty('id');
    });

    it('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          description: 'Missing title'
        })
        .expect(400);
      
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      // Create a task first
      const task = Task.create(taskData);
      
      const updatedData = {
        title: 'Updated Task',
        completed: true
      };
      
      const res = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send(updatedData)
        .expect(200);
      
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id', task.id);
      expect(res.body.data).toHaveProperty('title', updatedData.title);
      expect(res.body.data).toHaveProperty('completed', updatedData.completed);
      // Description should remain unchanged
      expect(res.body.data).toHaveProperty('description', taskData.description);
    });

    it('should return 404 when updating non-existent task', async () => {
      const res = await request(app)
        .put('/api/tasks/999')
        .send({
          title: 'Updated Task'
        })
        .expect(404);
      
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      // Create a task first
      const task = Task.create(taskData);
      
      const res = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .expect(200);
      
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      
      // Verify task was deleted
      const getRes = await request(app)
        .get(`/api/tasks/${task.id}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent task', async () => {
      const res = await request(app)
        .delete('/api/tasks/999')
        .expect(404);
      
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });
  });
});