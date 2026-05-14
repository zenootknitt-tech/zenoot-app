// ─── ROUGH-UI.JS — sketchy UI renderer pakai Rough.js ────────
// Fix: canvas rough selalu diinsert sebagai firstChild (z-index aman),
//      guard duplikasi ketat, konten HTML selalu tampil di atas canvas.

(function() {
  const INK   = '#1c1a14';
  const CREAM = '#f5f0e8';
  const BASE  = { roughness:2.1, bowing:1.6, strokeWidth:1.7, stroke:INK };

  // ── Helper: hapus canvas lama, buat baru, INSERT SEBAGAI FIRST CHILD
  // ── Ini kunci utama fix: canvas rough harus jadi sibling PERTAMA
  // ── agar semua konten HTML setelahnya menang di stacking context
  function _makeRoughCanvas(el, className, w, h) {
    el.querySelectorAll('canvas.' + className).forEach(c => c.remove());
    const cvs = document.createElement('canvas');
    cvs.className = className;
    cvs.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:0;';
    cvs.width  = w;
    cvs.height = h;
    // insertBefore(newNode, firstChild) = prepend — canvas jadi lapisan paling bawah
    el.insertBefore(cvs, el.firstChild);
    return cvs;
  }

  // ── 1. NAV ITEM
  function sketchNavItem(el) {
    if (!el.offsetWidth) return;
    const W = el.offsetWidth, H = el.offsetHeight;
    const cvs = _makeRoughCanvas(el, 'rough-nav', W, H);
    const rc  = rough.canvas(cvs);
    const r   = H / 2;
    const isActive = el.classList.contains('active');
    const fill   = isActive ? INK  : 'none';
    const fstyle = isActive ? 'solid' : 'none';
    const opt = { ...BASE, fill, fillStyle: fstyle };

    rc.circle(r, r, H - 4, { ...opt, roughness:0.6, bowing:0.3 });
    rc.line(r, 2,   W - 4, 2,   { ...BASE, roughness:0.5, bowing:0.2 });
    rc.line(r, H-2, W - 4, H-2, { ...BASE, roughness:0.5, bowing:0.2 });
    rc.line(W-3, 2, W-3, H-2,   { ...BASE, roughness:0.4 });

    if (isActive) {
      rc.rectangle(r, 2, W - r - 4, H - 4, {
        ...BASE, stroke:'none', fill:INK, fillStyle:'solid', roughness:0.3
      });
    }
  }

  // ── 2. TOMBOL — CSS border saja, tidak perlu rough canvas
  function sketchBtn(el) {
    el.querySelectorAll('canvas.rough-btn').forEach(c => c.remove());
  }

  // ── 3. CARD / METRIC BOX
  function sketchCard(el) {
    if (!el.offsetWidth || !el.offsetHeight) return;
    const W = el.offsetWidth, H = el.offsetHeight;
    const cvs = _makeRoughCanvas(el, 'rough-card', W, H);
    rough.canvas(cvs).rectangle(2, 2, W - 4, H - 4, {
      ...BASE, roughness:1.2, bowing:0.6,
      fill: CREAM, fillStyle: 'solid'
    });
  }

  // ── 4. DATE PILL
  function sketchPill(el) {
    if (!el.offsetWidth || !el.offsetHeight) return;
    const W = el.offsetWidth, H = el.offsetHeight;
    const cvs = _makeRoughCanvas(el, 'rough-pill', W, H);
    rough.canvas(cvs).rectangle(2, 2, W - 4, H - 4, {
      ...BASE, roughness:2, bowing:2, fill:'none'
    });
  }

  // ── Migrasi nav-item lama ke struktur pill baru
  function migrateNavItem(el) {
    if (el.querySelector('.ni-icon')) return;
    const icon = el.querySelector('i');
    const iconClass = icon ? icon.className : 'ti ti-circle';
    const text = el.textContent.replace(/[→]/g,'').trim();
    el.innerHTML = `<span class="ni-icon"><i class="${iconClass}" aria-hidden="true"></i></span><span class="ni-label">${text}</span>`;
  }

  // ── INIT
  function init() {
    if (typeof rough === 'undefined') {
      console.warn('[rough-ui] Rough.js belum dimuat!');
      return;
    }

    document.querySelectorAll('.nav-item').forEach(el => {
      migrateNavItem(el);
      sketchNavItem(el);
    });

    document.querySelectorAll('.btn:not(.ch-mini-btn)').forEach(el => sketchBtn(el));
    document.querySelectorAll('.card, .metric').forEach(el => sketchCard(el));

    const dp = document.getElementById('topbar-date');
    if (dp) sketchPill(dp);

    // Re-sketch nav saat gotoPage
    const origGotoPage = window.gotoPage;
    if (origGotoPage) {
      window.gotoPage = function(page, btn) {
        origGotoPage(page, btn);
        setTimeout(() => {
          document.querySelectorAll('.nav-item').forEach(el => sketchNavItem(el));
          const activePage = document.getElementById('page-' + page);
          if (activePage) rerenderUI(activePage);
        }, 30);
      };
    }

    // Re-sketch saat nav group expand/collapse
    document.querySelectorAll('.nav-group-header').forEach(h => {
      h.addEventListener('click', () => {
        setTimeout(() => {
          document.querySelectorAll('.nav-item').forEach(el => sketchNavItem(el));
        }, 300);
      });
    });
  }

  // ── rerenderUI: dipanggil modul lain setelah inject HTML dinamis
  function rerenderUI(root) {
    if (typeof rough === 'undefined') return;
    const scope = root || document;
    scope.querySelectorAll('.btn:not(.ch-mini-btn)').forEach(el => sketchBtn(el));
    scope.querySelectorAll('.card, .metric').forEach(el => sketchCard(el));
    scope.querySelectorAll('.nav-item').forEach(el => {
      migrateNavItem(el);
      sketchNavItem(el);
    });
    const dp = document.getElementById('topbar-date');
    if (dp) sketchPill(dp);
  }

  window.rerenderUI = rerenderUI;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 50);
  }
})();
