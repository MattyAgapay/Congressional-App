// ======= State =======
const state = {
  reefHealth: 70,
  fishPop: 65,
  turns: 5,
  selectedZone: null,
  reefName: 'Hāʻena',
  species: [
    { key: 'manini', name: 'Manini (Convict Tang)', status: 'stable',    pop: 72, note: 'Grazer that controls algae on reefs.' },
    { key: 'uuu',    name: "U'u (Menpachi Soldierfish)", status: 'pressured', pop: 48, note: 'Nocturnal; sensitive to shoreline overharvest.' },
    { key: 'ulua',   name: 'Ulua (Giant Trevally)', status: 'declining', pop: 33, note: 'Top predator; slow to recover.' },
  ],
};

// ======= Dom helpers =======
const $ = (s) => document.querySelector(s);
function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1600);
}
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

// ======= Buttons & interactions =======
$('#startBtn').onclick = () => { showScreen('#map-screen'); $('#storyModal').classList.add('open'); };
$('#howBtn').onclick = () => alert('Make 5 policy decisions. Reef/Fish bars update. Open 📘 for species.');
$('#openAbout').onclick = () => alert('Prototype aligned to your wireframe and color palette.');
$('#skipStory').onclick = () => $('#storyModal').classList.remove('open');
$('#contStory').onclick = () => $('#storyModal').classList.remove('open');
$('#navHome').onclick = () => showScreen('#landing');
$('#navPolicies').onclick = () => toast('Policies are listed on the right.');
$('#navDex').onclick = () => toggleDex(true);
$('#closeDex').onclick = () => toggleDex(false);
$('#navSettings').onclick = () => toast('Settings coming soon');
$('#resetBtn').onclick = () => {
  Object.assign(state, { reefHealth: 70, fishPop: 65, turns: 5 });
  updateHUD(); drawZones(); renderDecisionCards();
};

function toggleDex(open){ $('#dex').classList.toggle('open', open); if(open) renderDex(); }

// ======= HUD updates =======
function updateHUD(){
  $('#reefBar').style.width = clamp(state.reefHealth, 0, 100) + '%';
  $('#fishBar').style.width = clamp(state.fishPop, 0, 100) + '%';
  $('#reefVal').textContent = `${state.reefHealth} / 100`;
  $('#fishVal').textContent = `${state.fishPop} / 100`;
  $('#turnsLeft').textContent = state.turns;
  $('#reefName').textContent = state.reefName;
}

// ======= Map setup =======
let map, zonesLayer;

function initMap(){
  map = L.map('map', { zoomControl: false }).setView([21.565, -158.0], 9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, attribution: '© OpenStreetMap'
  }).addTo(map);
  L.control.zoom({ position: 'topright' }).addTo(map);
  drawZones();
}

function zoneColor(){
  const h = state.reefHealth;
  if (h >= 75) return '#2ecc71';
  if (h >= 50) return '#f1c40f';
  return '#e74c3c';
}

function drawZones(){
  if (zonesLayer) zonesLayer.remove();

  // Mock GeoJSON — swap with real reef polygons later
  const geo = {
    type: 'FeatureCollection',
    features: [
      { type:'Feature', properties:{ name:'Hāʻena Reef' },
        geometry:{ type:'Polygon', coordinates:[[[-158.08,21.69],[-158.02,21.69],[-158.02,21.64],[-158.08,21.64],[-158.08,21.69]]] } },
      { type:'Feature', properties:{ name:'Māʻili Reef' },
        geometry:{ type:'Polygon', coordinates:[[[-158.25,21.44],[-158.19,21.44],[-158.19,21.39],[-158.25,21.39],[-158.25,21.44]]] } },
      { type:'Feature', properties:{ name:'Kailua Reef' },
        geometry:{ type:'Polygon', coordinates:[[[-157.76,21.43],[-157.70,21.43],[-157.70,21.39],[-157.76,21.39],[-157.76,21.43]]] } },
    ]
  };

  zonesLayer = L.geoJSON(geo, {
    style: { color:'#222', weight:1, fillColor: zoneColor(), fillOpacity:.5 },
    onEachFeature: (feat, layer) => {
      layer.on('click', () => {
        state.selectedZone = feat.properties.name;
        state.reefName = feat.properties.name;
        toast('Selected ' + feat.properties.name);
        updateHUD();
      });
      layer.bindTooltip(feat.properties.name);
    }
  }).addTo(map);
}

