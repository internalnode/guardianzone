const events=[
'04:12 — CAMERA_07 — Réponse reçue durant 2 secondes.',
'04:47 — RELAY_03 — Connexion brièvement rétablie.',
'05:11 — TUNNEL_SUD — Contact capteur brièvement actif.',
'05:39 — NORTH_BLOCK — Mouvement non confirmé.',
'06:02 — BLACK_CHANNEL — Tentative d’accès rejetée.'
];

function tickClock(){
 const d=new Date();
 document.getElementById('clock').textContent=
 String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}
setInterval(tickClock,1000);
tickClock();

setInterval(()=>{
 const feed=document.getElementById('feed');
 const div=document.createElement('div');
 div.className='feed-item';
 div.textContent=events[Math.floor(Math.random()*events.length)];
 feed.prepend(div);
 while(feed.children.length>6){
   feed.removeChild(feed.lastElementChild);
 }
},60000);
