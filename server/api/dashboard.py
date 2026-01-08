from fastapi import APIRouter, HTTPException
import pandas as pd
from pathlib import Path

router = APIRouter()

DATA_DIR = Path(__file__).parent.parent / "data"

# Constantes pour les noms de fichiers
PRODUCTS_CSV = "products.csv"
SUPPLIERS_CSV = "suppliers.csv"
CATEGORIES_CSV = "categories.csv"

@router.get("/stats")
async def get_dashboard_stats():
    """Récupère les statistiques pour le dashboard"""
    try:
        # Charger les fichiers CSV
        products = pd.read_csv(DATA_DIR / PRODUCTS_CSV)
        suppliers = pd.read_csv(DATA_DIR / SUPPLIERS_CSV)
        categories = pd.read_csv(DATA_DIR / CATEGORIES_CSV)
        
        # Calculer les KPIs
        total_revenue = products['revenue'].sum()
        total_sales = products['sales'].sum()
        total_stock = products['quantity'].sum()
        total_suppliers = len(suppliers)
        
        # Top 3 produits
        top_products = products.nlargest(3, 'revenue')[['name', 'revenue']].to_dict('records')
        
        # Flop 3 produits
        flop_products = products.nsmallest(3, 'revenue')[['name', 'revenue']].to_dict('records')
        
        # Répartition par fournisseur
        supplier_distribution = suppliers[['name', 'total_revenue']].to_dict('records')
        
        # Revenus par catégorie
        category_revenue = categories.to_dict('records')
        
        return {
            "kpis": {
                "revenue": float(total_revenue),
                "sales": int(total_sales),
                "stock": int(total_stock),
                "suppliers": int(total_suppliers)
            },
            "top_products": top_products,
            "flop_products": flop_products,
            "supplier_distribution": supplier_distribution,
            "category_revenue": category_revenue
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du chargement des données: {str(e)}")

@router.get("/stock/stats")
async def get_stock_stats():
    """Récupère les statistiques pour la page stock"""
    try:
        products = pd.read_csv(DATA_DIR / PRODUCTS_CSV)
        categories = pd.read_csv(DATA_DIR / CATEGORIES_CSV)
        
        # Calculer total stock
        total_quantity = products['quantity'].sum()
        
        # Calculer stock faible (seuil: 20)
        low_stock = len(products[products['quantity'] <= 20])
        
        # Nombre de catégories
        total_categories = len(categories)
        
        # Valeur totale du stock (quantité * prix)
        total_value = (products['quantity'] * products['price']).sum()
        
        return {
            "total_quantity": int(total_quantity),
            "low_stock": int(low_stock),
            "categories": int(total_categories),
            "total_value": float(total_value)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/products")
async def get_all_products():
    """Récupère tous les produits"""
    try:
        products = pd.read_csv(DATA_DIR / PRODUCTS_CSV)
        # Calculer le statut du stock
        result = []
        for _, row in products.iterrows():
            # Déterminer le statut du stock
            if row['quantity'] > row['threshold']:
                status = "Élevé"
            elif row['quantity'] > 10:
                status = "Moyen"
            else:
                status = "Faible"
            result.append({
                'id': f"REF-{str(row['id']).zfill(3)}",
                'name': row['name'],
                'category': row['category'],
                'supplier': row['supplier'],
                'quantity': int(row['quantity']),
                'price': float(row['price']),
                'sales': int(row['sales']),
                'revenue': float(row['revenue']),
                'threshold': row['threshold'],
                'margin': row['margin'],
                'status': status
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    """Supprime un produit"""
    try:
        products = pd.read_csv(DATA_DIR / PRODUCTS_CSV)
        # Extraire l'ID numérique
        numeric_id = int(product_id.replace('REF-', ''))
        products = products[products['id'] != numeric_id]
        products.to_csv(DATA_DIR / PRODUCTS_CSV, index=False)
        return {"success": True, "message": "Produit supprimé"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/products")
async def create_product(product: dict):
    """Ajoute un nouveau produit"""
    try:
        products = pd.read_csv(DATA_DIR / PRODUCTS_CSV)
        
        # Générer nouvel ID
        new_id = products['id'].max() + 1 if len(products) > 0 else 1
        
        # Créer nouveau produit
        new_product = {
            'id': new_id,
            'name': product['name'],
            'category': product['category'],
            'supplier': product['supplier'],
            'quantity': product['quantity'],
            'price': product['price'],
            'threshold': product['threshold'],
            'margin': product['margin'],
            'sales': 0,  # Initialiser à 0
            'revenue': 0.0  # Initialiser à 0
        }
        
        # Ajouter au DataFrame
        products = pd.concat([products, pd.DataFrame([new_product])], ignore_index=True)
        products.to_csv(DATA_DIR / PRODUCTS_CSV, index=False)
        
        return {"success": True, "message": "Produit ajouté", "id": f"REF-{str(new_id).zfill(3)}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/suppliers")
async def get_all_suppliers():
    """Récupère tous les fournisseurs"""
    try:
        suppliers = pd.read_csv(DATA_DIR / SUPPLIERS_CSV)
        return suppliers.to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
