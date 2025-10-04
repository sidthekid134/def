from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List, Optional
import logging
from datetime import datetime

from app.database import get_session
from app.models import Task, TaskCreate, TaskRead, TaskUpdate, TaskStatus

router = APIRouter(tags=["Tasks"])
logger = logging.getLogger(__name__)

@router.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task: TaskCreate, 
    session: Session = Depends(get_session)
):
    """Create a new task"""
    db_task = Task.from_orm(task)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    logger.info(f"Created task with ID: {db_task.id}")
    return db_task

@router.get("/tasks", response_model=List[TaskRead])
async def read_tasks(
    status: Optional[TaskStatus] = None,
    skip: int = 0, 
    limit: int = Query(default=100, lte=100),
    session: Session = Depends(get_session)
):
    """Get all tasks with optional filtering"""
    query = select(Task)
    
    # Apply status filter if provided
    if status:
        query = query.where(Task.status == status)
    
    # Apply pagination
    tasks = session.exec(query.offset(skip).limit(limit)).all()
    return tasks

@router.get("/tasks/{task_id}", response_model=TaskRead)
async def read_task(
    task_id: int, 
    session: Session = Depends(get_session)
):
    """Get a specific task by ID"""
    task = session.get(Task, task_id)
    if not task:
        logger.warning(f"Task with ID {task_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    return task

@router.patch("/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int, 
    task_update: TaskUpdate, 
    session: Session = Depends(get_session)
):
    """Update a task (partial update)"""
    db_task = session.get(Task, task_id)
    if not db_task:
        logger.warning(f"Task with ID {task_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    
    # Update task data from request
    task_data = task_update.dict(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)
    
    # Update the updated_at timestamp
    db_task.updated_at = datetime.utcnow()
    
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    logger.info(f"Updated task with ID: {task_id}")
    return db_task

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int, 
    session: Session = Depends(get_session)
):
    """Delete a task"""
    db_task = session.get(Task, task_id)
    if not db_task:
        logger.warning(f"Task with ID {task_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    
    session.delete(db_task)
    session.commit()
    logger.info(f"Deleted task with ID: {task_id}")
    return None