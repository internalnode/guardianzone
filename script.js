
const bootMessages = [
  "ІНІЦІАЛІЗАЦІЯ ЛОКАЛЬНОГО ВУЗЛА...",
  "ЗАВАНТАЖЕННЯ АРХІВНОГО ІНДЕКСУ...",
  "СИНХРОНІЗАЦІЯ ПЕРИМЕТРИЧНИХ РЕЛЕ...",
  "ВІДНОВЛЕННЯ НЧ-КАНАЛУ...",
  "СКАНУВАННЯ АКТИВНИХ ТОЧОК...",
  "ОБМЕЖЕНИЙ ДОСТУП НАДАНО."
];

const bootLines = document.getElementById("boot-lines");
if (bootLines) {
  bootMessages.forEach((msg, index) => {
    setTimeout(() => {
      const line = document.createElement("div");
      line.textContent = "> " + msg;
      bootLines.appendChild(line);
    }, 330 * index);
  });
}

window.addEventListener("load", () => {
  setTimeout(() => {
    const boot = document.getElementById("boot");
    if (!boot) return;
    boot.style.opacity = "0";
    setTimeout(() => boot.style.display = "none", 800);
  }, 3900);
});

function pad(n){ return String(n).padStart(2, "0"); }

const nodeStart = Date.now();
let map = null;
window.map = null;
let mapReady = false;
let incidentLayer = null;
let majorLayer = null;

const majorPoints = [
  {
    id:"CENTRALE",
    coords:[51.389,30.102],
    status:"Émission instable",
    severity:"CRITIQUE",
    severityClass:"severity-high",
    body:[
      "Alimentation relevée hors cycle prévu autour des structures principales.",
      "Caméras indisponibles. Vérification terrain prioritaire."
    ]
  },
  {
    id:"PRIPYAT_BLOCK",
    coords:[51.407,30.065],
    status:"Mouvement non confirmé",
    severity:"ÉLEVÉE",
    severityClass:"severity-high",
    body:[
      "Déclenchements capteurs relevés dans plusieurs bâtiments résidentiels.",
      "Signal faible : contact porte, vibration brève, perte de flux."
    ]
  },
  {
    id:"NORTH_RELAY",
    coords:[51.423,30.082],
    status:"Relais instable",
    severity:"MOYENNE",
    severityClass:"severity-medium",
    body:[
      "Parasitage constant sur bande courte. Origine non isolée.",
      "Contrôle différé recommandé. Conditions de visibilité insuffisantes."
    ]
  },
  {
    id:"TUNNEL_SUD",
    coords:[51.356,30.072],
    status:"Contact capteur bref",
    severity:"FAIBLE",
    severityClass:"severity-low",
    body:[
      "Signal bref détecté sur fenêtre nocturne.",
      "Source non attribuée : relais dégradé, transmission courte ou unité mobile."
    ]
  },
  {
    id:"RELAY_03",
    coords:[51.377,30.118],
    status:"Alimentation hors cycle",
    severity:"ÉLEVÉE",
    severityClass:"severity-high",
    body:[
      "Relais alimenté malgré l’arrêt officiel du réseau.",
      "Réponse irrégulière. Accès terrain classé difficile."
    ]
  }
];

const incidentPool = [
  {id:"INC-041", sector:"RELAY_03", status:"Signal intermittent", severity:"Élevée", detail:"Réponse courte du relais. Vérification terrain recommandée.", recurrence:.45},
  {id:"INC-052", sector:"FOREST_BUNKER", status:"Accès verrouillé", severity:"Moyenne", detail:"Verrou manuel réengagé. Dernier passage non confirmé.", recurrence:.35},
  {id:"INC-066", sector:"CAMERA_07", status:"Flux indisponible", severity:"Faible", detail:"Caméra hors ligne. Capteur de mouvement encore actif.", recurrence:.60},
  {id:"INC-088", sector:"RAIL_DEPOT", status:"Transmission courte", severity:"Élevée", detail:"Signal basse fréquence détecté durant 4 secondes.", recurrence:.25},
  {id:"INC-094", sector:"NODE-01", status:"Maintenance non signée", severity:"Moyenne", detail:"Cycle technique exécuté sans identifiant conservé.", recurrence:.40},
  {id:"INC-117", sector:"REPEATER_NODE", status:"Signal perdu puis rétabli", severity:"Moyenne", detail:"Synchronisation instable avec délai réseau anormal.", recurrence:.32}
];

