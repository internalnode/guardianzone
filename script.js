const bootMessages=["Initializing local kernel...","Loading restricted archive index...","Syncing perimeter relays...","Restoring low frequency channel...","Scanning active perimeter points...","Limited authorization granted."];
const bootLines=document.getElementById("boot-lines");bootMessages.forEach((m,i)=>setTimeout(()=>{const l=document.createElement("div");l.textContent="> "+m;bootLines.appendChild(l)},330*i));
window.addEventListener("load",()=>setTimeout(()=>{const b=document.getElementById("boot");b.style.opacity="0";setTimeout(()=>b.style.display="none",800)},3900));
let map,mapReady=false;
const reports=[
{coords:[51.3890,30.0990],title:"CENTRALE",severity:"critical",label:"CRITICAL",category:"Émission instable",text:"Fluctuations électriques relevées autour des installations principales.",detail:"Aucune présence visuelle confirmée. Priorité élevée pour MYTH."},
{coords:[51.4048,30.0569],title:"PRIPYAT",severity:"high",label:"HIGH",category:"Passage récent",text:"Traces de déplacement supposées dans plusieurs bâtiments résidentiels.",detail:"Signal faible : capteur de porte, vibration brève, puis silence."},
{coords:[51.3180,30.0710],title:"SECTEUR ROUGE",severity:"medium",label:"MEDIUM",category:"Interférences radio",text:"Parasites persistants sur bande courte.",detail:"Contrôle recommandé lorsque les conditions météo seront stables."},
{coords:[51.2750,30.2210],title:"OBSERVATION EAST",severity:"low",label:"LOW",category:"Signal nocturne",text:"Signal court détecté durant la nuit.",detail:"Source indéterminée : relais dégradé, transmission ou présence mobile."},
{coords:[51.3530,29.9800],title:"ANCIEN RELAIS",severity:"medium",label:"MEDIUM",category:"Alimentation active",text:"Relais encore alimenté malgré l’arrêt officiel du réseau.",detail:"Données irrégulières. Accès terrain difficile."}
];
function showReport(r){document.getElementById("report").innerHTML=`<div class="card-title">SELECTED POINT</div><h3>${r.title}</h3><p><strong>${r.category}</strong> — SEVERITY : ${r.label}</p><p>${r.text}</p><p style="color:#778070">${r.detail}</p>`}
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
"ARCHIVE SEGMENT CORRUPTED",
"DOOR SENSOR TRIGGERED — EMPTY FEED",
"MYTH TASKING PENDING"
];
function pad(n){return String(n).padStart(2,"0")}
function pushLog(){const log=document.getElementById("system-log");if(!log)return;const now=new Date(),line=document.createElement("div");line.textContent=`[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}] ${events[Math.floor(Math.random()*events.length)]}`;log.appendChild(line);while(log.children.length>5)log.removeChild(log.firstElementChild)}
function updateSystems(){
const q=document.getElementById("quality"),d=document.getElementById("dosimeter"),c=document.getElementById("channel"),s=document.getElementById("signal-state"),l=document.getElementById("loss");
const wind=document.getElementById("wind"),pressure=document.getElementById("pressure"),cam=document.getElementById("camera-integrity"),lat=document.getElementById("latency"),mu=document.getElementById("map-update");
const qualities=["DEGRADED","UNSTABLE","WEAK","RESTORED"],quality=qualities[Math.floor(Math.random()*qualities.length)];
if(q){q.textContent=quality;q.classList.toggle("flash-warn",quality==="UNSTABLE"||quality==="WEAK")}
if(s)s.textContent="SIGNAL "+quality;
if(c)c.textContent=["OPEN","NOISY","PARTIAL","DELAYED"][Math.floor(Math.random()*4)];
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
      "Le relais était déjà alimenté avant l’arrivée sur site.",
      "Aucune présence détectée à proximité immédiate.",
      "Aucune trace récente observée autour de l’installation.",
      "Le système a pourtant été redémarré manuellement."
    ],
    note:true
  },

  tunnel:{
    title:"TUNNEL_SUD",
    status:"RESTRICTED",
    access:"02:14",
    power:"OFFLINE",
    integrity:"58%",
    content:[
      "Détection nocturne signalée près de l’accès sud.",
      "Le tunnel semble condamné depuis plusieurs années.",
      "Un capteur de porte a pourtant brièvement répondu.",
      "Aucune confirmation visuelle disponible."
    ]
  },

  install12:{
    title:"INSTALLATION_12",
    status:"UNSTABLE",
    access:"UNKNOWN",
    power:"PARTIAL",
    integrity:"41%",
    content:[
      "Structure partiellement effondrée.",
      "Une émission faible persiste sur bande courte.",
      "Le signal fluctue selon les conditions météo.",
      "Le secteur reste difficile d’accès."
    ]
  },

  visual:{
    title:"VISUAL_RECORD",
    status:"CORRUPTED",
    access:"FILE DAMAGE",
    power:"UNKNOWN",
    integrity:"12%",
    content:[
      "Segment image récupéré depuis un ancien terminal.",
      "Plusieurs portions du fichier sont manquantes.",
      "Une silhouette apparaît brièvement avant la perte du signal.",
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
      <div class="file-state">STATUS : ${data.status}</div>
    </div>

    <div class="file-meta">
      <div>
        <span>LAST ACCESS</span>
        <strong>${data.access}</strong>
      </div>

      <div>
        <span>POWER SOURCE</span>
        <strong>${data.power}</strong>
      </div>

      <div>
        <span>ARCHIVE INTEGRITY</span>
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
