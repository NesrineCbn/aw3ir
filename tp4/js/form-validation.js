function calcNbChar(id) {
  const input = document.getElementById(id);
  const count = input.closest('.row').querySelector('[data-count]');
  count.textContent = input.value.length + " car.";
}

// CARTE EN DIRECT QUAND ON ÉCRIT
function updateMapFromAddress() {
  const adresse = document.getElementById("adresse").value.trim();
  const coords = adresse.split(',');
  if (coords.length !== 2) return;
  
  const lat = parseFloat(coords[0]);
  const lon = parseFloat(coords[1]);
  if (isNaN(lat) || isNaN(lon)) return;

  document.getElementById("map-container").style.display = "block";
  const delta = 0.012;
  const bbox = `${lon-delta},${lat-delta},${lon+delta},${lat+delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

  document.getElementById("map").innerHTML = 
    `<iframe width="100%" height="380" frameborder="0" scrolling="no" src="${src}"></iframe>`;
}

function displayContactList() {
  const list = contactStore.getList();
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";
  list.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>${c.firstname}</td>
      <td>${c.date}</td>
      <td><a href="https://openstreetmap.org/?mlat=${c.adress.split(',')[0]}&mlon=${c.adress.split(',')[1]}#map=16/${c.adress}" target="_blank">${c.adress}</a></td>
      <td><a href="mailto:${c.mail}">${c.mail}</a></td>
    `;
    tbody.appendChild(tr);
  });
  document.getElementById("count").textContent = list.length;
}

function validate() {
  let ok = true;
  ["name","firstname"].forEach(id => {
    const f = document.getElementById(id);
    if (f.value.trim().length < 5) { f.classList.add("is-invalid"); ok = false; }
    else f.classList.remove("is-invalid");
  });
  const birth = document.getElementById("birth");
  if (birth.value && new Date(birth.value) > new Date()) {
    birth.classList.add("is-invalid"); ok = false;
  }
  const adr = document.getElementById("adresse");
  if (adr.value.length < 5) { adr.classList.add("is-invalid"); ok = false; }
  const mail = document.getElementById("mail");
  if (!/^\S+@\S+\.\S+$/.test(mail.value)) { mail.classList.add("is-invalid"); ok = false; }
  return ok;
}

window.onload = function () {
  displayContactList();

  document.getElementById("gps").addEventListener("click", getLocation);
  document.getElementById("adresse").addEventListener("input", updateMapFromAddress);

  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (validate()) {
      contactStore.add(
        document.getElementById("name").value.trim(),
        document.getElementById("firstname").value.trim(),
        document.getElementById("birth").value,
        document.getElementById("adresse").value,
        document.getElementById("mail").value.trim()
      );
      this.reset();
      document.querySelectorAll("[data-count]").forEach(el => el.textContent = "0 car.");
      document.getElementById("map-container").style.display = "none";
      document.getElementById("map").innerHTML = "";
      displayContactList();

      const alert = document.createElement("div");
      alert.className = "alert alert-success mt-3";
      alert.textContent = "Contact ajouté avec succès !";
      document.querySelector("form").appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    }
  });

  document.getElementById("resetList").addEventListener("click", () => {
    if (confirm("Vider toute la liste ?")) {
      contactStore.reset();
      displayContactList();
    }
  });
};