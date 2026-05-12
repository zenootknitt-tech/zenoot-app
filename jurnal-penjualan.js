// ─── JURNAL-PENJUALAN.JS ─────────────────────────────────────

document.getElementById('page-jurnal-penjualan').innerHTML = `

  <!-- METRICS -->
  <div class="metrics" style="grid-template-columns:repeat(2,1fr);margin-bottom:14px">
    <div class="metric">
      <div class="m-label">Total Penjualan</div>
      <div class="m-value" id="jp-total-penjualan">—</div>
      <div class="m-delta">semua transaksi</div>
    </div>
    <div class="metric">
      <div class="m-label">Total Item Terjual</div>
      <div class="m-value" id="jp-total-item">—</div>
      <div class="m-delta">qty keseluruhan</div>
    </div>
  </div>

  <!-- TOMBOL AKSI + FILTER -->
  <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
    <button class="btn btn-sm btn-primary" onclick="showTambahJP()">
      <i class="ti ti-plus"></i> Tambah Penjualan
    </button>
    <button class="btn btn-sm" onclick="loadJurnalPenjualan()">
      <i class="ti ti-refresh"></i> Refresh
    </button>
    <button class="btn btn-sm" onclick="exportJurnalPenjualan()">
      <i class="ti ti-download"></i> Export CSV
    </button>
    <div style="margin-left:auto;display:flex;gap:6px;align-items:center;flex-wrap:wrap">
      <label style="font-size:12px;color:var(--ink2)">Bulan:</label>
      <input type="month" id="jp-filter-bulan"
        style="font-family:var(--f);font-size:13px;padding:4px 8px;border:2px solid var(--ink);background:var(--cream)"
        oninput="filterJP()">
      <button class="btn btn-sm" onclick="document.getElementById('jp-filter-bulan').value='';filterJP()">&#10005;</button>
      <label style="font-size:12px;color:var(--ink2);margin-left:6px">Channel:</label>
      <select id="jp-filter-channel"
        style="font-family:var(--f);font-size:13px;padding:4px 8px;border:2px solid var(--ink);background:var(--cream)"
        onchange="filterJP()">
        <option value="">Semua</option>
      </select>
    </div>
  </div>

  <!-- MODAL -->
  <div class="modal-overlay" id="modal-jp" onclick="jpOverlayClose(event)">
    <div class="modal" style="max-width:480px;width:100%">

      <div style="display:flex;align-items:center;justify-content:space-between;
                  margin-bottom:16px;padding-bottom:10px;border-bottom:2px dashed var(--ink3)">
        <div class="modal-title" id="jp-modal-title"
             style="margin:0;border:none;padding:0;font-size:18px">
          <i class="ti ti-plus"></i> Tambah Penjualan
        </div>
        <button onclick="closeModalJP()"
          style="background:none;border:none;font-size:22px;cursor:pointer;
                 color:var(--ink3);line-height:1;padding:4px 8px;">&#10005;</button>
      </div>

      <input type="hidden" id="jp-id">

      <!-- Tanggal + Waktu + Channel -->
      <div class="form-row" style="margin-bottom:12px">
        <div class="form-group" style="flex:1.2">
          <label>Tanggal</label>
          <input type="date" id="jp-tgl">
        </div>
        <div class="form-group" style="flex:0.8">
          <label>Waktu</label>
          <input type="time" id="jp-waktu"
            style="font-family:var(--f);font-size:14px;padding:6px 10px;
                   border:2px solid var(--ink);background:var(--cream)">
        </div>
        <div class="form-group" style="flex:1.5">
          <label>Channel</label>
          <select id="jp-channel"
            style="font-family:var(--f);font-size:14px;padding:6px 10px;
                   border:2px solid var(--ink);background:var(--cream)">
            <option value="">— Pilih Channel —</option>
          </select>
        </div>
      </div>

      <!-- SKU Induk: ketik + dropdown -->
      <div class="form-row" style="margin-bottom:12px">
        <div class="form-group" style="flex:1;position:relative">
          <label>SKU Induk / Katalog</label>
          <div style="display:flex">
            <input type="text" id="jp-sku-induk"
              placeholder="Ketik nama katalog..."
              autocomplete="off"
              style="flex:1;border-right:none"
              oninput="jpSugestKatalog()"
              onkeydown="jpKatalogKeyNav(event)"
              onfocus="jpSugestKatalog()">
            <button id="jp-sku-dd-btn"
              onclick="jpToggleKatalogFull()"
              title="Lihat semua katalog"
              style="background:var(--cream2);border:2px solid var(--ink);border-left:none;
                     padding:0 12px;cursor:pointer;font-size:16px;color:var(--ink)">&#9660;</button>
          </div>
          <div id="jp-sku-dropdown"
            style="display:none;position:fixed;z-index:9999;
                   background:var(--cream);border:2px solid var(--ink);border-top:none;
                   max-height:200px;overflow-y:auto;box-shadow:4px 4px 0 var(--ink4)">
          </div>
        </div>
      </div>

      <!-- SKU Variasi -->
      <div class="form-row" style="margin-bottom:12px">
        <div class="form-group" style="flex:1">
          <label>SKU Variasi</label>
          <select id="jp-sku-variasi"
            style="font-family:var(--f);font-size:14px;padding:6px 10px;
                   border:2px solid var(--ink);background:var(--cream)"
            onchange="jpOnPilihVariasi()">
            <option value="">— Pilih Variasi —</option>
          </select>
        </div>
      </div>

      <!-- Qty + Harga + Total -->
      <div class="form-row" style="margin-bottom:16px">
        <div class="form-group">
          <label>Qty Terjual</label>
          <input type="number" id="jp-qty" placeholder="0" min="1" oninput="hitungTotalJP()">
        </div>
        <div class="form-group">
          <label>Harga Satuan (Rp)</label>
          <input type="number" id="jp-harga" placeholder="0" oninput="hitungTotalJP()">
        </div>
        <div class="form-group">
          <label>Total (otomatis)</label>
          <input type="number" id="jp-total" placeholder="0" readonly
            style="background:var(--cream2);cursor:not-allowed;font-weight:700;color:var(--ok)">
        </div>
      </div>

      <div class="modal-actions"
        style="justify-content:flex-end;border-top:1.5px dashed var(--ink3);padding-top:12px">
        <button class="btn btn-sm" onclick="closeModalJP()">Batal</button>
        <button class="btn btn-primary btn-sm" onclick="simpanJP()">
          <i class="ti ti-check"></i> Simpan Transaksi
        </button>
      </div>
    </div>
  </div>

  <!-- TABEL -->
  <div class="card">
    <div class="card-title"
      style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span><i class="ti ti-receipt"></i> Jurnal Penjualan</span>
      <input type="text" id="jp-search"
        placeholder="Cari SKU / channel..."
        style="font-family:var(--f);font-size:13px;padding:4px 8px;
               border:2px solid var(--ink);background:var(--cream);width:200px"
        oninput="filterJP()">
    </div>
    <div class="tbl-wrap"><table class="tbl">
      <thead>
        <tr>
          <th onclick="sortJP('tanggal')" style="cursor:pointer">Tgl &amp; Waktu <span id="sort-tanggal">&#8597;</span></th>
          <th>Channel</th>
          <th onclick="sortJP('sku')" style="cursor:pointer">SKU <span id="sort-sku">&#8597;</span></th>
          <th onclick="sortJP('qty')" style="cursor:pointer">Qty <span id="sort-qty">&#8597;</span></th>
          <th>Harga Sat.</th>
          <th onclick="sortJP('total')" style="cursor:pointer">Total <span id="sort-total">&#8597;</span></th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody id="jp-tbody">
        <tr><td colspan="7" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>
      </tbody>
    </table></div>
    <div id="jp-footer" style="font-size:12px;color:var(--ink3);margin-top:8px;text-align:right"></div>
  </div>
`;

