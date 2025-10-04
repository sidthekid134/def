import os
from sqlmodel import SQLModel, Session, create_engine
from typing import Generator
import logging

logger = logging.getLogger(__name__)

# Get database URL from environment variable or use a default SQLite database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL, 
    echo=False,  # Set to True to see SQL queries
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

def create_db_and_tables() -> None:
    """Create database tables from SQLModel metadata"""
    logger.info("Creating database tables")
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Dependency for getting DB session"""
    with Session(engine) as session:
        yield session