// ====== KEEP PARTNER UI; JUST ADD BEHAVIOR ======

// Sidebar collapse / expand (unchanged)
const sidebar = document.querySelector('.sidebar');
const sidebarToggler = document.querySelector('.sidebar-toggler');
if (sidebar && sidebarToggler) {
  sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    // Give Leaflet a tick to recalc sizes if needed
    setTimeout(() => {
      try {
        // If we can find any map from a layer, invalidate its size (best-effort)
        const gj = window._geojsonLayer;
        if (gj) {
          let mapRef = null;
          gj.eachLayer(l => { if (!mapRef && l._map) mapRef = l._map; });
          if (mapRef && mapRef.invalidateSize) mapRef.invalidateSize();
        }
      } catch (_) {}
    }, 200);
  });
}

// Tiny helper: open/close the existing panel without changing its styles
function openPanel(html) {
  const panel = document.getElementById('dilemma-panel');
  panel.innerHTML = `
    <div class="dilemma-speech-pointer"></div>
    <div class="bubble-content">${html}</div>
  `;
  panel.style.display = 'block';
}
function closePanel() {
  const panel = document.getElementById('dilemma-panel');
  panel.style.display = 'none';
}
window.closePanel = closePanel;

// ========== GAME-LITE STATS (non-invasive) ==========
// We don’t change your partner’s OahuMap.js — we just listen.
window.__FF_STATS = { decisions: 0, lastOutcome: null };

// If OahuMap defines handleChoice later, we wrap it to count decisions.
// If it’s already defined, wrap now; otherwise, patch when DOM is ready.
(function wrapHandleChoiceWhenReady(){
  function tryWrap(){
    if (typeof window.handleChoice === 'function' && !window.handleChoice.__wrappedByFF) {
      const orig = window.handleChoice;
      window.handleChoice = function(idx){
        try {
          window.__FF_STATS.decisions += 1;
        } catch (_) {}
        return orig.apply(this, arguments);
      };
      window.handleChoice.__wrappedByFF = true;
    }
  }
  // Try now and again after DOMContentLoaded just in case
  tryWrap();
  document.addEventListener('DOMContentLoaded', tryWrap);
})();

// ========== REEFS PANEL (built from actual map layers) ==========
function getReefLayers() {
  // Cache once so buttons stay consistent
  if (Array.isArray(window.__REEF_LAYERS) && window.__REEF_LAYERS.length) return window.__REEF_LAYERS;

  const gj = window._geojsonLayer;
  const reefLayers = [];
  if (!gj) return reefLayers;

  gj.eachLayer(layer => {
    const f = layer.feature;
    if (!f || !f.properties) return;
    const isPolygon = f.geometry && f.geometry.type !== 'Point';
    const hasChoices = Array.isArray(f.properties.choices) && f.properties.choices.length > 0;
    if (isPolygon && hasChoices) {
      reefLayers.push({ layer, feature: f });
    }
  });

  window.__REEF_LAYERS = reefLayers;
  return reefLayers;
}

function colorDot(hex){
  const c = hex || '#A4A8B6';
  return `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c};vertical-align:middle;margin-right:6px;border:1px solid rgba(0,0,0,.15)"></span>`;
}