setTimeout(() => {
  if (typeof rerenderUI === 'function')
    rerenderUI(document.getElementById('page-jurnal-penjualan'));
}, 80);

// ─── STATE ───────────────────────────────────────────────────
let _jpAllData    = [];
let _jpChannelMap = {};  // id -> {id, nama, kategori?}
let _jpProdukList = [];  // [{katalog, sku, hpp}]
let _jpSort       = { col: 'tanggal', dir: 'desc' };
let _jpSkuIndex   = -1;
let _jpDdMode     = 'suggest';

function _jpNowTime() {
  const n = new Date();
  return String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
}
function _jpNowDate() {
  return new Date().toISOString().split('T')[0];
}

// ─── MODAL ───────────────────────────────────────────────────
function jpOverlayClose(e) {
  if (e.target === document.getElementById('modal-jp')) closeModalJP();
}
function closeModalJP() {
  document.getElementById('modal-jp').classList.remove('open');
  jpTutupDropdownSKU();
}

// ─── LOAD CHANNEL — tanpa asumsi kolom kategori ──────────────
async function loadChannelDropdownJP() {
  try {
    // Query tanpa filter kategori — ambil semua, sort nama saja
    const data = await dbGet('channels', '&order=nama.asc');
    if (!data || !data.length) return;

    _jpChannelMap = {};
    data.forEach(ch => { _jpChannelMap[ch.id] = ch; });

    let fHtml = '<option value="">— Pilih Channel —</option>';
    let filtHtml = '<option value="">Semua Channel</option>';

    // Coba group by kategori kalau ada, kalau tidak ada tampilkan flat
    const hasKategori = data[0] && data[0].kategori !== undefined;

    if (hasKategori) {
      const katLabel = { toko_utama: 'Toko Utama', reseller: 'Reseller', offline: 'Offline' };
      const grouped = {};
      data.forEach(ch => {
        const k = ch.kategori || 'lainnya';
        if (!grouped[k]) grouped[k] = [];
        grouped[k].push(ch);
      });
      Object.entries(grouped).forEach(([kat, items]) => {
        const lbl = katLabel[kat] || kat;
        fHtml    += '<optgroup label="── ' + lbl + ' ──">';
        filtHtml += '<optgroup label="── ' + lbl + ' ──">';
        items.forEach(ch => {
          fHtml    += '<option value="' + ch.id + '">' + ch.nama + '</option>';
          filtHtml += '<option value="' + ch.id + '">' + ch.nama + '</option>';
        });
        fHtml    += '</optgroup>';
        filtHtml += '</optgroup>';
      });
    } else {
      // Flat list — tidak ada kolom kategori
      data.forEach(ch => {
        fHtml    += '<option value="' + ch.id + '">' + ch.nama + '</option>';
        filtHtml += '<option value="' + ch.id + '">' + ch.nama + '</option>';
      });
    }

    document.getElementById('jp-channel').innerHTML        = fHtml;
    document.getElementById('jp-filter-channel').innerHTML = filtHtml;

  } catch(e) {
    console.warn('channel dropdown error:', e.message);
    // Tetap tampilkan opsi kosong agar tidak crash
    document.getElementById('jp-channel').innerHTML = '<option value="">— Channel tidak tersedia —</option>';
  }
}

