// ─── ROUGH-UI.JS — sketchy UI renderer pakai Rough.js ────────

(function() {
  const INK   = '#1c1a14';
  const CREAM = '#f5f0e8';
  const DANGER= '#b03020';
  const BASE  = { roughness:2.1, bowing:1.6, strokeWidth:1.7, stroke:INK };

  // ── 1. NAV ITEM
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
    const opt = { ...BASE, fill: isActive ? INK : 'none', fillStyle: isActive ? 'solid' : 'none' };
    rc.circle(r, r, H - 4, opt);
    rc.line(r, 2,   W - 4, 2,   { ...BASE, roughness:1.8 });
    rc.line(r, H-2, W - 4, H-2, { ...BASE, roughness:1.8 });
    rc.line(W-3, 2, W-3, H-2,   { ...BASE, roughness:1.5 });
    if (isActive) {
      rc.rectangle(r, 2, W - r - 4, H - 4, {
        ...BASE, stroke:'none', fill:INK, fillStyle:'solid', roughness:0.5
      });
    }
  }

  // ── 2. TOMBOL AKSI
  function sketchBtn(el) {
    if (!el.offsetWidth) return;
    el.querySelectorAll('canvas.rough-btn').forEach(c => c.remove());
    const W = el.offsetWidth, H = el.offsetHeight;
    const cvs = document.createElement('canvas');
    cvs.className = 'rough-btn';
    cvs.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:0';
    cvs.width = W; cvs.height = H;
    el.appendChild(cvs);
    const rc        = rough.canvas(cvs);
    const r         = H / 2;
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
      ...BASE, roughness:2.4, bowing:1.2, fill:CREAM, fillStyle:'solid'
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
    rough.canvas(cvs).rectangle(2, 2, W-4, H-4, { ...BASE, roughness:2, bowing:2, fill:'none' });
  }

  // ── Migrasi .btn lama → struktur pill (icon + label)
  // Hanya jalankan pada tombol yang ADA di luar tabel data
  function migrateBtn(el) {
    if (el.querySelector('.bi')) return; // sudah dimigrasi
    const icon = el.querySelector('i');
    const iconClass = icon ? icon.className : 'ti ti-check';
    // Ambil teks bersih (tanpa icon)
    const raw = Array.from(el.childNodes)
      .filter(n => n.nodeType === 3) // text nodes only
      .map(n => n.textContent.trim())
      .join(' ')
      .trim();
    const label = raw || el.textContent.replace(/^\W+/, '').trim();
    el.innerHTML = `<span class="bi"><i class="${iconClass}" aria-hidden="true"></i></span><span class="bl">${label}</span>`;
  }

  // ── Migrasi nav-item
  function migrateNavItem(el) {
    if (el.querySelector('.ni-icon')) return;
    const icon = el.querySelector('i');
    const iconClass = icon ? icon.className : 'ti ti-circle';
    const text = el.textContent.replace(/[→]/g,'').trim();
    el.innerHTML = `<span class="ni-icon"><i class="${iconClass}" aria-hidden="true"></i></span><span class="ni-label">${text}</span>`;
  }

  // ── Sketch semua tombol di satu container (skip yang ada di dalam tbody)
  function sketchBtnsIn(container) {
    container.querySelectorAll('.btn:not(.ch-mini-btn)').forEach(el => {
      if (el.closest('tbody')) return; // skip tombol edit/hapus di tabel data
      migrateBtn(el);
      sketchBtn(el);
    });
  }

  // ── Sketch semua card di satu container
  function sketchCardsIn(container) {
    container.querySelectorAll('.card, .metric').forEach(el => sketchCard(el));
  }

  // ── INIT
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

    // Tombol & card di halaman AKTIF saja (yang visible, offsetWidth > 0)
    const activePage = document.querySelector('.page.active');
    if (activePage) {
      sketchBtnsIn(activePage);
      sketchCardsIn(activePage);
    }

    // Date pill
    const dp = document.getElementById('topbar-date');
    if (dp) sketchPill(dp);

    // ── Hook gotoPage: sketch ulang saat pindah halaman
    const origGotoPage = window.gotoPage;
    if (origGotoPage) {
      window.gotoPage = function(page, btn) {
        origGotoPage(page, btn);

        // Sketch nav + tombol di frame berikutnya (setelah browser render display:block)
        requestAnimationFrame(() => {
          document.querySelectorAll('.nav-item').forEach(el => sketchNavItem(el));
          const pageEl = document.getElementById('page-' + page);
          if (pageEl) {
            sketchBtnsIn(pageEl);
            sketchCardsIn(pageEl);
          }
        });
      };
    }

    // ── Re-sketch saat nav group collapse/expand
    document.querySelectorAll('.nav-group-header').forEach(h => {
      h.addEventListener('click', () => {
        setTimeout(() => {
          document.querySelectorAll('.nav-item').forEach(el => sketchNavItem(el));
        }, 300);
      });
    });
  }

  // ── API global — bisa dipanggil dari JS lain kalau perlu
  window.roughUI = {
    sketchBtn,
    sketchCard,
    migrateBtn,
    sketchBtnsIn,
    // Panggil ini setelah inject HTML baru ke dalam halaman yang sudah aktif
    refreshPage: function(pageId) {
      const el = pageId ? document.getElementById(pageId) : document.querySelector('.page.active');
      if (!el) return;
      sketchBtnsIn(el);
      sketchCardsIn(el);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 50);
  }
})();
