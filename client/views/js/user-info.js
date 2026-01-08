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
      const user = await response.json();
      
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
      setDefaultUserInfo();
    }
  } catch (error) {
    console.error('Erreur lors du chargement des infos utilisateur:', error);
    setDefaultUserInfo();
  }
}

function setDefaultUserInfo() {
  const avatarEl = document.getElementById('userAvatar');
  const nameEl = document.getElementById('userName');
  const roleEl = document.getElementById('userRole');
  
  if (avatarEl) avatarEl.textContent = '??';
  if (nameEl) nameEl.textContent = 'Utilisateur';
  if (roleEl) roleEl.textContent = 'Employé';
}

// Rendre le user-section clickable
function makeUserSectionClickable() {
  const userInfo = document.querySelector('.user-section .user-info');
  if (userInfo && !userInfo.classList.contains('clickable-initialized')) {
    userInfo.classList.add('clickable');
    userInfo.style.cursor = 'pointer';
    userInfo.style.transition = 'all 0.3s';
    
    userInfo.addEventListener('click', () => {
      window.location.href = 'account.html';
    });
    
    userInfo.addEventListener('mouseenter', () => {
      userInfo.style.transform = 'translateX(5px)';
      userInfo.style.borderColor = 'rgba(99, 102, 241, 0.3)';
    });
    
    userInfo.addEventListener('mouseleave', () => {
      userInfo.style.transform = 'translateX(0)';
      userInfo.style.borderColor = '';
    });
    
    userInfo.classList.add('clickable-initialized');
  }
}

// Charger automatiquement au chargement de la page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    makeUserSectionClickable();
  });
} else {
  loadUserInfo();
  makeUserSectionClickable();
}

