/* ====================== iPhone safe 100vh ====================== */
function setVH(){ document.documentElement.style.setProperty('--app-vh', `${window.innerHeight * 0.01}px`); }
setVH();
addEventListener('resize', setVH);
addEventListener('orientationchange', setVH);

/* ====================== Game State ====================== */
const Game = {
  reefHealth: 70,
  fishPop: 65,
  turns: 5,
  currentIndex: null
};
function clamp(n){ return Math.max(0, Math.min(100, n)); }

/* ====================== Toast (lightweight) ====================== */
function toast(msg){
  let t = document.getElementById('ff-toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'ff-toast';
    t.style.cssText = `
      position:fixed;bottom:18px;left:50%;transform:translateX(-50%);
      background:#111;color:#fff;border-radius:999px;padding:8px 12px;
      opacity:0;transition:.2s;z-index:9999;font:600 13px/1 Inter,system-ui,sans-serif;`;
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity = 1;
  setTimeout(()=> t.style.opacity = 0, 1200);
}

/* ====================== HUD (Leaflet control) ====================== */
let hudCtrl;
function ensureHUD(){
  if(hudCtrl) return hudCtrl;
  hudCtrl = L.control({position:'topleft'});
  hudCtrl.onAdd = function(){
    const div = L.DomUtil.create('div','ff-hud');
    div.style.cssText = `
      background:#fff;border:2px solid #A3A9A2;border-radius:12px;
      box-shadow:0 6px 18px rgba(0,0,0,.15);padding:8px 10px;
      font:600 12px/1.2 Inter,system-ui,sans-serif;`;
    div.innerHTML = `
      <div>Reef Health: <span id="ff-reef-val">${Game.reefHealth}</span></div>
      <div>Fish Pop: <span id="ff-fish-val">${Game.fishPop}</span></div>
      <div>Turns: <span id="ff-turns">${Game.turns}</span></div>`;
    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  hudCtrl.addTo(OahuMap);
  return hudCtrl;
}
function updateHUD(){
  document.getElementById('ff-reef-val').textContent = Game.reefHealth;
  document.getElementById('ff-fish-val').textContent = Game.fishPop;
  document.getElementById('ff-turns').textContent   = Game.turns;
}

/* ====================== Reef Data (merged with your partner’s) ====================== */
const reefData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type":"Feature",
      "properties": { "marker-color":"#b50916", "name":"Maunalua Beach Bay" },
      "geometry": { "type":"Point", "coordinates":[-157.7256809877041,21.26149342810224] }
    },
    {
      "type":"Feature",
      "properties": {
        "name":"Maunalua Beach Bay",
        "dilemma":"OH NO! <br><br>The once rich biodiversity of their reefes teeming with colorful fish that maintained a delicate balance, over the past decade, a troubling decline in reef fish populations have become evident—a staggering 40% drop, particularly among the herbivorous species.<br><br> These herbivorous species are known to control the invasive algae overtaking the reefs, suffocating corals and endangering the fragile marine life that their way of life depended on. <br><br> Please help!",
        "choices":[
          {
            "title":"Temporary No-Fishing Zone",
            "description":"<br>You propose a 1-year closure of fishing in the most damaged reef area",
            "reefImpact":35,
            "fishPopulationImpactMin":20,
            "fishPopulationImpactMax":30,
            "displayReefHealth":"+35",
            "displayFishPopulation":"+20-30%"
          },
          {
            "title":"Community-Led Catch Limits",
            "description":"<br>You collaborate with local fishers to limit the size and number of reef fish caught",
            "reefImpact":10,
            "fishPopulationImpact":-10,
            "displayReefHealth":"+10",
            "displayFishPopulation":"-10%"
          },
          {
            "title":"Education & Monitoring First",
            "description":"<br>You start community workshops and reef surveys without changing fishing rules",
            "reefImpact":10,
            "fishPopulationImpact":-30,
            "displayReefHealth":"+10",
            "displayFishPopulation":"-30%"
          }
        ],
        "stroke":"#5B5F71",
        "fill":"#A4A8B6"
      },
      "geometry":{
        "type":"Polygon",
        "coordinates":[[[-157.70466051284626,21.259299602174437],[-157.70943129395155,21.2592998046281],[-157.7115511829742,21.261110849675532],[-157.71119879484337,21.264075130235724],[-157.70872806820267,21.268685670008495],[-157.70925624703327,21.272636504574393],[-157.70854769942153,21.277411130884573],[-157.70996000078696,21.279222548204785],[-157.71279149082807,21.281525241117365],[-157.7149131769268,21.282676122130894],[-157.71667990089654,21.283004888310188],[-157.71897771196478,21.28448402290074],[-157.72198486665084,21.28414705322882],[-157.72180636180843,21.282340864451314],[-157.72392317155928,21.280862569229058],[-157.7278076818471,21.281190316341025],[-157.73345360091142,21.282005344674104],[-157.73310563345342,21.27971400994167],[-157.73593239508898,21.279550127826795],[-157.73610244087166,21.28118745039386],[-157.73752063971762,21.27987785872709],[-157.73999324328682,21.27987785872709],[-157.743174972091,21.280373109207048],[-157.7440619971232,21.278399366972963],[-157.75006963613524,21.277411465968854],[-157.75482608815432,21.276256806817713],[-157.7539487764978,21.27411789154742],[-157.75851482765228,21.27329421525816],[-157.76113095003296,21.276743504503145],[-157.77020277886072,21.27230726660234],[-157.77639424972497,21.269837510875305],[-157.77904622109077,21.266050316826707],[-157.786464413383,21.261111036470837],[-157.7908680715161,21.258314964432813],[-157.79033996403393,21.25568046266376],[-157.79351160576394,21.254859525789797],[-157.7963289128544,21.257001487801944],[-157.79563575895975,21.25370591721108],[-157.70466051284626,21.259299602174437]]]
      }
    },
    {
      "type":"Feature",
      "properties": {
        "name":"Maunalua Beach Bay",
        "dilemma":"OH NO!<br><br> Overfishing of nocturnal reef predators—especially through unregulated night spearfishing—has led to a sharp decline in species like taʻape, menpachi, and kūmū. These predators once kept invertebrate populations in check. Without them, small crustaceans and bioeroding species have surged, destabilizing coral structures from within.",
        "choices":[
          { "title":"Night OverFishing Ban", "description":"You will enact a full ban on nighttime spearfishing within designated reef zones of Maunalua Bay.", "reefImpact":85, "fishPopulationImpact":70, "displayReefHealth":"+8", "displayFishPopulation":"+65%" },
          { "title":"Predator Species Hatchery Restocking", "description":"You would establish a hatchery initiative focused on breeding and releasing native predator species into Maunalua Bay.", "reefImpact":65, "fishPopulationImpact":90, "displayReefHealth":"+7", "displayFishPopulation":"+75%" },
          { "title":"Community-Led Monitoring", "description":"You would enact a policy that empowers local fishers, students, and cultural practitioners to monitor reef health and enforce seasonal fishing closures", "reefImpact":15, "fishPopulationImpact":60, "displayReefHealth":"+1", "displayFishPopulation":"+60%" }
        ],
        "stroke":"#e17f2a",
        "fill":"#e08e45"
      }
    }
  ]
};

