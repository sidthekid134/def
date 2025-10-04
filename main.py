import uvicorn
from app.main import app
from app.database import create_db_and_tables

if __name__ == "__main__":
    # Create database tables on startup
    create_db_and_tables()
    
    # Run the FastAPI app with uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)