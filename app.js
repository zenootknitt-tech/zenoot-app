// ─── APP.JS v4 — Safari & Samsung Browser compatible ──────────

// ─── SAFE QUERY HELPER ───────────────────────────────────────
function $id(id) { return document.getElementById(id); }
function $all(sel, root) { return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }

// ─── SIDEBAR MINIMIZE (DESKTOP) ──────────────────────────────
function toggleMinimize() {
  var isMini = document.body.classList.toggle('sidebar-mini');
  try { localStorage.setItem('zenoot_mini', isMini ? '1' : '0'); } catch(e) {}
}
// Restore sidebar state dari localStorage
// Di MOBILE: tidak pernah pakai sidebar-mini (sidebar jadi full overlay)
// Di DESKTOP: baca localStorage, default full/terbuka
try {
  var isMobile = window.innerWidth <= 768;
  if (!isMobile) {
    var savedMini = localStorage.getItem('zenoot_mini');
    if (savedMini === '1') {
      document.body.classList.add('sidebar-mini');
    }
  }
} catch(e) {}

// Juga handle resize: kalau user rotate HP jadi landscape/desktop, re-check
window.addEventListener('resize', function() {
  try {
    if (window.innerWidth <= 768) {
      // Mobile: paksa hapus sidebar-mini
      document.body.classList.remove('sidebar-mini');
    } else {
      // Desktop: restore dari localStorage
      var savedMini = localStorage.getItem('zenoot_mini');
      if (savedMini === '1') {
        document.body.classList.add('sidebar-mini');
      }
    }
  } catch(e) {}
});

// ─── COLLAPSIBLE NAV GROUPS ──────────────────────────────────
function toggleNavGroup(id) {
  var group = $id(id);
  if (!group) return;
  group.classList.toggle('collapsed');
  try {
    var s = JSON.parse(localStorage.getItem('zenoot_nav')||'{}');
    s[id] = group.classList.contains('collapsed');
    localStorage.setItem('zenoot_nav', JSON.stringify(s));
  } catch(e){}
}

function restoreNavGroups() {
  try {
    var s = JSON.parse(localStorage.getItem('zenoot_nav')||'{}');
    Object.keys(s).forEach(function(id) {
      var el = $id(id);
      if (el && s[id]) el.classList.add('collapsed');
    });
  } catch(e){}
}
restoreNavGroups();

// ─── DATE ────────────────────────────────────────────────────
var days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
var now    = new Date();
var dateEl = $id('topbar-date');
if (dateEl) {
  dateEl.textContent =
    days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
}

// ─── MOBILE SIDEBAR ──────────────────────────────────────────
function toggleSidebar() {
  var sb  = $id('sidebar');
  var ov  = $id('sidebar-overlay');
  var btn = $id('btn-hamburger');
  if (!sb || !ov) return;
  var isOpen = sb.classList.contains('open');
  if (isOpen) {
    sb.classList.remove('open');
    ov.classList.remove('open');
    if (btn) { btn.innerHTML = '<i class="ti ti-menu-2"></i>'; btn.setAttribute('aria-label','Buka menu'); }
  } else {
    sb.classList.add('open');
    ov.classList.add('open');
    if (btn) { btn.innerHTML = '<i class="ti ti-x"></i>'; btn.setAttribute('aria-label','Tutup menu'); }
  }
}
function closeSidebar() {
  var sb  = $id('sidebar');
  var ov  = $id('sidebar-overlay');
  var btn = $id('btn-hamburger');
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('open');
  if (btn) { btn.innerHTML = '<i class="ti ti-menu-2"></i>'; btn.setAttribute('aria-label','Buka menu'); }
}

// Swipe-to-close sidebar (Samsung & Safari)
(function() {
  var startX = 0, startY = 0;
  document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - startX;
    var dy = Math.abs(e.changedTouches[0].clientY - startY);
    var sb = $id('sidebar');
    if (sb && sb.classList.contains('open') && dx < -60 && dy < 80) {
      closeSidebar();
    }
  }, { passive: true });
})();

