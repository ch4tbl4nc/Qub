document.addEventListener('DOMContentLoaded', function() {
  
  // Éléments du formulaire
  const purchasePriceInput = document.getElementById('productPurchasePrice');
  const marginInput = document.getElementById('productMargin');
  const salePriceInput = document.getElementById('productPrice');
  const profitDisplay = document.getElementById('profitDisplay');
  
  // Éléments de l'aperçu
  const previewRef = document.getElementById('previewRef');
  const previewName = document.getElementById('previewName');
  const previewCategory = document.getElementById('previewCategory');
  const previewSupplier = document.getElementById('previewSupplier');
  const previewPurchase = document.getElementById('previewPurchase');
  const previewMargin = document.getElementById('previewMargin');
  const previewPrice = document.getElementById('previewPrice');
  const previewProfit = document.getElementById('previewProfit');
  const previewQuantity = document.getElementById('previewQuantity');
  const previewThreshold = document.getElementById('previewThreshold');
  
  // Fonction de calcul du prix de vente
  function calculateSalePrice() {
    const purchasePrice = parseFloat(purchasePriceInput.value) || 0;
    const margin = parseFloat(marginInput.value) || 0;
    
    // Formule : Prix de vente = Prix d'achat × (1 + Marge/100)
    const salePrice = purchasePrice * (1 + margin / 100);
    const profit = salePrice - purchasePrice;
    
    // Mettre à jour les champs
    salePriceInput.value = salePrice.toFixed(2);
    profitDisplay.textContent = '€' + profit.toFixed(2);
    
    // Mettre à jour l'aperçu
    previewPurchase.textContent = '€' + purchasePrice.toFixed(2);
    previewMargin.textContent = margin.toFixed(1) + '%';
    previewPrice.textContent = '€' + salePrice.toFixed(2);
    previewProfit.textContent = '€' + profit.toFixed(2);
    
    // Animation visuelle
    salePriceInput.style.animation = 'none';
    setTimeout(() => {
      salePriceInput.style.animation = 'pulse 0.5s ease-out';
    }, 10);
  }
  
  // Event listeners pour le calcul automatique
  purchasePriceInput.addEventListener('input', calculateSalePrice);
  marginInput.addEventListener('input', calculateSalePrice);
  
  // Mise à jour de l'aperçu en temps réel
  document.getElementById('productRef').addEventListener('input', function(e) {
    previewRef.textContent = e.target.value || '-';
  });
  
  document.getElementById('productName').addEventListener('input', function(e) {
    previewName.textContent = e.target.value || '-';
  });
  
  document.getElementById('productCategory').addEventListener('input', function(e) {
    previewCategory.textContent = e.target.value || '-';
  });
  
  document.getElementById('productSupplier').addEventListener('change', function(e) {
    previewSupplier.textContent = e.target.value || '-';
  });
  
  document.getElementById('productQuantity').addEventListener('input', function(e) {
    previewQuantity.textContent = e.target.value || '0';
  });
  
  document.getElementById('productThreshold').addEventListener('input', function(e) {
    previewThreshold.textContent = e.target.value || '10';
  });
  
  // Soumission du formulaire
  const form = document.getElementById('addProductForm');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const productData = {
      id: document.getElementById('productRef').value.trim(),
      name: document.getElementById('productName').value.trim(),
      category: document.getElementById('productCategory').value.trim(),
      supplier: document.getElementById('productSupplier').value,
      purchasePrice: parseFloat(document.getElementById('productPurchasePrice').value),
      margin: parseFloat(document.getElementById('productMargin').value),
      price: parseFloat(document.getElementById('productPrice').value),
      quantity: parseInt(document.getElementById('productQuantity').value),
      threshold: parseInt(document.getElementById('productThreshold').value)
    };
    
    // Validation
    if (!productData.id || !productData.name || !productData.category || !productData.supplier) {
      showNotification('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    
    if (productData.purchasePrice <= 0 || productData.price <= 0) {
      showNotification('Les prix doivent être supérieurs à 0', 'error');
      return;
    }
    
    if (productData.quantity < 0 || productData.threshold <= 0) {
      showNotification('Les quantités doivent être positives', 'error');
      return;
    }
    
    // Sauvegarder le produit (à connecter avec votre backend)
    console.log('Produit à ajouter:', productData);
    
    // Afficher une notification de succès
    showNotification('Produit ajouté avec succès !', 'success');
    
    // Rediriger vers la page de stock après 2 secondes
    setTimeout(() => {
      window.location.href = 'stock.html';
    }, 2000);
  });
  
  // Fonction de notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} glass-card`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    
    notification.innerHTML = `
      <span class="alert-icon">${icon}</span>
      <div class="alert-content">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // Animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
  `;
  document.head.appendChild(style);
});
