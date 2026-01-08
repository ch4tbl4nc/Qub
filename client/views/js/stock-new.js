// Chargement des données depuis l'API
window.API_URL = window.API_URL || 'http://127.0.0.1:8000';
const API_URL = window.API_URL;
let stockData = [];
let filteredData = [];

// Charger les stats du stock
async function loadStockStats() {
  try {
    const response = await fetch(`${API_URL}/dashboard/stock/stats`);
    const stats = await response.json();

    // Mettre à jour les KPIs
    document.getElementById('stockTotal').textContent = stats.total_quantity.toLocaleString('fr-FR');
    document.getElementById('stockLow').textContent = stats.low_stock;
    document.getElementById('stockCategories').textContent = stats.categories;

    // Formater la valeur
    const valueFormatted = stats.total_value >= 1000000
      ? `€${(stats.total_value / 1000000).toFixed(1)}M`
      : `€${(stats.total_value / 1000).toFixed(0)}k`;
    document.getElementById('stockValue').textContent = valueFormatted;

    // Gérer l'alerte de stock faible
    updateLowStockAlert(stats.low_stock);
  } catch (error) {
    console.error('Erreur lors du chargement des stats:', error);
  }
}

// Mettre à jour l'alerte de stock faible
function updateLowStockAlert(lowStockCount) {
  const alertContainer = document.querySelector('.alerts-container');
  if (!alertContainer) return;

  if (lowStockCount > 0) {
    alertContainer.innerHTML = `
      <div class="alert alert-warning glass-card">
        <span class="alert-icon">⚠️</span>
        <div class="alert-content">
          <strong>${lowStockCount} produit${lowStockCount > 1 ? 's' : ''}</strong> ${lowStockCount > 1 ? 'ont' : 'a'} un stock faible et nécessite${lowStockCount > 1 ? 'nt' : ''} un réapprovisionnement
        </div>
        <button class="alert-close" onclick="this.parentElement.parentElement.style.display='none'">✕</button>
      </div>
    `;
  } else {
    alertContainer.innerHTML = '';
  }
}


async function loadSuppliersToSelect() {
    const selectMenu = document.getElementById('supplierSelect');

    try {
        // 1. Récupérer TOUS les contrats
        const response = await fetch(`${API_URL}/history/contracts`);
        if (!response.ok) throw new Error('Erreur réseau');
        
        const contracts = await response.json();

        // 2. Extraire uniquement les noms des suppliers
        // On utilise map() pour avoir une liste de noms, puis new Set() pour dédoublonner
        const allSuppliers = contracts.map(contrat => contrat.supplier);
        const uniqueSuppliers = [...new Set(allSuppliers)]; // Conversion du Set en Array

        // 3. Vider le select et ajouter l'option par défaut
        selectMenu.innerHTML = '<option value="">Sélectionnez un fournisseur</option>';

        // 4. Ajouter chaque supplier unique dans le select
        uniqueSuppliers.sort().forEach(supplierName => {
            // new Option(text, value)
            // Ici le texte affiché et la valeur envoyée sont identiques
            const option = new Option(supplierName, supplierName);
            selectMenu.add(option);
        });

        console.log(`${uniqueSuppliers.length} fournisseurs chargés.`);

    } catch (error) {
        console.error("Erreur lors du chargement des fournisseurs:", error);
        selectMenu.innerHTML = '<option value="">Erreur de chargement</option>';
    }
}

// Charger les produits depuis l'API
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/dashboard/products`);
    stockData = await response.json();
    filteredData = [...stockData];
    renderTable();
    updateStats();
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
    notify.error('Impossible de charger les produits');
  }
}

// Fonction pour afficher le tableau
function renderTable() {
  const tbody = document.querySelector('.stock-table tbody');
  if (!tbody) return;

  if (filteredData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8;">Aucun produit trouvé</td></tr>';
    return;
  }

  tbody.innerHTML = filteredData.map(product => {
    const statusClass = product.status === 'Élevé' ? 'success' :
      product.status === 'Moyen' ? 'warning' : 'error';

    return `
      <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>€${product.price.toFixed(2)}</td>
        <td>${product.quantity}</td>
        <td>${product.supplier}</td>
        <td><span class="status-badge ${statusClass}">${product.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon btn-edit" onclick="editProduct('${product.id}')" title="Modifier">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
            <button class="btn-icon btn-delete" onclick="deleteProduct('${product.id}')" title="Supprimer">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Fonction de recherche
function searchProducts() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  const searchTerm = searchInput.value.toLowerCase();
  filteredData = stockData.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.id.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.supplier.toLowerCase().includes(searchTerm)
  );
  renderTable();
}

