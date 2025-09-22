from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from datetime import datetime
from typing import List, Dict, Optional
import uuid

from app.models import (
    TodoItemCreate, 
    TodoItemResponse, 
    HealthCheck,
    TodoItemBase
)

app = FastAPI(
    title="Todo API",
    description="A simple Todo API with in-memory storage",
    version="0.1.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for todo items
# Each item is a dict with keys matching TodoItemResponse fields
todo_items: Dict[str, dict] = {}

@app.get("/health", response_model=HealthCheck, tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify the API is running.
    """
    logger.info("Health check request received")
    return HealthCheck(
        status="healthy",
        timestamp=datetime.utcnow()
    )

@app.post("/todos", response_model=TodoItemResponse, status_code=status.HTTP_201_CREATED, tags=["Todos"])
async def create_todo(todo: TodoItemCreate):
    """
    Create a new todo item and store it in memory.
    """
    logger.info(f"Creating new todo item: {todo.title}")
    
    # Generate a unique ID
    todo_id = str(uuid.uuid4())
    
    # Get current timestamp
    now = datetime.utcnow()
    
    # Create new todo item
    todo_dict = {
        "id": todo_id,
        "title": todo.title,
        "description": todo.description,
        "is_completed": todo.is_completed,
        "created_at": now,
        "updated_at": now
    }
    
    # Store in our in-memory dictionary
    todo_items[todo_id] = todo_dict
    
    logger.info(f"Todo item created with ID: {todo_id}")
    
    # Return the created item
    return TodoItemResponse(**todo_dict)

@app.get("/todos", response_model=List[TodoItemResponse], tags=["Todos"])
async def get_todos(skip: int = 0, limit: int = 100):
    """
    Retrieve all todo items with pagination support.
    """
    logger.info(f"Fetching todos with skip={skip}, limit={limit}")
    
    # Convert dictionary values to a list and apply pagination
    todos_list = list(todo_items.values())[skip:skip+limit]
    
    return [TodoItemResponse(**todo) for todo in todos_list]

@app.get("/todos/{todo_id}", response_model=TodoItemResponse, tags=["Todos"])
async def get_todo(todo_id: str):
    """
    Retrieve a specific todo item by ID.
    """
    logger.info(f"Fetching todo with ID: {todo_id}")
    
    if todo_id not in todo_items:
        logger.warning(f"Todo item with ID {todo_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo item with ID {todo_id} not found"
        )
    
    return TodoItemResponse(**todo_items[todo_id])

@app.put("/todos/{todo_id}", response_model=TodoItemResponse, tags=["Todos"])
async def update_todo(todo_id: str, todo: TodoItemBase):
    """
    Update a specific todo item by ID.
    """
    logger.info(f"Updating todo with ID: {todo_id}")
    
    if todo_id not in todo_items:
        logger.warning(f"Todo item with ID {todo_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo item with ID {todo_id} not found"
        )
    
    # Update the todo item while preserving id and created_at
    todo_items[todo_id].update({
        "title": todo.title,
        "description": todo.description,
        "is_completed": todo.is_completed,
        "updated_at": datetime.utcnow()
    })
    
    logger.info(f"Todo item {todo_id} updated successfully")
    
    return TodoItemResponse(**todo_items[todo_id])

@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Todos"])
async def delete_todo(todo_id: str):
    """
    Delete a specific todo item by ID.
    """
    logger.info(f"Deleting todo with ID: {todo_id}")
    
    if todo_id not in todo_items:
        logger.warning(f"Todo item with ID {todo_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo item with ID {todo_id} not found"
        )
    
    # Remove the todo item from the dictionary
    del todo_items[todo_id]
    
    logger.info(f"Todo item {todo_id} deleted successfully")