
const bootMessages = [
  "Chargement du noyau local...",
  "Synchronisation des relais périphériques...",
  "Lecture des anciennes coordonnées...",
  "Connexion au réseau basse fréquence...",
  "Analyse des points actifs...",
  "Accès limité accordé."
];

const bootLines = document.getElementById("boot-lines");

bootMessages.forEach((msg, index) => {
  setTimeout(() => {
    const line = document.createElement("div");
    line.textContent = "> " + msg;
    bootLines.appendChild(line);
  }, 360 * index);
});

window.addEventListener("load", () => {
  setTimeout(() => {
    const boot = document.getElementById("boot");
    boot.style.opacity = "0";
    setTimeout(() => boot.style.display = "none", 900);
  }, 4300);
});

let map = null;
let mapReady = false;

const reports = [
  {
    coords:[51.3890,30.0990],
    title:"CENTRALE",
    severity:"critical",
    severityLabel:"CRITIQUE",
    category:"Émission instable",
    text:"Fluctuations électriques relevées autour des installations principales.",
    detail:"Aucune présence visuelle confirmée. Le signal pourrait provenir d’un circuit autonome encore actif."
  },
  {
    coords:[51.4048,30.0569],
    title:"PRIPYAT",
    severity:"high",
    severityLabel:"ÉLEVÉ",
    category:"Passage récent",
    text:"Traces de déplacement supposées dans plusieurs bâtiments résidentiels.",
    detail:"Les éléments reçus sont faibles : capteur de porte, vibration brève, puis silence complet."
  },
  {
    coords:[51.3180,30.0710],
    title:"SECTEUR ROUGE",
    severity:"medium",
    severityLabel:"MOYEN",
    category:"Interférences radio",
    text:"Parasites persistants sur bande courte.",
    detail:"Vérification recommandée lorsque les conditions météo seront plus stables."
  },
  {
    coords:[51.2750,30.2210],
    title:"POINT D’OBSERVATION",
    severity:"low",
    severityLabel:"FAIBLE",
    category:"Signal nocturne",
    text:"Signal court détecté durant la nuit.",
    detail:"Source indéterminée : relais dégradé, transmission brève ou présence mobile."
  },
  {
    coords:[51.3530,29.9800],
    title:"ANCIEN RELAIS",
    severity:"medium",
    severityLabel:"MOYEN",
    category:"Alimentation active",
    text:"Le relais semble encore alimenté malgré l’arrêt officiel du réseau.",
    detail:"Données irrégulières. Accès terrain difficile. Vérification par MYTH en attente."
  }
];

function setReport(report){
  const box = document.getElementById("report");
  box.innerHTML = `
    <h3>${report.title}</h3>
    <p><strong>${report.category}</strong> — GRAVITÉ : ${report.severityLabel}</p>
    <p>${report.text}</p>
    <small>${report.detail}</small>
  `;
}

function initMap(){
  const el = document.getElementById("map");
  if(!el || typeof L === "undefined") return;

  const bounds = L.latLngBounds(
    [51.18, 29.75],
    [51.55, 30.45]
  );

  map = L.map("map", {
    zoomControl:false,
    attributionControl:false,
    dragging:true,
    scrollWheelZoom:true,
    doubleClickZoom:true,
    boxZoom:false,
    keyboard:false,
    touchZoom:true,
    minZoom:9,
    maxZoom:14,
    maxBounds:bounds,
    maxBoundsViscosity:1.0
  }).setView([51.3890, 30.0990], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom:18,
    crossOrigin:true
  }).addTo(map);

  map.fitBounds(bounds);

  reports.forEach((report) => {
    const icon = L.divIcon({
      className: "",
      html: `<div class="severity-marker severity-${report.severity}"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });

    const marker = L.marker(report.coords, { icon }).addTo(map);

    marker.bindPopup(`
      <div style="font-family:IBM Plex Mono,monospace;font-size:11px;letter-spacing:2px;margin-bottom:10px;color:#d6dccf;">${report.title}</div>
      <div style="font-size:12px;letter-spacing:2px;color:#9aaa7d;margin-bottom:8px;">GRAVITÉ : ${report.severityLabel}</div>
      <div style="font-size:13px;line-height:1.65;color:#aeb6a8;">${report.text}</div>
    `);

    marker.on("click", () => setReport(report));
  });

  mapReady = true;
  setTimeout(() => map.invalidateSize(), 250);
}

function showScreen(id){
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".menu button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.screen === id);
  });

  if(id === "screen-status"){
    if(!mapReady) initMap();
    else setTimeout(() => {
      map.invalidateSize();
      map.setView([51.3890, 30.0990], 10);
    }, 250);
  }

  window.scrollTo({top:0, behavior:"smooth"});
}

document.querySelectorAll(".menu button").forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.screen));
});