const incidentBase = {
  "RELAY_03":[51.377,30.118],
  "FOREST_BUNKER":[51.355,30.045],
  "CAMERA_07":[51.398,30.105],
  "RAIL_DEPOT":[51.335,30.135],
  "NODE-01":[51.392,30.088],
  "REPEATER_NODE":[51.378,30.125]
};

function seededRandom(seed){
  let h = 2166136261 >>> 0;
  for(let i=0;i<seed.length;i++){
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function(){
    h += h << 13; h ^= h >>> 7;
    h += h << 3; h ^= h >>> 17;
    h += h << 5;
    return ((h >>> 0) / 4294967295);
  };
}

function getPersistentIncidents(){
  const key = "myth_persistent_incidents_v75";
  try{
    const stored = JSON.parse(localStorage.getItem(key) || "null");
    if(stored && stored.expiresAt && Date.now() < stored.expiresAt) return stored.incidents;
  }catch(e){}

  const pool = [...incidentPool].sort(() => Math.random() - .5);
  const selected = [];

  while(selected.length < 3 && pool.length){
    const candidate = pool.shift();
    if(Math.random() <= candidate.recurrence || selected.length < 2){
      selected.push({...candidate, startedAt:Date.now()});
    }
  }

  const durationHours = 24 + Math.floor(Math.random() * 25);
  localStorage.setItem(key, JSON.stringify({
    createdAt:Date.now(),
    expiresAt:Date.now() + durationHours * 60 * 60 * 1000,
    incidents:selected
  }));

  return selected;
}

function gpsLine(coords){
  return `GPS : ${coords[0].toFixed(5)} / ${coords[1].toFixed(5)}`;
}

function iconHTML(cls){
  return `<div class="leaflet-incident-marker ${cls}"></div>`;
}

function makeIcon(cls, size=26){
  return L.divIcon({
    className:"",
    html:iconHTML(cls),
    iconSize:[size,size],
    iconAnchor:[size/2,size/2],
    popupAnchor:[0,-size/2]
  });
}

function majorPopup(point){
  return `
    <div class="map-point-popup">
      <h4>${point.id}</h4>
      <p><strong>${point.status}</strong></p>
      <p class="severity">SEVERITY : ${point.severity}</p>
      ${point.body.map(line => `<p class="muted">${line}</p>`).join("")}
      <p class="gps-line">${gpsLine(point.coords)}</p>
    </div>
  `;
}

function incidentAge(startedAt){
  const hours = Math.floor((Date.now() - startedAt) / (1000*60*60));
  return hours <= 1 ? "Statut mis à jour récemment." : `Statut inchangé depuis ${hours} h.`;
}

function incidentCoords(incident){
  const base = incidentBase[incident.sector] || [51.38,30.09];
  const stored = localStorage.getItem("myth_persistent_incidents_v75") || "";
  const rand = seededRandom(`${incident.id}_${incident.sector}_${stored.slice(0,40)}`);
  return [
    base[0] + (rand() - .5) * .018,
    base[1] + (rand() - .5) * .026
  ];
}

function incidentClass(severity){
  if(severity === "Élevée") return "severity-high";
  if(severity === "Faible") return "severity-low";
  return "severity-medium";
}

function incidentPopup(incident, coords){
  return `
    <div class="incident-popup">
      <h4>${incident.id}</h4>
      <p><strong>${incident.sector}</strong></p>
      <p>${incident.status}</p>
      <p class="muted">${incident.detail}</p>
      <p class="gps-line">${gpsLine(coords)}</p>
      <p class="muted">${incidentAge(incident.startedAt)}</p>
    </div>
  `;
}

function initMap(){
  if(mapReady || typeof L === "undefined") return;

  const el = document.getElementById("leaflet-map");
  if(!el) return;

  const bounds = L.latLngBounds([51.18,29.75],[51.55,30.45]);
  map = L.map(el, {
    zoomControl:false,
    attributionControl:false,
    scrollWheelZoom:true,
    doubleClickZoom:true,
    boxZoom:false,
    keyboard:false,
    touchZoom:true,
    minZoom:9,
    maxZoom:14,
    maxBounds:bounds,
    maxBoundsViscosity:1
  }).setView([51.389,30.099],10);

  window.map = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom:18,
    crossOrigin:true
  }).addTo(map);

  majorLayer = L.layerGroup().addTo(map);
  majorPoints.forEach(point => {
    L.marker(point.coords, {
      icon:makeIcon(point.severityClass, point.severityClass === "severity-high" ? 34 : 26),
      keyboard:false,
      riseOnHover:true
    }).bindPopup(majorPopup(point), {
      closeButton:true,
      autoPan:true,
      className:"incident-popup-shell"
    }).addTo(majorLayer);
  });

  incidentLayer = L.layerGroup().addTo(map);
  renderIncidents();

  map.fitBounds(bounds);
  mapReady = true;

  setTimeout(() => map.invalidateSize(), 300);
}

