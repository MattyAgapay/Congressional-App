// Input GeoJSON
const reefData = {
  "type": "FeatureCollection",
  "features": [
        {
     "type": "Feature",
     "properties": {
       "marker-color": "#b50916",
       "name": "Maunalua Beach Bay"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-157.7256809877041, 21.26149342810224]
      }
    },
    {
      "type": "Feature",
      "properties": {
            "name": "Maunalua Beach Bay",
            "dilemma": "OH NO! <br><br>The once rich biodiversity of their reefes teeming with colorful fish that maintained a delicate balance, over the past decade, a troubling decline in reef fish populations have become evident—a staggering 40% drop, particularly among the herbivorous species.<br><br> These herbivorous species are known to control the invasive algae overtaking the reefs, suffocating corals and endangering the fragile marine life that their way of life depended on. <br><br> Please help!",
              "choices": [
                { 
                  "title": "Temporary No-Fishing Zone",
                  "description": "<br>You propose a 1-year closure of fishing in the most damaged reef area",
                  "reefImpact": 35, // numeric percent
                  "fishPopulationImpactMin": 20, 
                  "fishPopulationImpactMax": 30,
                  "displayReefHealth": "+35",
                  "displayFishPopulation": "+ 20-30%"
                },
                { 
                  "title": "Community-Led Catch Limits",
                  "description": "<br>You collaborate with local fishers to limit the size and number of reef fish caught", 
                  "reefImpact": 10, 
                  "fishPopulationImpact": -10, 
                  "displayReefHealth": "+ 10",
                  "displayFishPopulation": "- 10%"
                },
                { 
                  "title": "Education & Monitoring First", 
                  "description": "<br>You start community workshops and reef surveys without changing fishing rules", 
                  "reefImpact": 10, 
                  "fishPopulationImpact": -30, 
                  "displayReefHealth": "- 20",
                  "displayFishPopulation": "- 30%"
                }
              ],
       
            "stroke": "#5B5F71",
            "fill": "#A4A8B6"
      },
      "geometry": {
            "type": "Polygon",
            "coordinates": [
            [
                  [-157.70466051284626, 21.259299602174437],
                  [-157.70943129395155, 21.2592998046281],
                  [-157.7115511829742, 21.261110849675532],
                  [-157.71119879484337, 21.264075130235724],
                  [-157.70872806820267, 21.268685670008495],
                  [-157.70925624703327, 21.272636504574393],
                  [-157.70854769942153, 21.277411130884573],
                  [-157.70996000078696, 21.279222548204785],
                  [-157.71279149082807, 21.281525241117365],
                  [-157.7149131769268, 21.282676122130894],
                  [-157.71667990089654, 21.283004888310188],
                  [-157.71897771196478, 21.28448402290074],
                  [-157.72198486665084, 21.28414705322882],
                  [-157.72180636180843, 21.282340864451314],
                  [-157.72392317155928, 21.280862569229058],
                  [-157.7278076818471, 21.281190316341025],
                  [-157.73345360091142, 21.282005344674104],
                  [-157.73310563345342, 21.27971400994167],
                  [-157.73593239508898, 21.279550127826795],
                  [-157.73610244087166, 21.28118745039386],
                  [-157.73752063971762, 21.27987785872709],
                  [-157.73999324328682, 21.27987785872709],
                  [-157.743174972091, 21.280373109207048],
                  [-157.7440619971232, 21.278399366972963],
                  [-157.75006963613524, 21.277411465968854],
                  [-157.75482608815432, 21.276256806817713],
                  [-157.7539487764978, 21.27411789154742],
                  [-157.75851482765228, 21.27329421525816],
                  [-157.76113095003296, 21.276743504503145],
                  [-157.77020277886072, 21.27230726660234],
                  [-157.77639424972497, 21.269837510875305],
                  [-157.77904622109077, 21.266050316826707],
                  [-157.786464413383, 21.261111036470837],
                  [-157.7908680715161, 21.258314964432813],
                  [-157.79033996403393, 21.25568046266376],
                  [-157.79351160576394, 21.254859525789797],
                  [-157.7963289128544, 21.257001487801944],
                  [-157.79563575895975, 21.25370591721108],
                  [-157.70466051284626, 21.259299602174437]
            ]

         ]
      } 
    },
    {
      "type": "Feature",
      "properties": {
            "name": "Maunalua Beach Bay",
            "dilemma": "OH NO!<br><br> Overfishing of nocturnal reef predators—especially through unregulated night spearfishing—has led to a sharp decline in species like taʻape, menpachi, and kūmū. These predators once kept invertebrate populations in check. Without them, small crustaceans and bioeroding species have surged, destabilizing coral structures from within.",
            "choices": [
              { "title": "Night OverFishing Ban", "description": "You will enact a full ban on nighttime spearfishing within designated reef zones of Maunalua Bay.", 
               "reefImpact": 85, 
               "fishPopulationImpact": 70, 
               "displayReefHealth": "+ 8",
               "displayFishPopulation": "+ 65%" },
              { "title": "Predator Species Hatchery Restocking", "description": "You would establish a hatchery initiative focused on breeding and releasing native predator species into Maunalua Bay.", 
              "reefImpact": 65, 
               "fishPopulationImpact": 90, 
               "displayReefHealth": "+ 7",
               "displayFishPopulation": "+ 75%" },
              { "title": "Community-Led Monitoring", "description": "You would enact a policy that empowers local fishers, students, and cultural practitioners to monitor reef health and enforce seasonal fishing closures", 
              "reefImpact": 15, 
               "fishPopulationImpact": 60, 
               "displayReefHealth": "- 20",
               "displayFishPopulation": "- 10%" }
            ],
       
            "stroke": "#e17f2a",
            "fill": "#e08e45"
      }
    }
  ]
};

