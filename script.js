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

/* v53 — true terminal behavior layer */
const terminalStartTimeV53 = Date.now();

function v53Pad(n){
  return String(n).padStart(2,"0");
}

function v53Rand(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function updateTerminalStateV53(){
  const elapsed = Math.floor((Date.now() - terminalStartTimeV53) / 1000);
  const uptime = document.getElementById("terminal-uptime");
  const loss = document.getElementById("packet-loss");
  const ping = document.getElementById("relay-ping");
  const power = document.getElementById("grid-power");

  if(uptime){
    const h = v53Pad(Math.floor(elapsed / 3600));
    const m = v53Pad(Math.floor((elapsed % 3600) / 60));
    const s = v53Pad(elapsed % 60);
    uptime.textContent = `${h}:${m}:${s}`;
  }

  if(loss){
    const value = Math.floor(6 + Math.random()*22);
    loss.textContent = `${value}%`;
    loss.classList.toggle("net-warning", value > 18);
  }

  if(ping){
    const value = Math.floor(180 + Math.random()*640);
    ping.textContent = `${value} MS`;
    ping.classList.toggle("net-warning", value > 520);
  }

  if(power){
    power.textContent = Math.random() > .82 ? "SECONDAIRE" : "LOCAL";
  }
}

function updateRelayNetworkV53(){
  const relayStates = ["ACTIF","INSTABLE","HORS LIGNE","PING REÇU","RÉPONSE LENTE"];
  const cameraStates = ["HORS LIGNE","CAPTEUR ACTIF","AUCUNE IMAGE","SYNCHRO PERDUE"];
  const gateStates = ["VERROUILLÉ","PING REÇU","CONTACT PERDU","ÉTAT INCOHÉRENT"];

  const r = document.getElementById("relay03-state");
  const c = document.getElementById("camera07-state");
  const g = document.getElementById("northgate-state");

  if(r){
    r.textContent = v53Rand(relayStates);
    r.classList.toggle("net-fail", r.textContent === "HORS LIGNE");
  }

  if(c){
    c.textContent = v53Rand(cameraStates);
    c.classList.toggle("net-fail", c.textContent === "HORS LIGNE" || c.textContent === "AUCUNE IMAGE");
  }

  if(g){
    g.textContent = v53Rand(gateStates);
    g.classList.toggle("net-warning", g.textContent === "ÉTAT INCOHÉRENT");
  }
}

function addRealisticSystemLogV53(){
  const log = document.getElementById("system-log");
  if(!log) return;

  const messages = [
    "SYNC FAILED — retrying relay connection.",
    "PACKET LOSS ABOVE THRESHOLD.",
    "CAMERA_07 offline, motion sensor still active.",
    "RELAY_03 response delayed.",
    "SECONDARY POWER CHECK COMPLETED.",
    "MANUAL LOCK STATE CHANGED.",
    "FIELD NODE QUERY TIMED OUT."
  ];

  const now = new Date();
  const line = document.createElement("div");
  line.className = "system-log-entry-live terminal-wait";
  line.textContent = `[${v53Pad(now.getHours())}:${v53Pad(now.getMinutes())}:${v53Pad(now.getSeconds())}] ${v53Rand(messages)}`;
  log.appendChild(line);

  while(log.children.length > 7){
    log.removeChild(log.firstElementChild);
  }

  setTimeout(()=>line.classList.remove("terminal-wait"), 2500);
}

function enrichSafehouseRenderingV53(){
  if(typeof renderSafehouse !== "function") return;

  const original = renderSafehouse;
  window.renderSafehouse = function(id){
    original(id);

    const detail = document.getElementById("safehouse-detail");
    if(!detail || detail.querySelector(".safehouse-logistics")) return;

    const logistics = {
      node01:["ACTIF","42%","FAIBLE","31%"],
      forest:["HORS LIGNE","18%","INTERMITTENT","78%"],
      rail:["PARTIEL","34%","FAIBLE","46%"],
      north:["BATTERIE","12%","TRÈS FAIBLE","63%"]
    }[id] || ["INCONNU","--","INCONNU","--"];

    const block = document.createElement("div");
    block.className = "safehouse-logistics";
    block.innerHTML = `
      <div><label>GENERATOR</label><p>${logistics[0]}</p></div>
      <div><label>FUEL</label><p>${logistics[1]}</p></div>
      <div><label>RADIO</label><p>${logistics[2]}</p></div>
      <div><label>HUMIDITY</label><p>${logistics[3]}</p></div>
    `;

    const desc = detail.querySelector(".node-description");
    if(desc) detail.insertBefore(block, desc);
    else detail.appendChild(block);
  }
}

function queryDelayOnClicksV53(){
  document.querySelectorAll(".safe-point, .severity-marker, .tabs button").forEach(el=>{
    el.addEventListener("click", ()=>{
      document.body.classList.add("querying");
      setTimeout(()=>document.body.classList.remove("querying"), 220);
    });
  });
}

window.addEventListener("load", ()=>{
  updateTerminalStateV53();
  updateRelayNetworkV53();
  enrichSafehouseRenderingV53();
  queryDelayOnClicksV53();

  setInterval(updateTerminalStateV53, 5000);
  setInterval(updateRelayNetworkV53, 22000);
  setInterval(addRealisticSystemLogV53, 65000);
});

/* v78-from-v1-clean — disable only external incident-detail panel writes */
function updateIncidentDetailPanelV64(){ return; }
function renderIncidentDetailV62(){ return; }
function renderIncidentDetailV61(){ return; }
function renderIncidentDetailV60(){ return; }

/* v78 — robust tab sync without moving map across screens */
window.addEventListener("load", ()=>{
  const buttons = document.querySelectorAll(".tabs button[data-screen], .tabs button[data-tab]");
  const screens = document.querySelectorAll(".screen");

  function targetOf(btn){
    return btn.dataset.screen || btn.dataset.tab;
  }

  function activate(target){
    if(!target) return;

    screens.forEach(screen=>{
      screen.classList.toggle("active", screen.id === target);
    });

    buttons.forEach(btn=>{
      btn.classList.toggle("active", targetOf(btn) === target);
    });

    if(target === "map"){
      setTimeout(()=>{
        try{
          const mapInstance = (typeof map !== "undefined" && map) ? map : window.map;
          if(mapInstance && typeof mapInstance.invalidateSize === "function"){
            mapInstance.invalidateSize();
          }
        }catch(e){}
      }, 250);
    }
  }

  buttons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      activate(targetOf(btn));
      window.scrollTo({top:0, behavior:"smooth"});
    });
  });

  const activeBtn = document.querySelector(".tabs button.active[data-screen], .tabs button.active[data-tab]");
  const activeScreen = document.querySelector(".screen.active");
  activate(targetOf(activeBtn) || activeScreen?.id || "map");
});

