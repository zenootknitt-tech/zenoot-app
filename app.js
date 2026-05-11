// ─── APP.JS v3 — navigasi, sidebar mobile, no channel ops ────

// ─── COLLAPSIBLE NAV GROUPS ──────────────────────────────────
function toggleNavGroup(id) {
  const group = document.getElementById(id);
  group.classList.toggle('collapsed');
  try {
    const s = JSON.parse(localStorage.getItem('zenoot_nav')||'{}');
    s[id] = group.classList.contains('collapsed');
    localStorage.setItem('zenoot_nav', JSON.stringify(s));
  } catch(e){}
}

function restoreNavGroups() {
  try {
    const s = JSON.parse(localStorage.getItem('zenoot_nav')||'{}');
    Object.entries(s).forEach(([id, collapsed]) => {
      const el = document.getElementById(id);
      if (el && collapsed) el.classList.add('collapsed');
    });
  } catch(e){}
}
restoreNavGroups();

// ─── DATE ────────────────────────────────────────────────────
const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const now    = new Date();
document.getElementById('topbar-date').textContent =
  days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();

// ─── MOBILE SIDEBAR ──────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

// ─── PAGE MAP ────────────────────────────────────────────────
const pageMap = {
  // Operasional
  dashboard:           { title:'Dashboard',          sub:'overview performa hari ini'        },
  stok:                { title:'Stok Produk',         sub:'monitoring stok semua SKU'         },
  restock:             { title:'Re-Stock',            sub:'daftar reorder per boss'           },
  kas:                 { title:'Kas & Jurnal',        sub:'pencatatan arus kas harian'        },
  'jurnal-penjualan':  { title:'Jurnal Penjualan',    sub:'pencatatan transaksi penjualan'    },
  'price-list':        { title:'Price List',          sub:'harga jual otomatis dari HPP'      },
  // Toko
  dataorder:           { title:'Data Order',          sub:'upload & lihat order Shopee'       },
  rekap:               { title:'Rekap & P&L',         sub:'laporan keuangan per toko'         },
  // Database
  produk:              { title:'Kelola Produk',       sub:'master SKU, HPP, dan boss'         },
  channel:             { title:'Channel',             sub:'master data channel toko'          },
  'beban-operasional': { title:'Beban Operasional',   sub:'acuan % beban & target NPM'        },
};

// ─── NAVIGASI ────────────────────────────────────────────────
function gotoPage(page, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const info = pageMap[page];
  if (info) {
    document.getElementById('topbar-title').textContent = info.title;
    document.getElementById('topbar-sub').textContent   = info.sub;
  }
  // Render channel switcher hanya untuk halaman toko
  renderTokoSwitcher(page);
  closeSidebar();
}

// ─── CHANNEL SWITCHER — HANYA UNTUK TOKO ─────────────────────
// Toko pages yang pakai channel switcher
const TOKO_PAGES = ['dataorder', 'rekap'];

function renderTokoSwitcher(page) {
  if (!TOKO_PAGES.includes(page)) return;
  const elId = 'toko-switcher-' + page;
  const el   = document.getElementById(elId);
  if (!el) return;

  // Ambil channel toko dari Supabase (cache di _channelCache)
  renderSwitcherFromCache(el);
}

let _channelCache = [];

async function loadChannelCache() {
  try {
    const data = await dbGet('channels', '&kategori=eq.toko_utama&order=nama.asc');
    _channelCache = data || [];
    // Re-render switcher kalau halaman toko sedang aktif
    TOKO_PAGES.forEach(page => {
      const el = document.getElementById('toko-switcher-' + page);
      if (el) renderSwitcherFromCache(el);
    });
  } catch(e) {
    _channelCache = [];
  }
}

let _activeTokoChannel = null;

function renderSwitcherFromCache(el) {
  if (!_channelCache || _channelCache.length === 0) {
    el.innerHTML = '<span style="font-size:12px;color:var(--ink3)">Belum ada channel — tambah di Database › Channel</span>';
    return;
  }
  if (!_activeTokoChannel) _activeTokoChannel = _channelCache[0].nama;
  el.innerHTML = '<span class="ch-switcher-label">Channel:</span>' +
    _channelCache.map(ch =>
      `<button class="ch-btn${ch.nama===_activeTokoChannel?' active-ch-btn':''}"
        onclick="switchTokoChannel('${ch.nama}')">${ch.nama}</button>`
    ).join('');
}

function switchTokoChannel(nama) {
  _activeTokoChannel = nama;
  TOKO_PAGES.forEach(page => {
    const el = document.getElementById('toko-switcher-' + page);
    if (el) renderSwitcherFromCache(el);
  });
}

function getActiveTokoChannel() {
  return _activeTokoChannel;
}

// ─── MODAL ───────────────────────────────────────────────────
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ─── CONFIRM DELETE HELPER ────────────────────────────────────
function confirmDelete(msg, onConfirm) {
  document.getElementById('modal-confirm-msg').textContent = msg;
  document.getElementById('modal-confirm').classList.add('open');
  const btn = document.getElementById('modal-confirm-ok');
  btn.onclick = () => { closeModal('modal-confirm'); onConfirm(); };
}

// ─── EXPORT CSV HELPER ────────────────────────────────────────
function exportCSV(filename, headers, rows) {
  const lines = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v||'').replace(/"/g,'""')}"`).join(','))];
  const blob  = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a     = document.createElement('a');
  a.href      = URL.createObjectURL(blob);
  a.download  = filename;
  a.click();
}

// ─── INIT ────────────────────────────────────────────────────
loadChannelCache();
