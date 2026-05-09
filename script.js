const bootMessages=["ІНІЦІАЛІЗАЦІЯ ЛОКАЛЬНОГО ВУЗЛА...","ЗАВАНТАЖЕННЯ АРХІВНОГО ІНДЕКСУ...","СИНХРОНІЗАЦІЯ ПЕРИМЕТРИЧНИХ РЕЛЕ...","ВІДНОВЛЕННЯ НЧ-КАНАЛУ...","СКАНУВАННЯ АКТИВНИХ ТОЧОК...","ОБМЕЖЕНИЙ ДОСТУП НАДАНО."];
const bootLines=document.getElementById("boot-lines");bootMessages.forEach((m,i)=>setTimeout(()=>{const l=document.createElement("div");l.textContent="> "+m;bootLines.appendChild(l)},330*i));
window.addEventListener("load",()=>setTimeout(()=>{const b=document.getElementById("boot");b.style.opacity="0";setTimeout(()=>b.style.display="none",800)},3900));
let map,mapReady=false;
const reports=[
{coords:[51.3890,30.0990],title:"CENTRALE",severity:"critical",label:"CRITICAL",category:"Unstable emission",text:"Alimentation relevée hors cycle prévu autour des structures principales.",detail:"Caméras indisponibles. Vérification terrain prioritaire."},
{coords:[51.4048,30.0569],title:"PRIPYAT",severity:"high",label:"ÉLEVÉ",category:"Recent movement",text:"Déclenchements capteurs relevés dans plusieurs bâtiments résidentiels.",detail:"Signal faible : contact porte, vibration brève, perte de flux."},
{coords:[51.3180,30.0710],title:"SECTEUR ROUGE",severity:"medium",label:"MOYEN",category:"Radio interference",text:"Parasitage constant sur bande courte. Origine non isolée.",detail:"Contrôle différé recommandé. Conditions de visibilité insuffisantes."},
{coords:[51.2750,30.2210],title:"OBSERVATION EAST",severity:"low",label:"FAIBLE",category:"Night signal",text:"Signal bref détecté sur fenêtre nocturne.",detail:"Source non attribuée : relais dégradé, transmission courte ou unité mobile."},
{coords:[51.3530,29.9800],title:"ANCIEN RELAIS",severity:"medium",label:"MOYEN",category:"Active power",text:"Relais alimenté malgré l’arrêt officiel du réseau.",detail:"Réponse irrégulière. Accès terrain classé difficile."}
];
function showReport(r){document.getElementById("report").innerHTML=`<div class="card-title">ОБРАНА ТОЧКА</div><h3>${r.title}</h3><p><strong>${r.category}</strong> — SEVERITY : ${r.label}</p><p>${r.text}</p><p style="color:#778070">${r.detail}</p>`}
function initMap(){if(mapReady||typeof L==="undefined")return;const bounds=L.latLngBounds([51.18,29.75],[51.55,30.45]);map=L.map("leaflet-map",{zoomControl:false,attributionControl:false,scrollWheelZoom:true,doubleClickZoom:true,boxZoom:false,keyboard:false,touchZoom:true,minZoom:9,maxZoom:14,maxBounds:bounds,maxBoundsViscosity:1}).setView([51.389,30.099],10);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,crossOrigin:true}).addTo(map);reports.forEach(r=>{const icon=L.divIcon({className:"",html:`<div class="severity-marker ${r.severity}"></div>`,iconSize:[25,25],iconAnchor:[12,12],popupAnchor:[0,-12]});const marker=L.marker(r.coords,{icon}).addTo(map);marker.bindPopup(`<div style="font-family:IBM Plex Mono,monospace;font-size:11px;letter-spacing:2px;margin-bottom:8px;">${r.title}</div><div style="font-size:12px;color:#9aaa7d;margin-bottom:8px;">SEVERITY : ${r.label}</div><div style="font-size:13px;line-height:1.6;color:#aeb6a8;">${r.text}</div>`);marker.on("click",()=>showReport(r))});map.fitBounds(bounds);mapReady=true;setTimeout(()=>map.invalidateSize(),250)}
function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelectorAll(".tabs button").forEach(b=>b.classList.toggle("active",b.dataset.screen===id));if(id==="map"){if(!mapReady)initMap();else setTimeout(()=>map.invalidateSize(),250)}window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".tabs button").forEach(btn=>btn.addEventListener("click",()=>showScreen(btn.dataset.screen)));
const events=[
"CAMERA FEED LOST — SECTOR NORTH",
"LOW FREQUENCY BURST DETECTED",
"PERIMETER RELAY 03 RESPONDING",
"UNCONFIRMED MOVEMENT — RESIDENTIAL BLOCK",
"DOSIMETER SPIKE NORMALIZED",
"SIGNAL DROP — 4 SECONDS",
"UNSIGNED ACCESS — RELAY 03",
"ARCHIVE SEGMENT CORROMPU",
"DOOR SENSOR TRIGGERED — EMPTY FEED",
"MYTH TASKING PENDING"
];
function pad(n){return String(n).padStart(2,"0")}
function pushLog(){const log=document.getElementById("system-log");if(!log)return;const now=new Date(),line=document.createElement("div");line.textContent=`[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}] ${events[Math.floor(Math.random()*events.length)]}`;log.appendChild(line);while(log.children.length>5)log.removeChild(log.firstElementChild)}
function updateSystems(){
const q=document.getElementById("quality"),d=document.getElementById("dosimeter"),c=document.getElementById("channel"),s=document.getElementById("signal-state"),l=document.getElementById("loss");
const wind=document.getElementById("wind"),pressure=document.getElementById("pressure"),cam=document.getElementById("camera-integrity"),lat=document.getElementById("latency"),mu=document.getElementById("map-update");
const qualities=["DÉGRADÉ","INSTABLE","FAIBLE","RÉTABLI"],quality=qualities[Math.floor(Math.random()*qualities.length)];
if(q){q.textContent=quality;q.classList.toggle("flash-warn",quality==="INSTABLE"||quality==="FAIBLE")}
if(s)s.textContent="SIGNAL "+quality;
if(c)c.textContent=["OUVERT","PARASITÉ","PARTIEL","RETARDÉ"][Math.floor(Math.random()*4)];
if(d)d.textContent=(0.28+Math.random()*0.46).toFixed(2)+" µSv/h";
if(l)l.textContent=Math.floor(8+Math.random()*19)+"%";
if(wind)wind.textContent=["N/NE 11 KM/H","E 07 KM/H","NW 18 KM/H","CALME","S 14 KM/H"][Math.floor(Math.random()*5)];
if(pressure)pressure.textContent=Math.floor(1001+Math.random()*18)+" HPA";
if(cam)cam.textContent=Math.floor(22+Math.random()*31)+"%";
if(lat)lat.textContent=Math.floor(240+Math.random()*390)+" MS";
if(mu){const now=new Date();mu.textContent=`LAST UPDATE : ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`}
}
setInterval(()=>{pushLog();updateSystems()},11000);