/* v81 — realistic autonomous incidents: random persistence, no full rotation */
const autonomousIncidentPoolV79 = [
  {title:"RELAY_03", severity:"medium", label:"MOYEN", category:"PING ANORMAL", text:"Réponse courte détectée hors fenêtre de synchronisation.", detail:"Relais actif par intermittence ; source non attribuée.", coords:[51.3826,30.0917]},
  {title:"CAMERA_07", severity:"high", label:"ÉLEVÉ", category:"CAPTEUR ACTIF", text:"Capteur de mouvement actif malgré flux vidéo indisponible.", detail:"Contrôle terrain conseillé ; image non récupérable.", coords:[51.4051,30.0612]},
  {title:"NORTH_GATE", severity:"medium", label:"MOYEN", category:"VERROUILLAGE", text:"Changement d’état enregistré sans commande distante.", detail:"Dernier état : verrouillage confirmé, ping instable.", coords:[51.4484,30.0365]},
  {title:"EAST_WINDOW", severity:"low", label:"FAIBLE", category:"SIGNAL NOCTURNE", text:"Signal lumineux bref capté sur façade isolée.", detail:"Hypothèse : reflet, relais dégradé ou unité mobile.", coords:[51.2768,30.2236]},
  {title:"SOUTH_TUNNEL", severity:"critical", label:"CRITIQUE", category:"CONTACT PERDU", text:"Balise basse fréquence disparue pendant le balayage.", detail:"Dernière trame incomplète ; zone à éviter sans escorte.", coords:[51.2462,30.0831]},
  {title:"PRIPYAT_BLOCK", severity:"high", label:"ÉLEVÉ", category:"MOUVEMENT", text:"Déclenchements multiples dans un bâtiment résidentiel.", detail:"Aucun identifiant associé ; bruit de porte et vibration brève.", coords:[51.4079,30.0579]},
  {title:"RED_FOREST_EDGE", severity:"medium", label:"MOYEN", category:"INTERFÉRENCE", text:"Parasitage radio relevé sur bande courte.", detail:"Signal large, non vocal, durée inférieure à 18 secondes.", coords:[51.3658,30.0042]},
  {title:"DRAINAGE_LINE", severity:"low", label:"FAIBLE", category:"SONDE HUMIDE", text:"Variation de pression localisée sur collecteur abandonné.", detail:"Lecture fluctuante ; niveau de fiabilité réduit.", coords:[51.3316,30.1468]},
  {title:"ARCHIVE_12", severity:"medium", label:"MOYEN", category:"TRACE DONNÉE", text:"Horodatage modifié pendant la synchronisation carte.", detail:"Incident logiciel probable, mais corrélé à un ping terrain.", coords:[51.3914,29.9746]},
  {title:"BLACK_CHANNEL", severity:"critical", label:"CRITIQUE", category:"HANDSHAKE FAILED", text:"Tentative de liaison non signée rejetée par le nœud.", detail:"Canal fermé automatiquement ; empreinte non reconnue.", coords:[51.2982,29.9129]},
  {title:"RAIL_SPUR", severity:"medium", label:"MOYEN", category:"ÉCHO MÉTALLIQUE", text:"Vibration brève relevée sur ancienne voie de service.", detail:"Lecture isolée ; possible passage animal ou choc mécanique.", coords:[51.3695,30.1179]},
  {title:"PUMP_STATION", severity:"high", label:"ÉLEVÉ", category:"PRESSION", text:"Remontée de pression sans activation planifiée.", detail:"Station hors réseau ; télémétrie partielle seulement.", coords:[51.3228,30.1854]}
];

