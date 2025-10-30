// ====== KEEP PARTNER UI; ADD SMOOTH TRANSITIONS & FUNCTIONAL PANELS ======

// Sidebar collapse / expand (unchanged)
const sidebar = document.querySelector('.sidebar');
const sidebarToggler = document.querySelector('.sidebar-toggler');
if (sidebar && sidebarToggler) {
  sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    // Give Leaflet a tick to recalc sizes if needed
    setTimeout(() => {
      try {
        const gj = window._geojsonLayer;
        if (gj) {
          let mapRef = null;
          gj.eachLayer(l => { if (!mapRef && l._map) mapRef = l._map; });
          if (mapRef && mapRef.invalidateSize) mapRef.invalidateSize();
        }
      } catch (_) {}
    }, 220);
  });
}

// ===== Panel animation helpers =====
const panel = document.getElementById('dilemma-panel');

function animateIn() {
  // Show, then next frame add .show to trigger CSS transition
  panel.style.display = 'block';
  panel.classList.remove('show');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panel.classList.add('show');
    });
  });
}
function animateOut() {
  // Remove .show to fade; on transition end set display none
  function onEnd(e) {
    if (e && e.target !== panel) return;
    panel.removeEventListener('transitionend', onEnd);
    panel.style.display = 'none';
  }
  panel.addEventListener('transitionend', onEnd);
  panel.classList.remove('show');
}

// Reusable open/close using the existing bubble styles
function openPanel(html) {
  panel.innerHTML = `
    <div class="dilemma-speech-pointer"></div>
    <div class="bubble-content">${html}</div>
  `;
  animateIn();
}
function closePanel() {
  animateOut();
}
window.closePanel = closePanel;

// ===== Wire sidebar items to sensible popups (no GUI changes) =====
function colorDot(hex){
  const c = hex || '#A4A8B6';
  return `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c};vertical-align:middle;margin-right:6px;border:1px solid rgba(0,0,0,.15)"></span>`;
}

function getReefLayers() {
  if (Array.isArray(window.__REEF_LAYERS) && window.__REEF_LAYERS.length) return window.__REEF_LAYERS;
  const gj = window._geojsonLayer;
  const reefLayers = [];
  if (!gj) return reefLayers;
  gj.eachLayer(layer => {
    const f = layer.feature;
    if (!f || !f.properties) return;
    const isPolygon = f.geometry && f.geometry.type !== 'Point';
    const hasChoices = Array.isArray(f.properties.choices) && f.properties.choices.length > 0;
    if (isPolygon && hasChoices) reefLayers.push({ layer, feature: f });
  });
  window.__REEF_LAYERS = reefLayers;
  return reefLayers;
}

function openReefsPanel(){
  const reefs = getReefLayers();
  if (!reefs.length) {
    openPanel(`
      <div class="decision-header">
        <button class="close-btn" onclick="closePanel()">✕</button>
        <h2>Reefs</h2>
      </div>
      <p style="font-family: Barlow Semi Condensed; color:#483D3F;">Map is loading or no reef dilemmas were found.</p>
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

window.__ff_viewReef = function(idx){
  try {
    const reefs = getReefLayers();
    const obj = reefs[idx];
    if (!obj) return;
    const layer = obj.layer;
    const map = layer && layer._map;
    if (map && layer.getBounds) {
      map.fitBounds(layer.getBounds(), { padding:[24,24] });
      setTimeout(() => { if (layer.openPopup) layer.openPopup(); }, 220);
    } else if (layer && layer.openPopup) {
      layer.openPopup();
    }
    closePanel();
  } catch (e) { console.warn(e); }
};

window.__ff_actionReef = function(idx){
  const reefs = getReefLayers();
  if (!reefs[idx]) return;

  if (!Array.isArray(window.__FF_DILEMMA_INDEXES)) {
    window.__FF_DILEMMA_INDEXES = [];
    try {
      const gj = window._geojsonLayer;
      const feats = [];
      gj.eachLayer(l => {
        const f = l.feature;
        if (f && f.properties && Array.isArray(f.properties.choices)) feats.push(f);
      });
      window.__FF_DILEMMA_INDEXES = feats;
    } catch (_) {}
  }

  const feature = reefs[idx].feature;
  const ordered = window.__FF_DILEMMA_INDEXES || [];
  const di = ordered.indexOf(feature);

  if (di >= 0 && typeof window.showDilemmaPanel === 'function') {
    window.showDilemmaPanel(di);
  } else if (typeof window.openDilemmaPanel === 'function') {
    window.openDilemmaPanel(idx);
  } else {
    __ff_viewReef(idx);
  }
};

// Simple, clean panels for other items
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

// Wire sidebar clicks (no DOM changes)
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

// ========== Lightweight decision counter (non-invasive) ==========
// Keep partner OahuMap.js intact; we wrap handleChoice if present.
window.__FF_STATS = { decisions: 0 };
(function wrapHandleChoiceWhenReady(){
  function tryWrap(){
    if (typeof window.handleChoice === 'function' && !window.handleChoice.__wrappedByFF) {
      const orig = window.handleChoice;
      window.handleChoice = function(idx){
        try { window.__FF_STATS.decisions += 1; } catch (_) {}
        const result = orig.apply(this, arguments);
        // Ensure the dilemma panel uses smooth animation after OahuMap updates it
        try { animateIn(); } catch(_) {}
        return result;
      };
      window.handleChoice.__wrappedByFF = true;
    }
    // Also wrap show/summary to animate in
    ['showDilemmaPanel','showDilemmaSummary','openDilemmaPanel'].forEach(fn=>{
      const f = window[fn];
      if (typeof f === 'function' && !f.__wrappedByFF) {
        window[fn] = function(){
          const r = f.apply(this, arguments);
          try { animateIn(); } catch(_) {}
          return r;
        };
        window[fn].__wrappedByFF = true;
      }
    });
  }
  tryWrap();
  document.addEventListener('DOMContentLoaded', tryWrap);
})();
