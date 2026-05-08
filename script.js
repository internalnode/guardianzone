
const bootMessages = [
  "Initializing local kernel...",
  "Loading restricted archive index...",
  "Syncing perimeter relays...",
  "Restoring low frequency channel...",
  "Scanning active perimeter points...",
  "Limited authorization granted."
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
    severityLabel:"CRITICAL",
    category:"Unstable emission",
    text:"Electrical fluctuations detected around the main structures.",
    detail:"No visual confirmation. Signal may originate from an autonomous circuit still active."
  },
  {
    coords:[51.4048,30.0569],
    title:"PRIPYAT",
    severity:"high",
    severityLabel:"HIGH",
    category:"Recent passage",
    text:"Possible movement traces detected in several residential buildings.",
    detail:"Weak input only: door sensor, brief vibration, then complete silence."
  },
  {
    coords:[51.3180,30.0710],
    title:"SECTEUR ROUGE",
    severity:"medium",
    severityLabel:"MEDIUM",
    category:"Radio interference",
    text:"Persistent shortwave interference.",
    detail:"Field check recommended when weather conditions stabilize."
  },
  {
    coords:[51.2750,30.2210],
    title:"POINT D’OBSERVATION",
    severity:"low",
    severityLabel:"LOW",
    category:"Night signal",
    text:"Short signal detected during the night.",
    detail:"Unknown source: degraded relay, brief transmission, or mobile presence."
  },
  {
    coords:[51.3530,29.9800],
    title:"ANCIEN RELAIS",
    severity:"medium",
    severityLabel:"MEDIUM",
    category:"Active power",
    text:"Relay still appears powered despite official network shutdown.",
    detail:"Irregular data. Difficult field access. MYTH verification pending."
  }
];

function setReport(report){
  const box = document.getElementById("report");
  box.innerHTML = `
    <h3>${report.title}</h3>
    <p><strong>${report.category}</strong> — SEVERITY : ${report.severityLabel}</p>
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
      <div style="font-size:12px;letter-spacing:2px;color:#9aaa7d;margin-bottom:8px;">SEVERITY : ${report.severityLabel}</div>
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


/* v3.7 live surveillance simulation */
const liveEvents = [
  "CAMERA FEED LOST — SECTOR NORTH",
  "LOW FREQUENCY BURST DETECTED",
  "PERIMETER RELAY 03 RESPONDING",
  "UNCONFIRMED MOVEMENT — RESIDENTIAL BLOCK",
  "DOSIMETER SPIKE NORMALIZED",
  "SIGNAL DROP — 4 SECONDS",
  "MYTH TASKING PENDING"
];

function pad(n){ return String(n).padStart(2, "0"); }

function pushSystemLog(message){
  const log = document.getElementById("system-log");
  if(!log) return;

  const now = new Date();
  const stamp = `[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}]`;
  const line = document.createElement("div");
  line.textContent = `${stamp} ${message}`;

  log.appendChild(line);

  while(log.children.length > 5){
    log.removeChild(log.firstElementChild);
  }
}

function updateLiveStrip(){
  const signal = document.getElementById("signal-quality");
  const dosimeter = document.getElementById("dosimeter");
  const channel = document.getElementById("lf-channel");

  if(signal){
    const values = ["DEGRADED", "UNSTABLE", "WEAK", "RESTORED"];
    signal.textContent = values[Math.floor(Math.random()*values.length)];
  }

  if(dosimeter){
    const value = (0.28 + Math.random()*0.46).toFixed(2);
    dosimeter.textContent = `${value} µSv/h`;
  }

  if(channel){
    const values = ["OPEN", "NOISY", "DELAYED", "PARTIAL"];
    channel.textContent = values[Math.floor(Math.random()*values.length)];
  }
}

setInterval(() => {
  pushSystemLog(liveEvents[Math.floor(Math.random()*liveEvents.length)]);
  updateLiveStrip();
}, 9000);

setInterval(() => {
  document.body.classList.add("pulse-alert");
  setTimeout(() => document.body.classList.remove("pulse-alert"), 500);
}, 17000);
