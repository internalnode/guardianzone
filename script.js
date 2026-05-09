const bootMessages=["ІНІЦІАЛІЗАЦІЯ ЛОКАЛЬНОГО ВУЗЛА...","ЗАВАНТАЖЕННЯ АРХІВНОГО ІНДЕКСУ...","СИНХРОНІЗАЦІЯ ПЕРИМЕТРИЧНИХ РЕЛЕ...","ВІДНОВЛЕННЯ НЧ-КАНАЛУ...","СКАНУВАННЯ АКТИВНИХ ТОЧОК...","ОБМЕЖЕНИЙ ДОСТУП НАДАНО."];
const bootLines=document.getElementById("boot-lines");bootMessages.forEach((m,i)=>setTimeout(()=>{const l=document.createElement("div");l.textContent="> "+m;bootLines.appendChild(l)},330*i));
window.addEventListener("load",()=>setTimeout(()=>{const b=document.getElementById("boot");b.style.opacity="0";setTimeout(()=>b.style.display="none",800)},3900));
let map,mapReady=false;
const reports=[
{coords:[51.3890,30.0990],title:"CENTRALE",severity:"critical",label:"CRITICAL",category:"Unstable emission",text:"Alimentation relevée hors cycle prévu autour des structures principales.",detail:"Caméras indisponibles. Vérification terrain prioritaire."},
{coords:[51.4048,30.0569],title:"PRIPYAT",severity:"high",label:"HIGH",category:"Recent movement",text:"Déclenchements capteurs relevés dans plusieurs bâtiments résidentiels.",detail:"Signal faible : contact porte, vibration brève, perte de flux."},
{coords:[51.3180,30.0710],title:"SECTEUR ROUGE",severity:"medium",label:"MEDIUM",category:"Radio interference",text:"Parasitage constant sur bande courte. Origine non isolée.",detail:"Contrôle différé recommandé. Conditions de visibilité insuffisantes."},
{coords:[51.2750,30.2210],title:"OBSERVATION EAST",severity:"low",label:"СЛАБКИЙ",category:"Night signal",text:"Signal bref détecté sur fenêtre nocturne.",detail:"Source non attribuée : relais dégradé, transmission courte ou unité mobile."},
{coords:[51.3530,29.9800],title:"ANCIEN RELAIS",severity:"medium",label:"MEDIUM",category:"Active power",text:"Relais alimenté malgré l’arrêt officiel du réseau.",detail:"Réponse irrégulière. Accès terrain classé difficile."}
];
function showReport(r){document.getElementById("report").innerHTML=`<div class="card-title">SELECTED POINT</div><h3>${r.title}</h3><p><strong>${r.category}</strong> — SEVERITY : ${r.label}</p><p>${r.text}</p><p style="color:#778070">${r.detail}</p>`}
function initMap(){if(mapReady||typeof L==="undefined")return;const bounds=L.latLngBounds([51.18,29.75],[51.55,30.45]);map=L.map("leaflet-map",{zoomControl:false,attributionControl:false,scrollWheelZoom:true,doubleClickZoom:true,boxZoom:false,keyboard:false,touchZoom:true,minZoom:9,maxZoom:14,maxBounds:bounds,maxBoundsViscosity:1}).setView([51.389,30.099],10);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,crossOrigin:true}).addTo(map);reports.forEach(r=>{const icon=L.divIcon({className:"",html:`<div class="severity-marker ${r.severity}"></div>`,iconSize:[25,25],iconAnchor:[12,12],popupAnchor:[0,-12]});const marker=L.marker(r.coords,{icon}).addTo(map);marker.bindPopup(`<div style="font-family:IBM Plex Mono,monospace;font-size:11px;letter-spacing:2px;margin-bottom:8px;">${r.title}</div><div style="font-size:12px;color:#9aaa7d;margin-bottom:8px;">SEVERITY : ${r.label}</div><div style="font-size:13px;line-height:1.6;color:#aeb6a8;">${r.text}</div>`);marker.on("click",()=>showReport(r))});map.fitBounds(bounds);mapReady=true;setTimeout(()=>map.invalidateSize(),250)}
function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelectorAll(".tabs button").forEach(b=>b.classList.toggle("active",b.dataset.screen===id));if(id==="map"){if(!mapReady)initMap();else setTimeout(()=>map.invalidateSize(),250)}window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".tabs button").forEach(btn=>btn.addEventListener("click",()=>showScreen(btn.dataset.screen)));
const events=[
"CAMERA FEED LOST — SECTOR NORTH",
"СЛАБКИЙ FREQUENCY BURST DETECTED",
"PERIMETER RELAY 03 RESPONDING",
"UNCONFIRMED MOVEMENT — RESIDENTIAL BLOCK",
"DOSIMETER SPIKE NORMALIZED",
"SIGNAL DROP — 4 SECONDS",
"UNSIGNED ACCESS — RELAY 03",
"ARCHIVE SEGMENT CORRUPTED",
"DOOR SENSOR TRIGGERED — EMPTY FEED",
"MYTH TASKING PENDING"
];
function pad(n){return String(n).padStart(2,"0")}
function pushLog(){const log=document.getElementById("system-log");if(!log)return;const now=new Date(),line=document.createElement("div");line.textContent=`[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}] ${events[Math.floor(Math.random()*events.length)]}`;log.appendChild(line);while(log.children.length>5)log.removeChild(log.firstElementChild)}
function updateSystems(){
const q=document.getElementById("quality"),d=document.getElementById("dosimeter"),c=document.getElementById("channel"),s=document.getElementById("signal-state"),l=document.getElementById("loss");
const wind=document.getElementById("wind"),pressure=document.getElementById("pressure"),cam=document.getElementById("camera-integrity"),lat=document.getElementById("latency"),mu=document.getElementById("map-update");
const qualities=["DEGRADED","UNSTABLE","СЛАБКИЙ","RESTORED"],quality=qualities[Math.floor(Math.random()*qualities.length)];
if(q){q.textContent=quality;q.classList.toggle("flash-warn",quality==="UNSTABLE"||quality==="СЛАБКИЙ")}
if(s)s.textContent="SIGNAL "+quality;
if(c)c.textContent=["OPEN","PARASITÉ","ЧАСТКОВИЙ","DELAYED"][Math.floor(Math.random()*4)];
if(d)d.textContent=(0.28+Math.random()*0.46).toFixed(2)+" µSv/h";
if(l)l.textContent=Math.floor(8+Math.random()*19)+"%";
if(wind)wind.textContent=["N/NE 11 KM/H","E 07 KM/H","NW 18 KM/H","CALM","S 14 KM/H"][Math.floor(Math.random()*5)];
if(pressure)pressure.textContent=Math.floor(1001+Math.random()*18)+" HPA";
if(cam)cam.textContent=Math.floor(22+Math.random()*31)+"%";
if(lat)lat.textContent=Math.floor(240+Math.random()*390)+" MS";
if(mu){const now=new Date();mu.textContent=`LAST UPDATE : ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`}
}
setInterval(()=>{pushLog();updateSystems()},11000);