// ─── LOAD PRODUK — toleran nama kolom ────────────────────────
async function loadProdukListJP() {
  try {
    // Coba order katalog dulu, kalau gagal fallback ke nama/sku
    let data = null;
    try {
      data = await dbGet('produk', '&order=katalog.asc,sku.asc');
    } catch(e) {
      // Kolom mungkin bernama berbeda, coba tanpa order spesifik
      try { data = await dbGet('produk', ''); } catch(e2) {}
    }
    _jpProdukList = data || [];
    console.log('Produk list loaded:', _jpProdukList.length, 'items');
    if (_jpProdukList.length > 0) console.log('Contoh kolom:', Object.keys(_jpProdukList[0]));
  } catch(e) {
    console.warn('produk list error:', e.message);
    _jpProdukList = [];
  }
}

// ─── SKU AUTOCOMPLETE ────────────────────────────────────────
// Deteksi nama kolom katalog secara dinamis
function _jpGetKatalog(p) {
  return p.katalog || p.nama_katalog || p.catalog || p.nama || '';
}
function _jpGetSku(p) {
  return p.sku || p.sku_variasi || p.kode || '';
}
function _jpGetHpp(p) {
  return p.hpp || p.harga_pokok || p.cost || 0;
}

function _jpRenderDropdown(katalogs, katalogMap) {
  const dd  = document.getElementById('jp-sku-dropdown');
  const inp = document.getElementById('jp-sku-induk');
  if (!katalogs.length) {
    dd.style.display = 'none';
    if (_jpProdukList.length === 0) {
      _jpPositionDropdown();
      dd.innerHTML = '<div style="padding:10px 12px;color:var(--ink3);font-size:13px;font-style:italic">Produk belum ada — tambah di Kelola Produk</div>';
      dd.style.display = 'block';
    }
    return;
  }
  _jpSkuIndex = -1;
  dd.innerHTML = katalogs.map((kat, i) => {
    const safe = kat.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    return '<div class="jp-dd-item" data-katalog="' + safe + '" data-idx="' + i + '"'
      + ' style="padding:10px 12px;cursor:pointer;font-size:14px;'
      + 'border-bottom:1px dashed var(--ink4);display:flex;justify-content:space-between;align-items:center;background:var(--cream)"'
      + ' onmouseenter="jpHighlightItem(this)"'
      + ' onclick="jpPilihKatalog(this.dataset.katalog)">'
      + '<span style="font-weight:600">' + kat + '</span>'
      + '<span style="font-size:11px;color:var(--ink3);margin-left:8px">' + katalogMap[kat] + ' var</span>'
      + '</div>';
  }).join('');
  _jpPositionDropdown();
  dd.style.display = 'block';
}