let geojson; // Declare outside for scope
const dilemmaFeatures = reefData.features.filter(f => f.properties.choices);

// Store polygon layer references for each dilemma feature
const featureLayers = [];


// Computer effectiveness score
function effectiveness(choice, { jitterRange = 0.4, deterministic = false } = {}) {
  if (!choice) return 0; // No input
  const rh = String(choice.reefHealth || "").trim();

  let bias = 0;
  switch (rh) {
    case "++": bias = 0.8; break;
    case "+":  bias = 0.5; break;
    case "+-": bias = 0;   break;
    case "-":  bias = -0.5;break;
    case "--": bias = -0.8;break;
    default:   bias = 0;   break;
  }

  // Results change each play
  const jitter = deterministic ? 0 : (Math.random() * (jitterRange * 2) - jitterRange);
  const score = Math.max(-1, Math.min(1, bias + jitter));
  return score;
}

function reefHealthColorChange(score) {
  // score > 8 => green (improve)
  // 04 >= score <= 6 orange (moderate)
  // score < 04 => red (worsened)

  if (score >= 8) return { color: "2ECC71", label: "Improved" }; // Good
  if (score <= 3) return { color: "#E43825", label: "Worsened" }; // Severe
  return { color: "#F19955", label: "Moderate" }; // Moderate
}

