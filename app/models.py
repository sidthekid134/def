from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database import Base


# SQLAlchemy Models (for ORM)
class TodoItem(Base):
    __tablename__ = "todo_items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Pydantic Models (for API validation)
class TodoItemBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="Title of the todo item")
    description: Optional[str] = Field(None, max_length=500, description="Detailed description of the todo item")
    is_completed: bool = Field(False, description="Completion status of the todo item")


class TodoItemCreate(TodoItemBase):
    pass


class TodoItemResponse(TodoItemBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class HealthCheck(BaseModel):
    status: str
    timestamp: datetime


# For batch operations in future story
class TodoItemBatchCreate(BaseModel):
    items: List[TodoItemCreate]