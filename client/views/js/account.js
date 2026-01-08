// Configuration API
window.API_URL = window.API_URL || 'http://127.0.0.1:8000';
const API_URL = window.API_URL;

let currentSecret = null;

// Charger les informations du compte
async function loadAccountInfo() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Erreur de chargement');
    
    const user = await response.json();
    
    // Mettre à jour les informations
    document.getElementById('accountUsername').textContent = user.username;
    
    const roleMapping = {
      'employe': 'Employé',
      'manager': 'Manager',
      'directeur': 'Directeur'
    };
    document.getElementById('accountRole').textContent = roleMapping[user.role] || user.role;
    
    // Mettre à jour le statut 2FA
    update2FAStatus(user.totp_enabled);
    
  } catch (error) {
    console.error('Erreur:', error);
    notify.error('Impossible de charger les informations du compte');
  }
}

// Mettre à jour l'affichage du statut 2FA
function update2FAStatus(enabled) {
  const statusBadge = document.getElementById('account2FAStatus');
  const disabledState = document.getElementById('twofa-disabled');
  const setupState = document.getElementById('twofa-setup');
  const enabledState = document.getElementById('twofa-enabled');
  
  if (enabled) {
    statusBadge.innerHTML = '<span class="status-badge success">Activée</span>';
    disabledState.style.display = 'none';
    setupState.style.display = 'none';
    enabledState.style.display = 'block';
  } else {
    statusBadge.innerHTML = '<span class="status-badge error">Désactivée</span>';
    disabledState.style.display = 'block';
    setupState.style.display = 'none';
    enabledState.style.display = 'none';
  }
}

// Changer le mot de passe
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Validation
  if (newPassword !== confirmPassword) {
    notify.error('Les mots de passe ne correspondent pas');
    return;
  }
  
  if (newPassword.length < 8) {
    notify.error('Le mot de passe doit contenir au moins 8 caractères');
    return;
  }
  
  if (newPassword === currentPassword) {
    notify.error('Le nouveau mot de passe doit être différent de l\'ancien');
    return;
  }
  
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/users/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Erreur lors du changement de mot de passe');
    }
    
    notify.success('Mot de passe changé avec succès');
    document.getElementById('changePasswordForm').reset();
    
  } catch (error) {
    console.error('Erreur:', error);
    notify.error(error.message);
  }
});

// Activer l'A2F - Étape 1: Générer le QR code
document.getElementById('enableTwoFABtn').addEventListener('click', async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/users/2fa/enable`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Erreur lors de la génération du QR code');
    
    const data = await response.json();
    currentSecret = data.secret;
    
    // Afficher l'état de configuration
    document.getElementById('twofa-disabled').style.display = 'none';
    document.getElementById('twofa-setup').style.display = 'block';
    
    // Afficher le QR code
    document.getElementById('qrCodeImage').src = data.qr_code;
    document.getElementById('qrCodeImage').style.display = 'block';
    document.getElementById('qrLoading').style.display = 'none';
    
    // Afficher la clé secrète
    document.getElementById('secretKey').textContent = data.secret;
    
    notify.info('Scannez le QR code avec Google Authenticator');
    
  } catch (error) {
    console.error('Erreur:', error);
    notify.error('Impossible de générer le QR code');
  }
});

// Vérifier et activer l'A2F
document.getElementById('verifyCodeBtn').addEventListener('click', async () => {
  const code = document.getElementById('verifyCode').value;
  
  if (!code || code.length !== 6) {
    notify.error('Veuillez entrer un code à 6 chiffres');
    return;
  }
  
  if (!/^\d{6}$/.test(code)) {
    notify.error('Le code doit contenir uniquement des chiffres');
    return;
  }
  
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/users/2fa/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        code: code,
        secret: currentSecret
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Code invalide');
    }
    
    notify.success('Authentification à deux facteurs activée avec succès');
    update2FAStatus(true);
    document.getElementById('verifyCode').value = '';
    currentSecret = null;
    
  } catch (error) {
    console.error('Erreur:', error);
    notify.error(error.message);
  }
});

// Annuler la configuration de l'A2F
document.getElementById('cancelTwoFABtn').addEventListener('click', () => {
  confirmDialog(
    'Êtes-vous sûr de vouloir annuler la configuration de l\'A2F ?',
    () => {
      document.getElementById('twofa-setup').style.display = 'none';
      document.getElementById('twofa-disabled').style.display = 'block';
      document.getElementById('verifyCode').value = '';
      currentSecret = null;
      notify.info('Configuration annulée');
    }
  );
});

// Désactiver l'A2F
document.getElementById('disableTwoFABtn').addEventListener('click', () => {
  confirmDialog(
    'Êtes-vous sûr de vouloir désactiver l\'authentification à deux facteurs ? Cela réduira la sécurité de votre compte.',
    async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/users/2fa/disable`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Erreur lors de la désactivation');
        
        notify.success('Authentification à deux facteurs désactivée');
        update2FAStatus(false);
        
      } catch (error) {
        console.error('Erreur:', error);
        notify.error('Impossible de désactiver l\'A2F');
      }
    }
  );
});

// Copier la clé secrète
function copySecret() {
  const secret = document.getElementById('secretKey').textContent;
  navigator.clipboard.writeText(secret).then(() => {
    notify.success('Clé copiée dans le presse-papier');
  }).catch(() => {
    notify.error('Impossible de copier la clé');
  });
}

// Déconnexion
document.getElementById('logoutBtn').addEventListener('click', () => {
  confirmDialog(
    'Êtes-vous sûr de vouloir vous déconnecter ?',
    () => {
      localStorage.removeItem('access_token');
      notify.success('Déconnexion réussie');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
    }
  );
});

// Auto-format du code 2FA (ajouter des espaces tous les 3 chiffres)
document.getElementById('verifyCode').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  loadAccountInfo();
});