function _jpPositionDropdown() {
  const inp = document.getElementById('jp-sku-induk');
  const dd  = document.getElementById('jp-sku-dropdown');
  if (!inp || !dd) return;
  const rect = inp.getBoundingClientRect();
  dd.style.top   = (rect.bottom + 2) + 'px';
  dd.style.left  = rect.left + 'px';
  dd.style.width = rect.width + 'px';
}

function jpSugestKatalog() {
  _jpDdMode = 'suggest';
  _jpPositionDropdown();
  const q = (document.getElementById('jp-sku-induk').value || '').trim().toLowerCase();
  const katalogMap = {};
  _jpProdukList.forEach(p => {
    const kat = _jpGetKatalog(p);
    if (!kat) return;
    if (q && !kat.toLowerCase().includes(q)) return;
    katalogMap[kat] = (katalogMap[kat] || 0) + 1;
  });
  _jpRenderDropdown(Object.keys(katalogMap), katalogMap);
}

function jpToggleKatalogFull() {
  const dd = document.getElementById('jp-sku-dropdown');
  if (dd.style.display !== 'none' && _jpDdMode === 'full') {
    jpTutupDropdownSKU(); return;
  }
  _jpDdMode = 'full';
  _jpPositionDropdown();
  document.getElementById('jp-sku-induk').value = '';
  const katalogMap = {};
  _jpProdukList.forEach(p => {
    const kat = _jpGetKatalog(p);
    if (!kat) return;
    katalogMap[kat] = (katalogMap[kat] || 0) + 1;
  });
  _jpRenderDropdown(Object.keys(katalogMap), katalogMap);
  document.getElementById('jp-sku-induk').focus();
}

function jpHighlightItem(el) {
  document.getElementById('jp-sku-dropdown')
    .querySelectorAll('.jp-dd-item')
    .forEach(x => x.style.background = '');
  el.style.background = 'var(--cream2)';
  _jpSkuIndex = parseInt(el.dataset.idx);
}

