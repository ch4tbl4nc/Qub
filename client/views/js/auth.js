// Fonction utilitaire pour gérer l'authentification JWT
const API_BASE_URL = 'http://127.0.0.1:8000';

// Récupérer le token JWT du localStorage
function getToken() {
  return localStorage.getItem('access_token');
}

// Vérifier si l'utilisateur est connecté
function isAuthenticated() {
  return getToken() !== null;
}

// Déconnecter l'utilisateur
function logout() {
  localStorage.removeItem('access_token');
  window.location.href = 'login.html';
}

// Faire une requête authentifiée à l'API
async function authenticatedFetch(url, options = {}) {
  const token = getToken();
  
  if (!token) {
    window.location.href = 'login.html';
    throw new Error('Non authentifié');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers
  });

  // Si le token est invalide ou expiré
  if (response.status === 401) {
    logout();
    throw new Error('Session expirée');
  }

  return response;
}

// Protéger les pages (à appeler sur chaque page sauf login)
function protectPage() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

// Export pour utilisation dans d'autres fichiers
window.Auth = {
  getToken,
  isAuthenticated,
  logout,
  authenticatedFetch,
  protectPage,
  API_BASE_URL
};
