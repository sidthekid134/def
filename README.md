# Task Management API

A simple RESTful API for managing tasks, built with Node.js and Express.js.

## Features

- CRUD operations for tasks
- RESTful API design
- Error handling middleware
- Environment-based configuration

## Setup and Installation

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
   
For development with automatic restarts:
```
npm run dev
```

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Request & Response Examples

#### Get all tasks

Request:
```
GET /api/tasks
```

Response:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "1",
      "title": "Complete backend setup",
      "description": "Set up the Node.js and Express backend",
      "status": "in-progress",
      "dueDate": "2023-12-31",
      "createdAt": "2023-10-04T14:30:00.000Z",
      "updatedAt": "2023-10-04T14:30:00.000Z"
    }
  ]
}
```

#### Create a task

Request:
```
POST /api/tasks
Content-Type: application/json

{
  "title": "Implement frontend",
  "description": "Create React frontend for the task manager",
  "status": "pending",
  "dueDate": "2024-01-15"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "2",
    "title": "Implement frontend",
    "description": "Create React frontend for the task manager",
    "status": "pending",
    "dueDate": "2024-01-15",
    "createdAt": "2023-10-04T15:00:00.000Z",
    "updatedAt": "2023-10-04T15:00:00.000Z"
  }
}
```

## Project Structure

```
/
├── node_modules/
├── src/
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   └── task.controller.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── task.model.js
│   └── routes/
│       └── task.routes.js
├── .env
├── .env.example
├── package.json
├── README.md
└── server.js
```

## Future Enhancements

- Database integration
- Authentication and authorization
- Task categories/labels
- User management
- Task assignments