function openReefsPanel(){
  const reefs = getReefLayers();
  if (!reefs.length) {
    openPanel(`
      <div class="decision-header">
        <button class="close-btn" onclick="closePanel()">✕</button>
        <h2>Reefs</h2>
      </div>
      <p>Map is loading or no reef dilemmas were found.</p>
    `);
    return;
  }

  const list = reefs.map((obj, i) => {
    const name = obj.feature.properties?.name || `Reef ${i+1}`;
    const fill = obj.feature.properties?.fill || '#A4A8B6';
    return `
      <div class="choice-card">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            ${colorDot(fill)} <b>${name}</b>
          </div>
          <div style="display:flex;gap:8px;">
            <button onclick="__ff_viewReef(${i})">View</button>
            <button class="authorize-btn" onclick="__ff_actionReef(${i})">Take Action</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  openPanel(`
    <div class="decision-header">
      <button class="close-btn" onclick="closePanel()">✕</button>
      <h2>Reefs</h2>
    </div>
    ${list}
  `);
}

// Zoom to reef + show popup (no style changes)
window.__ff_viewReef = function(idx){
  try {
    const reefs = getReefLayers();
    const obj = reefs[idx];
    if (!obj) return;
    const layer = obj.layer;
    const map = layer && layer._map;
    if (map && layer.getBounds) {
      map.fitBounds(layer.getBounds(), { padding:[24,24] });
      // small delay then open popup to keep UX clean
      setTimeout(() => { if (layer.openPopup) layer.openPopup(); }, 250);
    } else if (layer && layer.openPopup) {
      layer.openPopup();
    }
    closePanel();
  } catch (e) { console.warn(e); }
};

// Open the partner’s dilemma panel by index, matching the reef order we built
window.__ff_actionReef = function(idx){
  const reefs = getReefLayers();
  if (!reefs[idx]) return;

  // We need the index used by OahuMap.js (dilemmaFeatures ordering).
  // Reconstruct a mapping by matching feature object references from the GeoJSON layer order:
  if (!Array.isArray(window.__FF_DILEMMA_INDEXES)) {
    window.__FF_DILEMMA_INDEXES = [];
    try {
      // Build the ordered array of dilemma features exactly like OahuMap.js did:
      // reefData.features.filter(f => f.properties.choices)
      // But we don't have reefData here, so derive from _geojsonLayer order:
      const gj = window._geojsonLayer;
      const feats = [];
      gj.eachLayer(l => {
        const f = l.feature;
        if (f && f.properties && Array.isArray(f.properties.choices)) feats.push(f);
      });
      // Now feats[i] should correspond to the same index OahuMap expects.
      window.__FF_DILEMMA_INDEXES = feats;
    } catch (_) {}
  }

  const feature = reefs[idx].feature;
  const dilemmasOrdered = window.__FF_DILEMMA_INDEXES || [];
  const di = dilemmasOrdered.indexOf(feature);

  if (di >= 0 && typeof window.showDilemmaPanel === 'function') {
    closePanel();
    window.showDilemmaPanel(di);
  } else if (typeof window.openDilemmaPanel === 'function') {
    closePanel();
    // fall back to try same numeric idx
    window.openDilemmaPanel(idx);
  } else {
    // If nothing else, just open the layer popup
    __ff_viewReef(idx);
  }
};

// ========== PANELS FOR OTHER SIDEBAR ITEMS ==========
function openProfilePanel(){
  openPanel(`
    <div class="decision-header">
      <button class="close-btn" onclick="closePanel()">✕</button>
      <h2>Profile</h2>
    </div>
    <p style="font-family: Barlow Semi Condensed; color:#483D3F;">
      Welcome to <b>Fishline Futures</b>. Profile customization coming soon.
    </p>
  `);
}

function openStatsPanel(){
  const d = window.__FF_STATS?.decisions ?? 0;
  openPanel(`
    <div class="decision-header">
      <button class="close-btn" onclick="closePanel()">✕</button>
      <h2>Player Stats</h2>
    </div>
    <div class="choice-card">
      <div><b>Decisions Made:</b> ${d}</div>
    </div>
    <div style="display:flex; gap:8px; margin-top:6px;">
      <button onclick="closePanel()">Close</button>
    </div>
  `);
}

function openDexPanel(){
  openPanel(`
    <div class="decision-header">
      <button class="close-btn" onclick="closePanel()">✕</button>
      <h2>Encyclopedia</h2>
    </div>
    <p style="font-family: Barlow Semi Condensed; color:#483D3F;">
      Tap a reef and choose a policy. As you play, we’ll unlock entries for local species,
      kapu seasons, and stewardship concepts.
    </p>
    <div style="margin-top:10px;">
      <button onclick="closePanel()">Close</button>
    </div>
  `);
}

function openSettingsPanel(){
  openPanel(`
    <div class="decision-header">
      <button class="close-btn" onclick="closePanel()">✕</button>
      <h2>Settings</h2>
    </div>
    <p style="font-family: Barlow Semi Condensed; color:#483D3F;">
      Sounds, color-blind palette, and difficulty (coming soon).
    </p>
    <div style="margin-top:10px;">
      <button onclick="closePanel()">Close</button>
    </div>
  `);
}

// ========== WIRE THE SIDEBAR CLICKS (no DOM changes needed) ==========
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const label = link.querySelector('.nav-label')?.textContent?.trim().toLowerCase();
    if (!label) return;

    if (label === 'profile')      openProfilePanel();
    if (label === 'player stats') openStatsPanel();
    if (label === 'reefs')        openReefsPanel();
    if (label === 'encyclopedia') openDexPanel();
    if (label === 'settings')     openSettingsPanel();
  });
});
