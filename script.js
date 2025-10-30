/* ===================== iOS 100vh Fix ===================== */
function setVH(){
  document.documentElement.style.setProperty("--app-vh", `${window.innerHeight * 0.01}px`);
}
setVH();
window.addEventListener("resize", setVH);
window.addEventListener("orientationchange", setVH);

/* ===================== State ===================== */
const state = {
  reefHealth: 70,
  fishPop: 65,
  turns: 5,
  reefName: "Hāʻena",
  species: [
    { name:"Manini (Convict Tang)",  status:"stable",    pop:72, note:"Important herbivore" },
    { name:"U'u (Menpachi)",         status:"pressured", pop:48, note:"Nocturnal schooling fish" },
    { name:"Ulua (Giant Trevally)",  status:"declining", pop:33, note:"Top predator & culturally important" },
  ]
};

const $ = sel => document.querySelector(sel);

/* ===================== Toast ===================== */
function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1500);
}

/* ===================== Screen Switching ===================== */
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  $(id).classList.add("active");

  setTimeout(()=> map && map.invalidateSize(), 200);
}

/* ===================== Start Flow ===================== */
$("#startBtn").onclick = () => {
  showScreen("#map-screen");
  $("#storyModal").classList.add("open");
  setTimeout(()=>map && map.invalidateSize(),200);
};

$("#howBtn").onclick = () => alert("You have 5 turns to save the reef using kapu + sustainability decisions.");

$("#openAbout").onclick = () => alert("Fishline Futures — Hawaiʻi reef stewardship simulator.");

/* Story Close */
$("#skipStory").onclick = () => {
  $("#storyModal").classList.remove("open");
  setTimeout(()=>map && map.invalidateSize(),150);
};
$("#contStory").onclick = () => {
  $("#storyModal").classList.remove("open");
  setTimeout(()=>map && map.invalidateSize(),150);
};

/* NAV Buttons */
$("#navHome").onclick = () => showScreen("#landing");
$("#navPolicies").onclick = () => toast("Policies are in the right panel.");
$("#navDex").onclick = () => $("#dex").classList.add("open");
$("#closeDex").onclick = () => $("#dex").classList.remove("open");
$("#navSettings").onclick = () => toast("Settings coming soon! ⚙️");

/* ===================== Reset Game ===================== */
$("#resetBtn").onclick = resetGame;
function resetGame(){
  Object.assign(state,{ reefHealth:70, fishPop:65, turns:5 });
  updateHUD();
  drawZones();
  renderCards();
  toast("Game reset");
}

/* ===================== HUD Update ===================== */
function updateHUD(){
  $("#reefBar").style.width = `${state.reefHealth}%`;
  $("#fishBar").style.width = `${state.fishPop}%`;
  $("#reefVal").textContent = `${state.reefHealth}/100`;
  $("#fishVal").textContent = `${state.fishPop}/100`;
  $("#turnsLeft").textContent = state.turns;
  $("#reefName").textContent = state.reefName;
}

/* ===================== Map ===================== */
let map, zones;

function initMap(){
  map = L.map("map",{ zoomControl:false }).setView([21.57,-158],9);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    maxZoom:18, attribution:"© OpenStreetMap"
  }).addTo(map);

  L.control.zoom({position:"topright"}).addTo(map);

  drawZones();
  setTimeout(()=>map.invalidateSize(),300);
}

function zoneColor(){
  return state.reefHealth>=75 ? "#2ecc71" :
         state.reefHealth>=50 ? "#f1c40f" : "#e74c3c";
}

function drawZones(){
  if(zones) zones.remove();

  const reefs = {
    type:"FeatureCollection",
    features:[
      { type:"Feature", properties:{name:"Hāʻena Reef"},
        geometry:{ type:"Polygon", coordinates:[[[-158.08,21.69],[-158.02,21.69],[-158.02,21.64],[-158.08,21.64]]] } },
      { type:"Feature", properties:{name:"Māʻili Reef"},
        geometry:{ type:"Polygon", coordinates:[[[-158.25,21.44],[-158.19,21.44],[-158.19,21.39],[-158.25,21.39]]] } },
      { type:"Feature", properties:{name:"Kailua Reef"},
        geometry:{ type:"Polygon", coordinates:[[[-157.76,21.43],[-157.70,21.43],[-157.70,21.39],[-157.76,21.39]]] } }
    ]
  };

  zones = L.geoJSON(reefs, {
    style:()=>({
      color:"#111",
      weight:1,
      fillOpacity:.45,
      fillColor:zoneColor()
    }),
    onEachFeature:(f,l)=>{
      l.on("click",()=>{
        state.reefName = f.properties.name;
        updateHUD();
        toast(`Selected: ${f.properties.name}`);
      });
      l.bindTooltip(f.properties.name);
    }
  }).addTo(map);
}

