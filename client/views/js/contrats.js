// Données de démonstration
const contractsData = [
  {
    id: 'CNT-2024-001',
    supplier: 'TechCorp',
    startDate: '2024-01-15',
    duration: '24 mois',
    endDate: '2026-01-15',
    status: 'active',
    value: 450000,
    products: [
      { name: 'iPhone 15 Pro', purchasePrice: 950, salePrice: 1199.99, margin: 26.3 },
      { name: 'MacBook Air M2', purchasePrice: 1100, salePrice: 1399.99, margin: 27.3 },
      { name: 'iPad Pro 12.9"', purchasePrice: 1050, salePrice: 1299.99, margin: 23.8 },
      { name: 'Apple Watch Ultra', purchasePrice: 650, salePrice: 849.99, margin: 30.8 }
    ]
  },
  {
    id: 'CNT-2024-002',
    supplier: 'ElectroPlus',
    startDate: '2024-03-01',
    duration: '18 mois',
    endDate: '2025-09-01',
    status: 'active',
    value: 320000,
    products: [
      { name: 'AirPods Pro', purchasePrice: 210, salePrice: 279.99, margin: 33.3 },
      { name: 'Samsung Galaxy S24', purchasePrice: 720, salePrice: 899.99, margin: 25.0 },
      { name: 'Sony WH-1000XM5', purchasePrice: 310, salePrice: 399.99, margin: 29.0 }
    ]
  },
  {
    id: 'CNT-2024-003',
    supplier: 'MegaDistrib',
    startDate: '2023-06-01',
    duration: '36 mois',
    endDate: '2026-06-01',
    status: 'active',
    value: 580000,
    products: [
      { name: 'Dell XPS 15', purchasePrice: 1550, salePrice: 1899.99, margin: 22.6 },
      { name: 'Magic Keyboard', purchasePrice: 115, salePrice: 149.99, margin: 30.4 },
      { name: 'Logitech MX Master', purchasePrice: 75, salePrice: 99.99, margin: 33.3 }
    ]
  },
  {
    id: 'CNT-2023-015',
    supplier: 'GlobalSupply',
    startDate: '2023-02-01',
    duration: '12 mois',
    endDate: '2025-02-01',
    status: 'expiring',
    value: 180000,
    products: [
      { name: 'HP Pavilion', purchasePrice: 650, salePrice: 799.99, margin: 23.1 },
      { name: 'Lenovo ThinkPad', purchasePrice: 980, salePrice: 1199.99, margin: 22.5 }
    ]
  },
  {
    id: 'CNT-2023-008',
    supplier: 'SmartTech',
    startDate: '2023-01-01',
    duration: '12 mois',
    endDate: '2024-01-01',
    status: 'expired',
    value: 95000,
    products: [
      { name: 'Xiaomi Mi Band', purchasePrice: 35, salePrice: 49.99, margin: 42.9 },
      { name: 'Google Nest Hub', purchasePrice: 75, salePrice: 99.99, margin: 33.3 }
    ]
  },
  {
    id: 'CNT-2024-004',
    supplier: 'AudioPro',
    startDate: '2024-04-15',
    duration: '24 mois',
    endDate: '2026-04-15',
    status: 'active',
    value: 275000,
    products: [
      { name: 'Bose QuietComfort', purchasePrice: 280, salePrice: 349.99, margin: 25.0 },
      { name: 'JBL Flip 6', purchasePrice: 95, salePrice: 129.99, margin: 36.9 },
      { name: 'Sonos One', purchasePrice: 165, salePrice: 219.99, margin: 33.3 }
    ]
  },
  {
    id: 'CNT-2023-022',
    supplier: 'CompuWorld',
    startDate: '2023-09-01',
    duration: '18 mois',
    endDate: '2025-03-01',
    status: 'expiring',
    value: 420000,
    products: [
      { name: 'ASUS ROG Laptop', purchasePrice: 1650, salePrice: 1999.99, margin: 21.2 },
      { name: 'MSI Gaming Monitor', purchasePrice: 380, salePrice: 499.99, margin: 31.6 }
    ]
  },
  {
    id: 'CNT-2024-005',
    supplier: 'MobileStore',
    startDate: '2024-05-01',
    duration: '12 mois',
    endDate: '2025-05-01',
    status: 'expiring',
    value: 210000,
    products: [
      { name: 'OnePlus 12', purchasePrice: 580, salePrice: 749.99, margin: 29.3 },
      { name: 'Google Pixel 8', purchasePrice: 550, salePrice: 699.99, margin: 27.3 }
    ]
  }
];