/* v8 living system */
const nodeStart = Date.now();
const previousStates = [
  "Le relais 03 a répondu avant l’ouverture manuelle du terminal.",
  "La caméra 12 a perdu l’image mais a continué d’émettre un signal audio.",
  "Le capteur du portail nord s’est fermé sans commande enregistrée.",
  "Deux fichiers d’archives ont changé d’état pendant que le terminal était hors ligne.",
  "Le canal basse fréquence s’est ouvert durant 11 secondes. Source inconnue."
];

const rareEvents = [
  "Unsigned maintenance trace — relay 03",
  "Le canal thermique a répondu sans image",
  "Le microphone terrain a détecté un impact métallique",
  "Erreur de vérification d’archive",
  "Panneau d’accès ouvert — aucun identifiant détecté",
  "Ancienne caméra alimentée durant 00:00:04",
  "État du capteur modifié avant synchronisation"
];

function tickClock(){
  const now = new Date();
  const clock = document.getElementById("node-clock");
  if(clock) clock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const uptime = document.getElementById("uptime");
  if(uptime){
    const elapsed = Math.floor((Date.now() - nodeStart) / 1000);
    const h = pad(Math.floor(elapsed / 3600));
    const m = pad(Math.floor((elapsed % 3600) / 60));
    const s = pad(elapsed % 60);
    uptime.textContent = `${h}:${m}:${s}`;
  }

  const prevTime = document.getElementById("previous-state-time");
  if(prevTime && prevTime.textContent.includes("pending")){
    const offset = Math.floor(19 + Math.random()*210);
    prevTime.textContent = `Horodatage récupéré : T-${offset} min`;
  }
}

function seedPreviousState(){
  const target = document.getElementById("previous-state");
  if(target) target.textContent = previousStates[Math.floor(Math.random()*previousStates.length)];
}

function updateEnvironment(){
  const fog = document.getElementById("fog");
  const thermal = document.getElementById("thermal");
  const grid = document.getElementById("grid-integrity");
  const field = document.getElementById("field-condition");

  if(fog) fog.textContent = ["FAIBLE","MOYEN","DENSE","IRRÉGULIER"][Math.floor(Math.random()*4)];
  if(thermal){
    const value = ["HORS LIGNE","AUCUNE IMAGE","PARTIEL","PARASITES SEULS"][Math.floor(Math.random()*4)];
    thermal.textContent = value;
    thermal.classList.toggle("system-critical", value === "AUCUNE IMAGE" || value === "PARASITES SEULS");
  }
  if(grid) grid.textContent = Math.floor(25 + Math.random()*31) + "%";
  if(field) field.textContent = ["STABLE","HUMIDE","VISIBILITÉ RÉDUITE","INTERFÉRENCES"][Math.floor(Math.random()*4)];
}

function rareSystemEvent(){
  if(Math.random() > 0.42) return;
  pushSystemLog(rareEvents[Math.floor(Math.random()*rareEvents.length)]);

  const entries = document.querySelectorAll(".file-entry strong");
  if(entries.length){
    const entry = entries[Math.floor(Math.random()*entries.length)];
    entry.classList.add("archive-updated");
    setTimeout(()=>entry.classList.remove("archive-updated"), 9000);
  }
}

setInterval(tickClock, 1000);
setInterval(updateEnvironment, 14000);
setInterval(rareSystemEvent, 22000);

window.addEventListener("load", ()=>{
  seedPreviousState();
  tickClock();
  updateEnvironment();
});

function pushSystemLog(message){
  const log=document.getElementById("system-log");
  if(!log)return;
  const now=new Date(),line=document.createElement("div");
  line.textContent=`[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}] ${message}`;
  log.appendChild(line);
  while(log.children.length>5)log.removeChild(log.firstElementChild);
}

/* v14 map-first boot */
window.addEventListener("load", ()=>{
  setTimeout(()=>{
    if(document.getElementById("map")?.classList.contains("active")){
      initMap();
    }
  }, 450);
});

