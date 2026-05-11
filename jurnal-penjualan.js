// ─── JURNAL-PENJUALAN.JS — Jurnal Penjualan Operasional ───────

// ─── RENDER HTML ─────────────────────────────────────────────
document.getElementById('page-jurnal-penjualan').innerHTML = `

  <!-- RINGKASAN METRICS -->
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

    <!-- FILTER BULAN + CHANNEL -->
    <div style="margin-left:auto;display:flex;gap:6px;align-items:center;flex-wrap:wrap">
      <label style="font-size:12px;color:var(--ink2)">Bulan:</label>
      <input type="month" id="jp-filter-bulan"
        style="font-family:var(--f);font-size:13px;padding:4px 8px;border:2px solid var(--ink);background:var(--cream)"
        oninput="filterJP()">
      <button class="btn btn-sm" onclick="document.getElementById('jp-filter-bulan').value='';filterJP()">
        ✕
      </button>
      <label style="font-size:12px;color:var(--ink2);margin-left:6px">Channel:</label>
      <select id="jp-filter-channel"
        style="font-family:var(--f);font-size:13px;padding:4px 8px;border:2px solid var(--ink);background:var(--cream)"
        onchange="filterJP()">
        <option value="">Semua</option>
      </select>
    </div>
  </div>

  <!-- FORM TAMBAH / EDIT -->
  <div id="form-jp" style="display:none;margin-bottom:12px">
    <div class="card">
      <div class="card-title" id="jp-form-title"><i class="ti ti-plus"></i> Tambah Penjualan</div>
      <input type="hidden" id="jp-id">
      <div class="form-row">
        <div class="form-group">
          <label>Tanggal</label>
          <input type="date" id="jp-tgl">
        </div>
        <div class="form-group">
          <label>Channel</label>
          <select id="jp-channel" style="font-family:var(--f);font-size:13px;padding:5px 8px;border:2px solid var(--ink);background:var(--cream)">
            <option value="">— Pilih Channel —</option>
          </select>
        </div>
        <div class="form-group">
          <label>Nama / Keterangan</label>
          <input type="text" id="jp-ket" placeholder="mis: Penjualan SKU-001 ke Budi">
        </div>
        <div class="form-group">
          <label>SKU / Produk</label>
          <input type="text" id="jp-sku" placeholder="mis: MAYRA_MAUVE">
        </div>
        <div class="form-group">
          <label>Qty</label>
          <input type="number" id="jp-qty" placeholder="0" min="1" oninput="hitungTotalJP()">
        </div>
        <div class="form-group">
          <label>Harga Satuan (Rp)</label>
          <input type="number" id="jp-harga" placeholder="0" oninput="hitungTotalJP()">
        </div>
        <div class="form-group">
          <label>Diskon (Rp)</label>
          <input type="number" id="jp-diskon" placeholder="0" oninput="hitungTotalJP()">
        </div>
        <div class="form-group">
          <label>Total (otomatis)</label>
          <input type="number" id="jp-total" placeholder="0" readonly
            style="background:var(--cream2);cursor:not-allowed">
        </div>
        <div class="form-group">
          <label>Pembayaran</label>
          <select id="jp-bayar" style="font-family:var(--f);font-size:13px;padding:5px 8px;border:2px solid var(--ink);background:var(--cream)">
            <option value="Tunai">Tunai</option>
            <option value="Transfer">Transfer</option>
            <option value="COD">COD</option>
            <option value="Kredit">Kredit</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <div class="form-group">
          <label>Catatan</label>
          <input type="text" id="jp-catatan" placeholder="opsional">
        </div>
        <div class="form-group" style="flex:0;justify-content:flex-end">
          <label>&nbsp;</label>
          <button class="btn btn-primary btn-sm" onclick="simpanJP()">Simpan</button>
          <button class="btn btn-sm" onclick="cancelFormJP()" style="margin-top:4px">Batal</button>
        </div>
      </div>
    </div>
  </div>

  <!-- TABEL JURNAL -->
  <div class="card">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span><i class="ti ti-receipt"></i> Jurnal Penjualan</span>
      <input type="text" id="jp-search"
        placeholder="Cari SKU / keterangan / channel..."
        style="font-family:var(--f);font-size:13px;padding:4px 8px;border:2px solid var(--ink);background:var(--cream);width:210px"
        oninput="filterJP()">
    </div>
    <div class="tbl-wrap"><table class="tbl">
      <thead>
        <tr>
          <th onclick="sortJP('tanggal')" style="cursor:pointer">Tanggal <span id="sort-tanggal">↕</span></th>
          <th>Channel</th>
          <th>Keterangan</th>
          <th onclick="sortJP('sku')" style="cursor:pointer">SKU <span id="sort-sku">↕</span></th>
          <th onclick="sortJP('qty')" style="cursor:pointer">Qty <span id="sort-qty">↕</span></th>
          <th>Harga Sat.</th>
          <th>Diskon</th>
          <th onclick="sortJP('total')" style="cursor:pointer">Total <span id="sort-total">↕</span></th>
          <th>Bayar</th>
          <th>Catatan</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody id="jp-tbody">
        <tr><td colspan="11" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>
      </tbody>
    </table></div>
    <div id="jp-footer" style="font-size:12px;color:var(--ink3);margin-top:8px;text-align:right"></div>
  </div>
`;

