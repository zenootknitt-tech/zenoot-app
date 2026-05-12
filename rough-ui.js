// ─── ROUGH-UI.JS — sketchy UI renderer pakai Rough.js ────────
// Tambahkan di index.html SEBELUM closing </body>:
//   <script src="https://cdn.jsdelivr.net/npm/roughjs@4.6.6/bundled/rough.min.js"></script>
//   <script src="rough-ui.js"></script>

(function() {
  const INK     = '#1c1a14';
  const INK2    = '#3d3a2e';
  const INK3    = '#6b6354';
  const CREAM   = '#f5f0e8';
  const DANGER  = '#b03020';
  const BASE    = { roughness:2.1, bowing:1.6, strokeWidth:1.7, stroke:INK };

  function makeCanvas(el) {
    const cvs = document.createElement('canvas');
    cvs.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:0';
    cvs.width  = el.offsetWidth;
    cvs.height = el.offsetHeight;
    el.style.position = 'relative';
    el.appendChild(cvs);
    return rough.canvas(cvs);
  }

  // ── 1. NAV ITEM — pill: lingkaran icon kiri + rect label kanan
  function sketchNavItem(el) {
    if (!el.offsetWidth) return;
    el.querySelectorAll('canvas.rough-nav').forEach(c => c.remove());
    const W = el.offsetWidth, H = el.offsetHeight;
    const cvs = document.createElement('canvas');
    cvs.className = 'rough-nav';
    cvs.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:0';
    cvs.width = W; cvs.height = H;
    el.appendChild(cvs);
    const rc = rough.canvas(cvs);
    const r  = H / 2;
    const isActive = el.classList.contains('active');
    const fill   = isActive ? INK  : 'none';
    const fstyle = isActive ? 'solid' : 'none';
    const opt = { ...BASE, fill, fillStyle: fstyle };

    // Lingkaran kiri (icon box)
    rc.circle(r, r, H - 4, opt);

    // Sambungan ke rect kanan
    rc.line(r, 2,   W - 4, 2,   { ...BASE, roughness:1.8 });
    rc.line(r, H-2, W - 4, H-2, { ...BASE, roughness:1.8 });
    rc.line(W-3, 2, W-3, H-2,   { ...BASE, roughness:1.5 });

    if (isActive) {
      // Fill rect kanan
      rc.rectangle(r, 2, W - r - 4, H - 4, {
        ...BASE, stroke:'none', fill:INK, fillStyle:'solid', roughness:0.5
      });
    }
  }

  // ── 2. TOMBOL AKSI — clean border, tanpa efek arsir/rough
  function sketchBtn(el) {
    // Hapus canvas rough lama kalau ada
    el.querySelectorAll('canvas.rough-btn').forEach(c => c.remove());
    // Tidak menggambar rough canvas — tombol pakai CSS border biasa
  }

  // ── 3. CARD / METRIC BOX
  function sketchCard(el) {
    if (!el.offsetWidth) return;
    el.querySelectorAll('canvas.rough-card').forEach(c => c.remove());
    const W = el.offsetWidth, H = el.offsetHeight;
    const cvs = document.createElement('canvas');
    cvs.className = 'rough-card';
    cvs.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:0';
    cvs.width = W; cvs.height = H;
    el.appendChild(cvs);
    rough.canvas(cvs).rectangle(2, 2, W-4, H-4, {
      ...BASE, roughness:2.4, bowing:1.2,
      fill:CREAM, fillStyle:'solid'
    });
  }

  // ── 4. DATE PILL
  function sketchPill(el) {
    if (!el.offsetWidth) return;
    el.querySelectorAll('canvas.rough-pill').forEach(c => c.remove());
    const W = el.offsetWidth, H = el.offsetHeight;
    const cvs = document.createElement('canvas');
    cvs.className = 'rough-pill';
    cvs.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:0';
    cvs.width = W; cvs.height = H;
    el.appendChild(cvs);
    rough.canvas(cvs).rectangle(2, 2, W-4, H-4, {
      ...BASE, roughness:2, bowing:2,
      fill:'none'
    });
  }

  // ── Migrasi HTML: dinonaktifkan — tombol tetap pakai struktur asli
  function migrateBtn(el) {
    // Tidak mengubah HTML tombol, biarkan icon <i> dan teks tampil langsung
  }

  // ── Migrasi nav-item lama jadi struktur pill baru
  function migrateNavItem(el) {
    if (el.querySelector('.ni-icon')) return;
    const icon = el.querySelector('i');
    const iconClass = icon ? icon.className : 'ti ti-circle';
    const text = el.textContent.replace(/[→]/g,'').trim();
    el.innerHTML = `<span class="ni-icon"><i class="${iconClass}" aria-hidden="true"></i></span><span class="ni-label">${text}</span>`;
  }

  // ── INIT — jalankan setelah DOM siap
  function init() {
    if (typeof rough === 'undefined') {
      console.warn('[rough-ui] Rough.js belum dimuat!');
      return;
    }

    // Nav items
    document.querySelectorAll('.nav-item').forEach(el => {
      migrateNavItem(el);
      sketchNavItem(el);
    });

    // Tombol .btn (hanya yang punya teks/icon, bukan modal btn kecil)
    document.querySelectorAll('.btn:not(.ch-mini-btn)').forEach(el => {
      migrateBtn(el);
      sketchBtn(el);
    });

    // Cards
    document.querySelectorAll('.card, .metric').forEach(el => sketchCard(el));

    // Date pill
    const dp = document.getElementById('topbar-date');
    if (dp) sketchPill(dp);

    // Re-sketch nav saat toggle active (navigasi)
    const origGotoPage = window.gotoPage;
    if (origGotoPage) {
      window.gotoPage = function(page, btn) {
        origGotoPage(page, btn);
        setTimeout(() => {
          // re-sketch nav
          document.querySelectorAll('.nav-item').forEach(el => sketchNavItem(el));
          // sketch tombol & card di halaman yang baru aktif (sebelumnya display:none)
          const activePage = document.getElementById('page-' + page);
          if (activePage) rerenderUI(activePage);
        }, 30);
      };
    }

    // Re-sketch saat nav group collapse/expand
    document.querySelectorAll('.nav-group-header').forEach(h => {
      h.addEventListener('click', () => {
        setTimeout(() => {
          document.querySelectorAll('.nav-item').forEach(el => sketchNavItem(el));
        }, 300);
      });
    });
  }

  // ── rerenderUI: sketch ulang semua elemen dalam kontainer (atau seluruh halaman)
  // Dipanggil oleh modul-modul setelah mereka inject HTML secara dinamis
  function rerenderUI(root) {
    if (typeof rough === 'undefined') return;
    const scope = root || document;
    scope.querySelectorAll('.btn:not(.ch-mini-btn)').forEach(el => {
      migrateBtn(el);
      sketchBtn(el);
    });
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
