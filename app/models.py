from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from uuid import UUID, uuid4

# Todo Pydantic models
class TodoBase(BaseModel):
    """Base Todo model with common fields."""
    title: str = Field(..., min_length=1, max_length=100, description="The title of the todo item")
    description: Optional[str] = Field(None, max_length=1000, description="Optional description of the todo item")
    completed: bool = Field(False, description="Whether the todo item has been completed")

class TodoCreate(TodoBase):
    """Model used for creating a new todo item."""
    pass

class TodoUpdate(BaseModel):
    """Model used for updating an existing todo item."""
    title: Optional[str] = Field(None, min_length=1, max_length=100, description="The title of the todo item")
    description: Optional[str] = Field(None, max_length=1000, description="Optional description of the todo item")
    completed: Optional[bool] = Field(None, description="Whether the todo item has been completed")

class Todo(TodoBase):
    """Model representing a todo item with all fields."""
    id: UUID = Field(default_factory=uuid4, description="Unique identifier for the todo item")
    created_at: datetime = Field(default_factory=datetime.now, description="When the todo item was created")
    updated_at: Optional[datetime] = Field(None, description="When the todo item was last updated")

    class Config:
        from_attributes = True