function jpKatalogKeyNav(e) {
  const dd = document.getElementById('jp-sku-dropdown');
  if (!dd || dd.style.display === 'none') return;
  const items = dd.querySelectorAll('.jp-dd-item');
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _jpSkuIndex = Math.min(_jpSkuIndex + 1, items.length - 1);
    items.forEach((x, i) => x.style.background = i === _jpSkuIndex ? 'var(--cream2)' : '');
    if (items[_jpSkuIndex]) items[_jpSkuIndex].scrollIntoView({block:'nearest'});
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    _jpSkuIndex = Math.max(_jpSkuIndex - 1, 0);
    items.forEach((x, i) => x.style.background = i === _jpSkuIndex ? 'var(--cream2)' : '');
    if (items[_jpSkuIndex]) items[_jpSkuIndex].scrollIntoView({block:'nearest'});
  } else if (e.key === 'Enter' && _jpSkuIndex >= 0 && items[_jpSkuIndex]) {
    e.preventDefault();
    jpPilihKatalog(items[_jpSkuIndex].dataset.katalog);
  } else if (e.key === 'Escape') {
    jpTutupDropdownSKU();
  }
}

function jpPilihKatalog(katalog) {
  document.getElementById('jp-sku-induk').value = katalog;
  jpTutupDropdownSKU();
  const varList = _jpProdukList.filter(p => _jpGetKatalog(p) === katalog);
  const sel = document.getElementById('jp-sku-variasi');
  sel.innerHTML = '<option value="">— Pilih Variasi —</option>';
  varList.forEach(p => {
    const opt = document.createElement('option');
    opt.value         = _jpGetSku(p);
    opt.textContent   = _jpGetSku(p);
    opt.dataset.hpp   = _jpGetHpp(p);
    opt.dataset.sku   = _jpGetSku(p);
    sel.appendChild(opt);
  });
  setTimeout(() => sel.focus(), 60);
}

// ─── HITUNG HARGA DARI PRICE LIST ────────────────────────────
// Ambil harga berdasarkan kategori channel yang dipilih
async function _jpGetHargaFromPriceList(hpp) {
  if (!hpp || hpp <= 0) return 0;
  const chId  = document.getElementById('jp-channel').value;
  const ch    = _jpChannelMap[chId];
  const kat   = ch ? (ch.kategori || 'toko_utama') : 'toko_utama';
  const tipe  = kat === 'reseller' ? 'reseller' : 'toko_utama';

  try {
    const beban = await dbGet('beban_operasional', '&tipe=eq.' + tipe);
    const totalBeban = beban.reduce((s, r) => s + (r.beban_persen || 0), 0);
    const totalNpm   = beban.reduce((s, r) => s + (r.npm_persen   || 0), 0);
    const mult       = 1 + (totalBeban + totalNpm) / 100;
    return Math.ceil(hpp * mult);
  } catch(e) {
    return hpp; // fallback ke HPP kalau gagal
  }
}

function jpOnPilihVariasi() {
  const sel = document.getElementById('jp-sku-variasi');
  const opt = sel.options[sel.selectedIndex];
  if (!opt || !opt.dataset.hpp) return;

  const hpp = parseInt(opt.dataset.hpp) || 0;
  if (!hpp) return;

  // Kalau harga sudah diisi manual, tanya dulu
  const hargaEl = document.getElementById('jp-harga');
  if (hargaEl.value && parseInt(hargaEl.value) > 0) return;

  // Ambil harga dari price list berdasarkan channel
  _jpGetHargaFromPriceList(hpp).then(harga => {
    hargaEl.value = harga || hpp;
    hitungTotalJP();
  });
}

function jpTutupDropdownSKU() {
  const dd = document.getElementById('jp-sku-dropdown');
  if (dd) dd.style.display = 'none';
}