/* v15 — active incidents and credibility layer */
const incidentStates = [
  ["RELAY_03","ALIMENTÉ HORS CYCLE"],
  ["SOUTH_TUNNEL","CONTACT PERDU"],
  ["PRIPYAT_BLOCK","MOUVEMENT NON CONFIRMÉ"],
  ["CAMERA_07","HORS LIGNE / SENSOR ACTIF"],
  ["NORTH_GATE","VERROUILLÉ / PING RECEIVED"],
  ["ARCHIVE_12","CORROMPU / RECENT CHANGE"],
  ["BLACK_CHANNEL","HANDSHAKE FAILED"]
];

function updateIncidents(){
  const list = document.getElementById("incident-list");
  if(!list) return;

  const shuffled = [...incidentStates].sort(()=>Math.random()-.5).slice(0,3);
  list.innerHTML = shuffled.map(item=>`
    <div>
      <span>${item[0]}</span>
      <strong>${item[1]}</strong>
    </div>
  `).join("");
}

setInterval(updateIncidents, 18000);
window.addEventListener("load", updateIncidents);

/* v17 exploration fragments */
const feedFragments = [
"04:18 — Transmission brève sur bande courte.",
"04:41 — Mouvement non confirmé dans bloc résidentiel.",
"05:02 — Camera_07 revenue ONLINE durant 3 secondes.",
"05:37 — Verrou secondaire refermé sans commande.",
"06:11 — Relais 03 inaccessible puis réinitialisé.",
"06:42 — Bruit métallique détecté sur microphone terrain."
];

function pushFieldFragment(){
  const feed = document.getElementById("field-feed");
  if(!feed) return;

  const entry = document.createElement("div");
  entry.textContent = feedFragments[Math.floor(Math.random()*feedFragments.length)];
  entry.classList.add("new-fragment");

  feed.prepend(entry);

  while(feed.children.length > 6){
    feed.removeChild(feed.lastElementChild);
  }

  setTimeout(()=>entry.classList.remove("new-fragment"), 5000);
}

setInterval(pushFieldFragment, 26000);

/* hidden archive evolution */
window.addEventListener("load", ()=>{
  setTimeout(()=>{
    const files = document.querySelector(".files-list");
    if(!files) return;

    const btn = document.createElement("button");
    btn.className = "file-entry hidden-fragment";
    btn.innerHTML = `
      <span>FILE 07</span>
      <em>[UNINDEXED]</em>
      <strong>REPEATER_NODE</strong>
      <small>T-07 MIN // REL: 0.21</small>
    `;

    files.appendChild(btn);
  }, 45000);
});

/* v31 primary node dynamics */
const nodeUpdates = [
  "Maintenance trace detected near NODE-01.",
  "Long range relay briefly synchronized.",
  "Manual lock state changed at RAIL_DEPOT.",
  "FOREST BUNKER responded for 4 seconds.",
  "Unregistered maintenance cycle detected.",
  "Secondary generator briefly active."
];

function injectNodeUpdate(){
  const feed = document.getElementById("system-log") || document.getElementById("field-feed");
  if(!feed) return;

  const line = document.createElement("div");
  line.className = "system-log-entry-live";
  const d = new Date();
  const hh = String(d.getHours()).padStart(2,"0");
  const mm = String(d.getMinutes()).padStart(2,"0");

  line.textContent = `[${hh}:${mm}] ${nodeUpdates[Math.floor(Math.random()*nodeUpdates.length)]}`;
  feed.prepend(line);

  while(feed.children.length > 8){
    feed.removeChild(feed.lastElementChild);
  }
}

window.addEventListener("load", ()=>{
  setInterval(injectNodeUpdate, 120000);
});

/* v33 safehouses tab */
const safehouseData = {
  node01:{
    title:"NODE-01 // PRIMARY RELAY",
    status:"ACTIF",
    power:"RÉSEAU LOCAL",
    signal:"STABLE",
    access:"01:42",
    image:"https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1200&auto=format&fit=crop",
    caption:"NODE-01 // cliché récupéré depuis caméra interne — image partielle",
    body:[
      "Ancien site technique réutilisé comme point d’ancrage principal.",
      "Relais longue portée actif. Maintenance récente confirmée.",
      "Réserve opérationnelle maintenue. Inventaire détaillé absent du terminal."
    ]
  },
  forest:{
    title:"FOREST_BUNKER",
    status:"INSTABLE",
    power:"HORS LIGNE",
    signal:"INTERMITTENT",
    access:"INCONNU",
    image:"https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
    caption:"FOREST_BUNKER // cliché extérieur — visibilité réduite",
    body:[
      "Humidité importante dans les accès bas.",
      "Porte verrouillée manuellement.",
      "Présence récente non confirmée."
    ]
  },
  rail:{
    title:"RAIL_DEPOT",
    status:"RESTREINT",
    power:"PARTIEL",
    signal:"FAIBLE",
    access:"03:18",
    image:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    caption:"RAIL_DEPOT // cliché longue distance — source non confirmée",
    body:[
      "Réserve opérationnelle maintenue.",
      "Accès verrouillé manuellement.",
      "Transmission courte détectée cette nuit."
    ]
  },
  north:{
    title:"NORTH_SHELTER",
    status:"SCELLÉ",
    power:"BATTERIE LOCALE",
    signal:"FAIBLE",
    access:"INCONNU",
    image:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    caption:"NORTH_SHELTER // cliché périmètre — coordonnées masquées",
    body:[
      "Abri secondaire utilisé comme point de repli.",
      "Alimentation faible. Relais local silencieux.",
      "Ouverture non recommandée sans vérification terrain."
    ]
  }
};

