// Données de démonstration
const stockData = [
  {
    id: 'REF-001',
    name: 'iPhone 15 Pro',
    category: 'Électronique',
    price: 1199.99,
    quantity: 45,
    supplier: 'TechCorp',
    threshold: 10
  },
  {
    id: 'REF-002',
    name: 'MacBook Air M2',
    category: 'Informatique',
    price: 1399.99,
    quantity: 23,
    supplier: 'TechCorp',
    threshold: 10
  },
  {
    id: 'REF-003',
    name: 'AirPods Pro',
    category: 'Audio',
    price: 279.99,
    quantity: 8,
    supplier: 'ElectroPlus',
    threshold: 10
  },
  {
    id: 'REF-004',
    name: 'iPad Pro 12.9"',
    category: 'Électronique',
    price: 1299.99,
    quantity: 15,
    supplier: 'TechCorp',
    threshold: 10
  },
  {
    id: 'REF-005',
    name: 'Magic Keyboard',
    category: 'Accessoires',
    price: 149.99,
    quantity: 5,
    supplier: 'MegaDistrib',
    threshold: 10
  },
  {
    id: 'REF-006',
    name: 'Samsung Galaxy S24',
    category: 'Électronique',
    price: 899.99,
    quantity: 32,
    supplier: 'ElectroPlus',
    threshold: 10
  },
  {
    id: 'REF-007',
    name: 'Dell XPS 15',
    category: 'Informatique',
    price: 1899.99,
    quantity: 12,
    supplier: 'MegaDistrib',
    threshold: 10
  },
  {
    id: 'REF-008',
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    price: 399.99,
    quantity: 28,
    supplier: 'ElectroPlus',
    threshold: 10
  }
];

let filteredData = [...stockData];

// Rendu de la table
function renderTable(data = filteredData) {
  const tbody = document.getElementById('stockTableBody');
  
  tbody.innerHTML = data.map(product => {
    const stockStatus = getStockStatus(product.quantity, product.threshold);
    
    return `
      <tr data-id="${product.id}">
        <td><span class="product-id">${product.id}</span></td>
        <td><span class="product-name">${product.name}</span></td>
        <td>${product.category}</td>
        <td>€${product.price.toFixed(2)}</td>
        <td>${product.quantity}</td>
        <td>${product.supplier}</td>
        <td>
          <div class="stock-status">
            <span class="stock-indicator ${stockStatus.class}"></span>
            <span>${stockStatus.text}</span>
          </div>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn-secondary btn-icon edit-btn" title="Modifier">✏️</button>
            <button class="btn btn-danger btn-icon delete-btn" title="Supprimer">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  attachTableEventListeners();
}

// Déterminer le statut du stock
function getStockStatus(quantity, threshold) {
  if (quantity <= threshold) {
    return { class: 'low', text: 'Faible' };
  } else if (quantity <= threshold * 2) {
    return { class: 'medium', text: 'Moyen' };
  } else {
    return { class: 'high', text: 'Élevé' };
  }
}

// Filtrage
function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const supplier = document.getElementById('supplierFilter').value;
  const stockLevel = document.getElementById('stockFilter').value;
  
  filteredData = stockData.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm) || 
                       product.id.toLowerCase().includes(searchTerm);
    const matchCategory = !category || product.category.toLowerCase() === category;
    const matchSupplier = !supplier || product.supplier.toLowerCase() === supplier;
    
    let matchStock = true;
    if (stockLevel === 'low') {
      matchStock = product.quantity <= product.threshold;
    } else if (stockLevel === 'medium') {
      matchStock = product.quantity > product.threshold && product.quantity <= product.threshold * 2;
    } else if (stockLevel === 'high') {
      matchStock = product.quantity > product.threshold * 2;
    }
    
    return matchSearch && matchCategory && matchSupplier && matchStock;
  });
  
  renderTable(filteredData);
}

// Event listeners pour les filtres
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('categoryFilter').addEventListener('change', applyFilters);
document.getElementById('supplierFilter').addEventListener('change', applyFilters);
document.getElementById('stockFilter').addEventListener('change', applyFilters);

// Modal
const modal = document.getElementById('productModal');
const closeBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const productForm = document.getElementById('productForm');

function openModal(productId = null) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  if (productId) {
    const product = stockData.find(p => p.id === productId);
    document.getElementById('modalTitle').textContent = 'Modifier le produit';
    document.getElementById('productName').value = product.name;
    document.getElementById('productRef').value = product.id;
    document.getElementById('productCategory').value = product.category.toLowerCase();
    document.getElementById('productSupplier').value = product.supplier.toLowerCase();
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productQuantity').value = product.quantity;
    document.getElementById('productThreshold').value = product.threshold;
  } else {
    document.getElementById('modalTitle').textContent = 'Ajouter un produit';
    productForm.reset();
  }
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  productForm.reset();
}

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

// Soumission du formulaire
productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = {
    id: document.getElementById('productRef').value,
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').options[document.getElementById('productCategory').selectedIndex].text,
    price: parseFloat(document.getElementById('productPrice').value),
    quantity: parseInt(document.getElementById('productQuantity').value),
    supplier: document.getElementById('productSupplier').options[document.getElementById('productSupplier').selectedIndex].text,
    threshold: parseInt(document.getElementById('productThreshold').value)
  };
  
  const existingIndex = stockData.findIndex(p => p.id === formData.id);
  
  if (existingIndex >= 0) {
    stockData[existingIndex] = formData;
  } else {
    stockData.push(formData);
  }
  
  closeModal();
  applyFilters();
  
  // Afficher une notification de succès
  showNotification('Produit enregistré avec succès!', 'success');
});

// Event listeners pour les actions de la table
function attachTableEventListeners() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      const productId = row.dataset.id;
      openModal(productId);
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      confirmDialog(
        'Êtes-vous sûr de vouloir supprimer ce produit ?',
        () => {
          const row = e.target.closest('tr');
          const productId = row.dataset.id;
          const index = stockData.findIndex(p => p.id === productId);
          
          if (index >= 0) {
            stockData.splice(index, 1);
            applyFilters();
            notify.success('Produit supprimé avec succès!');
          }
        }
      );
    });
  });
}

// Notification simple
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} glass-card`;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '9999';
  notification.style.minWidth = '300px';
  
  notification.innerHTML = `
    <span class="alert-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
    <div class="alert-content">${message}</div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Fermeture des alertes
document.querySelectorAll('.alert-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.alert').remove();
  });
});

// Initialisation
renderTable();
