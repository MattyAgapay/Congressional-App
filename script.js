// Sidebar collapse / expand
const sidebar = document.querySelector('.sidebar');
const sidebarToggler = document.querySelector('.sidebar-toggler');

if (sidebar && sidebarToggler) {
  sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    // Let Leaflet reflow if it's already created
    setTimeout(() => window.__FF_MAP && window.__FF_MAP.invalidateSize(), 180);
  });
}

// Prevent default jumps for nav items with href="#"
document.querySelectorAll('.nav-link[href="#"]').forEach(a => {
  a.addEventListener('click', e => e.preventDefault());
});

// Temporary encyclopedia toast (keeps your partner’s layout)
document.getElementById('openDex')?.addEventListener('click', (e) => {
  e.preventDefault();
  let t = document.getElementById('ff-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'ff-toast';
    t.style.cssText = `
      position:fixed;bottom:18px;left:50%;transform:translateX(-50%);
      background:#111;color:#fff;border-radius:999px;padding:8px 12px;
      opacity:0;transition:.2s;z-index:9999;font:600 13px/1 Inter,system-ui,sans-serif;`;
    document.body.appendChild(t);
  }
  t.textContent = "Encyclopedia coming soon 📘";
  t.style.opacity = 1;
  setTimeout(()=> t.style.opacity = 0, 1200);
});