function renderIncidents(){
  if(!incidentLayer || typeof L === "undefined") return;

  incidentLayer.clearLayers();

  getPersistentIncidents().forEach(incident => {
    const coords = incidentCoords(incident);
    const cls = incidentClass(incident.severity);

    L.marker(coords, {
      icon:makeIcon(cls, cls === "severity-high" ? 34 : 26),
      keyboard:false,
      riseOnHover:true
    }).bindPopup(incidentPopup(incident, coords), {
      closeButton:true,
      autoPan:true,
      className:"incident-popup-shell"
    }).addTo(incidentLayer);
  });
}

function showScreen(id){
  document.querySelectorAll(".screen").forEach(screen => {
    const active = screen.id === id;
    screen.classList.toggle("active", active);
  });

  document.querySelectorAll(".tabs button").forEach(button => {
    button.classList.toggle("active", button.dataset.screen === id);
  });

  if(id === "map"){
    if(!mapReady) initMap();
    setTimeout(() => {
      if(map) map.invalidateSize();
    }, 250);
  }

  window.scrollTo({top:0, behavior:"smooth"});
}

document.querySelectorAll(".tabs button").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

function tickClock(){
  const now = new Date();
  const clock = document.getElementById("node-clock");
  if(clock) clock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const uptime = document.getElementById("uptime");
  if(uptime){
    const elapsed = Math.floor((Date.now() - nodeStart) / 1000);
    uptime.textContent = `${pad(Math.floor(elapsed/3600))}:${pad(Math.floor((elapsed%3600)/60))}:${pad(elapsed%60)}`;
  }
}

