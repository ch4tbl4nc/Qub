
"""Endpoints API pour manipuler le CSV de produits (lecture/ajout/modification)."""
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from libs.csv.Read import read_csv
from libs.csv.Edit import edit_csv
from libs.csv.Drop import drop_csv
from libs.csv.Add import add_csv
from libs.csv.Get import get_csv

class EditProduct(BaseModel):
    index: int
    name: str
    data: str

class AddProduct(BaseModel):
    name: str

# Create a router instance
router = APIRouter()

# Fichier CSV central
PRODUCTS_FILE = "server/data/product.csv"

# Define a simple root endpoint
@router.get("/")
async def root():
    return {"message": "Hello products !"}

@router.get("/products/all")
async def get_all_products():
    try:
        return read_csv(PRODUCTS_FILE)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    
@router.get("/products/get/{index}")
async def get_product_by_index(index: int):
    try:
        product = {"product_id": index}
        product.update(get_csv(PRODUCTS_FILE, index))
        return product
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/products/edit")
async def edit_product(product: EditProduct):
    try:
        return edit_csv(PRODUCTS_FILE, product.index, product.name, product.data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.delete("/products/drop/{index}")
async def drop_product(index: int):
    try:
        return drop_csv(PRODUCTS_FILE, index)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    
@router.put("/products/add")
async def add_product(product: AddProduct):
    try:
        return add_csv(PRODUCTS_FILE, {"product_name": product.name})
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))