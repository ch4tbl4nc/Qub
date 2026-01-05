// Gestion des onglets Login/Register
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const forms = document.querySelectorAll('.auth-form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Retirer active de tous
      tabs.forEach(t => t.classList.remove('active'));
      forms.forEach(f => f.classList.remove('active'));

      // Ajouter active au sélectionné
      tab.classList.add('active');
      document.getElementById(`${targetTab}-form`).classList.add('active');
    });
  });

  // Gestion de la soumission du formulaire de connexion
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulation - Redirection vers dashboard
      window.location.href = 'dashboard.html';
    });
  }

  // Gestion de la soumission du formulaire d'inscription
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 2. Récupérer les valeurs des inputs
      const name = document.getElementById('register-name').value;
      const company = document.getElementById('register-company').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm').value;

      // 3. Petite vérification de sécurité côté client
      if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas !");
        return;
      }

      // 4. Préparer l'objet JSON
      const data = {
        username: name,
        company: company,
        email: email,
        password: password
      };

      try {
        // 5. Envoyer la requête POST
        const response = await fetch('http://127.0.0.1:8000/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        // 6. Gérer la réponse du serveur
        if (response.ok) {
          console.log('Succès:', result);
          alert('Compte créé avec succès !');
        } else {
          console.error('Erreur serveur:', result);
          alert('Erreur lors de l\'inscription: ' + (result.detail || 'Erreur inconnue'));
        }
      } catch (error) {
        console.error('Erreur de connexion:', error);
        alert('Impossible de contacter le serveur backend.');
      }

    }

    )
  }

  // Gestion du menu mobile
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Fermer le sidebar sur mobile en cliquant en dehors
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (sidebar && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
});
