// Fonction commune pour charger les informations utilisateur
// Utilise window.API_URL défini dans les autres scripts ou par défaut

async function loadUserInfo() {
  const API_URL = window.API_URL || 'http://127.0.0.1:8000';
  
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
      const data = await response.json();
      const user = data.user;
      
      // Mettre à jour l'avatar (initiales)
      const initials = user.username.substring(0, 2).toUpperCase();
      const avatarEl = document.getElementById('userAvatar');
      if (avatarEl) avatarEl.textContent = initials;
      
      // Mettre à jour le nom
      const nameEl = document.getElementById('userName');
      if (nameEl) nameEl.textContent = user.username;
      
      // Mettre à jour le rôle avec traduction
      const roleMap = {
        'employe': 'Employé',
        'manager': 'Manager',
        'directeur': 'Directeur'
      };
      const roleEl = document.getElementById('userRole');
      if (roleEl) roleEl.textContent = roleMap[user.role] || user.role;
    } else {
      console.error('Erreur lors du chargement des infos utilisateur:', response.status);
      // Valeurs par défaut
      const avatarEl = document.getElementById('userAvatar');
      const nameEl = document.getElementById('userName');
      const roleEl = document.getElementById('userRole');
      
      if (avatarEl) avatarEl.textContent = '??';
      if (nameEl) nameEl.textContent = 'Utilisateur';
      if (roleEl) roleEl.textContent = 'Employé';
    }
  } catch (error) {
    console.error('Erreur lors du chargement des infos utilisateur:', error);
    // Valeurs par défaut
    const avatarEl = document.getElementById('userAvatar');
    const nameEl = document.getElementById('userName');
    const roleEl = document.getElementById('userRole');
    
    if (avatarEl) avatarEl.textContent = '??';
    if (nameEl) nameEl.textContent = 'Utilisateur';
    if (roleEl) roleEl.textContent = 'Employé';
  }
}

// Charger automatiquement au chargement de la page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadUserInfo);
} else {
  loadUserInfo();
}
