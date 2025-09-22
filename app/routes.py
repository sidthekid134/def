from fastapi import APIRouter, HTTPException, status, Path, Body
from app.models import Todo, TodoCreate, TodoUpdate
from app.repository import todo_repository
from typing import List, Dict, Any
from uuid import UUID
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/todos",
    tags=["todos"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[Todo], status_code=status.HTTP_200_OK)
async def get_todos() -> List[Todo]:
    """
    Get all todo items.
    
    Returns:
        List[Todo]: List of all todo items.
    """
    logger.info("Getting all todos")
    return todo_repository.get_all()

@router.get("/{todo_id}", response_model=Todo, status_code=status.HTTP_200_OK)
async def get_todo(
    todo_id: UUID = Path(..., description="The ID of the todo to get")
) -> Todo:
    """
    Get a todo item by ID.
    
    Args:
        todo_id (UUID): The ID of the todo to get.
        
    Returns:
        Todo: The requested todo item.
        
    Raises:
        HTTPException: If the todo item is not found.
    """
    logger.info(f"Getting todo with ID: {todo_id}")
    todo = todo_repository.get_by_id(todo_id)
    
    if todo is None:
        logger.warning(f"Todo with ID {todo_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with ID {todo_id} not found"
        )
    
    return todo

@router.post("/", response_model=Todo, status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_create: TodoCreate = Body(..., description="The todo to create")
) -> Todo:
    """
    Create a new todo item.
    
    Args:
        todo_create (TodoCreate): The todo item to create.
        
    Returns:
        Todo: The created todo item.
    """
    logger.info(f"Creating new todo with title: {todo_create.title}")
    return todo_repository.create(todo_create)

@router.put("/{todo_id}", response_model=Todo, status_code=status.HTTP_200_OK)
async def update_todo(
    todo_id: UUID = Path(..., description="The ID of the todo to update"),
    todo_update: TodoUpdate = Body(..., description="The updated todo data")
) -> Todo:
    """
    Update a todo item.
    
    Args:
        todo_id (UUID): The ID of the todo to update.
        todo_update (TodoUpdate): The updated todo data.
        
    Returns:
        Todo: The updated todo item.
        
    Raises:
        HTTPException: If the todo item is not found.
    """
    logger.info(f"Updating todo with ID: {todo_id}")
    updated_todo = todo_repository.update(todo_id, todo_update)
    
    if updated_todo is None:
        logger.warning(f"Todo with ID {todo_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with ID {todo_id} not found"
        )
    
    return updated_todo

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    todo_id: UUID = Path(..., description="The ID of the todo to delete")
) -> None:
    """
    Delete a todo item.
    
    Args:
        todo_id (UUID): The ID of the todo to delete.
        
    Raises:
        HTTPException: If the todo item is not found.
    """
    logger.info(f"Deleting todo with ID: {todo_id}")
    deleted = todo_repository.delete(todo_id)
    
    if not deleted:
        logger.warning(f"Todo with ID {todo_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with ID {todo_id} not found"
        )

@router.post("/bulk", response_model=List[Todo], status_code=status.HTTP_201_CREATED)
async def create_todos(
    todos: List[TodoCreate] = Body(..., description="List of todos to create")
) -> List[Todo]:
    """
    Create multiple todo items in a single request.
    
    Args:
        todos (List[TodoCreate]): List of todo items to create.
        
    Returns:
        List[Todo]: The list of created todo items.
    """
    logger.info(f"Creating {len(todos)} todo items")
    return todo_repository.create_many(todos)