window.onload = function () {
  console.log("DOM ready!");

  const form = document.getElementById("myForm");
  const modal = new bootstrap.Modal(document.getElementById("myModal"));
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  // Validation email
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const firstname = document.getElementById("firstname").value.trim();
    const birthday = document.getElementById("birthday").value;
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();

    let errors = [];

    // === 1. TOUS LES CHAMPS OBLIGATOIRES ===
    if (!name || !firstname || !birthday || !address || !email) {
      errors.push("Tous les champs sont obligatoires.");
    }

    // === 2. AUTRES VALIDATIONS (seulement si tous les champs sont remplis) ===
    if (name && firstname && birthday && address && email) {
      if (name.length < 5) errors.push("Le nom doit contenir au moins 5 caractères.");
      if (firstname.length < 5) errors.push("Le prénom doit contenir au moins 5 caractères.");
      if (address.length < 5) errors.push("L'adresse doit contenir au moins 5 caractères.");
      if (!validateEmail(email)) errors.push("L'email est invalide.");

      // Date future
      const birthDate = new Date(birthday);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (birthDate > today) {
        errors.push("La date de naissance ne peut pas être dans le futur.");
      }
    }

    // === ERREUR ===
    if (errors.length > 0) {
      modalTitle.textContent = "Erreur dans le formulaire";
      modalTitle.className = "modal-title text-danger";
      modalBody.innerHTML = errors.join("<br>");
      modal.show();
      return;
    }

    // === SUCCÈS : LIEN GOOGLE MAPS ===
    const [y, m, d] = birthday.split('-');
    const formattedDate = `${d}/${m}/${y}`;

    const cityMatch = address.match(/,\s*\d{5}\s*([^,]+)$/i);
    const city = cityMatch ? cityMatch[1].trim() : "Paris";
    const encodedAddress = encodeURIComponent(address);
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    modalTitle.textContent = `Bienvenue ${firstname}`;
    modalTitle.className = "modal-title";

    modalBody.innerHTML = `
      <p>Vous êtes né le <strong>${formattedDate}</strong> et vous habitez</p>
      <p class="mb-2"><strong>${address}</strong></p>
      <p>
        <a href="${googleMapsLink}" target="_blank" class="text-primary">
          Voir sur Google Maps
        </a>
      </p>
    `;

    modal.show();
  });
};