// Données de démonstration - Commandes
const ordersData = [
  {
    id: 'CMD-2024-001',
    customer: 'Marie Dubois',
    date: '2024-12-09 14:32',
    price: 2599.98,
    products: [
      { ref: 'REF-001', name: 'iPhone 15 Pro', price: 1199.99 },
      { ref: 'REF-002', name: 'MacBook Air M2', price: 1399.99 }
    ],
    status: 'Livrée'
  },
  {
    id: 'CMD-2024-002',
    customer: 'Pierre Martin',
    date: '2024-12-09 10:15',
    price: 279.99,
    products: [
      { ref: 'REF-003', name: 'AirPods Pro', price: 279.99 }
    ],
    status: 'En cours'
  },
  {
    id: 'CMD-2024-003',
    customer: 'Sophie Laurent',
    date: '2024-12-08 16:45',
    price: 1549.98,
    products: [
      { ref: 'REF-004', name: 'iPad Pro 12.9"', price: 1299.99 },
      { ref: 'REF-005', name: 'Magic Keyboard', price: 149.99 },
      { ref: 'REF-003', name: 'AirPods Pro', price: 279.99 }
    ],
    status: 'Livrée'
  },
  {
    id: 'CMD-2024-004',
    customer: 'Luc Bernard',
    date: '2024-12-08 09:20',
    price: 899.99,
    products: [
      { ref: 'REF-006', name: 'Samsung Galaxy S24', price: 899.99 }
    ],
    status: 'Livrée'
  },
  {
    id: 'CMD-2024-005',
    customer: 'Emma Rousseau',
    date: '2024-12-07 15:30',
    price: 2299.98,
    products: [
      { ref: 'REF-007', name: 'Dell XPS 15', price: 1899.99 },
      { ref: 'REF-008', name: 'Sony WH-1000XM5', price: 399.99 }
    ],
    status: 'Livrée'
  }
];

// Données de démonstration - Produits
const productsData = [
  {
    ref: 'REF-001',
    name: 'iPhone 15 Pro',
    category: 'Électronique',
    supplier: 'TechCorp',
    supplierContract: 'CNT-2024-001',
    order: 'CMD-2024-001',
    date: '2024-12-09 14:32',
    action: 'Vente'
  },
  {
    ref: 'REF-002',
    name: 'MacBook Air M2',
    category: 'Informatique',
    supplier: 'TechCorp',
    supplierContract: 'CNT-2024-001',
    order: 'CMD-2024-001',
    date: '2024-12-09 14:32',
    action: 'Vente'
  },
  {
    ref: 'REF-003',
    name: 'AirPods Pro',
    category: 'Audio',
    supplier: 'ElectroPlus',
    supplierContract: 'CNT-2024-002',
    order: 'CMD-2024-002',
    date: '2024-12-09 10:15',
    action: 'Vente'
  },
  {
    ref: 'REF-004',
    name: 'iPad Pro 12.9"',
    category: 'Électronique',
    supplier: 'TechCorp',
    supplierContract: 'CNT-2024-001',
    order: 'CMD-2024-003',
    date: '2024-12-08 16:45',
    action: 'Vente'
  },
  {
    ref: 'REF-007',
    name: 'Dell XPS 15',
    category: 'Informatique',
    supplier: 'MegaDistrib',
    supplierContract: 'CNT-2024-003',
    order: null,
    date: '2024-12-07 09:00',
    action: 'Ajout stock'
  }
];

let currentTab = 'orders';
let filteredOrders = [...ordersData];
let filteredProducts = [...productsData];