const INCIDENT_STORAGE_KEY_V80 = "myth.map.incidents.v81";
const INCIDENT_MIN_DELAY_V80 = 24 * 60 * 60 * 1000;
const INCIDENT_MAX_DELAY_V80 = 48 * 60 * 60 * 1000;

let liveIncidentMarkersV79 = [];
let incidentTimerV79 = null;
let activeIncidentStateV80 = null;
let popupAutoplayTimerV80 = null;

function randomBetweenV80(min,max){
  return min + Math.floor(Math.random() * (max - min + 1));
}

function weightedPickV81(items){
  const total = items.reduce((sum,item)=>sum + item.weight,0);
  let roll = Math.random() * total;
  for(const item of items){
    roll -= item.weight;
    if(roll <= 0) return item.value;
  }
  return items[items.length - 1].value;
}

function jitterCoordV79(coord,scale=1){
  return [
    +(coord[0] + (Math.random() - .5) * .018 * scale).toFixed(6),
    +(coord[1] + (Math.random() - .5) * .026 * scale).toFixed(6)
  ];
}

function gpsTextV79(coords){
  return `${Number(coords[0]).toFixed(6)}, ${Number(coords[1]).toFixed(6)}`;
}

function nextChangeAtV81(from=Date.now()){
  return from + randomBetweenV80(INCIDENT_MIN_DELAY_V80, INCIDENT_MAX_DELAY_V80);
}

function makeIncidentV81(base, now=Date.now()){
  const confidence = randomBetweenV80(42,91);
  return {
    ...base,
    id:`${base.title}-${now}-${Math.floor(Math.random()*9999)}`,
    coords:jitterCoordV79(base.coords),
    createdAt:now - randomBetweenV80(0, 5 * 60 * 60 * 1000),
    updatedAt:now,
    confidence,
    status:confidence < 55 ? "NON CONFIRMÉ" : "ACTIF"
  };
}