// ─── PAGE MAP ────────────────────────────────────────────────
var pageMap = {
  'dashboard':          { title:'Dashboard',          sub:'overview performa hari ini'     },
  'stok':               { title:'Stok Produk',         sub:'monitoring stok semua SKU'      },
  'restock':            { title:'Re-Stock',            sub:'daftar reorder per boss'        },
  'kas':                { title:'Kas & Jurnal',        sub:'pencatatan arus kas harian'     },
  'jurnal-penjualan':   { title:'Jurnal Penjualan',    sub:'pencatatan transaksi penjualan' },
  'price-list':         { title:'Price List',          sub:'harga jual otomatis dari HPP'   },
  'dataorder':          { title:'Data Order',          sub:'upload & lihat order Shopee'    },
  'rekap':              { title:'Rekap & P&L',         sub:'laporan keuangan per toko'      },
  'produk':             { title:'Kelola Produk',       sub:'master SKU, HPP, dan boss'      },
  'channel':            { title:'Channel',             sub:'master data channel toko'       },
  'beban-operasional':  { title:'Beban Operasional',   sub:'acuan % beban & target NPM'     },
  'keuangan':           { title:'Keuangan Operasional', sub:'hutang, neraca, rasio & valuasi' },
};

// ─── NAVIGASI ────────────────────────────────────────────────
function gotoPage(page, btn) {
  $all('.page').forEach(function(p) { p.classList.remove('active'); });
  var pageEl = $id('page-' + page);
  if (pageEl) pageEl.classList.add('active');
  $all('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  var info = pageMap[page];
  if (info) {
    var titleEl = $id('topbar-title');
    var subEl   = $id('topbar-sub');
    if (titleEl) titleEl.textContent = info.title;
    if (subEl)   subEl.textContent   = info.sub;
  }
  closeSidebar();
  var contentEl = document.querySelector('.content');
  if (contentEl) contentEl.scrollTop = 0;
}

// ─── MODAL ───────────────────────────────────────────────────
function closeModal(id) {
  var el = $id(id);
  if (el) el.classList.remove('open');
}
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});
document.addEventListener('touchend', function(e) {
  if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
}, { passive: true });

// ─── CONFIRM DELETE HELPER ────────────────────────────────────
function confirmDelete(msg, onConfirm) {
  var msgEl = $id('modal-confirm-msg');
  var modal = $id('modal-confirm');
  var okBtn = $id('modal-confirm-ok');
  if (!msgEl || !modal || !okBtn) return;
  msgEl.textContent = msg;
  modal.classList.add('open');
  okBtn.onclick = function() { closeModal('modal-confirm'); onConfirm(); };
}

// ─── EXPORT CSV HELPER ────────────────────────────────────────
function exportCSV(filename, headers, rows) {
  var lines = [headers.join(',')].concat(
    rows.map(function(r) {
      return r.map(function(v) {
        return '"' + String(v || '').replace(/"/g, '""') + '"';
      }).join(',');
    })
  );
  var blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  var a    = document.createElement('a');
  a.href   = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 300);
}

// ─── HELPER re-render rough UI ────────────────────────────────
function sketchForm(containerId) {
  setTimeout(function() {
    if (typeof rerenderUI === 'function') {
      var el = $id(containerId);
      if (el) rerenderUI(el);
    }
  }, 30);
}



// ─── GLOBAL MODAL HELPER ─────────────────────────────────────
// showModal(id) — buka modal overlay
// hideModal(id) — tutup modal overlay
function showModal(id) {
  var el = document.getElementById(id);
  if (el) {
    el.classList.add('open');
    // Sketchy render
    var m = el.querySelector('.modal');
    if (m && typeof rerenderUI === 'function') setTimeout(function(){ rerenderUI(m); }, 30);
  }
}
function hideModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('open');
}
// Tutup modal saat klik overlay
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ─── GLOBAL FORMAT RUPIAH ─────────────────────────────────────
// Format full: Rp1.200.000 (tidak pakai jt/rb)
function fmtRpFull(v) {
  if (!v && v !== 0) return '—';
  v = Math.round(Number(v));
  return 'Rp' + v.toLocaleString('id-ID');
}
// Format singkat untuk chart/label sempit
function fmtRpShort(v) {
  if (!v && v !== 0) return '—';
  v = Number(v);
  if (v >= 1000000) return 'Rp' + (v/1000000).toFixed(1).replace('.0','') + 'jt';
  if (v >= 1000)    return 'Rp' + Math.round(v/1000) + 'rb';
  return 'Rp' + Math.round(v).toLocaleString('id-ID');
}