// ======= Policies (deck) =======
const policyDeck = [
  { title:'Seasonal Kapu on Herbivores', body:'Restrict manini & parrotfish harvest for 3 months.',  good:{ reef:+8,  fish:+6 }, bad:{ reef:-4, fish:-2 } },
  { title:'Ban Lay Nets near Shore',     body:'Reduce bycatch; protect juveniles.',                  good:{ reef:+6,  fish:+7 }, bad:{ reef:-3, fish:-4 } },
  { title:'Tourism Education Program',   body:'Snorkel briefings to avoid coral contact/feeding.',  good:{ reef:+5,  fish:+2 }, bad:{ reef:-2, fish:-1 } },
  { title:'Combat Invasive Algae',       body:'Urchin out-planting and removal teams.',             good:{ reef:+9,  fish:+4 }, bad:{ reef:-5, fish:-2 } },
  { title:'Emergency Bleaching Response',body:'Temporary full kapu during heatwave forecasts.',     good:{ reef:+10, fish:+6 }, bad:{ reef:-6, fish:-5 } },
  { title:'Allow Spearfishing Derby',    body:'Short-term economy vs. broodstock loss.',            good:{ reef:-6, fish:-10 }, bad:{ reef:+2, fish:+1 } },
];

function renderDecisionCards(){
  const wrap = $('#decisions');
  wrap.innerHTML = '';
  const cards = policyDeck
    .map((c,i)=>({ ...c, id:i }))
    .sort(()=>Math.random()-0.5)
    .slice(0,3);

  cards.forEach(c=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="title">${c.title}</div>
      <div class="body">${c.body}</div>
      <div class="actions">
        <button class="btn primary">Implement</button>
        <button class="btn ghost">Reject</button>
      </div>`;
    const [okBtn, noBtn] = el.querySelectorAll('button');
    okBtn.onclick = ()=>applyDecision(c.good,  `Implemented: ${c.title}`);
    noBtn.onclick = ()=>applyDecision(c.bad,   `Rejected: ${c.title}`);
    wrap.appendChild(el);
  });
}

function applyDecision(delta, msg){
  if (state.turns <= 0){ toast('No turns left'); return; }
  state.reefHealth = clamp(state.reefHealth + delta.reef, 0, 100);
  state.fishPop    = clamp(state.fishPop + delta.fish, 0, 100);
  state.turns -= 1;

  updateHUD(); drawZones(); toast(msg);
  if (state.turns === 0) endRound();
  else renderDecisionCards();
}

function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }

function endRound(){
  const result =
    state.reefHealth>=75 && state.fishPop>=70 ? 'Reef recovering — excellent stewardship!' :
    state.reefHealth>=55 ? 'Mixed results — recovery underway.' :
    'Reef stressed — try stricter protections next run.';
  alert(result);
}

// ======= Encyclopedia =======
function renderDex(){
  const wrap = $('#dexList');
  wrap.innerHTML = '';
  state.species.forEach(s=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-weight:700">${s.name}</div>
        <span style="font-size:12px;opacity:.7">status: ${s.status}</span>
      </div>
      <div class="body" style="margin-top:6px">${s.note}</div>
      <div class="bar" style="margin-top:8px"><i style="width:${s.pop}%"></i></div>
    `;
    wrap.appendChild(card);
  });
}

// ======= Init =======
updateHUD();
renderDecisionCards();
setTimeout(initMap, 50);
