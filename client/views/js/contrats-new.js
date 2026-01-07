// Configuration API
window.API_URL = window.API_URL || 'http://127.0.0.1:8000';
const API_URL = window.API_URL;

let contractsData = [];
let filteredContracts = [];

// Charger les stats des contrats
async function loadContractStats() {
  try {
    const response = await fetch(`${API_URL}/history/contracts/stats`);
    const stats = await response.json();
    
    // Mettre à jour les KPIs
    document.getElementById('contractsActive').textContent = stats.active;
    document.getElementById('contractsExpiring').textContent = stats.expiring;
    
    // Formater la valeur
    const valueFormatted = stats.total_value >= 1000000 
      ? `€${(stats.total_value / 1000000).toFixed(1)}M`
      : `€${(stats.total_value / 1000).toFixed(0)}k`;
    document.getElementById('contractsValue').textContent = valueFormatted;
  } catch (error) {
    console.error('Erreur lors du chargement des stats:', error);
  }
}

// Charger les contrats depuis l'API
async function loadContracts() {
  try {
    const response = await fetch(`${API_URL}/history/contracts`);
    contractsData = await response.json();
    filteredContracts = [...contractsData];
    renderContracts();
  } catch (error) {
    console.error('Erreur lors du chargement des contrats:', error);
    notify.error('Impossible de charger les contrats');
  }
}

// Afficher les contrats
function renderContracts() {
  const container = document.querySelector('.contracts-grid');
  if (!container) return;

  if (filteredContracts.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: #94a3b8;">Aucun contrat trouvé</div>';
    return;
  }

  container.innerHTML = filteredContracts.map(contract => {
    const statusClass = contract.status === 'active' ? 'success' : 
                       contract.status === 'expiring' ? 'warning' : 'error';
    const statusText = contract.status === 'active' ? 'Actif' :
                      contract.status === 'expiring' ? 'Expire bientôt' : 'Expiré';
    
    const productsHtml = contract.products.map(p =>
      `<div class="product-row">
        <span class="product-name">${p.name}</span>
        <span class="product-prices">
          <span class="purchase">Achat: €${p.purchase_price}</span>
          <span class="sale">Vente: €${p.sale_price}</span>
          <span class="margin ${p.margin > 30 ? 'high' : 'normal'}">
            Marge: ${p.margin.toFixed(1)}%
          </span>
        </span>
      </div>`
    ).join('');

    return `
      <div class="contract-card glass-card">
        <div class="card-header">
          <div>
            <h3 class="contract-id">${contract.id}</h3>
            <p class="contract-supplier">${contract.supplier}</p>
          </div>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="card-content">
          <div class="contract-info">
            <div class="info-row">
              <span class="label">Début:</span>
              <span class="value">${formatDate(contract.start_date)}</span>
            </div>
            <div class="info-row">
              <span class="label">Fin:</span>
              <span class="value">${formatDate(contract.end_date)}</span>
            </div>
            <div class="info-row">
              <span class="label">Durée:</span>
              <span class="value">${contract.duration}</span>
            </div>
            <div class="info-row">
              <span class="label">Valeur:</span>
              <span class="value">€${contract.value.toLocaleString('fr-FR')}</span>
            </div>
          </div>
          <div class="products-section">
            <h4>Produits (${contract.products.length})</h4>
            <div class="products-list">
              ${productsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Formater la date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Filtrer les contrats
function filterContracts() {
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const status = document.getElementById('statusFilter')?.value || '';
  
  filteredContracts = contractsData.filter(contract => {
    const matchSearch = contract.id.toLowerCase().includes(search) ||
                       contract.supplier.toLowerCase().includes(search);
    const matchStatus = !status || contract.status === status;
    
    return matchSearch && matchStatus;
  });
  
  renderContracts();
}

// Event listeners
document.getElementById('searchInput')?.addEventListener('input', filterContracts);
document.getElementById('statusFilter')?.addEventListener('change', filterContracts);

// Modal pour créer un contrat
function openAddContractModal() {
  // À implémenter si besoin
  notify.info('Fonctionnalité en cours de développement');
}

// Initialisation
loadContractStats();
loadContracts();