document.addEventListener("DOMContentLoaded", function () {
  // Initalize the map
      var OahuMap = L.map('main-map').setView([21.270435, -157.733683], 19);
      
      // Add OpenStreetMap tiles
       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             maxZoom: 13,
             attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(OahuMap);
  
    // Replace manual markers
    geojson = L.geoJSON(reefData, {
            pointToLayer: function (feature, latlng) {
                  // No popup
                  return L.circleMarker(latlng, {
                        radius: 8,
                        fillColor: feature.properties["marker-color"] || "#3388ff",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                  });
            },
            style: function (feature) {
                  // Applies only to polygons
                  return {
                        color: feature.properties && feature.properties.stroke ? feature.properties.stroke : "#3388ff",
                        fillColor: feature.properties && feature.properties.fill ? feature.properties.fill : "#3388ff",
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.5
                  };
            },
      
            onEachFeature: function (feature, layer) {
              // Bind popup and store polygon layers for dilemmas
              if (feature.geometry && feature.geometry.type !== "Point") {
                const props = feature.properties || {};
                // store reference to this layer if it's a dilemma feature
                const dilemmaIndex = dilemmaFeatures.indexOf(feature);
                if (dilemmaIndex >= 0) {
                  featureLayers[dilemmaIndex] = layer;
                }

                // Popup Setup
                const popupContent = `<strong>${props.name || ""}</strong><br>${props.dilemma || ""}<br><br><button onclick="openDilemmaPanel(${dilemmaIndex})">Take Action</button>`;
                layer.bindPopup(popupContent);

                layer.on({
                  mouseover: highlightFeature,
                  mouseout: resetHighlight
                });
              } else {
                // For point or geometry-less features, optionally bind popup or skip
                if (feature.properties && feature.properties.name && feature.properties.choices) {
                  // In case a dilemma feature had no geometry we can still allow opening its panel via some UI, but skip mapping to polygon.
                  // (No polygon to color-change.)
                }
              }
            }
      }).addTo(OahuMap);

      // Make GEOJSON accessible
      window._geojsonLayer = geojson;

});