// render sketchy UI untuk halaman jurnal penjualan setelah innerHTML siap
setTimeout(() => { if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-jurnal-penjualan')); }, 80);

// ─── DATA & SORT CACHE ───────────────────────────────────────
let _jpAllData    = [];
let _jpChannelMap = {}; // id -> {nama, kategori}
let _jpSort       = { col: 'tanggal', dir: 'desc' };

const _katLabel = { toko_utama: 'Toko Utama', reseller: 'Reseller', offline: 'Offline' };

// ─── LOAD CHANNEL KE DROPDOWN ────────────────────────────────
async function loadChannelDropdownJP() {
  try {
    const data = await dbGet('channels', '&order=kategori.asc,nama.asc');
    if (!data || data.length === 0) return;

    // simpan map id->channel untuk lookup di tabel
    _jpChannelMap = {};
    data.forEach(ch => { _jpChannelMap[ch.id] = ch; });

    // grouped <optgroup> untuk form
    const selectForm   = document.getElementById('jp-channel');
    const selectFilter = document.getElementById('jp-filter-channel');

    const grouped = {};
    data.forEach(ch => {
      if (!grouped[ch.kategori]) grouped[ch.kategori] = [];
      grouped[ch.kategori].push(ch);
    });

    let formHtml   = '<option value="">— Pilih Channel —</option>';
    let filterHtml = '<option value="">Semua Channel</option>';

    Object.entries(grouped).forEach(([kat, items]) => {
      const label = _katLabel[kat] || kat;
      formHtml   += `<optgroup label="── ${label} ──">`;
      filterHtml += `<optgroup label="── ${label} ──">`;
      items.forEach(ch => {
        formHtml   += `<option value="${ch.id}">${ch.nama}</option>`;
        filterHtml += `<option value="${ch.id}">${ch.nama}</option>`;
      });
      formHtml   += '</optgroup>';
      filterHtml += '</optgroup>';
    });

    selectForm.innerHTML   = formHtml;
    selectFilter.innerHTML = filterHtml;
  } catch(e) { console.warn('Gagal load channel dropdown:', e.message); }
}

// ─── HITUNG TOTAL OTOMATIS ────────────────────────────────────
function hitungTotalJP() {
  const qty    = parseInt(document.getElementById('jp-qty').value)    || 0;
  const harga  = parseInt(document.getElementById('jp-harga').value)  || 0;
  const diskon = parseInt(document.getElementById('jp-diskon').value) || 0;
  const total  = (qty * harga) - diskon;
  document.getElementById('jp-total').value = total > 0 ? total : 0;
}

// ─── LOAD DATA ───────────────────────────────────────────────
async function loadJurnalPenjualan() {
  const tbody = document.getElementById('jp-tbody');
  tbody.innerHTML = '<tr><td colspan="11" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>';
  try {
    const filterBulan = document.getElementById('jp-filter-bulan').value;
    let filter = '';
    if (filterBulan) {
      const [y, m] = filterBulan.split('-');
      const from = `${y}-${m}-01`;
      const to   = new Date(y, parseInt(m), 0).toISOString().split('T')[0];
      filter = `&tanggal=gte.${from}&tanggal=lte.${to}`;
    }
    const data = await dbGet('jurnal_penjualan', filter + '&order=tanggal.desc');
    _jpAllData = data || [];
    filterJP();
  } catch(err) {
    tbody.innerHTML = `<tr><td colspan="11" style="color:var(--danger)">Error: ${err.message}</td></tr>`;
  }
}

// ─── FILTER + SORT (satu fungsi, selalu dipakai) ──────────────
function filterJP() {
  const q   = document.getElementById('jp-search').value.toLowerCase().trim();
  const kat = document.getElementById('jp-filter-channel').value;

  let hasil = _jpAllData.filter(r => {
    const namaChannel = (_jpChannelMap[r.channel_id]?.nama || '').toLowerCase();
    const cocokQ = !q || (
      (r.sku          || '').toLowerCase().includes(q) ||
      (r.keterangan   || '').toLowerCase().includes(q) ||
      (r.catatan      || '').toLowerCase().includes(q) ||
      (r.metode_bayar || '').toLowerCase().includes(q) ||
      namaChannel.includes(q)
    );
    const cocokCh = !kat || String(r.channel_id) === String(kat);
    return cocokQ && cocokCh;
  });

  // sort
  const { col, dir } = _jpSort;
  hasil.sort((a, b) => {
    let va = a[col], vb = b[col];
    if (col === 'tanggal') { va = va || ''; vb = vb || ''; }
    else                   { va = va || 0;  vb = vb || 0;  }
    if (va < vb) return dir === 'asc' ? -1 :  1;
    if (va > vb) return dir === 'asc' ?  1 : -1;
    return 0;
  });

  renderTabelJP(hasil);
  updateMetricsJP(hasil);
  updateSortIcons();
}

// ─── SORT ────────────────────────────────────────────────────
function sortJP(col) {
  if (_jpSort.col === col) {
    _jpSort.dir = _jpSort.dir === 'asc' ? 'desc' : 'asc';
  } else {
    _jpSort.col = col;
    _jpSort.dir = 'asc';
  }
  filterJP();
}

function updateSortIcons() {
  ['tanggal','sku','qty','total'].forEach(c => {
    const el = document.getElementById('sort-' + c);
    if (!el) return;
    if (_jpSort.col === c) {
      el.textContent = _jpSort.dir === 'asc' ? '↑' : '↓';
      el.style.color = 'var(--accent)';
    } else {
      el.textContent = '↕';
      el.style.color = 'var(--ink3)';
    }
  });
}

// ─── RENDER TABEL ────────────────────────────────────────────
function renderTabelJP(data) {
  const tbody = document.getElementById('jp-tbody');
  const fmtRp = v => v ? 'Rp' + Number(v).toLocaleString('id-ID') : '—';

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" style="color:var(--ink3);font-style:italic">Belum ada entri penjualan</td></tr>';
    document.getElementById('jp-footer').textContent = '';
    return;
  }

  tbody.innerHTML = data.map(row => {
    const tgl = new Date(row.tanggal).toLocaleDateString('id-ID', {day:'2-digit',month:'2-digit',year:'2-digit'});
    const ch  = _jpChannelMap[row.channel_id];
    const chNama = ch ? ch.nama : '—';
    const chKat  = ch ? (_katLabel[ch.kategori] || ch.kategori) : '';
    const chBadge = ch
      ? `<span style="font-size:11px;padding:2px 6px;border-radius:3px;background:var(--cream2);color:var(--ink2)">${chNama}</span><br><span style="font-size:10px;color:var(--ink3)">${chKat}</span>`
      : '—';
    return `
      <tr>
        <td>${tgl}</td>
        <td>${chBadge}</td>
        <td>${row.keterangan || '—'}</td>
        <td><span style="font-weight:600;color:var(--accent)">${row.sku || '—'}</span></td>
        <td style="text-align:center">${row.qty || 0}</td>
        <td>${fmtRp(row.harga_satuan)}</td>
        <td style="color:var(--danger)">${row.diskon ? fmtRp(row.diskon) : '—'}</td>
        <td style="color:var(--ok);font-weight:600">${fmtRp(row.total)}</td>
        <td><span class="badge-bayar badge-${(row.metode_bayar||'').toLowerCase()}">${row.metode_bayar || '—'}</span></td>
        <td style="font-size:12px;color:var(--ink3)">${row.catatan || '—'}</td>
        <td>
          <button class="btn btn-sm" onclick="editJP(${row.id})" style="margin-right:4px">✎</button>
          <button class="btn btn-sm btn-danger" onclick="hapusJP(${row.id},'${(row.keterangan||'').replace(/'/g,"\\'")}')">✕</button>
        </td>
      </tr>`;
  }).join('');

  document.getElementById('jp-footer').textContent = `Menampilkan ${data.length} entri`;
}

// ─── UPDATE METRICS ──────────────────────────────────────────
function updateMetricsJP(data) {
  const totalPenjualan = data.reduce((s, r) => s + (r.total || 0), 0);
  const totalItem      = data.reduce((s, r) => s + (r.qty   || 0), 0);
  document.getElementById('jp-total-penjualan').textContent = 'Rp' + totalPenjualan.toLocaleString('id-ID');
  document.getElementById('jp-total-item').textContent      = totalItem.toLocaleString('id-ID') + ' item';
}

// ─── FORM SHOW/HIDE ──────────────────────────────────────────
function showTambahJP() {
  document.getElementById('jp-form-title').innerHTML = '<i class="ti ti-plus"></i> Tambah Penjualan';
  document.getElementById('jp-id').value       = '';
  document.getElementById('jp-tgl').value      = new Date().toISOString().split('T')[0];
  document.getElementById('jp-channel').value  = '';
  document.getElementById('jp-ket').value      = '';
  document.getElementById('jp-sku').value      = '';
  document.getElementById('jp-qty').value      = '';
  document.getElementById('jp-harga').value    = '';
  document.getElementById('jp-diskon').value   = '';
  document.getElementById('jp-total').value    = '';
  document.getElementById('jp-bayar').value    = 'Tunai';
  document.getElementById('jp-catatan').value  = '';
  document.getElementById('form-jp').style.display = 'block';
  document.getElementById('form-jp').scrollIntoView({behavior:'smooth'});
  sketchForm('form-jp');
}

function cancelFormJP() {
  document.getElementById('form-jp').style.display = 'none';
}

// ─── EDIT ────────────────────────────────────────────────────
async function editJP(id) {
  try {
    const data = await dbGet('jurnal_penjualan', `&id=eq.${id}`);
    if (!data || !data[0]) return;
    const r = data[0];
    document.getElementById('jp-form-title').innerHTML = '<i class="ti ti-edit"></i> Edit Penjualan';
    document.getElementById('jp-id').value      = r.id;
    document.getElementById('jp-tgl').value     = r.tanggal ? r.tanggal.split('T')[0] : '';
    document.getElementById('jp-channel').value = r.channel_id || '';
    document.getElementById('jp-ket').value     = r.keterangan    || '';
    document.getElementById('jp-sku').value     = r.sku           || '';
    document.getElementById('jp-qty').value     = r.qty           || '';
    document.getElementById('jp-harga').value   = r.harga_satuan  || '';
    document.getElementById('jp-diskon').value  = r.diskon        || '';
    document.getElementById('jp-total').value   = r.total         || '';
    document.getElementById('jp-bayar').value   = r.metode_bayar  || 'Tunai';
    document.getElementById('jp-catatan').value = r.catatan       || '';
    document.getElementById('form-jp').style.display = 'block';
    document.getElementById('form-jp').scrollIntoView({behavior:'smooth'});
  } catch(err) { alert('Gagal load: ' + err.message); }
}

// ─── SIMPAN ──────────────────────────────────────────────────
async function simpanJP() {
  const id     = document.getElementById('jp-id').value;
  const qty    = parseInt(document.getElementById('jp-qty').value)    || 0;
  const harga  = parseInt(document.getElementById('jp-harga').value)  || 0;
  const diskon = parseInt(document.getElementById('jp-diskon').value) || 0;
  const total  = parseInt(document.getElementById('jp-total').value)  || (qty * harga - diskon);
  const chId   = document.getElementById('jp-channel').value;

  const data = {
    tanggal:      document.getElementById('jp-tgl').value,
    channel_id:   chId ? parseInt(chId) : null,
    keterangan:   document.getElementById('jp-ket').value.trim(),
    sku:          document.getElementById('jp-sku').value.trim().toUpperCase(),
    qty,
    harga_satuan: harga,
    diskon,
    total,
    metode_bayar: document.getElementById('jp-bayar').value,
    catatan:      document.getElementById('jp-catatan').value.trim(),
  };

  if (!data.tanggal)    { alert('Tanggal wajib diisi!');     return; }
  if (!data.keterangan) { alert('Keterangan wajib diisi!');  return; }
  if (qty <= 0)         { alert('Qty harus lebih dari 0!');  return; }
  if (harga <= 0)       { alert('Harga satuan harus diisi!');return; }

  try {
    if (id) { await dbUpdate('jurnal_penjualan', id, data); }
    else     { await dbInsert('jurnal_penjualan', data);    }
    cancelFormJP();
    loadJurnalPenjualan();
    if (typeof loadDashboard === 'function') loadDashboard();
  } catch(err) { alert('Gagal simpan: ' + err.message); }
}

// ─── HAPUS ───────────────────────────────────────────────────
async function hapusJP(id, ket) {
  confirmDelete(`Hapus penjualan "${ket}"?`, async () => {
    try {
      await dbDelete('jurnal_penjualan', id);
      loadJurnalPenjualan();
      if (typeof loadDashboard === 'function') loadDashboard();
    } catch(err) { alert('Gagal hapus: ' + err.message); }
  });
}

// ─── EXPORT CSV ──────────────────────────────────────────────
async function exportJurnalPenjualan() {
  try {
    const data = await dbGet('jurnal_penjualan', '&order=tanggal.asc');
    if (!data || data.length === 0) { alert('Belum ada data penjualan'); return; }
    const headers = ['Tanggal','Channel','Keterangan','SKU','Qty','Harga Satuan','Diskon','Total','Metode Bayar','Catatan'];
    const rows = data.map(r => {
      const ch = _jpChannelMap[r.channel_id];
      return [
        r.tanggal, ch ? ch.nama : '', r.keterangan, r.sku, r.qty,
        r.harga_satuan, r.diskon||0, r.total, r.metode_bayar, r.catatan||''
      ];
    });
    exportCSV('zenoot-jurnal-penjualan.csv', headers, rows);
  } catch(err) { alert('Gagal export: ' + err.message); }
}

// ─── INISIALISASI ────────────────────────────────────────────
document.getElementById('jp-filter-bulan').value = new Date().toISOString().slice(0,7);
loadChannelDropdownJP().then(() => loadJurnalPenjualan());
