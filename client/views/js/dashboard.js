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

// Diagramme camembert - Répartition fournisseurs
const supplierChartCtx = document.getElementById('supplierChart');
if (supplierChartCtx) {
  try {
    new Chart(supplierChartCtx, {
      type: 'doughnut',
      data: {
        labels: ['TechCorp', 'ElectroPlus', 'MegaDistrib', 'GlobalSupply', 'Autres'],
        datasets: [{
          data: [30, 25, 20, 15, 10],
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

// Graphique revenus par catégorie
const categoryChartCtx = document.getElementById('categoryChart');
if (categoryChartCtx) {
  const categoryChart = new Chart(categoryChartCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      datasets: [
        {
          label: 'Électronique',
          data: [12000, 15000, 13000, 17000, 16000, 19000],
          borderColor: chartColors.primary,
          backgroundColor: chartColors.primary + '20',
          tension: 0.4,
          fill: true,
          hidden: false
        },
        {
          label: 'Informatique',
          data: [8000, 9000, 11000, 10000, 12000, 14000],
          borderColor: chartColors.success,
          backgroundColor: chartColors.success + '20',
          tension: 0.4,
          fill: true,
          hidden: false
        },
        {
          label: 'Accessoires',
          data: [3000, 4000, 3500, 4500, 5000, 5500],
          borderColor: chartColors.warning,
          backgroundColor: chartColors.warning + '20',
          tension: 0.4,
          fill: true,
          hidden: false
        },
        {
          label: 'Audio',
          data: [5000, 5500, 6000, 5800, 6500, 7000],
          borderColor: chartColors.purple,
          backgroundColor: chartColors.purple + '20',
          tension: 0.4,
          fill: true,
          hidden: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
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
              return context.dataset.label + ': €' + context.parsed.y.toLocaleString();
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

  // Créer la légende interactive
  createInteractiveLegend('categoryLegend', categoryChart);
}

// Graphique revenus par fournisseur
const supplierRevenueChartCtx = document.getElementById('supplierRevenueChart');
if (supplierRevenueChartCtx) {
  const supplierRevenueChart = new Chart(supplierRevenueChartCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      datasets: [
        {
          label: 'TechCorp',
          data: [15000, 18000, 16000, 20000, 19000, 22000],
          borderColor: chartColors.primary,
          backgroundColor: chartColors.primary + '20',
          tension: 0.4,
          fill: true
        },
        {
          label: 'ElectroPlus',
          data: [12000, 14000, 13000, 15000, 16000, 18000],
          borderColor: chartColors.success,
          backgroundColor: chartColors.success + '20',
          tension: 0.4,
          fill: true
        },
        {
          label: 'MegaDistrib',
          data: [8000, 9000, 10000, 9500, 11000, 12000],
          borderColor: chartColors.warning,
          backgroundColor: chartColors.warning + '20',
          tension: 0.4,
          fill: true
        },
        {
          label: 'GlobalSupply',
          data: [6000, 7000, 7500, 8000, 8500, 9000],
          borderColor: chartColors.info,
          backgroundColor: chartColors.info + '20',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
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
              return context.dataset.label + ': €' + context.parsed.y.toLocaleString();
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

  // Créer la légende interactive
  createInteractiveLegend('supplierLegend', supplierRevenueChart);
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