function renderSafehouse(id){
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
      ${data.body.map(p=>`<p>${p}</p>`).join("")}
    </div>
  `;
}

document.querySelectorAll(".safe-point").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".safe-point").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderSafehouse(btn.dataset.node);
  });
});

/* v51 — simple active tab sync */
window.addEventListener("load", ()=>{
  const buttons = document.querySelectorAll(".tabs button");
  const screens = document.querySelectorAll(".screen");

  buttons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const target = btn.dataset.screen;
      if(!target) return;

      buttons.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");

      screens.forEach(screen=>{
        screen.classList.toggle("active", screen.id === target);
      });

      window.scrollTo({top:0, behavior:"smooth"});
    });
  });
});

/* v52 — measured fixed HUD spacing */
function updateFixedHudSpacing(){
  const header = document.querySelector(".app-header, .header, .topbar");
  const tabs = document.querySelector(".tabs");
  const bottom = document.querySelector(".bottom-status, .footer-status, .system-footer");

  const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
  const tabsHeight = tabs ? Math.ceil(tabs.getBoundingClientRect().height) : 0;
  const bottomHeight = bottom ? Math.ceil(bottom.getBoundingClientRect().height) : 0;

  document.documentElement.style.setProperty("--fixed-header-height", headerHeight + "px");
  document.documentElement.style.setProperty("--hud-top-height", (headerHeight + tabsHeight) + "px");
  document.documentElement.style.setProperty("--hud-bottom-height", bottomHeight + "px");
}

window.addEventListener("load", updateFixedHudSpacing);
window.addEventListener("resize", updateFixedHudSpacing);
window.addEventListener("orientationchange", ()=>{
  setTimeout(updateFixedHudSpacing, 250);
});
setTimeout(updateFixedHudSpacing, 600);

/* v57 — default to MAP after operator removal */
window.addEventListener("load", ()=>{
  const screens = document.querySelectorAll(".screen");
  const buttons = document.querySelectorAll(".tabs button");
  const activeScreen = document.querySelector(".screen.active");
  if(!activeScreen && document.getElementById("map")){
    document.getElementById("map").classList.add("active");
    buttons.forEach(b=>b.classList.toggle("active", b.dataset.screen === "map"));
  }
});


/* v58 — daily randomized incidents */
const incidentsPoolV58 = [
  {
    id:"INC-041",
    sector:"RELAY_03",
    status:"Signal intermittent",
    severity:"Élevée",
    weight:8,
    detail:"Réponse courte du relais. Vérification terrain recommandée."
  },
  {
    id:"INC-052",
    sector:"FOREST_BUNKER",
    status:"Accès verrouillé",
    severity:"Moyenne",
    weight:5,
    detail:"Verrou manuel réengagé. Dernier passage non confirmé."
  },
  {
    id:"INC-066",
    sector:"CAMERA_07",
    status:"Flux indisponible",
    severity:"Faible",
    weight:7,
    detail:"Caméra hors ligne. Capteur de mouvement encore actif."
  },
  {
    id:"INC-073",
    sector:"NORTH_GATE",
    status:"État contradictoire",
    severity:"Moyenne",
    weight:4,
    detail:"Porte signalée verrouillée, mais ping capteur reçu."
  },
  {
    id:"INC-088",
    sector:"RAIL_DEPOT",
    status:"Transmission courte",
    severity:"Élevée",
    weight:3,
    detail:"Signal basse fréquence détecté durant 4 secondes."
  },
  {
    id:"INC-094",
    sector:"NODE-01",
    status:"Maintenance non signée",
    severity:"Moyenne",
    weight:4,
    detail:"Cycle technique exécuté sans identifiant conservé."
  },
  {
    id:"INC-102",
    sector:"TUNNEL_SUD",
    status:"Contact capteur bref",
    severity:"Faible",
    weight:5,
    detail:"Réponse isolée du capteur d’accès sud. Aucun flux visuel."
  },
  {
    id:"INC-117",
    sector:"REPEATER_NODE",
    status:"Signal perdu puis rétabli",
    severity:"Moyenne",
    weight:4,
    detail:"Synchronisation instable avec délai réseau anormal."
  },
  {
    id:"INC-126",
    sector:"NORTH_SHELTER",
    status:"Alimentation locale faible",
    severity:"Faible",
    weight:4,
    detail:"Batterie basse. Relais local silencieux."
  },
  {
    id:"INC-139",
    sector:"BLACK_CHANNEL",
    status:"Tentative d’accès rejetée",
    severity:"Élevée",
    weight:2,
    detail:"Requête non authentifiée. Source non attribuée."
  }
];

function seededRandomV58(seed){
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

function weightedIncidentPickV58(pool, randomFn){
  const total = pool.reduce((sum, item)=>sum + item.weight, 0);
  let roll = randomFn() * total;

  for(const item of pool){
    roll -= item.weight;
    if(roll <= 0) return item;
  }

  return pool[0];
}

function generateDailyIncidentsV58(count = 3){
  const today = new Date().toISOString().slice(0,10);
  const key = "myth_daily_incidents_" + today;

  const cached = localStorage.getItem(key);
  if(cached){
    try{
      return JSON.parse(cached);
    }catch(e){}
  }

  const randomFn = seededRandomV58(today + "_MYTH_NODE");
  const available = [...incidentsPoolV58];
  const selected = [];

  while(selected.length < count && available.length){
    const picked = weightedIncidentPickV58(available, randomFn);
    selected.push(picked);

    const idx = available.findIndex(item=>item.id === picked.id);
    if(idx >= 0) available.splice(idx, 1);
  }

  // Clean old incident cache keys
  Object.keys(localStorage).forEach(k=>{
    if(k.startsWith("myth_daily_incidents_") && k !== key){
      localStorage.removeItem(k);
    }
  });

  localStorage.setItem(key, JSON.stringify(selected));
  return selected;
}

function renderDailyIncidentsV58(){
  const container = document.getElementById("random-incidents");
  if(!container) return;

  const incidents = generateDailyIncidentsV58(3);

  container.innerHTML = incidents.map(incident=>{
    const severityClass =
      incident.severity === "Élevée" ? "high" :
      incident.severity === "Critique" ? "critical" : "";

    return `
      <div class="random-incident ${severityClass}">
        <div class="random-incident-top">
          <span class="random-incident-id">${incident.id}</span>
          <span class="random-incident-severity">${incident.severity}</span>
        </div>

        <div class="random-incident-sector">${incident.sector}</div>
        <div class="random-incident-status">${incident.status}</div>
        <div class="random-incident-detail">${incident.detail}</div>
      </div>
    `;
  }).join("");
}

window.addEventListener("load", renderDailyIncidentsV58);


/* v59 — persistent incidents over 24-48h */
const incidentPersistencePoolV59 = [
  {
    id:"INC-041",
    sector:"RELAY_03",
    status:"Signal intermittent",
    severity:"Élevée",
    detail:"Réponse courte du relais. Vérification terrain recommandée.",
    recurrence:0.45
  },
  {
    id:"INC-052",
    sector:"FOREST_BUNKER",
    status:"Accès verrouillé",
    severity:"Moyenne",
    detail:"Verrou manuel réengagé. Dernier passage non confirmé.",
    recurrence:0.35
  },
  {
    id:"INC-066",
    sector:"CAMERA_07",
    status:"Flux indisponible",
    severity:"Faible",
    detail:"Caméra hors ligne. Capteur de mouvement encore actif.",
    recurrence:0.60
  },
  {
    id:"INC-088",
    sector:"RAIL_DEPOT",
    status:"Transmission courte",
    severity:"Élevée",
    detail:"Signal basse fréquence détecté durant 4 secondes.",
    recurrence:0.25
  },
  {
    id:"INC-094",
    sector:"NODE-01",
    status:"Maintenance non signée",
    severity:"Moyenne",
    detail:"Cycle technique exécuté sans identifiant conservé.",
    recurrence:0.40
  },
  {
    id:"INC-117",
    sector:"REPEATER_NODE",
    status:"Signal perdu puis rétabli",
    severity:"Moyenne",
    detail:"Synchronisation instable avec délai réseau anormal.",
    recurrence:0.32
  }
];

function getPersistentIncidentSetV59(){
  const STORAGE_KEY = "myth_persistent_incidents_v59";

  try{
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");

    if(current && current.expiresAt && Date.now() < current.expiresAt){
      return current.incidents;
    }
  }catch(e){}

  const selected = [];
  const pool = [...incidentPersistencePoolV59]
    .sort(()=>Math.random() - 0.5);

  const count = 3 + Math.floor(Math.random() * 2);

  while(selected.length < count && pool.length){
    const candidate = pool.shift();

    if(Math.random() <= candidate.recurrence){
      selected.push({
        ...candidate,
        startedAt: Date.now()
      });
    }
  }

  // fallback if random selection too strict
  while(selected.length < 3 && pool.length){
    selected.push({
      ...pool.shift(),
      startedAt: Date.now()
    });
  }

  // random persistence between 24h and 48h
  const durationHours = 24 + Math.floor(Math.random() * 25);

  const payload = {
    createdAt: Date.now(),
    expiresAt: Date.now() + (durationHours * 60 * 60 * 1000),
    incidents: selected
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

  return selected;
}

function incidentAgeLabelV59(startedAt){
  const elapsed = Math.floor((Date.now() - startedAt) / (1000 * 60 * 60));

  if(elapsed <= 1){
    return "Status updated recently.";
  }

  return `Status unchanged for ${elapsed}h.`;
}

function renderPersistentIncidentsV59(){
  const container = document.getElementById("random-incidents");
  if(!container) return;

  const incidents = getPersistentIncidentSetV59();

  container.innerHTML = incidents.map(incident=>{
    const severityClass =
      incident.severity === "Élevée" ? "high" :
      incident.severity === "Critique" ? "critical" : "";

    return `
      <div class="random-incident ${severityClass}">
        <div class="random-incident-top">
          <span class="random-incident-id">${incident.id}</span>
          <span class="random-incident-severity">${incident.severity}</span>
        </div>

        <div class="random-incident-sector">${incident.sector}</div>
        <div class="random-incident-status">${incident.status}</div>
        <div class="random-incident-detail">${incident.detail}</div>
        <div class="random-incident-age">${incidentAgeLabelV59(incident.startedAt)}</div>
      </div>
    `;
  }).join("");
}

window.addEventListener("load", ()=>{
  setTimeout(renderPersistentIncidentsV59, 100);
});


/* v60 — render persistent incidents on map instead of a separate panel */
const incidentMapPositionsV60 = {
  RELAY_03:{x:46,y:43},
  FOREST_BUNKER:{x:29,y:58},
  CAMERA_07:{x:55,y:38},
  NORTH_GATE:{x:38,y:25},
  RAIL_DEPOT:{x:65,y:69},
  NODE_01:{x:49,y:42},
  "NODE-01":{x:49,y:42},
  TUNNEL_SUD:{x:42,y:63},
  REPEATER_NODE:{x:58,y:48},
  NORTH_SHELTER:{x:36,y:29},
  BLACK_CHANNEL:{x:52,y:53}
};

function incidentAgeLabelFRV60(startedAt){
  const elapsed = Math.floor((Date.now() - startedAt) / (1000 * 60 * 60));

  if(elapsed <= 1){
    return "Statut mis à jour récemment.";
  }

  return `Statut inchangé depuis ${elapsed} h.`;
}

function renderIncidentDetailV60(incident){
  const box = document.getElementById("map-incident-detail");
  if(!box) return;

  box.innerHTML = `
    <div class="card-title">INCIDENT DETAIL</div>
    <h3>${incident.id} // ${incident.sector}</h3>

    <div class="meta">
      <div>SEVERITY : ${incident.severity}</div>
      <div>STATUS : ${incident.status}</div>
    </div>

    <p>${incident.detail}</p>
    <p class="muted-line">${incidentAgeLabelFRV60(incident.startedAt)}</p>
  `;
}

function renderPersistentIncidentsOnMapV60(){
  const layer = document.getElementById("map-incident-layer");
  if(!layer) return;

  const incidents =
    typeof getPersistentIncidentSetV59 === "function"
      ? getPersistentIncidentSetV59()
      : [];

  layer.innerHTML = "";

  incidents.forEach((incident, index)=>{
    const pos = incidentMapPositionsV60[incident.sector] || {x:42 + index*8, y:42 + index*6};

    const marker = document.createElement("button");
    marker.className = "map-incident-marker";
    marker.type = "button";
    marker.style.left = pos.x + "%";
    marker.style.top = pos.y + "%";
    marker.title = `${incident.id} // ${incident.sector}`;

    if(incident.severity === "Élevée") marker.classList.add("high");
    if(incident.severity === "Faible") marker.classList.add("low");

    marker.addEventListener("click", ()=>{
      document.querySelectorAll(".map-incident-marker").forEach(m=>m.classList.remove("active"));
      marker.classList.add("active");
      renderIncidentDetailV60(incident);
    });

    layer.appendChild(marker);
  });
}