let OahuMap, geojson;
const dilemmaFeatures = reefData.features.filter(f => f.properties && f.properties.choices);
const featureLayers = [];

/* ====================== Helpers ====================== */
function reefHealthColorFromState(){
  const h = Game.reefHealth;
  return h >= 75 ? "#2ECC71" : h >= 50 ? "#F1C40F" : "#E74C3C";
}
function formatPercentNumber(n){
  if (typeof n !== 'number' || isNaN(n)) return null;
  const sign = n > 0 ? '+' : '';
  return `${sign}${n}%`;
}
function computeFishDisplay(choice){
  const min = (typeof choice.fishPopulationImpactMin === 'number') ? choice.fishPopulationImpactMin
           : (typeof choice.fishImpactMin === 'number') ? choice.fishImpactMin
           : undefined;
  const max = (typeof choice.fishPopulationImpactMax === 'number') ? choice.fishPopulationImpactMax
           : (typeof choice.fishImpactMax === 'number') ? choice.fishImpactMax
           : undefined;
  if (typeof min === 'number' && typeof max === 'number' && min !== max){
    const mid = Math.round(((min + max)/2)*10)/10;
    const rangeStr = `${min>0?'+':''}${min}-${max}%`;
    return { display: rangeStr, midpointValue: mid };
  }
  const single = (typeof choice.fishPopulationImpact === 'number') ? choice.fishPopulationImpact
              : (typeof choice.fishImpact === 'number') ? choice.fishImpact
              : (typeof choice.fishPopulationImpactMin === 'number' && typeof choice.fishPopulationImpactMax !== 'number') ? choice.fishPopulationImpactMin
              : undefined;
  if (typeof single === 'number') return { display: formatPercentNumber(single), midpointValue: single };
  if (choice.displayFishPopulation) return { display: choice.displayFishPopulation, midpointValue: undefined };
  if (choice.fishPopulation) return { display: String(choice.fishPopulation), midpointValue: undefined };
  return { display: "+-", midpointValue: undefined };
}
function computeReefDisplay(choice){
  if (typeof choice.reefImpact === 'number') return { display: formatPercentNumber(choice.reefImpact), value: choice.reefImpact };
  if (choice.displayReefHealth) return { display: choice.displayReefHealth, value: undefined };
  if (choice.reefHealth) return { display: String(choice.reefHealth), value: undefined };
  return { display: "+-", value: undefined };
}

