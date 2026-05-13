// ─── APP.JS v4 — Safari & Samsung Browser compatible ──────────

// ─── SAFE QUERY HELPER ───────────────────────────────────────
function $id(id) { return document.getElementById(id); }
function $all(sel, root) { return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }

// ─── SIDEBAR MINIMIZE (DESKTOP) ──────────────────────────────
function toggleMinimize() {
  var isMini = document.body.classList.toggle('sidebar-mini');
  try { localStorage.setItem('zenoot_mini', isMini ? '1' : '0'); } catch(e) {}
}
// Sidebar mini sebagai default permanen
document.body.classList.add('sidebar-mini');

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
