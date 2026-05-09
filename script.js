const bootMessages = [
  "ІНІЦІАЛІЗАЦІЯ ЛОКАЛЬНОГО ВУЗЛА...",
  "ЗАВАНТАЖЕННЯ ПЕРИМЕТРА...",
  "СИНХРОНІЗАЦІЯ РЕЛЕ...",
  "ОБМЕЖЕНИЙ ДОСТУП НАДАНО."
];

const bootLines = document.getElementById("boot-lines");
bootMessages.forEach((message,index)=>{
  setTimeout(()=>{
    const line = document.createElement("div");
    line.textContent = "> " + message;
    bootLines.appendChild(line);
  }, index * 380);
});

window.addEventListener("load",()=>{
  setTimeout(()=>{
    const boot = document.getElementById("boot");
    boot.style.opacity = "0";
    setTimeout(()=>boot.style.display="none",700);
  },2600);
});

const start = Date.now();

function pad(n){return String(n).padStart(2,"0")}

function tick(){
  const now = new Date();
  document.getElementById("clock").textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  document.getElementById("mapUpdate").textContent = `LAST UPDATE : ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const elapsed = Math.floor((Date.now()-start)/1000);
  document.getElementById("uptime").textContent =
    `${pad(Math.floor(elapsed/3600))}:${pad(Math.floor((elapsed%3600)/60))}:${pad(elapsed%60)}`;
}

setInterval(tick,1000);
tick();

function showTab(id){
  document.querySelectorAll(".screen").forEach(screen=>{
    screen.classList.toggle("active",screen.id===id);
  });
  document.querySelectorAll(".tabs button").forEach(button=>{
    button.classList.toggle("active",button.dataset.tab===id);
  });
  window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll(".tabs button").forEach(button=>{
  button.addEventListener("click",()=>showTab(button.dataset.tab));
});

const incidents = {
  CENTRALE:{
    title:"CENTRALE",
    status:"Émission instable",
    severity:"CRITIQUE",
    gps:"51.38900 / 30.10200",
    body:[
      "Alimentation relevée hors cycle prévu autour des structures principales.",
      "Caméras indisponibles. Vérification terrain prioritaire."
    ]
  },
  RELAY_03:{
    title:"RELAY_03",
    status:"Alimentation hors cycle",
    severity:"ÉLEVÉE",
    gps:"51.37700 / 30.11800",
    body:[
      "Relais alimenté malgré l’arrêt officiel du réseau.",
      "Réponse irrégulière. Accès terrain classé difficile."
    ]
  },
  NODE_01:{
    title:"NODE-01",
    status:"Maintenance non signée",
    severity:"MOYENNE",
    gps:"51.39200 / 30.08800",
    body:[
      "Cycle technique exécuté sans identifiant conservé.",
      "Présence humaine non confirmée."
    ]
  },
  CAMERA_07:{
    title:"CAMERA_07",
    status:"Flux indisponible",
    severity:"FAIBLE",
    gps:"51.39800 / 30.10500",
    body:[
      "Caméra hors ligne.",
      "Capteur de mouvement encore actif."
    ]
  },
  TUNNEL_SUD:{
    title:"TUNNEL_SUD",
    status:"Contact capteur bref",
    severity:"FAIBLE",
    gps:"51.35600 / 30.07200",
    body:[
      "Signal bref détecté sur fenêtre nocturne.",
      "Source non attribuée."
    ]
  }
};

const popupBackdrop = document.getElementById("popupBackdrop");
const popupContent = document.getElementById("popupContent");

function openPopup(data){
  popupContent.innerHTML = `
    <h3>${data.title}</h3>
    <p><strong>${data.status}</strong></p>
    <p class="muted">SEVERITY : ${data.severity}</p>
    ${data.body.map(line=>`<p>${line}</p>`).join("")}
    <p class="gps">GPS : ${data.gps}</p>
  `;
  popupBackdrop.hidden = false;
}

document.querySelectorAll(".map-point").forEach(point=>{
  point.addEventListener("click",()=>openPopup(incidents[point.dataset.id]));
});

document.getElementById("popupClose").addEventListener("click",()=>popupBackdrop.hidden=true);
popupBackdrop.addEventListener("click",(e)=>{
  if(e.target === popupBackdrop) popupBackdrop.hidden = true;
});

function updateSystems(){
  const qualities = ["DÉGRADÉ","INSTABLE","FAIBLE","RÉTABLI"];
  const q = qualities[Math.floor(Math.random()*qualities.length)];
  document.getElementById("sysSignal").textContent = q;
  document.getElementById("signalState").textContent = "SIGNAL " + q;
  document.getElementById("dosimeter").textContent = (0.28 + Math.random()*0.38).toFixed(2) + " µSv/h";
  document.getElementById("channel").textContent = ["OUVERT","PARASITÉ","RETARDÉ","PARTIEL"][Math.floor(Math.random()*4)];
  document.getElementById("wind").textContent = ["N/NE 11 KM/H","E 07 KM/H","CALME","NW 18 KM/H"][Math.floor(Math.random()*4)];
  document.getElementById("pressure").textContent = Math.floor(1001 + Math.random()*18) + " HPA";
  document.getElementById("cameraIntegrity").textContent = Math.floor(24 + Math.random()*42) + "%";
  document.getElementById("latency").textContent = Math.floor(180 + Math.random()*420) + " MS";
  document.getElementById("gridIntegrity").textContent = Math.floor(30 + Math.random()*39) + "%";
  document.getElementById("fieldCondition").textContent = ["STABLE","VISIBILITÉ RÉDUITE","HUMIDE","INTERFÉRENCES"][Math.floor(Math.random()*4)];
  document.getElementById("loss").textContent = Math.floor(7 + Math.random()*22) + "%";
}

setInterval(updateSystems,9000);
updateSystems();

function pushLog(){
  const log = document.getElementById("systemLog");
  const messages = [
    "CAMERA FEED LOST — SECTOR NORTH",
    "LOW FREQUENCY BURST DETECTED",
    "PERIMETER RELAY 03 RESPONDING",
    "SIGNAL DROP — 4 SECONDS",
    "UNSIGNED ACCESS — RELAY 03",
    "MYTH TASKING PENDING"
  ];

  const now = new Date();
  const line = document.createElement("div");
  line.textContent = `[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}] ${messages[Math.floor(Math.random()*messages.length)]}`;
  log.appendChild(line);
  while(log.children.length > 6) log.removeChild(log.firstElementChild);
}

setInterval(pushLog,17000);

const safehouses = {
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

function renderSafehouse(id){
  const data = safehouses[id];
  const box = document.getElementById("safeDetail");
  box.innerHTML = `
    <div class="section-title">SELECTED CACHE</div>
    <h3>${data.title}</h3>
    <div class="node-meta">
      <div><label>POWER</label><p>${data.power}</p></div>
      <div><label>SIGNAL</label><p>${data.signal}</p></div>
      <div><label>LAST ACCESS</label><p>${data.access}</p></div>
      <div><label>STATUS</label><p>${data.status}</p></div>
    </div>
    <div class="safehouse-photo">
      <img src="${data.image}" alt="">
      <div class="photo-caption">${data.caption}</div>
    </div>
    <div class="node-description">${data.body.map(p=>`<p>${p}</p>`).join("")}</div>
  `;
}

document.querySelectorAll(".safe-point").forEach(point=>{
  point.addEventListener("click",()=>{
    document.querySelectorAll(".safe-point").forEach(p=>p.classList.remove("active"));
    point.classList.add("active");
    renderSafehouse(point.dataset.safe);
  });
});

renderSafehouse("node01");
