// Configuration API
window.API_URL = window.API_URL || 'http://127.0.0.1:8000';
const API_URL = window.API_URL;

let ordersData = [];
let filteredOrders = [];

// Charger les commandes depuis l'API
async function loadOrders() {
  try {
    const response = await fetch(`${API_URL}/history/orders`);
    ordersData = await response.json();
    filteredOrders = [...ordersData];
    renderOrders();
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error);
    notify.error('Impossible de charger les commandes');
  }
}

// Afficher les commandes
function renderOrders() {
  const container = document.querySelector('#ordersHistory .timeline');
  if (!container) return;

  if (filteredOrders.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: #94a3b8;">Aucune commande trouvée</div>';
    return;
  }

  container.innerHTML = filteredOrders.map(order => {
    const statusClass = order.status === 'Livrée' ? 'success' : 
                       order.status === 'En cours' ? 'warning' : 'error';
    
    const productsHtml = order.products.map(p => 
      `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.1);">
        <span>${p.name} (x${p.quantity})</span>
        <span>€${(p.unit_price * p.quantity).toFixed(2)}</span>
      </div>`
    ).join('');

    return `
      <div class="timeline-item glass-card" style="margin-bottom: 16px; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
          <div>
            <h3 style="color: #6366f1; margin: 0 0 8px 0; font-size: 16px;">${order.id}</h3>
            <p style="color: #cbd5e1; margin: 0; font-size: 14px;">${order.customer}</p>
          </div>
          <span class="status-badge ${statusClass}">${order.status}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
          <div>
            <span style="color: #94a3b8; font-size: 12px;">Date</span>
            <p style="color: #f1f5f9; margin: 4px 0 0 0;">${formatDate(order.date)}</p>
          </div>
          <div>
            <span style="color: #94a3b8; font-size: 12px;">Total</span>
            <p style="color: #10b981; margin: 4px 0 0 0; font-weight: 600;">€${order.total.toFixed(2)}</p>
          </div>
        </div>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(148, 163, 184, 0.1);">
          <h4 style="color: #cbd5e1; margin: 0 0 12px 0; font-size: 14px;">Produits</h4>
          ${productsHtml}
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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Filtrer les commandes
function filterOrders() {
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const status = document.getElementById('statusFilter')?.value || '';
  
  filteredOrders = ordersData.filter(order => {
    const matchSearch = order.id.toLowerCase().includes(search) ||
                       order.customer.toLowerCase().includes(search);
    const matchStatus = !status || order.status === status;
    
    return matchSearch && matchStatus;
  });
  
  renderOrders();
}

// Gestion des onglets
function switchTab(tabName) {
  // Mettre à jour les boutons d'onglets
  document.querySelectorAll('.history-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
  
  // Mettre à jour le contenu
  document.querySelectorAll('.history-content').forEach(content => {
    content.classList.remove('active');
  });
  
  if (tabName === 'orders') {
    document.getElementById('ordersHistory')?.classList.add('active');
  } else if (tabName === 'products') {
    document.getElementById('productsHistory')?.classList.add('active');
  }
}

// Event listeners
document.getElementById('searchInput')?.addEventListener('input', filterOrders);
document.getElementById('statusFilter')?.addEventListener('change', filterOrders);

// Ajouter les event listeners pour les onglets
document.querySelectorAll('.history-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');
    switchTab(tabName);
  });
});

// Initialisation
loadOrders();