/* ===================== Policy Cards ===================== */
const cards = [
  { title:"Seasonal Kapu",           body:"Protect manini & uhu",          good:{reef:8, fish:6},   bad:{reef:-4, fish:-2} },
  { title:"Ban Lay Nets",            body:"Protect juveniles",             good:{reef:6, fish:7},   bad:{reef:-3, fish:-4} },
  { title:"Tourism Education",       body:"Coral-safe snorkeling",         good:{reef:5, fish:2},   bad:{reef:-2, fish:-1} },
  { title:"Invasive Algae Control",  body:"Plant urchins",                 good:{reef:9, fish:4},   bad:{reef:-5, fish:-2} },
  { title:"Bleaching Closure",       body:"Full kapu during heatwaves",    good:{reef:10, fish:6},  bad:{reef:-6, fish:-5} },
  { title:"Spearfish Derby",         body:"Short gain, long loss",         good:{reef:-6, fish:-10},bad:{reef:+2, fish:+1} },
];

function clamp(n){ return Math.max(0, Math.min(100,n)); }

function apply(effect,msg){
  if(state.turns<=0){ toast("No turns left"); return; }

  state.reefHealth = clamp(state.reefHealth + effect.reef);
  state.fishPop = clamp(state.fishPop + effect.fish);
  state.turns--;

  toast(msg);
  updateHUD();
  drawZones();

  if(state.turns===0) return end();
  renderCards();
}

function renderCards(){
  const box = $("#decisions");
  box.innerHTML = "";

  [...cards].sort(()=>Math.random()-0.5).slice(0,3).forEach(c=>{
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div class="title">${c.title}</div>
      <div class="body">${c.body}</div>
      <div class="actions">
        <button class="btn primary">Implement</button>
        <button class="btn ghost">Reject</button>
      </div>
    `;
    const [yes,no] = el.querySelectorAll("button");
    yes.onclick = ()=>apply(c.good,`✅ Kapu Applied: ${c.title}`);
    no.onclick  = ()=>apply(c.bad, `❌ Ignored: ${c.title}`);

    box.appendChild(el);
  });
}

/* ===================== End Game ===================== */
function end(){
  let msg =
    state.reefHealth>=75 && state.fishPop>=70 ? "🌊 Excellent stewardship — the reef thrives!" :
    state.reefHealth>=55 ? "🌱 Reef recovering — good effort!" :
    "⚠️ Reef stressed — stronger protections needed.";

  alert(msg);
}

/* ===================== Encyclopedia ===================== */
function renderDex(){
  const box = $("#dexList");
  box.innerHTML = "";

  const hero = document.createElement("div");
  hero.className = "dex-explore";
  hero.innerHTML = `
    <div class="big"></div>
    <div class="meta">
      <div style="font-weight:700;font-size:14px;margin-bottom:6px">EXPLORE</div>
      <button class="btn ghost">[FISH NAME]</button>
    </div>`;
  box.appendChild(hero);

  state.species.forEach(s=>{
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div style="font-weight:700">${s.name}</div>
      <div class="body">${s.note}</div>
      <div class="bar" style="margin-top:6px"><i style="width:${s.pop}%"></i></div>`;
    box.appendChild(el);
  });
}

/* ===================== Sidebar Hover Map Resize ===================== */
const rail = $("#rail");
rail.addEventListener("mouseenter",()=>{
  rail.dataset.collapsed="0";
  setTimeout(()=>map && map.invalidateSize(),180);
});
rail.addEventListener("mouseleave",()=>{
  rail.dataset.collapsed="1";
  setTimeout(()=>map && map.invalidateSize(),180);
});

/* ===================== Init ===================== */
updateHUD();
renderCards();
renderDex();
setTimeout(initMap,80);