let filteredContracts = [...contractsData];

// Rendu des contrats
function renderContracts(data = filteredContracts) {
  const grid = document.getElementById('contractsGrid');
  
  grid.innerHTML = data.map(contract => {
    const daysUntilExpiry = getDaysUntilExpiry(contract.endDate);
    const productsToShow = contract.products.slice(0, 3);
    const remainingProducts = contract.products.length - 3;
    
    return `
      <div class="contract-card" data-contract-id="${contract.id}">
        <div class="contract-header">
          <div>
            <div class="contract-id">${contract.id}</div>
            <div class="contract-supplier">${contract.supplier}</div>
          </div>
          <span class="contract-status-badge ${contract.status}">${getStatusText(contract.status)}</span>
        </div>
        
        <div class="contract-info">
          <div class="info-row">
            <span class="info-label">Durée</span>
            <span class="info-value">${contract.duration}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Fin du contrat</span>
            <span class="info-value">${formatDate(contract.endDate)}</span>
          </div>
          ${contract.status === 'expiring' ? `
            <div class="info-row">
              <span class="info-label">⚠️ Expire dans</span>
              <span class="info-value" style="color: var(--warning-color);">${daysUntilExpiry} jours</span>
            </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label">Valeur</span>
            <span class="info-value" style="color: var(--primary-light); font-weight: 700;">€${(contract.value / 1000).toFixed(0)}k</span>
          </div>
        </div>
        
        <div class="contract-products">
          <div class="products-title">
            Produits
            <span class="products-count">${contract.products.length}</span>
          </div>
          <div class="products-preview">
            ${productsToShow.map(p => `
              <div class="product-preview-item">${p.name}</div>
            `).join('')}
          </div>
          ${remainingProducts > 0 ? `
            <div class="products-more">+${remainingProducts} autre${remainingProducts > 1 ? 's' : ''} produit${remainingProducts > 1 ? 's' : ''}</div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
  
  attachContractClickListeners();
}

// Calcul jours avant expiration
function getDaysUntilExpiry(endDate) {
  const today = new Date();
  const expiry = new Date(endDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Formatage de date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Texte du statut
function getStatusText(status) {
  const statusTexts = {
    'active': 'Actif',
    'expiring': 'À renouveler',
    'expired': 'Expiré'
  };
  return statusTexts[status] || status;
}

// Filtrage et tri
function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const sortFilter = document.getElementById('sortFilter').value;
  
  // Filtrage
  filteredContracts = contractsData.filter(contract => {
    const matchSearch = contract.id.toLowerCase().includes(searchTerm) ||
                       contract.supplier.toLowerCase().includes(searchTerm);
    const matchStatus = !statusFilter || contract.status === statusFilter;
    
    return matchSearch && matchStatus;
  });
  
  // Tri
  filteredContracts.sort((a, b) => {
    switch (sortFilter) {
      case 'date-desc':
        return new Date(b.startDate) - new Date(a.startDate);
      case 'date-asc':
        return new Date(a.startDate) - new Date(b.startDate);
      case 'value-desc':
        return b.value - a.value;
      case 'value-asc':
        return a.value - b.value;
      default:
        return 0;
    }
  });
  
  renderContracts(filteredContracts);
}

document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('statusFilter').addEventListener('change', applyFilters);
document.getElementById('sortFilter').addEventListener('change', applyFilters);

// Modal détails contrat
const contractModal = document.getElementById('contractModal');

function openContractModal(contractId) {
  const contract = contractsData.find(c => c.id === contractId);
  if (!contract) return;
  
  const totalMargin = contract.products.reduce((sum, p) => sum + p.margin, 0) / contract.products.length;
  
  document.getElementById('contractModalTitle').textContent = `Contrat ${contract.id}`;
  document.getElementById('contractModalBody').innerHTML = `
    <div class="contract-details">
      <div class="detail-section">
        <h3 class="detail-title">📋 Informations générales</h3>
        <div class="detail-grid">
          <div class="detail-item">
            <div class="detail-label">Numéro de contrat</div>
            <div class="detail-value">${contract.id}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Fournisseur</div>
            <div class="detail-value">${contract.supplier}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Date de début</div>
            <div class="detail-value">${formatDate(contract.startDate)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Date de fin</div>
            <div class="detail-value">${formatDate(contract.endDate)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Durée</div>
            <div class="detail-value">${contract.duration}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Statut</div>
            <div class="detail-value">
              <span class="contract-status-badge ${contract.status}">${getStatusText(contract.status)}</span>
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Valeur totale</div>
            <div class="detail-value" style="color: var(--primary-light); font-weight: 700; font-size: var(--font-size-lg);">
              €${contract.value.toLocaleString()}
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Marge moyenne</div>
            <div class="detail-value" style="color: var(--success-color); font-weight: 700;">
              ${totalMargin.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3 class="detail-title">📦 Produits et marges (${contract.products.length})</h3>
        <table class="products-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Prix d'achat</th>
              <th>Prix de vente</th>
              <th>Marge</th>
            </tr>
          </thead>
          <tbody>
            ${contract.products.map(product => `
              <tr>
                <td><strong>${product.name}</strong></td>
                <td>€${product.purchasePrice.toFixed(2)}</td>
                <td>€${product.salePrice.toFixed(2)}</td>
                <td>
                  <span class="margin-badge ${getMarginClass(product.margin)}">
                    ${product.margin.toFixed(1)}%
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  contractModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function getMarginClass(margin) {
  if (margin >= 30) return 'high';
  if (margin >= 20) return 'medium';
  return 'low';
}

function closeContractModal() {
  contractModal.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('closeContractModal').addEventListener('click', closeContractModal);
contractModal.querySelector('.modal-overlay').addEventListener('click', closeContractModal);

// Event listeners pour ouvrir les détails
function attachContractClickListeners() {
  document.querySelectorAll('.contract-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const contractId = e.currentTarget.dataset.contractId;
      openContractModal(contractId);
    });
  });
}

// ==================== MODAL AJOUTER CONTRAT ====================

const addContractModal = document.getElementById('addContractModal');

function openAddContractModal() {
  addContractModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAddContractModal() {
  addContractModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Bouton nouveau contrat
document.getElementById('addContractBtn').addEventListener('click', openAddContractModal);
document.getElementById('closeAddContractModal').addEventListener('click', closeAddContractModal);
document.getElementById('cancelAddContractBtn').addEventListener('click', closeAddContractModal);
addContractModal.querySelector('.modal-overlay').addEventListener('click', closeAddContractModal);

// Soumission du formulaire
document.getElementById('addContractForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const duration = document.getElementById('newContractDuration').value;
  const startDate = new Date(document.getElementById('newContractStartDate').value);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + parseInt(duration));
  
  const newContract = {
    id: document.getElementById('newContractId').value,
    supplier: document.getElementById('newContractSupplier').value,
    startDate: document.getElementById('newContractStartDate').value,
    duration: duration + ' mois',
    endDate: endDate.toISOString().split('T')[0],
    status: document.getElementById('newContractStatus').value,
    value: 0,
    products: []
  };
  
  contractsData.push(newContract);
  applyFilters();
  
  console.log('Nouveau contrat créé:', newContract);
  notify.success('Contrat créé avec succès !');
  
  closeAddContractModal();
  this.reset();
});

// Initialisation
renderContracts();
