from fastapi import FastAPI, HTTPException, Depends, status
from typing import Dict, Any
import uvicorn
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Todo API",
    description="A simple Todo API built with FastAPI",
    version="0.1.0",
)

# Health check endpoint
@app.get("/health", status_code=status.HTTP_200_OK, tags=["health"])
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify API is running.
    Returns a simple status message.
    """
    logger.info("Health check endpoint called")
    return {"status": "healthy"}

# Root endpoint
@app.get("/", tags=["root"])
async def root() -> Dict[str, str]:
    """
    Root endpoint that returns a welcome message.
    """
    logger.info("Root endpoint called")
    return {"message": "Welcome to the Todo API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)