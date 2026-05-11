// ─── DATA CHANNEL ────────────────────────────────────────────
// Edit file ini untuk tambah/ubah channel default

const state = {
  ops: {
    channels: ['Zenoot', 'BL-CS'],
    active: 'Zenoot'
  },
  toko: {
    channels: ['Zenoot', 'Toko B'],
    active: 'Zenoot'
  },
  currentPage: 'dashboard',
  modalTarget: null
};

const pageMap = {
  dashboard: { title:'Dashboard',     sub:'overview performa hari ini',       section:'ops'  },
  stok:      { title:'Stok Produk',   sub:'monitoring stok semua SKU',        section:'ops'  },
  restock:   { title:'Re-Stock',      sub:'daftar reorder per boss',          section:'ops'  },
  kas:       { title:'Kas & Jurnal',  sub:'pencatatan arus kas harian',       section:'ops'  },
  dataorder: { title:'Data Order',    sub:'upload & lihat order Shopee',      section:'toko' },
  rekap:     { title:'Rekap & P&L',   sub:'laporan keuangan per toko',        section:'toko' },
  hpp:       { title:'HPP Produk',    sub:'harga pokok produksi per SKU',     section:'toko' },
};
