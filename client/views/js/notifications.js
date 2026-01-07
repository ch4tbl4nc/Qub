// Système de notifications toast
class NotificationSystem {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  show(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };

    notification.style.cssText = `
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid ${colors[type] || colors.info};
      border-radius: 12px;
      padding: 16px 20px;
      color: #e2e8f0;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideIn 0.3s ease-out;
      min-width: 300px;
    `;

    notification.innerHTML = `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${colors[type] || colors.info};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
        flex-shrink: 0;
      ">${icons[type] || icons.info}</div>
      <div style="flex: 1; font-size: 14px;">${message}</div>
      <button style="
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        font-size: 20px;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      " onclick="this.parentElement.remove()">×</button>
    `;

    // Ajouter l'animation CSS
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    this.container.appendChild(notification);

    // Auto-fermeture
    if (duration > 0) {
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
      }, duration);
    }

    return notification;
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// Instance globale
window.notify = new NotificationSystem();

// Système de confirmation modal
window.confirmDialog = function(message, onConfirm, onCancel) {
  // Créer le modal
  const modal = document.createElement('div');
  modal.className = 'confirm-modal-overlay';
  modal.innerHTML = `
    <div class="confirm-modal">
      <div class="confirm-icon">⚠️</div>
      <div class="confirm-message">${message}</div>
      <div class="confirm-buttons">
        <button class="btn-cancel" id="confirmCancel">Annuler</button>
        <button class="btn-confirm" id="confirmOk">OK</button>
      </div>
    </div>
  `;
  
  // Ajouter les styles si pas déjà présents
  if (!document.getElementById('confirm-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'confirm-modal-styles';
    style.textContent = `
      .confirm-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease-out;
      }
      
      .confirm-modal {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
        border: 1px solid rgba(148, 163, 184, 0.1);
        border-radius: 16px;
        padding: 32px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        animation: slideUp 0.3s ease-out;
      }
      
      .confirm-icon {
        font-size: 48px;
        text-align: center;
        margin-bottom: 16px;
      }
      
      .confirm-message {
        color: #f1f5f9;
        font-size: 16px;
        text-align: center;
        margin-bottom: 24px;
        line-height: 1.5;
      }
      
      .confirm-buttons {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      
      .btn-cancel, .btn-confirm {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .btn-cancel {
        background: rgba(148, 163, 184, 0.1);
        color: #cbd5e1;
      }
      
      .btn-cancel:hover {
        background: rgba(148, 163, 184, 0.2);
      }
      
      .btn-confirm {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
      }
      
      .btn-confirm:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(modal);
  
  // Gérer les événements
  const closeModal = () => {
    modal.style.animation = 'fadeOut 0.2s ease-out';
    setTimeout(() => modal.remove(), 200);
  };
  
  document.getElementById('confirmCancel').onclick = () => {
    closeModal();
    if (onCancel) onCancel();
  };
  
  document.getElementById('confirmOk').onclick = () => {
    closeModal();
    if (onConfirm) onConfirm();
  };
  
  // Fermer avec Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (onCancel) onCancel();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
};