// ─── GLOBAL CHANNEL LOGO / ICON ──────────────────────────────
// Mengembalikan HTML badge monokrom berdasarkan nama channel
function chBadge(nama) {
  if (!nama) return '<span style="color:var(--ink3)">—</span>';
  const n = nama.toUpperCase();
  const wrap = (svg, label) =>
    '<span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:var(--ink);white-space:nowrap">' + svg + label + '</span>';

  // SVG icons monokrom
  const SHOPEE_SVG  = '<svg width="13" height="13" viewBox="0 0 40 40" fill="none" style="flex-shrink:0"><path d="M20 4C11.163 4 4 11.163 4 20c0 8.837 7.163 16 16 16s16-7.163 16-16S28.837 4 20 4z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M26 16c0-3.314-2.686-6-6-6s-6 2.686-6 6H11l1.5 14h15L29 16h-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/><circle cx="17" cy="16" r="1.2" fill="currentColor"/><circle cx="23" cy="16" r="1.2" fill="currentColor"/></svg>';
  const LAZADA_SVG  = '<svg width="13" height="13" viewBox="0 0 40 40" fill="none" style="flex-shrink:0"><rect x="4" y="4" width="32" height="32" rx="5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M11 28V12h4v12h10v4H11z" fill="currentColor"/></svg>';
  const TIKTOK_SVG  = '<svg width="13" height="13" viewBox="0 0 40 40" fill="none" style="flex-shrink:0"><path d="M26 6c0 4.4 3.6 8 8 8v5c-3 0-5.8-1-8-2.7V26c0 6.1-4.9 11-11 11S4 32.1 4 26s4.9-11 11-11c.6 0 1.1 0 1.6.1v5.5c-.5-.1-1.1-.1-1.6-.1-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5V6h5z" fill="currentColor"/></svg>';
  const STORE_SVG   = '<i class="ti ti-store" style="font-size:13px"></i>';
  const USERS_SVG   = '<i class="ti ti-users" style="font-size:13px"></i>';
  const CHANNEL_SVG = '<i class="ti ti-antenna" style="font-size:13px"></i>';

  if (n.indexOf('SHP') !== -1 || n.indexOf('SHOPEE') !== -1) return wrap(SHOPEE_SVG, nama);
  if (n.indexOf('LZD') !== -1 || n.indexOf('LAZ') !== -1)    return wrap(LAZADA_SVG, nama);
  if (n.indexOf('TT.') !== -1 || n.indexOf('TIKTOK') !== -1) return wrap(TIKTOK_SVG, nama);
  if (n.indexOf('OFFLINE') !== -1 || n.indexOf('COD') !== -1) return wrap(STORE_SVG, nama);
  if (n.indexOf('DIHI') !== -1 || n.indexOf('LOKAN') !== -1 || n.indexOf('OUTFIT') !== -1 || n.indexOf('RILOKA') !== -1) return wrap(USERS_SVG, nama);
  return wrap(CHANNEL_SVG, nama);
}

// ─── PREVENT DOUBLE-TAP ZOOM (Samsung Browser) ───────────────
(function() {
  var lastTap = 0;
  document.addEventListener('touchend', function(e) {
    var t = e.target;
    // Hanya prevent pada elemen interaktif, bukan scroll area
    if (t && (t.tagName === 'BUTTON' || t.tagName === 'A' || t.classList.contains('nav-item'))) {
      var now = Date.now();
      if (now - lastTap < 300) { e.preventDefault(); }
      lastTap = now;
    }
  }, { passive: false });
})();

// ─── SERVICE WORKER UPDATE HANDLER ───────────────────────────
// Terima pesan dari SW: reload saat user klik notif update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', function(e) {
    if (!e.data) return;

    // SW minta reload (user klik notif update di HP)
    if (e.data.type === 'SW_DO_RELOAD') {
      window.location.reload();
      return;
    }

    // SW aktif versi baru → tampil banner kecil di dalam app (fallback)
    if (e.data.type === 'SW_UPDATED') {
      // Tampil banner tipis di atas app sebagai fallback
      // (notif HP sudah dikirim via showNotification di sw.js)
      var existing = document.getElementById('zenot-update-banner');
      if (existing) return; // jangan duplikat

      var banner = document.createElement('div');
      banner.id = 'zenot-update-banner';
      banner.style.cssText = [
        'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:9999',
        'background:#1a1a2e', 'color:#fff', 'font-size:13px',
        'display:flex', 'align-items:center', 'justify-content:space-between',
        'padding:8px 14px', 'gap:10px',
        'border-bottom:1px solid rgba(255,255,255,0.1)',
        'font-family:inherit'
      ].join(';');
      banner.innerHTML =
        '<span>🚀 zenOt versi baru tersedia</span>' +
        '<button onclick="window.location.reload()" style="' +
          'background:#4f46e5;color:#fff;border:none;border-radius:6px;' +
          'padding:4px 12px;font-size:12px;cursor:pointer;font-weight:600' +
        '">Reload</button>';
      document.body.insertBefore(banner, document.body.firstChild);
    }
  });
}