/* v7 interactive files */
const fileData = {
  relais03:{
    title:"RELAIS_03",
    status:"ACTIVE",
    access:"UNKNOWN",
    power:"LOCAL GRID",
    integrity:"74%",
    content:[
      "Relais alimenté hors cycle prévu.",
      "Présence non détectée dans le rayon immédiat.",
      "Trace récente non confirmée.",
      "Redémarrage manuel probable. Signature absente."
    ],
    note:true
  },

  tunnel:{
    title:"TUNNEL_SUD",
    status:"RESTRICTED",
    access:"02:14",
    power:"HORS LIGNE",
    integrity:"58%",
    content:[
      "Détection nocturne sur accès sud.",
      "Tunnel condamné. Scellés anciens.",
      "Capteur porte : réponse brève.",
      "Confirmation visuelle indisponible."
    ]
  },

  install12:{
    title:"INSTALLATION_12",
    status:"UNSTABLE",
    access:"UNKNOWN",
    power:"ЧАСТКОВИЙ",
    integrity:"41%",
    content:[
      "Structure partiellement effondrée.",
      "Émission faible persistante sur bande courte.",
      "Signal instable selon conditions météo.",
      "Accès terrain difficile."
    ]
  },

  visual:{
    title:"VISUAL_RECORD",
    status:"CORRUPTED",
    access:"FILE DAMAGE",
    power:"UNKNOWN",
    integrity:"12%",
    content:[
      "Segment image récupéré depuis terminal ancien.",
      "Portions manquantes.",
      "Forme visible avant perte de signal.",
      "Identification impossible."
    ],
    note:true
  },

  sector:{
    title:"SECTOR_NOTE",
    status:"MISSING",
    access:"RECOVERY FAILED",
    power:"N/A",
    integrity:"0%",
    content:[
      "ARCHIVE SEGMENT MISSING",
      "RECOVERY FAILED",
      "NO ADDITIONAL DATA AVAILABLE"
    ],
    note:true
  },

  locked:{
    title:"BLACK_CHANNEL",
    status:"ЗАБЛОКОВАНО",
    access:"DENIED",
    power:"UNKNOWN",
    integrity:"--",
    content:[
      "ACCESS DENIED",
      "KEY FRAGMENT MISSING",
      "LAST HANDSHAKE : UNKNOWN"
    ],
    note:true
  }
};

