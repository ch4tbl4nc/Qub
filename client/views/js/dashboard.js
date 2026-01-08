// Configuration des graphiques
const chartColors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  teal: '#14b8a6',
  orange: '#f97316'
};

const API_URL = 'http://127.0.0.1:8000';
let charts = {}; // Stocker les instances de graphiques

// Charger les informations de l'utilisateur connecté
async function loadUserInfo() {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('Pas de token, connexion requise');
      return;
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const user = await response.json();
      
      // Mettre à jour l'avatar (initiales)
      const initials = user.username.substring(0, 2).toUpperCase();
      document.getElementById('userAvatar').textContent = initials;
      
      // Mettre à jour le nom
      document.getElementById('userName').textContent = user.username;
      
      // Mettre à jour le rôle avec traduction
      const roleMap = {
        'employe': 'Employé',
        'manager': 'Manager',
        'directeur': 'Directeur'
      };
      document.getElementById('userRole').textContent = roleMap[user.role] || user.role;
    } else {
      console.error('Erreur lors du chargement des infos utilisateur:', response.status);
      // Valeurs par défaut
      document.getElementById('userAvatar').textContent = '??';
      document.getElementById('userName').textContent = 'Utilisateur';
      document.getElementById('userRole').textContent = 'Employé';
    }
  } catch (error) {
    console.error('Erreur lors du chargement des infos utilisateur:', error);
    // Valeurs par défaut
    document.getElementById('userAvatar').textContent = '??';
    document.getElementById('userName').textContent = 'Utilisateur';
    document.getElementById('userRole').textContent = 'Employé';
  }
}

// Charger les données du dashboard
async function loadDashboardData() {
  try {
    const response = await fetch(`${API_URL}/dashboard/stats`);
    const data = await response.json();
    
    // Mettre à jour les KPIs
    updateKPIs(data.kpis);
    
    // Mettre à jour les graphiques
    createSupplierChart(data.supplier_distribution);
    createCategoryChart(data.category_revenue);
    createSupplierRevenueChart(data.supplier_distribution);
    
    // Mettre à jour les listes top/flop
    updateTopFlopLists(data.top_products, data.flop_products);
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
}

// Mettre à jour les KPIs
function updateKPIs(kpis) {
  const kpiValues = document.querySelectorAll('.kpi-value');
  if (kpiValues[0]) kpiValues[0].textContent = `€${kpis.revenue.toLocaleString('fr-FR', {minimumFractionDigits: 0})}`;
  if (kpiValues[1]) kpiValues[1].textContent = kpis.sales.toLocaleString('fr-FR');
  if (kpiValues[2]) kpiValues[2].textContent = kpis.stock.toLocaleString('fr-FR');
  if (kpiValues[3]) kpiValues[3].textContent = kpis.suppliers;
}

// Mettre à jour les listes top/flop
function updateTopFlopLists(topProducts, flopProducts) {
  // Top 3
  const topList = document.querySelector('.sales-section:first-child .sales-list');
  if (topList && topProducts) {
    topList.innerHTML = topProducts.map((product, index) => `
      <div class="sales-item">
        <span class="sales-rank">${index + 1}</span>
        <span class="sales-name">${product.name}</span>
        <span class="sales-value">€${product.revenue.toLocaleString('fr-FR', {minimumFractionDigits: 0})}</span>
      </div>
    `).join('');
  }
  
  // Flop 3
  const flopList = document.querySelector('.sales-section:last-child .sales-list');
  if (flopList && flopProducts) {
    flopList.innerHTML = flopProducts.map((product, index) => `
      <div class="sales-item flop">
        <span class="sales-rank">${index + 1}</span>
        <span class="sales-name">${product.name}</span>
        <span class="sales-value">€${product.revenue.toLocaleString('fr-FR', {minimumFractionDigits: 0})}</span>
      </div>
    `).join('');
  }
}

// Diagramme camembert - Répartition fournisseurs
function createSupplierChart(suppliers) {
  const supplierChartCtx = document.getElementById('supplierChart');
  if (!supplierChartCtx || !suppliers) return;
  
  // Détruire l'instance existante si elle existe
  if (charts.supplierChart) {
    charts.supplierChart.destroy();
  }
  
  const labels = suppliers.map(s => s.name);
  const data = suppliers.map(s => s.total_revenue);
  
  try {
    charts.supplierChart = new Chart(supplierChartCtx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            chartColors.primary,
            chartColors.secondary,
            chartColors.success,
            chartColors.warning,
            chartColors.info
          ],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#cbd5e1',
              padding: 15,
              font: {
                size: 12,
                family: "'Inter', sans-serif"
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f1f5f9',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function (context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du graphique des fournisseurs :', error);
  }
}

// Graphique revenus par catégorie - sera créé dynamiquement par createCategoryChart()
function createCategoryChart(categories) {
  const categoryChartCtx = document.getElementById('categoryChart');
  if (!categoryChartCtx || !categories) return;
  
  // Détruire l'instance existante si elle existe
  if (charts.categoryChart) {
    charts.categoryChart.destroy();
  }
  
  const labels = categories.map(c => c.category);
  const data = categories.map(c => c.revenue);
  
  // Couleurs pour chaque catégorie
  const colors = [chartColors.primary, chartColors.success, chartColors.warning, chartColors.purple, chartColors.teal, chartColors.orange];
  
  charts.categoryChart = new Chart(categoryChartCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenus',
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#f1f5f9',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function (context) {
              return 'Revenus: €' + context.parsed.y.toLocaleString('fr-FR');
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#94a3b8',
            callback: function (value) {
              return '€' + (value / 1000) + 'k';
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#94a3b8'
          }
        }
      }
    }
  });
}

// Fonction pour créer une légende interactive avec masquage de courbes
function createInteractiveLegend(containerId, chart) {
  const container = document.getElementById(containerId);
  if (!container) return;

  chart.data.datasets.forEach((dataset, index) => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <div class="legend-color" style="background-color: ${dataset.borderColor}"></div>
      <span class="legend-label">${dataset.label}</span>
    `;

    legendItem.addEventListener('click', () => {
      const meta = chart.getDatasetMeta(index);
      meta.hidden = !meta.hidden;
      legendItem.classList.toggle('inactive');
      chart.update();
    });

    container.appendChild(legendItem);
  });
}

// Créer le graphique des revenus par fournisseur
function createSupplierRevenueChart(suppliers) {
  const supplierRevenueChartCtx = document.getElementById('supplierRevenueChart');
  if (!supplierRevenueChartCtx || !suppliers) return;
  
  // Détruire l'instance existante si elle existe
  if (charts.supplierRevenueChart) {
    charts.supplierRevenueChart.destroy();
  }
  
  const labels = suppliers.map(s => s.name);
  const data = suppliers.map(s => s.total_revenue);
  
  charts.supplierRevenueChart = new Chart(supplierRevenueChartCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenus',
        data: data,
        backgroundColor: chartColors.success,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        x: {
          ticks: { color: '#94a3b8' },
          grid: { display: false }
        }
      }
    }
  });
  
  createInteractiveLegend('supplierLegend', charts.supplierRevenueChart);
}

// Charger les données au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  loadUserInfo();
  loadDashboardData();
});