/* ====================== Map Init ====================== */
document.addEventListener("DOMContentLoaded", function(){
  // Initialize map at a valid zoom (avoid blank tiles)
  OahuMap = L.map('main-map').setView([21.270435, -157.733683], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(OahuMap);
  L.control.zoom({position:'topright'}).addTo(OahuMap);
  window.__FF_MAP = OahuMap;

  ensureHUD(); updateHUD();

  geojson = L.geoJSON(reefData, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
      radius: 8,
      fillColor: feature.properties["marker-color"] || "#3388ff",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }),
    style: (feature) => ({
      color: feature.properties?.stroke || "#3388ff",
      fillColor: feature.properties?.fill || reefHealthColorFromState(),
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }),
    onEachFeature: (feature, layer) => {
      // store polygon layers that have dilemmas
      if (feature.geometry && feature.geometry.type !== "Point") {
        const idx = dilemmaFeatures.indexOf(feature);
        if (idx >= 0) featureLayers[idx] = layer;

        const props = feature.properties || {};
        const popup = `
          <strong>${props.name || ""}</strong><br>
          ${props.dilemma || ""}<br><br>
          <button onclick="openDilemmaPanel(${idx})">Take Action</button>`;
        layer.bindPopup(popup);

        layer.on({
          mouseover: (e)=> e.target.setStyle({weight:3,color:'#5578D8',fillOpacity:0.7}),
          mouseout:  (e)=> geojson.resetStyle(e.target)
        });
      }
    }
  }).addTo(OahuMap);
});

/* ====================== Dilemma Panel ====================== */
function openDilemmaPanel(i){ showDilemmaPanel(i); }
window.openDilemmaPanel = openDilemmaPanel;

function showDilemmaPanel(i){
  if (!(i >= 0 && i < dilemmaFeatures.length)){
    const panel = document.getElementById('dilemma-panel');
    panel.innerHTML = `<div class="bubble-content"><strong>No more dilemmas!</strong></div>`;
    panel.style.display = 'block';
    return;
  }
  Game.currentIndex = i;
  const feature = dilemmaFeatures[i];
  const props = feature.properties || {};

  const panel = document.getElementById('dilemma-panel');
  panel.innerHTML = `
    <div class="dilemma-speech-pointer"></div>
    <div class="bubble-content">
      <div class="decision-header">
        <button class="close-btn" onclick="closeDilemmaPanel()">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#5b5b5b"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
        </button>
        <h2>${props.name || ''}</h2>
      </div>
      <div class="choices">
        ${(props.choices||[]).map((c,idx)=>`
          <div class="choice-card">
            <h3>${c.title || '[POLICY TITLE]'}</h3>
            <p>${c.description || 'Policy Description'}</p>
            <div class="impacts"><b>Reef:</b> ${c.displayReefHealth ?? (typeof c.reefImpact==='number'? ('+'+c.reefImpact+'%'):'+-')}
              &nbsp;·&nbsp; <b>Fish:</b> ${c.displayFishPopulation ?? (typeof c.fishPopulationImpact==='number' ? ( (c.fishPopulationImpact>0?'+':'')+c.fishPopulationImpact+'%' ):'+-')}
            </div>
            <button class="authorize-btn" onclick="handleChoice(${idx})">Authorize</button>
          </div>
        `).join('')}
      </div>
    </div>`;
  panel.style.display = 'block';
}
window.showDilemmaPanel = showDilemmaPanel;

function showDilemmaSummary(i){
  if (!(i >= 0 && i < dilemmaFeatures.length)){
    const panel = document.getElementById('dilemma-panel');
    panel.innerHTML = `<div class="bubble-content"><strong>No more dilemmas!</strong></div>`;
    panel.style.display = 'block';
    return;
  }
  Game.currentIndex = i;
  const feature = dilemmaFeatures[i];
  const props = feature.properties || {};
  const excerpt = props.dilemma ? (props.dilemma.length > 240 ? props.dilemma.substring(0,240) + '…' : props.dilemma) : '';

  const panel = document.getElementById('dilemma-panel');
  panel.innerHTML = `
    <div class="dilemma-speech-pointer"></div>
    <div class="bubble-content">
      <div class="decision-header">
        <button class="close-btn" onclick="closeDilemmaPanel()">✕</button>
        <h2>${props.name || ''}</h2>
      </div>
      <div class="summary-body">
        <div class="summary-text">${excerpt}</div>
        <div style="margin-top:12px;">
          <button onclick="showDilemmaPanel(${i})">View Options</button>
          <button onclick="handleChoice(0)" style="margin-left:8px;">Auto-Authorize First Option</button>
        </div>
      </div>
    </div>`;
  panel.style.display = 'block';
}
window.showDilemmaSummary = showDilemmaSummary;