function buildIncidentStateV80(){
  const now = Date.now();
  const amount = randomBetweenV80(2,4);
  const selected = [...autonomousIncidentPoolV79]
    .sort(()=>Math.random() - .5)
    .slice(0, amount)
    .map(base=>makeIncidentV81(base, now));
  return {version:81, generatedAt:now, lastMutationAt:now, nextAt:nextChangeAtV81(now), incidents:selected};
}

function loadIncidentStateV80(){
  try{
    const raw = localStorage.getItem(INCIDENT_STORAGE_KEY_V80);
    if(!raw) return null;
    const state = JSON.parse(raw);
    if(!state || !Array.isArray(state.incidents) || !state.nextAt || state.version !== 81) return null;
    return state;
  }catch(e){ return null; }
}

function saveIncidentStateV80(state){
  activeIncidentStateV80 = state;
  try{ localStorage.setItem(INCIDENT_STORAGE_KEY_V80, JSON.stringify(state)); }catch(e){}
}

function mutateIncidentStateV81(state){
  const now = Date.now();
  const incidents = Array.isArray(state.incidents) ? [...state.incidents] : [];
  const activeTitles = new Set(incidents.map(i=>i.title));
  const canAdd = incidents.length < 6 && autonomousIncidentPoolV79.some(i=>!activeTitles.has(i.title));
  const canResolve = incidents.length > 1;
  const action = weightedPickV81([
    {value:"add", weight:canAdd ? 38 : 0},
    {value:"update", weight:34},
    {value:"resolve", weight:canResolve ? 18 : 0},
    {value:"drift", weight:10}
  ]);

  if(action === "add"){
    const candidates = autonomousIncidentPoolV79.filter(i=>!activeTitles.has(i.title));
    incidents.push(makeIncidentV81(candidates[Math.floor(Math.random()*candidates.length)], now));
  }else if(action === "resolve"){
    incidents.sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
    incidents.splice(randomBetweenV80(0, Math.min(2, incidents.length - 1)),1);
  }else{
    const target = incidents[Math.floor(Math.random()*incidents.length)];
    if(target){
      target.updatedAt = now;
      target.confidence = Math.max(31, Math.min(96, Number(target.confidence||60) + randomBetweenV80(-14,16)));
      target.status = target.confidence < 50 ? "À VÉRIFIER" : (target.confidence > 78 ? "CONFIRMÉ" : "ACTIF");
      if(action === "drift") target.coords = jitterCoordV79(target.coords, .35);
      target.detail = weightedPickV81([
        {value:"Signal recoupé par une seconde source, fiabilité en hausse.", weight:25},
        {value:"Lecture isolée maintenue en observation, aucune patrouille confirmée.", weight:25},
        {value:"Télémétrie instable ; dernière trame exploitable conservée.", weight:25},
        {value:target.detail, weight:25}
      ]);
    }
  }

  state.incidents = incidents;
  state.lastMutationAt = now;
  state.nextAt = nextChangeAtV81(now);
  return state;
}

function ensureIncidentStateV80(force=false){
  let state = force ? null : loadIncidentStateV80();
  if(!state) state = buildIncidentStateV80();
  let safety = 0;
  while(Date.now() >= Number(state.nextAt) && safety < 4){
    state = mutateIncidentStateV81(state);
    safety++;
  }
  saveIncidentStateV80(state);
  return state;
}

