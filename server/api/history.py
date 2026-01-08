from fastapi import APIRouter, HTTPException
import pandas as pd
from pathlib import Path

router = APIRouter()
DATA_DIR = Path(__file__).parent.parent / "data"

# Constantes pour les noms de fichiers
CONTRACTS_CSV = "contracts.csv"
ORDERS_CSV = "orders.csv"
ORDER_ITEMS_CSV = "order_items.csv"
CONTRACT_PRODUCTS_CSV = "contract_products.csv"
PRODUCTS_CSV = "products.csv"

@router.get("/contracts/stats")
async def get_contract_stats():
    """Récupère les statistiques des contrats"""
    try:
        contracts = pd.read_csv(DATA_DIR / CONTRACTS_CSV)
        
        # Calculer les stats
        total_active = len(contracts[contracts['status'] == 'active'])
        total_expiring = len(contracts[contracts['status'] == 'expiring'])
        total_value = contracts['value'].sum()
        
        return {
            "active": int(total_active),
            "expiring": int(total_expiring),
            "total_value": float(total_value)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/orders")
async def get_orders():
    """Récupère toutes les commandes avec leurs produits"""
    try:
        orders = pd.read_csv(DATA_DIR / ORDERS_CSV)
        order_items = pd.read_csv(DATA_DIR / ORDER_ITEMS_CSV)
        
        result = []
        for _, order in orders.iterrows():
            # Récupérer les produits de cette commande
            items = order_items[order_items['order_id'] == order['id']]
            products = []
            for _, item in items.iterrows():
                products.append({
                    'product_id': int(item['product_id']),
                    'name': item['product_name'],
                    'quantity': int(item['quantity']),
                    'unit_price': float(item['unit_price'])
                })
            
            result.append({
                'id': order['id'],
                'customer': order['customer'],
                'date': order['date'],
                'total': float(order['total']),
                'status': order['status'],
                'products': products
            })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/orders")
async def create_order(order: dict):
    """Crée une nouvelle commande"""
    try:
        orders = pd.read_csv(DATA_DIR / ORDERS_CSV)
        order_items = pd.read_csv(DATA_DIR / ORDER_ITEMS_CSV)
        
        # Générer nouvel ID
        new_id = f"CMD-{str(len(orders) + 1).zfill(3)}"
        
        # Créer la commande
        new_order = {
            'id': new_id,
            'customer': order['customer'],
            'date': order['date'],
            'total': order['total'],
            'status': order.get('status', 'En cours')
        }
        
        orders = pd.concat([orders, pd.DataFrame([new_order])], ignore_index=True)
        orders.to_csv(DATA_DIR / ORDERS_CSV, index=False)
        
        # Ajouter les produits
        for product in order.get('products', []):
            new_item = {
                'order_id': new_id,
                'product_id': product['product_id'],
                'product_name': product['name'],
                'quantity': product['quantity'],
                'unit_price': product['unit_price']
            }
            order_items = pd.concat([order_items, pd.DataFrame([new_item])], ignore_index=True)
        
        order_items.to_csv(DATA_DIR / ORDER_ITEMS_CSV, index=False)
        
        return {"success": True, "message": "Commande créée", "id": new_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/contracts")
async def get_contracts():
    """Récupère tous les contrats avec leurs produits"""
    try:
        contracts = pd.read_csv(DATA_DIR / CONTRACTS_CSV)
        contract_products = pd.read_csv(DATA_DIR / CONTRACT_PRODUCTS_CSV)
        
        result = []
        for _, contract in contracts.iterrows():
            # Récupérer les produits de ce contrat
            products_df = contract_products[contract_products['contract_id'] == contract['id']]
            products = []
            for _, prod in products_df.iterrows():
                products.append({
                    'name': prod['product_name'],
                    'purchase_price': float(prod['purchase_price']),
                    'sale_price': float(prod['sale_price']),
                    'margin': float(prod['margin_percent'])
                })
            
            result.append({
                'id': contract['id'],
                'supplier': contract['supplier'],
                'start_date': contract['start_date'],
                'end_date': contract['end_date'],
                'duration': f"{int(contract['duration_months'])} mois",
                'status': contract['status'],
                'value': float(contract['value']),
                'products': products
            })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/contracts")
async def create_contract(contract: dict):
    """Crée un nouveau contrat"""
    try:
        contracts = pd.read_csv(DATA_DIR / "contracts.csv")
        contract_products = pd.read_csv(DATA_DIR / "contract_products.csv")
        
        # Générer nouvel ID
        new_id = f"CNT-{str(len(contracts) + 1).zfill(3)}"
        
        # Créer le contrat
        new_contract = {
            'id': new_id,
            'supplier': contract['supplier'],
            'start_date': contract['start_date'],
            'end_date': contract['end_date'],
            'duration_months': contract['duration_months'],
            'status': contract.get('status', 'active'),
            'value': contract['value']
        }
        
        contracts = pd.concat([contracts, pd.DataFrame([new_contract])], ignore_index=True)
        contracts.to_csv(DATA_DIR / CONTRACTS_CSV, index=False)
        
        # Ajouter les produits
        for product in contract.get('products', []):
            new_product = {
                'contract_id': new_id,
                'product_name': product['name'],
                'purchase_price': product['purchase_price'],
                'sale_price': product['sale_price'],
                'margin_percent': product['margin']
            }
            contract_products = pd.concat([contract_products, pd.DataFrame([new_product])], ignore_index=True)
        
        contract_products.to_csv(DATA_DIR / CONTRACT_PRODUCTS_CSV, index=False)
        
        return {"success": True, "message": "Contrat créé", "id": new_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