/* disable old separate incident panel renderer */
function renderPersistentIncidentsV59(){
  renderPersistentIncidentsOnMapV60();
}

function renderDailyIncidentsV58(){
  renderPersistentIncidentsOnMapV60();
}

window.addEventListener("load", ()=>{
  setTimeout(renderPersistentIncidentsOnMapV60, 250);
});


/* v61 — semi-random credible incident placement */
const incidentBasePositionsV61 = {
  RELAY_03:{x:46,y:43,radius:4},
  FOREST_BUNKER:{x:29,y:58,radius:5},
  CAMERA_07:{x:55,y:38,radius:4},
  NORTH_GATE:{x:38,y:25,radius:5},
  RAIL_DEPOT:{x:65,y:69,radius:5},
  NODE_01:{x:49,y:42,radius:3},
  "NODE-01":{x:49,y:42,radius:3},
  TUNNEL_SUD:{x:42,y:63,radius:4},
  REPEATER_NODE:{x:58,y:48,radius:4},
  NORTH_SHELTER:{x:36,y:29,radius:5},
  BLACK_CHANNEL:{x:52,y:53,radius:6}
};

function seededRandomV61(seed){
  let h = 1779033703 ^ seed.length;
  for(let i=0;i<seed.length;i++){
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  return function(){
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function getIncidentPositionV61(incident, index){
  const base = incidentBasePositionsV61[incident.sector] || {x:42 + index*7, y:42 + index*5, radius:4};

  // Position stays stable for the current incident cycle, but changes next cycle.
  const storageRaw = localStorage.getItem("myth_persistent_incidents_v59") || "";
  let seedSuffix = "default";

  try{
    const payload = JSON.parse(storageRaw);
    seedSuffix = String(payload.createdAt || "default");
  }catch(e){}

  const rand = seededRandomV61(`${incident.id}_${incident.sector}_${seedSuffix}`);
  const angle = rand() * Math.PI * 2;
  const distance = rand() * base.radius;

  return {
    x: Math.max(5, Math.min(95, base.x + Math.cos(angle) * distance)),
    y: Math.max(5, Math.min(95, base.y + Math.sin(angle) * distance))
  };
}

function severityClassV61(severity){
  if(severity === "Élevée") return "critical";
  if(severity === "Moyenne") return "medium";
  return "low";
}

function renderIncidentDetailV61(incident, pos){
  const box = document.getElementById("map-incident-detail");
  if(!box) return;

  box.innerHTML = `
    <div class="card-title">INCIDENT DETAIL</div>
    <h3>${incident.id} // ${incident.sector}</h3>

    <div class="meta">
      <div>SEVERITY : ${incident.severity}</div>
      <div>STATUS : ${incident.status}</div>
    </div>

    <p>${incident.detail}</p>
    <p class="muted-line">${typeof incidentAgeLabelFRV60 === "function" ? incidentAgeLabelFRV60(incident.startedAt) : ""}</p>
    <p class="coord-line">MAP OFFSET : ${pos.x.toFixed(1)} / ${pos.y.toFixed(1)}</p>
  `;
}

function renderPersistentIncidentsOnMapV61(){
  const layer = document.getElementById("map-incident-layer");
  if(!layer) return;

  const incidents =
    typeof getPersistentIncidentSetV59 === "function"
      ? getPersistentIncidentSetV59()
      : [];

  layer.innerHTML = "";

  incidents.forEach((incident, index)=>{
    const pos = getIncidentPositionV61(incident, index);

    const marker = document.createElement("button");
    marker.className = `map-incident-marker live-drift ${severityClassV61(incident.severity)}`;
    marker.type = "button";
    marker.style.left = pos.x + "%";
    marker.style.top = pos.y + "%";
    marker.title = `${incident.id} // ${incident.sector}`;

    marker.addEventListener("click", ()=>{
      document.querySelectorAll(".map-incident-marker").forEach(m=>m.classList.remove("active"));
      marker.classList.add("active");
      renderIncidentDetailV61(incident, pos);
    });

    layer.appendChild(marker);
  });
}

/* Override previous renderers to ensure map-only living behavior */
function renderPersistentIncidentsOnMapV60(){
  renderPersistentIncidentsOnMapV61();
}

function renderPersistentIncidentsV59(){
  renderPersistentIncidentsOnMapV61();
}

function renderDailyIncidentsV58(){
  renderPersistentIncidentsOnMapV61();
}

window.addEventListener("load", ()=>{
  setTimeout(renderPersistentIncidentsOnMapV61, 350);
  setInterval(renderPersistentIncidentsOnMapV61, 10 * 60 * 1000);
});


/* v62 — incidents as real Leaflet markers, not CSS overlay */
let incidentLayerV62 = null;
let selectedIncidentElementV62 = null;

const incidentBaseLatLngV62 = {
  RELAY_03:[51.388,30.085],
  FOREST_BUNKER:[51.355,30.045],
  CAMERA_07:[51.398,30.105],
  NORTH_GATE:[51.430,30.060],
  RAIL_DEPOT:[51.335,30.135],
  NODE_01:[51.392,30.088],
  "NODE-01":[51.392,30.088],
  TUNNEL_SUD:[51.345,30.080],
  REPEATER_NODE:[51.378,30.125],
  NORTH_SHELTER:[51.422,30.050],
  BLACK_CHANNEL:[51.370,30.095]
};

function seededRandomV62(seed){
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

function incidentLatLngV62(incident){
  const base = incidentBaseLatLngV62[incident.sector] || [51.37,30.09];

  let seedSuffix = "default";
  try{
    const payload = JSON.parse(localStorage.getItem("myth_persistent_incidents_v59") || "null");
    seedSuffix = String(payload?.createdAt || "default");
  }catch(e){}

  const rand = seededRandomV62(`${incident.id}_${incident.sector}_${seedSuffix}`);
  const latOffset = (rand() - 0.5) * 0.018;
  const lngOffset = (rand() - 0.5) * 0.026;

  return [base[0] + latOffset, base[1] + lngOffset];
}

function incidentIconV62(incident){
  let sev = "severity-medium";
  if(incident.severity === "Élevée") sev = "severity-high";
  if(incident.severity === "Faible") sev = "severity-low";

  return L.divIcon({
    className:"",
    html:`<div class="leaflet-incident-marker ${sev}"></div>`,
    iconSize:[22,22],
    iconAnchor:[11,11]
  });
}

function incidentAgeLabelV62(startedAt){
  const elapsed = Math.floor((Date.now() - startedAt) / (1000 * 60 * 60));

  if(elapsed <= 1){
    return "Statut mis à jour récemment.";
  }

  return `Statut inchangé depuis ${elapsed} h.`;
}

function renderIncidentDetailV62(incident, latlng){
  const box = document.getElementById("map-incident-detail");
  if(!box) return;

  box.innerHTML = `
    <div class="card-title">INCIDENT DETAIL</div>
    <h3>${incident.id} // ${incident.sector}</h3>

    <div class="meta">
      <div>SEVERITY : ${incident.severity}</div>
      <div>STATUS : ${incident.status}</div>
    </div>

    <p>${incident.detail}</p>
    <p class="muted-line">${incidentAgeLabelV62(incident.startedAt)}</p>
    <p class="coord-line">POSITION : ${latlng[0].toFixed(4)} / ${latlng[1].toFixed(4)}</p>
  `;
}

function getMapInstanceV62(){
  if(typeof map !== "undefined" && map && typeof map.addLayer === "function") return map;
  if(window.map && typeof window.map.addLayer === "function") return window.map;
  return null;
}

function renderLeafletIncidentsV62(){
  const mapInstance = getMapInstanceV62();
  if(!mapInstance || typeof L === "undefined") return false;

  if(incidentLayerV62){
    incidentLayerV62.clearLayers();
  }else{
    incidentLayerV62 = L.layerGroup().addTo(mapInstance);
  }

  const incidents =
    typeof getPersistentIncidentSetV59 === "function"
      ? getPersistentIncidentSetV59()
      : [];

  incidents.forEach(incident=>{
    const latlng = incidentLatLngV62(incident);

    const marker = L.marker(latlng, {
      icon: incidentIconV62(incident),
      keyboard:false,
      riseOnHover:true
    });

    marker.on("click", ()=>{
      if(selectedIncidentElementV62){
        selectedIncidentElementV62.classList.remove("selected");
      }

      setTimeout(()=>{
        const el = marker.getElement()?.querySelector(".leaflet-incident-marker");
        if(el){
          el.classList.add("selected");
          selectedIncidentElementV62 = el;
        }
      },0);

      renderIncidentDetailV62(incident, latlng);
    });

    marker.addTo(incidentLayerV62);
  });

  return true;
}

/* Stop old overlay renderers from doing anything visible */
function renderPersistentIncidentsOnMapV61(){
  return renderLeafletIncidentsV62();
}

function renderPersistentIncidentsOnMapV60(){
  return renderLeafletIncidentsV62();
}

function renderPersistentIncidentsV59(){
  return renderLeafletIncidentsV62();
}

function renderDailyIncidentsV58(){
  return renderLeafletIncidentsV62();
}

window.addEventListener("load", ()=>{
  let tries = 0;
  const timer = setInterval(()=>{
    tries++;
    if(renderLeafletIncidentsV62() || tries > 20){
      clearInterval(timer);
    }
  }, 300);
});


/* v63 — robust click/touch handling for incident markers */
function attachIncidentEventsV63(marker, incident, latlng){
  const openIncident = ()=>{
    if(selectedIncidentElementV62){
      selectedIncidentElementV62.classList.remove("selected");
    }

    setTimeout(()=>{
      const el = marker.getElement()?.querySelector(".leaflet-incident-marker");
      if(el){
        el.classList.add("selected");
        selectedIncidentElementV62 = el;
      }
    }, 0);

    renderIncidentDetailV62(incident, latlng);
  };

  marker.on("click", openIncident);
  marker.on("touchstart", openIncident);
  marker.on("mousedown", openIncident);

  marker.on("add", ()=>{
    const el = marker.getElement();
    if(!el) return;

    el.addEventListener("click", (e)=>{
      e.stopPropagation();
      openIncident();
    });

    el.addEventListener("touchstart", (e)=>{
      e.stopPropagation();
      openIncident();
    }, {passive:true});
  });
}

/* override renderer with fixed interactions */
function renderLeafletIncidentsV62(){
  const mapInstance = getMapInstanceV62();
  if(!mapInstance || typeof L === "undefined") return false;

  if(incidentLayerV62){
    incidentLayerV62.clearLayers();
  }else{
    incidentLayerV62 = L.layerGroup().addTo(mapInstance);
  }

  const incidents =
    typeof getPersistentIncidentSetV59 === "function"
      ? getPersistentIncidentSetV59()
      : [];

  incidents.forEach(incident=>{
    const latlng = incidentLatLngV62(incident);

    const marker = L.marker(latlng, {
      icon: incidentIconV62(incident),
      keyboard:false,
      riseOnHover:true
    });

    attachIncidentEventsV63(marker, incident, latlng);

    marker.addTo(incidentLayerV62);
  });

  return true;
}


/* v64 — definitive incident marker/popup renderer */
function getActiveIncidentSetV64(){
  if(typeof getPersistentIncidentSetV59 === "function"){
    return getPersistentIncidentSetV59();
  }

  return [
    {
      id:"INC-041",
      sector:"RELAY_03",
      status:"Signal intermittent",
      severity:"Élevée",
      detail:"Réponse courte du relais. Vérification terrain recommandée.",
      startedAt:Date.now()
    }
  ];
}

function updateIncidentDetailPanelV64(incident, latlng){
  const box = document.getElementById("map-incident-detail");
  if(!box) return;

  const age =
    typeof incidentAgeLabelV62 === "function"
      ? incidentAgeLabelV62(incident.startedAt)
      : "Statut en cours.";

  box.innerHTML = `
    <div class="card-title">INCIDENT DETAIL</div>
    <h3>${incident.id} // ${incident.sector}</h3>
    <p><strong>SEVERITY :</strong> ${incident.severity}</p>
    <p><strong>STATUS :</strong> ${incident.status}</p>
    <p>${incident.detail}</p>
    <p class="muted-line">${age}</p>
    <p class="coord-line">POSITION : ${latlng[0].toFixed(4)} / ${latlng[1].toFixed(4)}</p>
  `;
}

function incidentPopupHTMLV64(incident, latlng){
  const age =
    typeof incidentAgeLabelV62 === "function"
      ? incidentAgeLabelV62(incident.startedAt)
      : "Statut en cours.";

  return `
    <div class="incident-popup">
      <h4>${incident.id}</h4>
      <p><strong>${incident.sector}</strong></p>
      <p>${incident.status}</p>
      <p class="muted">${incident.detail}</p>
      <p class="muted">${age}</p>
    </div>
  `;
}

function renderIncidentsLeafletNativeV64(){
  const mapInstance = getMapInstanceV62 ? getMapInstanceV62() : (typeof map !== "undefined" ? map : null);
  if(!mapInstance || typeof L === "undefined") return false;

  if(window.incidentLayerV64){
    window.incidentLayerV64.clearLayers();
  }else{
    window.incidentLayerV64 = L.layerGroup().addTo(mapInstance);
  }

  const incidents = getActiveIncidentSetV64();

  incidents.forEach(incident=>{
    const latlng =
      typeof incidentLatLngV62 === "function"
        ? incidentLatLngV62(incident)
        : [51.38, 30.09];

    const icon =
      typeof incidentIconV62 === "function"
        ? incidentIconV62(incident)
        : L.divIcon({
            className:"",
            html:`<div class="leaflet-incident-marker"></div>`,
            iconSize:[22,22],
            iconAnchor:[11,11]
          });

    const marker = L.marker(latlng, {
      icon,
      keyboard:false,
      bubblingMouseEvents:false,
      riseOnHover:true
    });

    marker.bindPopup(incidentPopupHTMLV64(incident, latlng), {
      closeButton:true,
      autoPan:true,
      className:"incident-popup-shell"
    });

    marker.on("click", ()=>{
      updateIncidentDetailPanelV64(incident, latlng);
      marker.openPopup();
    });

    marker.on("popupopen", ()=>{
      updateIncidentDetailPanelV64(incident, latlng);
    });

    marker.addTo(window.incidentLayerV64);
  });

  return true;
}

/* Override all previous incident renderers */
renderLeafletIncidentsV62 = renderIncidentsLeafletNativeV64;
renderPersistentIncidentsOnMapV61 = renderIncidentsLeafletNativeV64;
renderPersistentIncidentsOnMapV60 = renderIncidentsLeafletNativeV64;
renderPersistentIncidentsV59 = renderIncidentsLeafletNativeV64;
renderDailyIncidentsV58 = renderIncidentsLeafletNativeV64;

window.addEventListener("load", ()=>{
  let tries = 0;
  const t = setInterval(()=>{
    tries++;
    if(renderIncidentsLeafletNativeV64() || tries > 30){
      clearInterval(t);
    }
  }, 300);
});
