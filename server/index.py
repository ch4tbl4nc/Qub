
"""Point d'entrée FastAPI pour QUB."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.users import router as users_router
from api.csv import router as csv_router
from api.dashboard import router as dashboard_router
from api.history import router as history_router

app = FastAPI()

# Configuration CORS - OBLIGATOIRE pour pywebview
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifiez les origines exactes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers for API
app.include_router(users_router, prefix="/users")
app.include_router(csv_router, prefix="/csv")
app.include_router(dashboard_router, prefix="/dashboard")
app.include_router(history_router, prefix="/history")

@app.get("/")
async def root():
    """Endpoint racine de l'API."""
    return {"message": "Welcome to the API!"}