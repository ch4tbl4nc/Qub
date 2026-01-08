const API_URL = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', function () {

  // Éléments du formulaire
  const purchasePriceInput = document.getElementById('productPurchasePrice');
  const marginInput = document.getElementById('productMargin');
  const salePriceInput = document.getElementById('productPrice');
  const profitDisplay = document.getElementById('profitDisplay');

  // Éléments de l'aperçu
  const previewName = document.getElementById('previewName');
  const previewCategory = document.getElementById('previewCategory');
  const previewSupplier = document.getElementById('previewSupplier');
  const previewPurchase = document.getElementById('previewPurchase');
  const previewMargin = document.getElementById('previewMargin');
  const previewPrice = document.getElementById('previewPrice');
  const previewProfit = document.getElementById('previewProfit');
  const previewQuantity = document.getElementById('previewQuantity');
  const previewThreshold = document.getElementById('previewThreshold');

  // Fonction de calcul du prix de vente
  function calculateSalePrice() {
    const purchasePrice = Number.parseFloat(purchasePriceInput.value) || 0;
    const margin = Number.parseFloat(marginInput.value) || 0;

    // Formule : Prix de vente = Prix d'achat × (1 + Marge/100)
    const salePrice = purchasePrice * (1 + margin / 100);
    const profit = salePrice - purchasePrice;

    // Mettre à jour les champs
    salePriceInput.value = salePrice.toFixed(2);
    profitDisplay.textContent = '€' + profit.toFixed(2);

    // Mettre à jour l'aperçu
    previewPurchase.textContent = '€' + purchasePrice.toFixed(2);
    previewMargin.textContent = margin.toFixed(1) + '%';
    previewPrice.textContent = '€' + salePrice.toFixed(2);
    previewProfit.textContent = '€' + profit.toFixed(2);

    // Animation visuelle
    salePriceInput.style.animation = 'none';
    setTimeout(() => {
      salePriceInput.style.animation = 'pulse 0.5s ease-out';
    }, 10);
  }

  // Event listeners pour le calcul automatique
  purchasePriceInput.addEventListener('input', calculateSalePrice);
  marginInput.addEventListener('input', calculateSalePrice);

  // Mise à jour de l'aperçu en temps réel
  document.getElementById('productName').addEventListener('input', function (e) {
    previewName.textContent = e.target.value || '-';
  });

  document.getElementById('productCategory').addEventListener('input', function (e) {
    previewCategory.textContent = e.target.value || '-';
  });

  document.getElementById('supplierSelect').addEventListener('change', function (e) {
    previewSupplier.textContent = e.target.value || '-';
  });

  document.getElementById('productQuantity').addEventListener('input', function (e) {
    previewQuantity.textContent = e.target.value || '0';
  });

  document.getElementById('productThreshold').addEventListener('input', function (e) {
    previewThreshold.textContent = e.target.value || '10';
  });

  // Soumission du formulaire
  const form = document.getElementById('addProductForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Récupérer les données du formulaire
    const productData = {
      id: document.getElementById('productRef').value.trim(),
      name: document.getElementById('productName').value.trim(),
      category: document.getElementById('productCategory').value.trim(),
      supplier: document.getElementById('supplierSelect').value,
      margin: Number.parseFloat(document.getElementById('productMargin').value),
      price: Number.parseFloat(document.getElementById('productPrice').value),
      quantity: Number.parseInt(document.getElementById('productQuantity').value),
      threshold: Number.parseInt(document.getElementById('productThreshold').value)
    };

    // Validation
    if (!productData.name || !productData.category || !productData.supplier) {
      notify.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (productData.purchasePrice <= 0 || productData.price <= 0) {
      notify.error('Les prix doivent être supérieurs à 0');
      return;
    }

    if (productData.quantity < 0) {
      notify.error('La quantité doit être positive');
      return;
    }

    // Envoyer au backend
    sendProductToAPI(productData);
  });

  async function loadSuppliersToSelect() {
    const selectMenu = document.getElementById('supplierSelect');

    try {
      // 1. Récupérer TOUS les contrats
      const response = await fetch(`${API_URL}/history/contracts`);
      if (!response.ok) throw new Error('Erreur réseau');

      const contracts = await response.json();

      // 2. Extraire uniquement les noms des suppliers
      // On utilise map() pour avoir une liste de noms, puis new Set() pour dédoublonner
      const allSuppliers = contracts.map(contrat => contrat.supplier);
      const uniqueSuppliers = [...new Set(allSuppliers)]; // Conversion du Set en Array

      // 3. Vider le select et ajouter l'option par défaut
      selectMenu.innerHTML = '<option value="">Sélectionnez un fournisseur</option>';

      // 4. Ajouter chaque supplier unique dans le select
      uniqueSuppliers.sort().forEach(supplierName => {
        // new Option(text, value)
        // Ici le texte affiché et la valeur envoyée sont identiques
        const option = new Option(supplierName, supplierName);
        selectMenu.add(option);
      });

      console.log(`${uniqueSuppliers.length} fournisseurs chargés.`);

    } catch (error) {
      console.error("Erreur lors du chargement des fournisseurs:", error);
      selectMenu.innerHTML = '<option value="">Erreur de chargement</option>';
    }
  }

  loadSuppliersToSelect()

  // Envoyer le produit à l'API
  async function sendProductToAPI(productData) {
    try {
      const response = await fetch('http://127.0.0.1:8000/dashboard/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        notify.success('Produit ajouté avec succès !');

        // Rediriger après 1.5 secondes
        setTimeout(() => {
          window.location.href = 'stock.html';
        }, 1500);
      } else {
        notify.error('Erreur lors de l\'ajout du produit');
      }
    } catch (error) {
      console.error('Erreur:', error);
      notify.error('Impossible de communiquer avec le serveur');
    }
  }
});