document.addEventListener('click', function(e) {
  const inp = document.getElementById('jp-sku-induk');
  const btn = document.getElementById('jp-sku-dd-btn');
  const dd  = document.getElementById('jp-sku-dropdown');
  if (!inp || !dd) return;
  if (!inp.contains(e.target) && !dd.contains(e.target) && (!btn || !btn.contains(e.target))) {
    dd.style.display = 'none';
  }
});

// ─── HITUNG TOTAL ────────────────────────────────────────────
function hitungTotalJP() {
  const qty   = parseInt(document.getElementById('jp-qty').value)   || 0;
  const harga = parseInt(document.getElementById('jp-harga').value) || 0;
  document.getElementById('jp-total').value = qty * harga > 0 ? qty * harga : 0;
}

// ─── LOAD DATA ───────────────────────────────────────────────
async function loadJurnalPenjualan() {
  const tbody = document.getElementById('jp-tbody');
  tbody.innerHTML = '<tr><td colspan="7" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>';
  try {
    const fBulan = document.getElementById('jp-filter-bulan').value;
    let filter = '';
    if (fBulan) {
      const [y, m] = fBulan.split('-');
      const from = y + '-' + m + '-01';
      const to   = new Date(y, parseInt(m), 0).toISOString().split('T')[0];
      filter = '&tanggal=gte.' + from + '&tanggal=lte.' + to;
    }
    const data = await dbGet('jurnal_penjualan', filter + '&order=tanggal.desc');
    _jpAllData = data || [];
    filterJP();
  } catch(err) {
    tbody.innerHTML = '<tr><td colspan="7" style="color:var(--danger)">Error: ' + err.message + '</td></tr>';
  }
}

// ─── FILTER + SORT ────────────────────────────────────────────
function filterJP() {
  const q   = document.getElementById('jp-search').value.toLowerCase().trim();
  const kat = document.getElementById('jp-filter-channel').value;
  let hasil = _jpAllData.filter(r => {
    const ch = (_jpChannelMap[r.channel_id] ? _jpChannelMap[r.channel_id].nama : '').toLowerCase();
    const cocokQ  = !q || (r.sku||'').toLowerCase().includes(q) || ch.includes(q);
    const cocokCh = !kat || String(r.channel_id) === String(kat);
    return cocokQ && cocokCh;
  });
  const { col, dir } = _jpSort;
  hasil.sort((a, b) => {
    let va = a[col] || (col==='tanggal'?'':'0');
    let vb = b[col] || (col==='tanggal'?'':'0');
    if (col !== 'tanggal') { va = Number(va)||0; vb = Number(vb)||0; }
    if (va < vb) return dir==='asc'?-1:1;
    if (va > vb) return dir==='asc'?1:-1;
    return 0;
  });
  renderTabelJP(hasil);
  updateMetricsJP(hasil);
  updateSortIcons();
}

function sortJP(col) {
  if (_jpSort.col === col) _jpSort.dir = _jpSort.dir==='asc'?'desc':'asc';
  else { _jpSort.col = col; _jpSort.dir = 'asc'; }
  filterJP();
}
function updateSortIcons() {
  ['tanggal','sku','qty','total'].forEach(c => {
    const el = document.getElementById('sort-' + c);
    if (!el) return;
    el.textContent = _jpSort.col===c ? (_jpSort.dir==='asc'?'↑':'↓') : '↕';
    el.style.color = _jpSort.col===c ? 'var(--accent)' : 'var(--ink3)';
  });
}