function closeDilemmaPanel(){
  document.getElementById('dilemma-panel').style.display = 'none';
}
window.closeDilemmaPanel = closeDilemmaPanel;

/* ====================== Choice Handling ====================== */
function handleChoice(choiceIndex){
  const i = Game.currentIndex;
  const feature = (i!=null) ? dilemmaFeatures[i] : null;
  if(!feature) return;
  const choice = feature.properties?.choices?.[choiceIndex];
  if(!choice) return;

  if (Game.turns <= 0){ toast("No turns left"); return; }

  // Use numeric fields if present
  const reefObj = computeReefDisplay(choice);       // {display, value}
  const fishObj = computeFishDisplay(choice);       // {display, midpointValue}
  const reefDelta = (typeof reefObj.value === 'number') ? reefObj.value : 0;
  const fishDelta = (typeof fishObj.midpointValue === 'number') ? fishObj.midpointValue : 0;

  // Apply effect to state
  Game.reefHealth = clamp(Game.reefHealth + reefDelta);
  Game.fishPop    = clamp(Game.fishPop + fishDelta);
  Game.turns--;

  updateHUD();

  // Color the polygon for this dilemma based on **current** reefHealth
  const layer = featureLayers[i];
  if(layer){
    const fill = reefHealthColorFromState();
    layer.setStyle({ fillColor: fill, color: fill, fillOpacity: 0.6 });
    feature.properties.fill = fill;
  }

  // Build “Ocean Report”
  const panel = document.getElementById('dilemma-panel');
  panel.innerHTML = `
    <div class="dilemma-speech-pointer"></div>
    <div class="bubble-content">
      <div class="report-title"><strong>Ocean Report</strong></div>
      <div class="decision-number"><em>DECISION ${i+1}</em></div>
      <div class="report-stats">
        Reef Impact: <span>${reefObj.display || "+-"}</span><br>
        Fish Impact: <span>${fishObj.display || "+-"}</span><br>
        New Reef Health: <b>${Game.reefHealth}/100</b><br>
        New Fish Pop: <b>${Game.fishPop}/100</b><br>
        Turns Left: <b>${Game.turns}</b>
      </div>
      <hr>
      ${Game.turns>0 ? `
        <button class="nxtDilemmaBtn" onclick="nextDilemma()">Next Dilemma</button>
      ` : `
        <div class="outcome" style="margin-top:12px;">
          <strong>Round Complete</strong><br>
          ${finalVerdict()}
        </div>
        <div style="margin-top:10px;display:flex;gap:8px">
          <button onclick="resetGame()">Play Again</button>
          <button onclick="closeDilemmaPanel()">Close</button>
        </div>
      `}
    </div>`;
  panel.style.display = 'block';
}
window.handleChoice = handleChoice;

/* ====================== Flow Helpers ====================== */
function nextDilemma(){
  const next = (Game.currentIndex==null) ? 0 : Game.currentIndex + 1;
  if (next >= dilemmaFeatures.length){
    const panel = document.getElementById('dilemma-panel');
    panel.innerHTML = `<div class="bubble-content"><strong>No more dilemmas!</strong></div>`;
    panel.style.display = 'block';
    return;
  }
  showDilemmaSummary(next);
}
window.nextDilemma = nextDilemma;

function finalVerdict(){
  return (Game.reefHealth>=75 && Game.fishPop>=70)
    ? "🌊 Excellent stewardship — the reef thrives!"
    : (Game.reefHealth>=55)
      ? "🌱 Reef recovering — good effort."
      : "⚠️ Reef stressed — stronger protections needed.";
}
function resetGame(){
  Object.assign(Game,{ reefHealth:70, fishPop:65, turns:5, currentIndex:null });
  updateHUD();
  toast("Game reset");
  closeDilemmaPanel();
  // recolor polygons to match reset state
  featureLayers.forEach(l=>{
    if(l) l.setStyle({ fillColor: reefHealthColorFromState(), color: reefHealthColorFromState(), fillOpacity: 0.5 });
  });
}
window.resetGame = resetGame;