// Highlight on polygon when hovered
function highlightFeature(e) {
      const layer = e.target;
      layer.setStyle({
            weight: 3,
            color: '#5578D8',
            fillOpacity: 0.7            
      });
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

let currentDilemmaIndex = null;

// Dilemma Panel Logic
function openDilemmaPanel(dilemmaIndex) {
  // Alias used by popups (openDilemmaPanel) -> calls the show version so index bounds are validated
  showDilemmaPanel(dilemmaIndex);
}

function showDilemmaPanel(dilemmaIndex) {
  if (dilemmaIndex >= 0 && dilemmaIndex < dilemmaFeatures.length) {
      currentDilemmaIndex = dilemmaIndex;
      const feature = dilemmaFeatures[dilemmaIndex];
      const props = feature.properties || {};
    
      // Panel HTML
    const panel = document.getElementById('dilemma-panel');
    panel.innerHTML = `
      <div class="decision-header">
        <button class="close-btn" onclick="closeDilemmaPanel()"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
        <h2>${props.name || ''}</h2>
       </div>
       <div class="choices">
        ${ (props.choices || []).map((choice, i) => `
          <div class="choice-card">
          <h3>${choice.title || `[POLICY TITLE]`}</h3>
          <p>${choice.description || `Policy Description`}</p>
          <button class="authorize-btn" onclick="handleChoice(${i})">Authorize</button>
         </div>
        `).join('')}
       </div>
    `;
    panel.style.display = 'block';
  } else {
     // No more dilemmas
    const panel = document.getElementById('dilemma-panel');
    panel.innerHTML = `<div class="bubble-content"><strong>No more dilemmas!</strong></div>`;
    panel.style.display = 'block';    
  }
 
}

// Show a short summary for the given dilemma index (no choices shown)
function showDilemmaSummary(dilemmaIndex) {
  if (dilemmaIndex < 0 || dilemmaIndex >= dilemmaFeatures.length) {
    const panel = document.getElementById('dilemma-panel');
    panel.innerHTML = `<div class="bubble-content"><strong>No more dilemmas!</strong></div>`;
    panel.style.display = 'block';
    return;
  }

  currentDilemmaIndex = dilemmaIndex;
  const feature = dilemmaFeatures[dilemmaIndex];
  const props = feature.properties || {};

  // Short excerpt from the dilemma text (trim to e.g. 240 chars)
  const excerpt = props.dilemma ? (props.dilemma.length > 240 ? props.dilemma.substring(0,240) + '…' : props.dilemma) : '';

  const panel = document.getElementById('dilemma-panel');
  panel.innerHTML = `
    <div class="decision-header">
      <button class="close-btn" onclick="closeDilemmaPanel()">✕</button>
      <h2>${props.name || ''}</h2>
    </div>
    <div class="summary-body">
      <div class="summary-text">${excerpt}</div>
      <div style="margin-top:12px;">
        <button onclick="showDilemmaPanel(${dilemmaIndex})">View Options</button>
        <button onclick="handleChoice(0)" style="margin-left:8px;">Auto-Authorize First Option</button>
      </div>
    </div>
  `;
  panel.style.display = 'block';
}
window.showDilemmaSummary = showDilemmaSummary; // expose for onclick usage

// Use in popup setup
window.openDilemmaPanel = openDilemmaPanel;
window.showDilemmaPanel = showDilemmaPanel;

// Format number percent -> "+35%" or "-10%"
function formatPercentNumber(n) {
  if (typeof n !== 'number' || isNaN(n)) return null;
  const sign = n > 0 ? '+' : ''; // negative numbers include '-' automatically from n
  return `${sign}${n}%`;
}

// Compute fish display (supports fishPopulationImpactMin/Max OR fishImpactMin/Max OR single numeric fields)
function computeFishDisplay(choice) {
  // support both naming conventions: fishPopulationImpactMin/Max or fishImpactMin/Max
  const minField = (typeof choice.fishPopulationImpactMin === 'number') ? choice.fishPopulationImpactMin
                 : (typeof choice.fishImpactMin === 'number') ? choice.fishImpactMin
                 : undefined;
  const maxField = (typeof choice.fishPopulationImpactMax === 'number') ? choice.fishPopulationImpactMax
                 : (typeof choice.fishImpactMax === 'number') ? choice.fishImpactMax
                 : undefined;

  if (typeof minField === 'number' && typeof maxField === 'number' && minField !== maxField) {
    const rangeStr = `${minField > 0 ? '+' : ''}${minField}-${maxField}%`;
    const mid = Math.round(((minField + maxField) / 2) * 10) / 10; // one decimal
    const midStr = `${mid > 0 ? '+' : ''}${mid}%`;
    return { display: rangeStr, midpoint: midStr, midpointValue: mid };
  }

  // single numeric value (check both names)
  const single = (typeof choice.fishPopulationImpact === 'number') ? choice.fishPopulationImpact
               : (typeof choice.fishImpact === 'number') ? choice.fishImpact
               : (typeof choice.fishPopulationImpactMin === 'number' && typeof choice.fishPopulationImpactMax !== 'number') ? choice.fishPopulationImpactMin
               : undefined;

  if (typeof single === 'number') {
    return { display: formatPercentNumber(single), midpoint: formatPercentNumber(single), midpointValue: single };
  }

  // fallback to preformatted display strings or older fields
  if (choice.displayFishPopulation) return { display: choice.displayFishPopulation, midpoint: choice.displayFishPopulation, midpointValue: undefined };
  if (choice.fishPopulation) return { display: String(choice.fishPopulation), midpoint: String(choice.fishPopulation), midpointValue: undefined };

  return { display: "+-", midpoint: "+-", midpointValue: undefined };
}

function computeReefDisplay(choice) {
  if (typeof choice.reefImpact === 'number') return { display: formatPercentNumber(choice.reefImpact), value: choice.reefImpact };
  if (choice.displayReefHealth) return { display: choice.displayReefHealth, value: undefined };
  if (choice.reefHealth) return { display: String(choice.reefHealth), value: undefined };
  return { display: "+-", value: undefined };
}

// Updated handleChoice (uses computed display vars and computes an estimated percentage)
function handleChoice(choiceIndex) {
  const feature = dilemmaFeatures[currentDilemmaIndex];
  if (!feature) return;
  const choice = feature.properties && feature.properties.choices ? feature.properties.choices[choiceIndex] : null;
  if (!choice) return;

  // compute bias (your existing function returns -1..1)
  const bias = effectiveness(choice);

  // convert bias into integer score 1..10
  let score = Math.round(((bias + 1) / 2) * 9 + 1);
  score = Math.max(1, Math.min(10, score));

  const outcome = reefHealthColorChange(score);

  // update polygon color if present
  const polyLayer = featureLayers[currentDilemmaIndex];
  if (polyLayer) {
    polyLayer.setStyle({
      fillColor: outcome.color,
      color: outcome.color,
      fillOpacity: 0.6
    });
    if (feature.properties) feature.properties.fill = outcome.color;
  }

  // Build display strings
  const reefObj = computeReefDisplay(choice);         // {display, value}
  const fishObj = computeFishDisplay(choice);         // {display, midpoint, midpointValue}

  // Compute an "Estimated percentage" based on numeric fields when available
  // Use weights reefWeight = 0.7, fishWeight = 0.3 (tweak as desired)
  let estimatedPercentDisplay = "+-";
  const reefValue = (typeof reefObj.value === 'number') ? reefObj.value : undefined;           // e.g. 35
  const fishMidValue = (typeof fishObj.midpointValue === 'number') ? fishObj.midpointValue : undefined; // e.g. 25
  if (typeof reefValue === 'number' || typeof fishMidValue === 'number') {
    const reefBias = (typeof reefValue === 'number') ? reefValue / 100 : 0;
    const fishBias = (typeof fishMidValue === 'number') ? fishMidValue / 100 : 0;
    const reefWeight = 0.7, fishWeight = 0.3;
    const composite = (reefWeight * reefBias) + (fishWeight * fishBias);
    const pct = Math.round(composite * 100 * 10) / 10; // one decimal
    estimatedPercentDisplay = `${pct >= 0 ? '+' : ''}${pct}%`;
  }

  // Render panel using the computed variables (NOT choice.* properties)
  const panel = document.getElementById('dilemma-panel');
  panel.innerHTML = `
    <div class="dilemma-speech-pointer"></div>
    <div class="bubble-content">
      <div class="report-title"><strong>Ocean Report</strong></div>
      <div class="decision-number"><em>DECISION ${currentDilemmaIndex + 1}</em></div>
      <div class="report-stats">
        Reef Impact: <span>${reefObj.display || "+-"}</span><br>
        Fish Impact: <span>${fishObj.display || "+-"}</span>
        ${ (fishObj.midpoint && fishObj.midpoint !== fishObj.display) ? `<br>Estimated midpoint: ${fishObj.midpoint}` : '' }
        <br>
        Reef Health (raw): <span>${choice.displayReefHealth || choice.reefHealth || "+-"}</span><br>
        Fish Population (raw): <span>${choice.displayFishPopulation || choice.fishPopulation || "+-"}</span>
      </div>
      <hr>
      <div class="report-percentage">
        Estimated Percentage: <span>${estimatedPercentDisplay}</span>
      </div>
      <div class="outcome" style="margin-top:12px;">
        <strong>Outcome:</strong>
        <span style="display:inline-block;width:12px;height:12px;background:${outcome.color};margin:0 8px 0 12px;vertical-align:middle;border-radius:2px;"></span>
        <span>${outcome.label} (score: ${score})</span>
      </div>
      <button class="nxtDilemmaBtn" onclick="nextDilemma()">Next Dilemma</button>
    </div>
  `;
  panel.style.display = 'block';
}


window.handleChoice = handleChoice;

//
function nextDilemma() {
  // compute next index (if currentDilemmaIndex is not set, start at 0)
  const next = (typeof currentDilemmaIndex === 'number') ? currentDilemmaIndex + 1 : 0;

  // Debug log to confirm handler runs
  console.log('nextDilemma called, current:', currentDilemmaIndex, 'next:', next);

  if (next >= dilemmaFeatures.length) {
    const panel = document.getElementById('dilemma-panel');
    panel.innerHTML = `<div class="bubble-content"><strong>No more dilemmas!</strong></div>`;
    panel.style.display = 'block';
    return;
  }

  // show short summary for the next dilemma (this will set currentDilemmaIndex)
  showDilemmaSummary(next);
}
window.nextDilemma = nextDilemma;

function closeDilemmaPanel() {
  document.getElementById('dilemma-panel').style.display = 'none';
}

window.closeDilemmaPanel = closeDilemmaPanel;
