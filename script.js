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
function showReport(r){document.getElementById("report")
}

/* Override major point popup with GPS */
function majorPopupHTMLV65(point){
  return `
    <div class="map-point-popup">
      <h4>${point.id}</h4>
      <p><strong>${point.status}</strong></p>
      <p class="severity">SEVERITY : ${point.severity}</p>
      ${point.body.map(line=>`<p class="muted">${line}</p>`).join("")}
      <p class="gps-line">${formatGPSV67(point.latlng)}</p>
    </div>
  `;
}

/* v69 — popups only, no external incident detail panel */
function updateIncidentDetailPanelV64(){ return; }
function renderIncidentDetailV62(){ return; }
function renderIncidentDetailV61(){ return; }
function renderIncidentDetailV60(){ return; }
