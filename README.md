# Todo API

A simple Todo API built with FastAPI. This API provides endpoints to manage todo items with CRUD operations.

## Getting Started

### Prerequisites

- Python 3.7+
- FastAPI
- Uvicorn

### Installation

1. Clone this repository
2. Install required packages:
   ```
   pip install -r requirements.txt
   ```

### Running the API

Run the API locally:

```
python -m app.main
```

The API will be available at http://localhost:8000

## API Documentation

Once the API is running, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Health and Root Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/health` | Health check endpoint | `{"status": "healthy"}` |
| GET | `/` | Root endpoint | `{"message": "Welcome to the Todo API"}` |

### Todo Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/todos/` | Get all todo items | None | Array of todo items |
| GET | `/todos/{todo_id}` | Get a specific todo item by ID | None | Todo item |
| POST | `/todos/` | Create a new todo item | TodoCreate object | Created todo item |
| PUT | `/todos/{todo_id}` | Update a todo item | TodoUpdate object | Updated todo item |
| DELETE | `/todos/{todo_id}` | Delete a todo item | None | No content (204) |
| POST | `/todos/bulk` | Create multiple todo items | Array of TodoCreate objects | Array of created todo items |

## Data Models

### TodoCreate

Fields for creating a new todo:

```json
{
  "title": "string",
  "description": "string (optional)",
  "completed": false
}
```

### TodoUpdate

Fields for updating an existing todo (all fields optional):

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "completed": true/false (optional)
}
```

### Todo

Full todo item model returned by the API:

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string (optional)",
  "completed": true/false,
  "created_at": "datetime",
  "updated_at": "datetime (optional)"
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Resource deleted successfully
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error

## License

This project is licensed under the MIT License.