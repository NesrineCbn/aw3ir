function getLocation() {
    const adrInput = document.getElementById("adresse").value.trim();
  
    // Vérifie si c’est une coordonnée GPS (ex: "48.8566,2.3522")
    const gpsPattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    if (gpsPattern.test(adrInput)) {
      const [lat, lon] = adrInput.split(",").map(Number);
      showMap(lat, lon);
      return;
    }
  
    // Si l'utilisateur a saisi une adresse en texte, on tente de la géocoder
    if (adrInput.length > 0) {
      geocodeAddress(adrInput);
      return;
    }
  
    // Sinon, on utilise la géolocalisation du navigateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      alert("Géolocalisation non supportée");
    }
  }
  
  function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById("adresse").value = `${lat},${lon}`;
    calcNbChar("adresse");
    showMap(lat, lon);
  }
  
  function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          document.getElementById("adresse").value = `${lat},${lon}`;
          calcNbChar("adresse");
          showMap(lat, lon);
        } else {
          alert("Adresse introuvable !");
        }
      })
      .catch(() => alert("Erreur lors de la recherche d’adresse."));
  }
  
  function showMap(lat, lon) {
    document.getElementById("map-container").style.display = "block";
  
    const delta = 0.012;
    const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  
    document.getElementById("map").innerHTML =
      `<iframe width="100%" height="380" frameborder="0" scrolling="no" src="${src}"></iframe>`;
  }
  
  function showError(error) {
    let msg = "";
    switch (error.code) {
      case error.PERMISSION_DENIED: msg = "Autorisation refusée"; break;
      case error.POSITION_UNAVAILABLE: msg = "Position indisponible"; break;
      case error.TIMEOUT: msg = "Timeout"; break;
      default: msg = "Erreur inconnue"; break;
    }
    alert("GPS : " + msg);
  }
  