// ─── RENDER TABEL ────────────────────────────────────────────
function renderTabelJP(data) {
  const tbody = document.getElementById('jp-tbody');
  const fmtRp = v => v ? 'Rp' + Number(v).toLocaleString('id-ID') : '—';
  if (!data || !data.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="color:var(--ink3);font-style:italic">Belum ada entri penjualan</td></tr>';
    document.getElementById('jp-footer').textContent = '';
    return;
  }
  tbody.innerHTML = data.map(row => {
    const tgl = new Date(row.tanggal).toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'2-digit'});
    const jam = row.waktu ? String(row.waktu).slice(0,5) : '—';
    const ch  = _jpChannelMap[row.channel_id];
    const chLabel = ch ? ch.nama : (row.channel_id ? '#'+row.channel_id : '—');
    return '<tr>'
      + '<td style="white-space:nowrap"><b>' + tgl + '</b><br>'
      + '<span style="font-size:11px;color:var(--ink3)">' + jam + '</span></td>'
      + '<td><span style="font-size:12px;padding:2px 6px;border-radius:3px;background:var(--cream2)">' + chLabel + '</span></td>'
      + '<td><b style="color:var(--accent)">' + (row.sku||'—') + '</b></td>'
      + '<td style="text-align:center">' + (row.qty||0) + '</td>'
      + '<td>' + fmtRp(row.harga_satuan) + '</td>'
      + '<td><b style="color:var(--ok)">' + fmtRp(row.total) + '</b></td>'
      + '<td>'
      + '<button class="btn btn-sm" onclick="editJP(' + row.id + ')" style="margin-right:4px"><i class="ti ti-edit"></i></button>'
      + '<button class="btn btn-sm btn-danger" onclick="hapusJP(' + row.id + ',\'' + (row.sku||'').replace(/'/g,"\\'") + '\')"><i class="ti ti-trash"></i></button>'
      + '</td></tr>';
  }).join('');
  document.getElementById('jp-footer').textContent = 'Menampilkan ' + data.length + ' entri';
}

function updateMetricsJP(data) {
  const tot  = data.reduce((s,r) => s+(r.total||0), 0);
  const item = data.reduce((s,r) => s+(r.qty||0), 0);
  document.getElementById('jp-total-penjualan').textContent = 'Rp' + tot.toLocaleString('id-ID');
  document.getElementById('jp-total-item').textContent      = item.toLocaleString('id-ID') + ' item';
}

// ─── BUKA MODAL ──────────────────────────────────────────────
function showTambahJP() {
  document.getElementById('jp-modal-title').innerHTML = '<i class="ti ti-plus"></i> Tambah Penjualan';
  document.getElementById('jp-id').value         = '';
  document.getElementById('jp-tgl').value        = _jpNowDate();
  document.getElementById('jp-waktu').value      = _jpNowTime();
  document.getElementById('jp-channel').value    = '';
  document.getElementById('jp-sku-induk').value  = '';
  document.getElementById('jp-sku-variasi').innerHTML = '<option value="">— Pilih Variasi —</option>';
  document.getElementById('jp-qty').value        = '';
  document.getElementById('jp-harga').value      = '';
  document.getElementById('jp-total').value      = '';
  jpTutupDropdownSKU();
  // Reload produk list setiap buka modal agar selalu fresh
  loadProdukListJP();
  document.getElementById('modal-jp').classList.add('open');
  setTimeout(() => document.getElementById('jp-channel').focus(), 100);
}

// ─── EDIT ────────────────────────────────────────────────────
async function editJP(id) {
  try {
    const data = await dbGet('jurnal_penjualan', '&id=eq.' + id);
    if (!data || !data[0]) return;
    const r = data[0];
    document.getElementById('jp-modal-title').innerHTML = '<i class="ti ti-edit"></i> Edit Penjualan';
    document.getElementById('jp-id').value      = r.id;
    document.getElementById('jp-tgl').value     = r.tanggal ? r.tanggal.split('T')[0] : '';
    document.getElementById('jp-waktu').value   = r.waktu ? String(r.waktu).slice(0,5) : _jpNowTime();
    document.getElementById('jp-channel').value = r.channel_id || '';
    document.getElementById('jp-qty').value     = r.qty          || '';
    document.getElementById('jp-harga').value   = r.harga_satuan || '';
    document.getElementById('jp-total').value   = r.total        || '';
    jpTutupDropdownSKU();
    if (_jpProdukList.length === 0) await loadProdukListJP();
    const skuVal = r.sku || '';
    const found  = _jpProdukList.find(p => _jpGetSku(p) === skuVal);
    if (found) {
      const kat = _jpGetKatalog(found);
      document.getElementById('jp-sku-induk').value = kat;
      jpPilihKatalog(kat);
      setTimeout(() => { document.getElementById('jp-sku-variasi').value = skuVal; }, 80);
    } else {
      document.getElementById('jp-sku-induk').value = skuVal;
      const sel = document.getElementById('jp-sku-variasi');
      sel.innerHTML = skuVal
        ? '<option value="' + skuVal + '">' + skuVal + '</option>'
        : '<option value="">— Pilih Variasi —</option>';
    }
    document.getElementById('modal-jp').classList.add('open');
  } catch(err) { alert('Gagal load: ' + err.message); }
}

