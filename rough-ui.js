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

  // ── 2. TOMBOL AKSI — pill: lingkaran icon kiri + rect label kanan
  function sketchBtn(el) {
    if (!el.offsetWidth) return;
    el.querySelectorAll('canvas.rough-btn').forEach(c => c.remove());
    const W = el.offsetWidth, H = el.offsetHeight;
    const cvs = document.createElement('canvas');
    cvs.className = 'rough-btn';
    cvs.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:0';
    cvs.width = W; cvs.height = H;
    el.appendChild(cvs);
    const rc   = rough.canvas(cvs);
    const r    = H / 2;
    const isPrimary = el.classList.contains('btn-primary');
    const isDanger  = el.classList.contains('btn-danger');
    const stroke    = isDanger ? DANGER : INK;
    const fill      = isPrimary ? INK : 'none';
    const opt = { ...BASE, stroke, fill, fillStyle: isPrimary ? 'solid' : 'none' };

    rc.circle(r, r, H - 4, opt);
    rc.line(r, 2,   W - 4, 2,   { ...BASE, stroke, roughness:1.8 });
    rc.line(r, H-2, W - 4, H-2, { ...BASE, stroke, roughness:1.8 });
    rc.line(W-3, 2, W-3, H-2,   { ...BASE, stroke, roughness:1.5 });

    if (isPrimary) {
      rc.rectangle(r, 2, W - r - 4, H - 4, {
        ...BASE, stroke:'none', fill:INK, fillStyle:'solid', roughness:0.5
      });
    }
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

  // ── Migrasi HTML: ubah .btn lama jadi struktur pill baru
  function migrateBtn(el) {
    if (el.querySelector('.bi')) return; // sudah baru
    const text = el.textContent.trim();
    const icon = el.querySelector('i');
    const iconClass = icon ? icon.className : 'ti ti-check';
    el.innerHTML = `<span class="bi"><i class="${iconClass}" aria-hidden="true"></i></span><span class="bl">${text.replace(/^[^\w]*/, '')}</span>`;
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
          document.querySelectorAll('.nav-item').forEach(el => sketchNavItem(el));
          // Re-sketch tombol di halaman yang baru aktif
          const pageEl = document.getElementById('page-' + page);
          if (pageEl) {
            pageEl.querySelectorAll('.btn:not(.ch-mini-btn)').forEach(el => {
              // Skip tombol yang ada di dalam tbody (tombol edit/hapus di tabel data)
              if (!el.closest('tbody')) {
                migrateBtn(el);
                sketchBtn(el);
              }
            });
            pageEl.querySelectorAll('.card, .metric').forEach(el => sketchCard(el));
          }
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

    // MutationObserver: auto-sketch tombol baru yang muncul di DOM
    // Skip tbody/tr/td supaya tidak interferensi render data tabel
    const SKIP_TAGS = new Set(['TBODY','TR','TD','TH','THEAD','TFOOT']);
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        // Kalau mutasi terjadi di dalam elemen tabel, skip
        if (m.target && SKIP_TAGS.has(m.target.tagName)) return;
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (SKIP_TAGS.has(node.tagName)) return;
          // Kalau node itu sendiri tombol (dan bukan di dalam tbody)
          if (node.matches && node.matches('.btn:not(.ch-mini-btn)') && !node.closest('tbody')) {
            migrateBtn(node);
            sketchBtn(node);
          }
          // Atau cari di dalam node yang ditambahkan
          if (node.querySelectorAll) {
            node.querySelectorAll('.btn:not(.ch-mini-btn)').forEach(el => {
              // Hanya sketch tombol yang BUKAN di dalam tbody data tabel
              if (!el.closest('tbody')) {
                migrateBtn(el);
                sketchBtn(el);
              }
            });
            node.querySelectorAll('.card, .metric').forEach(el => sketchCard(el));
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Expose global supaya bisa dipanggil manual kalau perlu
  window.roughUI = {
    sketchBtn,
    sketchCard,
    migrateBtn,
    refreshPage: function(pageId) {
      const pageEl = document.getElementById(pageId);
      if (!pageEl) return;
      pageEl.querySelectorAll('.btn:not(.ch-mini-btn)').forEach(el => {
        if (!el.closest('tbody')) {
          migrateBtn(el);
          sketchBtn(el);
        }
      });
      pageEl.querySelectorAll('.card, .metric').forEach(el => sketchCard(el));
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 50);
  }
})();
