
from fastapi import APIRouter
from libs.csv.Read import read_csv

# Create a router instance
router = APIRouter()

# Define a simple root endpoint
@router.get("/")
async def root():
    return {"message": "Hello Users !"}

@router.get("/products/all")
async def get_all_products():
    try:
        return read_csv("server/data/product.csv")
    except Exception as e:
        return {"error": str(e)}

@router.get("/products/edit")
async def get_product():
    try:
        return read_csv("server/data/product.csv")
    except Exception as e:
        return {"error": str(e)}