// ─── SIMPAN ──────────────────────────────────────────────────
async function simpanJP() {
  const id    = document.getElementById('jp-id').value;
  const qty   = parseInt(document.getElementById('jp-qty').value)   || 0;
  const harga = parseInt(document.getElementById('jp-harga').value) || 0;
  const total = parseInt(document.getElementById('jp-total').value) || qty * harga;
  const chId  = document.getElementById('jp-channel').value;
  const skuV  = document.getElementById('jp-sku-variasi').value;
  const skuI  = document.getElementById('jp-sku-induk').value.trim().toUpperCase();
  const sku   = (skuV || skuI).trim().toUpperCase();
  const waktu = document.getElementById('jp-waktu').value || _jpNowTime();

  const payload = {
    tanggal:      document.getElementById('jp-tgl').value,
    waktu:        waktu,
    channel_id:   chId ? chId : null,
    sku:          sku,
    qty,
    harga_satuan: harga,
    total,
  };

  if (!payload.tanggal) { alert('Tanggal wajib diisi!');     return; }
  if (!sku)             { alert('SKU wajib diisi!');          return; }
  if (qty <= 0)         { alert('Qty harus lebih dari 0!');  return; }
  if (harga <= 0)       { alert('Harga satuan harus diisi!');return; }

  try {
    if (id) await dbUpdate('jurnal_penjualan', id, payload);
    else    await dbInsert('jurnal_penjualan', payload);
    closeModalJP();
    loadJurnalPenjualan();
    if (typeof loadDashboard === 'function') loadDashboard();
  } catch(err) { alert('Gagal simpan: ' + err.message); }
}

// ─── HAPUS ───────────────────────────────────────────────────
async function hapusJP(id, sku) {
  confirmDelete('Hapus transaksi SKU "' + sku + '"?', async () => {
    try {
      await dbDelete('jurnal_penjualan', id);
      loadJurnalPenjualan();
      if (typeof loadDashboard === 'function') loadDashboard();
    } catch(err) { alert('Gagal hapus: ' + err.message); }
  });
}

// ─── EXPORT ──────────────────────────────────────────────────
async function exportJurnalPenjualan() {
  try {
    const data = await dbGet('jurnal_penjualan', '&order=tanggal.asc');
    if (!data || !data.length) { alert('Belum ada data penjualan'); return; }
    const headers = ['Tanggal','Waktu','Channel','SKU','Qty','Harga Satuan','Total'];
    const rows = data.map(r => {
      const ch = _jpChannelMap[r.channel_id];
      return [r.tanggal, r.waktu||'', ch?ch.nama:'', r.sku, r.qty, r.harga_satuan, r.total];
    });
    exportCSV('zenoot-jurnal-penjualan.csv', headers, rows);
  } catch(err) { alert('Gagal export: ' + err.message); }
}

// ─── INIT ────────────────────────────────────────────────────
document.getElementById('jp-filter-bulan').value = new Date().toISOString().slice(0,7);
// Load channel dan produk secara paralel
Promise.all([
  loadChannelDropdownJP(),
  loadProdukListJP()
]).then(() => loadJurnalPenjualan());
