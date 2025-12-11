
from pydantic import BaseModel
from fastapi import APIRouter
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

# Define a simple root endpoint
@router.get("/")
async def root():
    return {"message": "Hello products !"}

@router.get("/products/all")
async def get_all_products():
    try:
        return read_csv("server/data/product.csv")
    except Exception as e:
        return {"error": str(e)}
    
@router.get("/products/get/{index}")
async def get_all_products(index: int):
    try:
        product = {"product_id": index}
        product.update(get_csv("server/data/product.csv", index))
        return product
    except Exception as e:
        return {"error": str(e)}

@router.post("/products/edit")
async def edit_product(product: EditProduct):
    try:
        return edit_csv("server/data/product.csv", product.index, product.name, product.data)
    except Exception as e:
        return {"error": str(e)}

@router.delete("/products/drop/{index}")
async def drop_product(index: int):
    try:
        return drop_csv("server/data/product.csv", index)
    except Exception as e:
        return {"error": str(e)}
    
@router.put("/products/add")
async def get_product(product: AddProduct):
    try:
        return add_csv("server/data/product.csv", {"product_name": product.name})
    except Exception as e:
        return {"error": str(e)}