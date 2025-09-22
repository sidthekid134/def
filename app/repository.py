from app.models import Todo, TodoCreate, TodoUpdate
from typing import Dict, List, Optional
from uuid import UUID, uuid4
from datetime import datetime
import logging

# Configure logging
logger = logging.getLogger(__name__)

# In-memory database for storing todos
class TodoRepository:
    """Repository for storing and retrieving Todo items in memory."""
    
    def __init__(self):
        self.todos: Dict[UUID, Todo] = {}
    
    def get_all(self) -> List[Todo]:
        """Get all Todo items."""
        logger.info("Getting all todo items")
        return list(self.todos.values())
    
    def get_by_id(self, todo_id: UUID) -> Optional[Todo]:
        """Get a Todo item by ID."""
        logger.info(f"Getting todo item with ID: {todo_id}")
        return self.todos.get(todo_id)
    
    def create(self, todo_create: TodoCreate) -> Todo:
        """Create a new Todo item."""
        # Convert TodoCreate to Todo
        todo = Todo(
            id=uuid4(),
            title=todo_create.title,
            description=todo_create.description,
            completed=todo_create.completed,
            created_at=datetime.now()
        )
        
        # Store in memory
        self.todos[todo.id] = todo
        logger.info(f"Created todo item with ID: {todo.id}")
        
        return todo
    
    def update(self, todo_id: UUID, todo_update: TodoUpdate) -> Optional[Todo]:
        """Update an existing Todo item."""
        existing_todo = self.get_by_id(todo_id)
        
        if existing_todo is None:
            logger.warning(f"Attempted to update non-existent todo with ID: {todo_id}")
            return None
        
        # Update fields if they are provided
        update_data = todo_update.dict(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(existing_todo, key, value)
        
        # Update the updated_at timestamp
        existing_todo.updated_at = datetime.now()
        
        # Save the updated todo
        self.todos[todo_id] = existing_todo
        logger.info(f"Updated todo item with ID: {todo_id}")
        
        return existing_todo
    
    def delete(self, todo_id: UUID) -> bool:
        """Delete a Todo item by ID."""
        if todo_id not in self.todos:
            logger.warning(f"Attempted to delete non-existent todo with ID: {todo_id}")
            return False
        
        del self.todos[todo_id]
        logger.info(f"Deleted todo item with ID: {todo_id}")
        
        return True
    
    def create_many(self, todo_creates: List[TodoCreate]) -> List[Todo]:
        """Create multiple Todo items at once."""
        created_todos = []
        
        for todo_create in todo_creates:
            todo = self.create(todo_create)
            created_todos.append(todo)
        
        logger.info(f"Created {len(created_todos)} todo items")
        return created_todos

# Create a single instance to be used throughout the app
todo_repository = TodoRepository()