function formatDelayV80(ms){
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}H ${String(minutes).padStart(2,"0")}M`;
}

function formatTimeV80(ts){
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function incidentPopupV79(incident){
  return `
    <div class="popup-incident-v79">
      <div class="popup-title-v79">${incident.title}</div>
      <div class="popup-meta-v79">GPS : ${gpsTextV79(incident.coords)}</div>
      <div class="popup-meta-v79">LAST PING : ${formatTimeV80(incident.updatedAt || Date.now())}</div>
      <div class="popup-body-v79">${incident.text}</div>
      <div class="popup-detail-v79">${incident.detail}</div>
    </div>
  `;
}

function clearLiveIncidentsV79(){
  if(!map) return;
  liveIncidentMarkersV79.forEach(marker=>map.removeLayer(marker));
  liveIncidentMarkersV79 = [];
}

function updateIncidentHudV80(state){
  const update = document.getElementById("map-update");
  if(update) update.textContent = `INCIDENT FEED : RANDOM / AUTONOMOUS`;
  const stateEl = document.getElementById("incident-cycle-state");
  if(stateEl){
    const remaining = Number(state.nextAt) - Date.now();
    stateEl.textContent = `${state.incidents.length} ACTIVE // NEXT FIELD CHANGE : ${formatDelayV80(remaining)}`;
  }
}

function renderAutonomousIncidentsV80(forceNew=false){
  if(!mapReady || !map || typeof L === "undefined") return;
  clearLiveIncidentsV79();
  const state = ensureIncidentStateV80(forceNew);
  state.incidents.forEach(incident=>{
    const icon = L.divIcon({className:"",html:`<div class="severity-marker ${incident.severity} live-incident-marker"></div>`,iconSize:[26,26],iconAnchor:[13,13],popupAnchor:[0,-13]});
    const marker = L.marker(incident.coords,{icon}).addTo(map);
    marker.bindPopup(incidentPopupV79(incident),{
      closeButton:false,
      autoPan:true,
      keepInView:true,
      maxWidth:220,
      minWidth:178,
      autoPanPaddingTopLeft:[42,42],
      autoPanPaddingBottomRight:[42,42]
    });
    liveIncidentMarkersV79.push(marker);
  });
  updateIncidentHudV80(state);
  schedulePopupAutoplayV80();
}

function schedulePopupAutoplayV80(){
  if(popupAutoplayTimerV80) clearInterval(popupAutoplayTimerV80);
  if(!liveIncidentMarkersV79.length) return;
  const openRandom = ()=>{
    if(!document.getElementById("map")?.classList.contains("active")) return;
    const marker = liveIncidentMarkersV79[Math.floor(Math.random() * liveIncidentMarkersV79.length)];
    if(marker){
      marker.openPopup();
      setTimeout(()=>{
        if(map && marker.getLatLng) map.panTo(marker.getLatLng(), {animate:true, duration:.35});
      },80);
    }
  };
  setTimeout(openRandom, randomBetweenV80(1200, 2600));
  popupAutoplayTimerV80 = setInterval(openRandom, randomBetweenV80(35000, 85000));
}

function startIncidentCycleV79(){
  if(incidentTimerV79) return;
  incidentTimerV79 = setInterval(()=>{
    const before = activeIncidentStateV80?.lastMutationAt;
    const state = ensureIncidentStateV80(false);
    if(before !== state.lastMutationAt) renderAutonomousIncidentsV80(false);
    else updateIncidentHudV80(state);
  },60000);
}

function spawnAutonomousIncidentsV79(){ renderAutonomousIncidentsV80(false); }

showReport = function(){ return; };
initMap = function(){
  if(mapReady || typeof L === "undefined") return;
  const bounds = L.latLngBounds([51.18,29.75],[51.55,30.45]);
  map = L.map("leaflet-map",{zoomControl:false,attributionControl:false,scrollWheelZoom:true,doubleClickZoom:true,boxZoom:false,keyboard:false,touchZoom:true,minZoom:9,maxZoom:14,maxBounds:bounds,maxBoundsViscosity:1}).setView([51.389,30.099],10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,crossOrigin:true}).addTo(map);
  map.fitBounds(bounds);
  mapReady = true;
  setTimeout(()=>map.invalidateSize(),250);
  renderAutonomousIncidentsV80(false);
  startIncidentCycleV79();
};

window.addEventListener("load",()=>{
  setTimeout(()=>{
    if(document.getElementById("map")?.classList.contains("active")){
      if(!mapReady) initMap();
      renderAutonomousIncidentsV80(false);
      startIncidentCycleV79();
    }
  },700);
});