// Rendu des commandes
function renderOrders(data = filteredOrders) {
  const container = document.querySelector('#ordersHistory .timeline');
  
  container.innerHTML = data.map(order => `
    <div class="timeline-item" data-order-id="${order.id}">
      <div class="timeline-card">
        <div class="timeline-header">
          <div>
            <div class="timeline-id">${order.id}</div>
            <div class="timeline-date">📅 ${order.date}</div>
          </div>
          <div class="timeline-price">€${order.price.toFixed(2)}</div>
        </div>
        
        <div class="timeline-body">
          <div class="timeline-info">
            <div class="timeline-label">Client</div>
            <div class="timeline-value">${order.customer}</div>
          </div>
          
          <div class="timeline-info">
            <div class="timeline-label">Produits</div>
            <div class="product-refs">
              ${order.products.map(p => `<span class="product-ref-badge">${p.ref}</span>`).join('')}
            </div>
          </div>
          
          <div class="timeline-info">
            <div class="timeline-label">Statut</div>
            <div class="timeline-value">
              <span class="badge ${order.status === 'Livrée' ? 'badge-success' : 'badge-warning'}">
                ${order.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  
  attachOrderClickListeners();
}

// Rendu des produits
function renderProducts(data = filteredProducts) {
  const container = document.querySelector('#productsHistory .timeline');
  
  container.innerHTML = data.map(product => `
    <div class="timeline-item">
      <div class="timeline-card">
        <div class="timeline-header">
          <div>
            <div class="timeline-id">${product.ref} - ${product.name}</div>
            <div class="timeline-date">📅 ${product.date}</div>
          </div>
          <div>
            <span class="badge ${product.action === 'Vente' ? 'badge-success' : 'badge-info'}">
              ${product.action}
            </span>
          </div>
        </div>
        
        <div class="timeline-body">
          <div class="timeline-info">
            <div class="timeline-label">Catégorie</div>
            <div class="timeline-value">${product.category}</div>
          </div>
          
          <div class="timeline-info">
            <div class="timeline-label">Fournisseur</div>
            <div class="timeline-value">
              <a href="contrats.html?contract=${product.supplierContract}" class="timeline-link">
                ${product.supplier}
              </a>
            </div>
          </div>
          
          ${product.order ? `
            <div class="timeline-info">
              <div class="timeline-label">Commande</div>
              <div class="timeline-value">
                <a href="#" class="timeline-link order-link" data-order-id="${product.order}">
                  ${product.order}
                </a>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
  
  attachProductClickListeners();
}

// Gestion des onglets
document.querySelectorAll('.history-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.history-content').forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(`${tabName}History`).classList.add('active');
    
    currentTab = tabName;
  });
});

// Filtrage
function applyFilters() {
  
  if (currentTab === 'orders') {
    filteredOrders = ordersData.filter(order => {
      const matchSearch = order.id.toLowerCase().includes(searchTerm) ||
                         order.customer.toLowerCase().includes(searchTerm);
      
      const orderDate = new Date(order.date);
      const matchDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
      const matchDateTo = !dateTo || orderDate <= new Date(dateTo + ' 23:59:59');
      
      return matchSearch && matchDateFrom && matchDateTo;
    });
    
    renderOrders(filteredOrders);
  } else {
    filteredProducts = productsData.filter(product => {
      const matchSearch = product.ref.toLowerCase().includes(searchTerm) ||
                         product.name.toLowerCase().includes(searchTerm) ||
                         product.supplier.toLowerCase().includes(searchTerm);
      
      const productDate = new Date(product.date);
      const matchDateFrom = !dateFrom || productDate >= new Date(dateFrom);
      const matchDateTo = !dateTo || productDate <= new Date(dateTo + ' 23:59:59');
      
      return matchSearch && matchDateFrom && matchDateTo;
    });
    
    renderProducts(filteredProducts);
  }
}

// Modal détails commande
const orderModal = document.getElementById('orderModal');

function openOrderModal(orderId) {
  const order = ordersData.find(o => o.id === orderId);
  if (!order) return;
  
  document.getElementById('orderModalTitle').textContent = `Commande ${order.id}`;
  document.getElementById('orderModalBody').innerHTML = `
    <div class="order-details">
      <div class="detail-section">
        <h3 class="detail-title">Informations générales</h3>
        <div class="detail-grid">
          <div class="detail-item">
            <div class="detail-label">Numéro de commande</div>
            <div class="detail-value">${order.id}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Client</div>
            <div class="detail-value">${order.customer}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Date et heure</div>
            <div class="detail-value">${order.date}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Statut</div>
            <div class="detail-value">
              <span class="badge ${order.status === 'Livrée' ? 'badge-success' : 'badge-warning'}">
                ${order.status}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3 class="detail-title">Produits (${order.products.length})</h3>
        <div class="products-list">
          ${order.products.map(p => `
            <div class="product-item">
              <div>
                <div class="product-item-name">${p.name}</div>
                <div class="product-id">${p.ref}</div>
              </div>
              <div class="product-item-price">€${p.price.toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="detail-section">
        <h3 class="detail-title">Montant total</h3>
        <div class="timeline-price" style="font-size: var(--font-size-3xl);">
          €${order.price.toFixed(2)}
        </div>
      </div>
    </div>
  `;
  
  orderModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  orderModal.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('closeOrderModal').addEventListener('click', closeOrderModal);
orderModal.querySelector('.modal-overlay').addEventListener('click', closeOrderModal);

// Event listeners pour ouvrir les détails
function attachOrderClickListeners() {
  document.querySelectorAll('#ordersHistory .timeline-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const orderId = e.currentTarget.closest('.timeline-item').dataset.orderId;
      openOrderModal(orderId);
    });
  });
}

function attachProductClickListeners() {
  document.querySelectorAll('.order-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const orderId = e.target.dataset.orderId;
      openOrderModal(orderId);
    });
  });
}

// Initialisation
renderOrders();
renderProducts();