// Fonction de filtrage par catégorie
function filterByCategory() {
  const categorySelect = document.getElementById('categoryFilter');
  if (!categorySelect) return;

  const category = categorySelect.value;
  if (category === 'all') {
    filteredData = [...stockData];
  } else {
    filteredData = stockData.filter(product => product.category === category);
  }
  renderTable();
}

// Fonction de filtrage par fournisseur
function filterBySupplier() {
  const supplierSelect = document.getElementById('supplierFilter');
  if (!supplierSelect) return;

  const supplier = supplierSelect.value;
  if (supplier === 'all') {
    filteredData = [...stockData];
  } else {
    filteredData = stockData.filter(product => product.supplier === supplier);
  }
  renderTable();
}

// Fonction de filtrage par stock
function filterByStock() {
  const stockSelect = document.getElementById('stockFilter');
  if (!stockSelect) return;

  const stockLevel = stockSelect.value;
  if (stockLevel === 'all') {
    filteredData = [...stockData];
  } else {
    filteredData = stockData.filter(product => product.status === stockLevel);
  }
  renderTable();
}

// Mettre à jour les statistiques
function updateStats() {
  const totalProducts = stockData.reduce((sum, p) => sum + p.quantity, 0);
  const totalCategories = new Set(stockData.map(p => p.category)).size;
  const totalValue = stockData.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  const statsElements = document.querySelectorAll('.kpi-value');
  if (statsElements[0]) statsElements[0].textContent = stockData.length;
  if (statsElements[1]) statsElements[1].textContent = totalProducts.toLocaleString('fr-FR');
  if (statsElements[2]) statsElements[2].textContent = totalCategories;
  if (statsElements[3]) statsElements[3].textContent = `€${totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 0 })}k`;
}

const modal = document.getElementById('productModal');

function openModal(productId = null) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (productId) {
    const product = stockData.find(p => p.id === productId);
    document.getElementById('modalTitle').textContent = 'Modifier le produit';
    document.getElementById('productName').value = product.name;
    document.getElementById('productId').value = product.id;
    document.getElementById('productRef').value = product.id;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('supplierSelect').value = product.supplier;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productMargin').value = product.margin;
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

const closeBtn = document.getElementById('closeModal');

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Fonction pour modifier un produit
function editProduct(id) {
  const product = stockData.find(p => p.id === id);
  if (product) {
    openModal(product.id);
  }
}




// Fonction pour supprimer un produit
async function deleteProduct(id) {
  const product = stockData.find(p => p.id === id);
  if (!product) return;

  confirmDialog(
    `Êtes-vous sûr de vouloir supprimer ${product.name} ?`,
    async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard/products/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          notify.success('Produit supprimé avec succès');
          await loadProducts(); // Recharger la liste
        } else {
          notify.error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur:', error);
        notify.error('Impossible de supprimer le produit');
      }
    }
  );
}

const form = document.getElementById('addProductForm');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const productData = {
    id: document.getElementById('productRef').value.trim(),
    name: document.getElementById('productName').value.trim(),
    category: document.getElementById('productCategory').value.trim(),
    supplier: document.getElementById('supplierSelect').value,
    margin: Number.parseFloat(document.getElementById('productMargin').value),
    price: Number.parseFloat(document.getElementById('productPrice').value),
    quantity: Number.parseInt(document.getElementById('productQuantity').value),
    threshold: Number.parseInt(document.getElementById('productThreshold').value)
  };

  try {
    const response = await fetch(`${API_URL}/dashboard/products/${document.getElementById('productId').value}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await loadProducts(); // Recharger la liste
    } else {
      notify.error('Erreur lors de la modification');
    }
  } catch (error) {
    console.error('Erreur:', error);
    notify.error('Impossible de modifier le produit');
  }

  console.log(productData)

  try {
    const response = await fetch('http://127.0.0.1:8000/dashboard/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    if (response.ok) {
      const result = await response.json();
      notify.success('Produit modifier avec succès !');

      // Rediriger après 1.5 secondes
      setTimeout(() => {
        window.location.href = 'stock.html';
      }, 1500);
    } else {
      notify.error('Erreur lors de la modification du produit');
    }
  } catch (error) {
    console.error('Erreur:', error);
    notify.error('Impossible de communiquer avec le serveur');
  }
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  // Attacher les événements de recherche et filtrage
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', searchProducts);
  }

  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterByCategory);
  }

  const supplierFilter = document.getElementById('supplierFilter');
  if (supplierFilter) {
    supplierFilter.addEventListener('change', filterBySupplier);
  }

  const stockFilter = document.getElementById('stockFilter');
  if (stockFilter) {
    stockFilter.addEventListener('change', filterByStock);
  }

  // Gestion du menu mobile
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (sidebar && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });

  // Charger les données
  loadStockStats();
  loadProducts();
  loadSuppliersToSelect()
});
