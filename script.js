// ===== Keep partner look; wire sidebar actions =====

// Sidebar collapse / expand
const sidebar = document.querySelector('.sidebar');
const sidebarToggler = document.querySelector('.sidebar-toggler');
if (sidebar && sidebarToggler) {
  sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    setTimeout(() => window.__FF_MAP && window.__FF_MAP.invalidateSize(), 180);
  });
}

// Stop "#" links from jumping
document.querySelectorAll('.nav-link[href="#"]').forEach(a => {
  a.addEventListener('click', e => e.preventDefault());
});

// Reuse the existing dilemma bubble as a generic panel
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

// Small toast helper
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

// Panels for sidebar items (minimal, matches partner UI)
function openProfilePanel(){
  openPanel(`
    <div class="decision-header">
      <button class="close-btn" onclick="closePanel()">✕</button>
      <h2>Profile</h2>
    </div>
    <p>Welcome to <b>Fishline Futures</b>. Customize your name and avatar here (coming soon).</p>
  `);
}

function openStatsPanel(){
  const reef = (window.Game && typeof Game.reefHealth === 'number') ? Game.reefHealth : '—';
  const fish = (window.Game && typeof Game.fishPop === 'number') ? Game.fishPop : '—';
  const turns = (window.Game && typeof Game.turns === 'number') ? Game.turns : '—';

  openPanel(`
    <div class="decision-header">
      <button class="close-btn" onclick="closePanel()">✕</button>
      <h2>Player Stats</h2>
    </div>
    <div class="choice-card">
      <div><b>Reef Health:</b> ${reef}/100</div>
      <div><b>Fish Population:</b> ${fish}/100</div>
      <div><b>Turns Left:</b> ${turns}</div>
    </div>
    <div style="display:flex; gap:8px; margin-top:6px;">
      <button onclick="window.resetGame && resetGame()">Reset Game</button>
      <button onclick="closePanel()">Close</button>
    </div>
  `);
}

function colorDot(hex){
  const c = hex || '#A4A8B6';
  return `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c};vertical-align:middle;margin-right:6px;border:1px solid rgba(0,0,0,.15)"></span>`;
}

function openReefsPanel(){
  if (!window.__FF_MAP || !window._geojsonLayer) {
    toast("Map is still loading…");
    return;
  }

  const features = (window.dilemmaFeatures && dilemmaFeatures.length)
    ? dilemmaFeatures
    : (window.reefData ? reefData.features.filter(f => f.properties) : []);

  const htmlList = features.map((f, idx) => {
    const name = f.properties?.name || `Reef ${idx+1}`;
    const fill = f.properties?.fill || '#A4A8B6';
    const hasChoices = Array.isArray(f.properties?.choices) && f.properties.choices.length > 0;
    return `
      <div class="choice-card">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            ${colorDot(fill)} <b>${name}</b>
          </div>
          <div style="display:flex;gap:8px;">
            <button onclick="flyToReef(${idx})">View</button>
            ${hasChoices ? `<button class="authorize-btn" onclick="openReefDilemma(${idx})">Take Action</button>` : ``}
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
    ${htmlList || `<p>No reefs available.</p>`}
  `);
}

function flyToReef(idx){
  try{
    const layer = window.featureLayers?.[idx];
    if (layer && layer.getBounds) {
      __FF_MAP.fitBounds(layer.getBounds(), { padding:[24,24] });
    } else if (layer && layer.getLatLng) {
      __FF_MAP.setView(layer.getLatLng(), 15);
    } else {
      toast("Could not locate reef bounds.");
    }
  } catch(e){
    console.error(e);
    toast("Could not locate reef.");
  }
}
function openReefDilemma(idx){
  closePanel();
  if (typeof window.showDilemmaSummary === 'function') {
    window.showDilemmaSummary(idx);
  } else if (typeof window.showDilemmaPanel === 'function') {
    window.showDilemmaPanel(idx);
  } else {
    toast("Dilemma system not ready.");
  }
}

// Wire by visible label text (no HTML changes)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const label = link.querySelector('.nav-label')?.textContent?.trim().toLowerCase();
    if (!label) return;
    e.preventDefault();

    if (label === 'profile')      openProfilePanel();
    if (label === 'player stats') openStatsPanel();
    if (label === 'reefs')        openReefsPanel();
    if (label === 'encyclopedia') openPanel(`
        <div class="decision-header">
          <button class="close-btn" onclick="closePanel()">✕</button>
          <h2>Encyclopedia</h2>
        </div>
        <p>Tap a reef and choose a policy. As you play, we’ll unlock entries for local species, kapu seasons, and stewardship concepts.</p>
        <div style="margin-top:10px;"><button onclick="closePanel()">Close</button></div>
      `);
    if (label === 'settings')     openPanel(`
        <div class="decision-header">
          <button class="close-btn" onclick="closePanel()">✕</button>
          <h2>Settings</h2>
        </div>
        <p>Sounds, color-blind palette, and difficulty (coming soon).</p>
        <div style="margin-top:10px;"><button onclick="closePanel()">Close</button></div>
      `);
  });
});