function renderFile(id){
  const data = fileData[id];
  const viewer = document.getElementById("file-viewer");
  if(!viewer || !data) return;

  const content = data.content.map((line,index)=>{
    const cls = data.note && index === data.content.length-1 ? 'terminal-note' : '';
    return `<p class="${cls}">${line}</p>`;
  }).join("");

  viewer.innerHTML = `
    <div class="card-title">ARCHIVE VIEWER</div>

    <div class="file-header">
      <h3>${data.title}</h3>
      <div class="file-state">СТАТУС : ${data.status}</div>
    </div>

    <div class="file-meta">
      <div>
        <span>ОСТАННІЙ ДОСТУП</span>
        <strong>${data.access}</strong>
      </div>

      <div>
        <span>ДЖЕРЕЛО ЖИВЛЕННЯ</span>
        <strong>${data.power}</strong>
      </div>

      <div>
        <span>ЦІЛІСНІСТЬ АРХІВУ</span>
        <strong>${data.integrity}</strong>
      </div>
    </div>

    <div class="file-content">
      ${content}
    </div>
  `;
}

document.querySelectorAll(".file-entry").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".file-entry").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderFile(btn.dataset.file);
  });
});


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
  "Trace de maintenance non signée — relais 03",
  "Le canal thermique a répondu sans image",
  "Le microphone terrain a détecté un impact métallique",
  "Erreur de vérification d’archive",
  "Panneau d’accès ouvert — aucun identifiant détecté",
  "Ancienne caméra alimentée durant 00:00:04",
  "État du capteur modifié avant synchronisation"
];

let audioOn = false;
let audioContext = null;
let noiseNode = null;
let gainNode = null;

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

  if(fog) fog.textContent = ["СЛАБКИЙ","MEDIUM","ГУСТИЙ","PATCHY"][Math.floor(Math.random()*4)];
  if(thermal){
    const value = ["HORS LIGNE","NO IMAGE","ЧАСТКОВИЙ","NOISE ONLY"][Math.floor(Math.random()*4)];
    thermal.textContent = value;
    thermal.classList.toggle("system-critical", value === "NO IMAGE" || value === "NOISE ONLY");
  }
  if(grid) grid.textContent = Math.floor(25 + Math.random()*31) + "%";
  if(field) field.textContent = ["STABLE","WET","СЛАБКИЙ VISIBILITY","INTERFERENCE"][Math.floor(Math.random()*4)];
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

function createNoiseBuffer(ctx){
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++){
    data[i] = (Math.random()*2-1) * 0.22;
  }
  return buffer;
}

function startAudio(){
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  noiseNode = audioContext.createBufferSource();
  noiseNode.buffer = createNoiseBuffer(audioContext);
  noiseNode.loop = true;

  gainNode = audioContext.createGain();
  gainNode.gain.value = 0.018;

  const filter = audioContext.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.7;

  noiseNode.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);
  noiseNode.start();
}

function stopAudio(){
  try{
    if(noiseNode) noiseNode.stop();
    if(audioContext) audioContext.close();
  }catch(e){}
  noiseNode = null;
  audioContext = null;
}

function setupAudioToggle(){
  const btn = document.getElementById("audio-toggle");
  if(!btn) return;

  btn.addEventListener("click", ()=>{
    audioOn = !audioOn;
    btn.textContent = audioOn ? "AUDIO : ON" : "AUDIO : OFF";
    if(audioOn) startAudio();
    else stopAudio();
  });
}

setInterval(tickClock, 1000);
setInterval(updateEnvironment, 14000);
setInterval(rareSystemEvent, 22000);

window.addEventListener("load", ()=>{
  seedPreviousState();
  tickClock();
  updateEnvironment();
  setupAudioToggle();
});

function pushSystemLog(message){
  const log=document.getElementById("system-log");
  if(!log)return;
  const now=new Date(),line=document.createElement("div");
  line.textContent=`[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}] ${message}`;
  log.appendChild(line);
  while(log.children.length>5)log.removeChild(log.firstElementChild);
}


