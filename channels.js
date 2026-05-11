// ─── CHANNELS.JS — state & channel dengan localStorage persist ──

function loadState() {
  try {
    const saved = localStorage.getItem('zenoot_state');
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return null;
}

function saveState() {
  try {
    localStorage.setItem('zenoot_state', JSON.stringify({
      ops:  { channels: state.ops.channels,  active: state.ops.active  },
      toko: { channels: state.toko.channels, active: state.toko.active },
    }));
  } catch(e) {}
}

const _saved = loadState();

const state = {
  ops: {
    channels: _saved?.ops?.channels  || ['Zenoot', 'BL-CS'],
    active:   _saved?.ops?.active    || 'Zenoot'
  },
  toko: {
    channels: _saved?.toko?.channels || ['Zenoot', 'Toko B'],
    active:   _saved?.toko?.active   || 'Zenoot'
  },
  currentPage: 'dashboard',
  modalTarget: null
};

const pageMap = {
  dashboard: { title:'Dashboard',      sub:'overview performa hari ini',       section:'ops'  },
  produk:    { title:'Kelola Produk',  sub:'master SKU, HPP, dan boss',        section:'ops'  },
  stok:      { title:'Stok Produk',    sub:'monitoring stok semua SKU',        section:'ops'  },
  restock:   { title:'Re-Stock',       sub:'daftar reorder per boss',          section:'ops'  },
  kas:       { title:'Kas & Jurnal',   sub:'pencatatan arus kas harian',       section:'ops'  },
  dataorder: { title:'Data Order',     sub:'upload & lihat order Shopee',      section:'toko' },
  rekap:     { title:'Rekap & P&L',    sub:'laporan keuangan per toko',        section:'toko' },
  hpp:       { title:'HPP Produk',     sub:'harga pokok produksi per SKU',     section:'toko' },
};
