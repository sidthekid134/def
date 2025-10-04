# Task Management API

A simple but production-ready task management application with modern development practices.

## Tech Stack

- Node.js
- Express.js
- RESTful API

## Project Structure

```
.
├── server.js                 # Application entry point
├── package.json              # Project dependencies and scripts
├── .env.example              # Example environment variables
└── src/                      # Source code
    ├── config/               # Application configuration
    │   └── config.js         # Configuration settings
    ├── controllers/          # Request handlers
    │   └── taskController.js # Task-related controllers
    ├── middleware/           # Express middleware
    │   ├── errorHandler.js   # Global error handling
    │   └── requestLogger.js  # Request logging
    ├── models/               # Data models
    │   └── Task.js           # Task model (placeholder for future DB integration)
    ├── routes/               # API routes
    │   ├── health.js         # Health check routes
    │   └── tasks.js          # Task management routes
    └── utils/                # Utility functions and classes
        └── AppError.js       # Custom error class
```

## API Endpoints

| Method | Endpoint     | Description         |
|--------|--------------|---------------------|
| GET    | /health      | API health check    |
| GET    | /api/tasks   | Get all tasks       |
| GET    | /api/tasks/:id | Get task by ID    |
| POST   | /api/tasks   | Create a new task   |
| PUT    | /api/tasks/:id | Update a task     |
| DELETE | /api/tasks/:id | Delete a task     |

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

## Task Model

The current implementation uses an in-memory store for tasks. Each task has the following properties:

- id: unique identifier
- title: task title (required)
- description: detailed description (optional)
- status: task status (pending, in-progress, completed)
- dueDate: deadline for the task (optional)
- createdAt: creation timestamp
- updatedAt: last update timestamp