/* v9 file access feel */
function fakeOpenArchive(id, btn){
  const viewer = document.getElementById("file-viewer");
  if(!viewer) return;

  viewer.innerHTML = `
    <div class="file-loading">
      ВІДКРИТТЯ АРХІВУ...
    </div>
  `;

  setTimeout(()=>{
    renderFile(id);

    if(Math.random() > 0.55 && btn){
      btn.classList.add("updated");
      setTimeout(()=>btn.classList.remove("updated"), 8000);
    }

  }, 320);
}

document.querySelectorAll(".file-entry").forEach(btn=>{
  btn.replaceWith(btn.cloneNode(true));
});

document.querySelectorAll(".file-entry").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".file-entry").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    fakeOpenArchive(btn.dataset.file, btn);
  });
});

const originalRender = renderFile;

renderFile = function(id){
  originalRender(id);

  const viewer = document.getElementById("file-viewer");

  if(id === "sector"){
    viewer.innerHTML += `
      <div class="restricted-banner">
        ВІДНОВЛЕННЯ НЕМОЖЛИВЕ // ENCRYPTED SEGMENT
      </div>
    `;
  }

  if(id === "visual"){
    viewer.innerHTML += `
      <div class="restricted-banner">
        IMAGE FEED // ЧАСТКОВИЙLY CORRUPTED
      </div>
    `;
  }
};


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
  ["RELAY_03","Alimenté hors cycle"],
  ["SOUTH_TUNNEL","Contact perdu"],
  ["PRIPYAT_BLOCK","Mouvement non confirmé"],
  ["CAMERA_07","HORS LIGNE / SENSOR ACTIVE"],
  ["NORTH_GATE","ЗАБЛОКОВАНО / PING RECEIVED"],
  ["ARCHIVE_12","CORRUPTED / RECENT CHANGE"],
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


/* v19 restored — living zone, non destructive */
const restoredZoneConditions = {
  fog:["СЛАБКИЙ","СЕРЕДНІЙ","ГУСТИЙ"],
  rain:["ВІДСУТНІЙ","СЛАБКИЙ","СИЛЬНИЙ"],
  visibility:["STABLE","ОБМЕЖЕНА","TRÈS СЛАБКИЙ"],
  network:["НЕСТАБІЛЬНИЙ","НЕСТІЙКИЙ","ПОШКОДЖЕНИЙ","ЧАСТКОВИЙ"]
};

const restoredZoneEvents = [
  "RELAY_03 — Connexion brièvement rétablie.",
  "CAMERA_07 — Réponse reçue durant 2 secondes.",
  "TUNNEL_SUD — Contact capteur brièvement actif.",
  "NORTH_BLOCK — Mouvement non confirmé.",
  "BLACK_CHANNEL — Tentative d’accès rejetée.",
  "REPEATER_NODE — Signal revenu puis perdu."
];

function restoredRandomItem(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function restoredUpdateZoneConditions(){
  const fog = document.getElementById("fog-state");
  const rain = document.getElementById("rain-state");
  const vis = document.getElementById("visibility-state");
  const net = document.getElementById("network-state");

  if(fog) fog.textContent = restoredRandomItem(restoredZoneConditions.fog);
  if(rain) rain.textContent = restoredRandomItem(restoredZoneConditions.rain);
  if(vis) vis.textContent = restoredRandomItem(restoredZoneConditions.visibility);
  if(net) net.textContent = restoredRandomItem(restoredZoneConditions.network);

  const hour = new Date().getHours();
  document.body.classList.toggle("night-mode", hour >= 21 || hour <= 5);
}

function restoredPushRareEvent(){
  const log = document.getElementById("system-log");
  if(!log) return;

  const now = new Date();
  const hh = String(now.getHours()).padStart(2,"0");
  const mm = String(now.getMinutes()).padStart(2,"0");
  const ss = String(now.getSeconds()).padStart(2,"0");

  const line = document.createElement("div");
  line.className = "system-log-entry-live";
  line.textContent = `[${hh}:${mm}:${ss}] ${restoredRandomItem(restoredZoneEvents)}`;

  log.appendChild(line);

  while(log.children.length > 6){
    log.removeChild(log.firstElementChild);
  }
}

window.addEventListener("load", ()=>{
  restoredUpdateZoneConditions();
  setInterval(restoredUpdateZoneConditions, 45000);
  setInterval(restoredPushRareEvent, 70000);
});