function updateSystems(){
  const qualities = ["DÉGRADÉ","INSTABLE","FAIBLE","RÉTABLI"];
  const quality = qualities[Math.floor(Math.random()*qualities.length)];

  const q = document.getElementById("quality");
  const signal = document.getElementById("signal-state");
  const channel = document.getElementById("channel");
  const dosimeter = document.getElementById("dosimeter");
  const loss = document.getElementById("loss");
  const wind = document.getElementById("wind");
  const pressure = document.getElementById("pressure");
  const camera = document.getElementById("camera-integrity");
  const latency = document.getElementById("latency");
  const fog = document.getElementById("fog");
  const thermal = document.getElementById("thermal");
  const grid = document.getElementById("grid-integrity");
  const field = document.getElementById("field-condition");
  const mapUpdate = document.getElementById("map-update");

  if(q) q.textContent = quality;
  if(signal) signal.textContent = "SIGNAL " + quality;
  if(channel) channel.textContent = ["OUVERT","PARASITÉ","PARTIEL","RETARDÉ"][Math.floor(Math.random()*4)];
  if(dosimeter) dosimeter.textContent = (0.28 + Math.random()*0.46).toFixed(2) + " µSv/h";
  if(loss) loss.textContent = Math.floor(8 + Math.random()*19) + "%";
  if(wind) wind.textContent = ["N/NE 11 KM/H","E 07 KM/H","NW 18 KM/H","CALME","S 14 KM/H"][Math.floor(Math.random()*5)];
  if(pressure) pressure.textContent = Math.floor(1001 + Math.random()*18) + " HPA";
  if(camera) camera.textContent = Math.floor(22 + Math.random()*31) + "%";
  if(latency) latency.textContent = Math.floor(240 + Math.random()*390) + " MS";
  if(fog) fog.textContent = ["FAIBLE","MOYEN","DENSE","IRRÉGULIER"][Math.floor(Math.random()*4)];
  if(thermal) thermal.textContent = ["HORS LIGNE","AUCUNE IMAGE","PARTIEL","PARASITES SEULS"][Math.floor(Math.random()*4)];
  if(grid) grid.textContent = Math.floor(25 + Math.random()*31) + "%";
  if(field) field.textContent = ["STABLE","HUMIDE","VISIBILITÉ RÉDUITE","INTERFÉRENCES"][Math.floor(Math.random()*4)];

  if(mapUpdate){
    const now = new Date();
    mapUpdate.textContent = `LAST UPDATE : ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }
}

function pushLog(){
  const log = document.getElementById("system-log");
  if(!log) return;

  const events = [
    "CAMERA FEED LOST — SECTOR NORTH",
    "LOW FREQUENCY BURST DETECTED",
    "PERIMETER RELAY 03 RESPONDING",
    "UNCONFIRMED MOVEMENT — RESIDENTIAL BLOCK",
    "DOSIMETER SPIKE NORMALIZED",
    "SIGNAL DROP — 4 SECONDS",
    "UNSIGNED ACCESS — RELAY 03",
    "DOOR SENSOR TRIGGERED — EMPTY FEED",
    "MYTH TASKING PENDING"
  ];

  const now = new Date();
  const line = document.createElement("div");
  line.textContent = `[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}] ${events[Math.floor(Math.random()*events.length)]}`;
  log.appendChild(line);

  while(log.children.length > 6) log.removeChild(log.firstElementChild);
}

const safehouseData = {
  node01:{
    title:"NODE-01 // PRIMARY RELAY",
    status:"ACTIF",
    power:"RÉSEAU LOCAL",
    signal:"STABLE",
    access:"01:42",
    image:"https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1200&auto=format&fit=crop",
    caption:"NODE-01 // cliché récupéré depuis caméra interne — image partielle",
    body:["Ancien site technique réutilisé.","Relais longue portée actif.","Réserve opérationnelle maintenue."]
  },
  forest:{
    title:"FOREST_BUNKER",
    status:"INSTABLE",
    power:"HORS LIGNE",
    signal:"INTERMITTENT",
    access:"INCONNU",
    image:"https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
    caption:"FOREST_BUNKER // cliché extérieur — visibilité réduite",
    body:["Traces récentes détectées.","Porte verrouillée manuellement.","Présence récente non confirmée."]
  },
  rail:{
    title:"RAIL_DEPOT",
    status:"RESTREINT",
    power:"PARTIEL",
    signal:"FAIBLE",
    access:"03:18",
    image:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    caption:"RAIL_DEPOT // cliché longue distance — source non confirmée",
    body:["Réserve opérationnelle maintenue.","Accès verrouillé manuellement.","Transmission détectée cette nuit."]
  },
  north:{
    title:"NORTH_SHELTER",
    status:"SCELLÉ",
    power:"BATTERIE LOCALE",
    signal:"FAIBLE",
    access:"INCONNU",
    image:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    caption:"NORTH_SHELTER // cliché périmètre — coordonnées masquées",
    body:["Abri secondaire utilisé comme point de repli.","Alimentation faible.","Ouverture non recommandée sans vérification terrain."]
  }
};

function renderSafehouse(id="node01"){
  const data = safehouseData[id];
  const box = document.getElementById("safehouse-detail");
  if(!box || !data) return;

  box.innerHTML = `
    <div class="card-title">SELECTED CACHE</div>
    <h3>${data.title}</h3>
    <div class="node-meta">
      <div><label>POWER</label><p>${data.power}</p></div>
      <div><label>SIGNAL</label><p>${data.signal}</p></div>
      <div><label>LAST ACCESS</label><p>${data.access}</p></div>
      <div><label>STATUS</label><p>${data.status}</p></div>
    </div>
    <div class="safehouse-photo">
      <img src="${data.image}" alt="${data.title}">
      <div class="photo-caption">${data.caption}</div>
    </div>
    <div class="node-description">
      ${data.body.map(p => `<p>${p}</p>`).join("")}
    </div>
  `;
}

document.querySelectorAll(".safe-point").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".safe-point").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    renderSafehouse(button.dataset.node);
  });
});

window.addEventListener("load", () => {
  tickClock();
  updateSystems();
  renderSafehouse("node01");
  showScreen("map");
  setTimeout(initMap, 500);

  setInterval(tickClock, 1000);
  setInterval(updateSystems, 11000);
  setInterval(pushLog, 18000);
});
