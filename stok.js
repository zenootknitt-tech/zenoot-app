// ─── STOK.JS v3 — basis dari produk, keluar dari jurnal ───────

function statusBadge(sisa) {
  if (sisa <= 0)  return '<span class="badge badge-crit">Habis!</span>';
  if (sisa <= 3)  return '<span class="badge badge-crit">Kritis!</span>';
  if (sisa <= 8)  return '<span class="badge badge-warn">Ati2</span>';
  return '<span class="badge badge-ok">Aman</span>';
}

document.getElementById('page-stok').innerHTML = `
  <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center;flex-wrap:wrap">
    <!-- KIRI: 1 tombol Filter dropdown -->
    <div style="position:relative">
      <button class="btn btn-sm" id="btn-filter-all" onclick="stokToggleFilterAll()" style="min-width:90px;text-align:left;padding-right:24px">
        <i class="ti ti-adjustments-horizontal"></i> <span id="lbl-filter-all">Filter</span>
        <i class="ti ti-chevron-down" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);font-size:11px"></i>
      </button>
      <div id="dd-filter-all" style="display:none;position:absolute;left:0;top:calc(100% + 2px);z-index:999;
        background:var(--cream);border:2px solid var(--ink);min-width:220px;
        box-shadow:4px 4px 0 var(--ink4)">

        <!-- Supplier -->
        <div style="padding:6px 10px;font-size:11px;font-weight:700;color:var(--ink3);border-bottom:1px dashed var(--ink4);letter-spacing:.04em">
          <i class="ti ti-user" style="font-size:12px"></i> SUPPLIER
        </div>
        <div id="dd-filter-boss" style="max-height:160px;overflow-y:auto"></div>

        <!-- SKU Induk -->
        <div style="padding:6px 10px;font-size:11px;font-weight:700;color:var(--ink3);border-top:2px solid var(--ink4);border-bottom:1px dashed var(--ink4);letter-spacing:.04em">
          <i class="ti ti-tag" style="font-size:12px"></i> SKU INDUK
        </div>
        <div id="dd-filter-katalog" style="max-height:160px;overflow-y:auto"></div>

        <!-- Status -->
        <div style="padding:6px 10px;font-size:11px;font-weight:700;color:var(--ink3);border-top:2px solid var(--ink4);border-bottom:1px dashed var(--ink4);letter-spacing:.04em">
          <i class="ti ti-circle-check" style="font-size:12px"></i> STATUS
        </div>
        <div id="dd-filter-status"></div>

        <!-- Reset -->
        <div style="padding:6px 10px;border-top:2px solid var(--ink)">
          <button class="btn btn-sm" onclick="stokResetAllFilter()" style="width:100%;font-size:12px">
            <i class="ti ti-x"></i> Reset Filter
          </button>
        </div>
      </div>
    </div>

    <!-- KANAN: Paste Massal + Tambah -->
    <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
      <button class="btn btn-sm" onclick="showPasteStok()"><i class="ti ti-clipboard"></i> Paste Massal</button>
      <button class="btn btn-sm btn-primary" onclick="showTambahStok()"><i class="ti ti-plus"></i> Tambah</button>
    </div>
  </div>

  <!-- MODAL PASTE MASSAL STOK -->
  <div class="modal-overlay" id="modal-paste-stok">
    <div class="modal" style="max-width:480px">
      <div class="modal-title"><i class="ti ti-clipboard"></i> Paste Massal Stok Masuk</div>
      <div style="font-size:12px;color:var(--ink3);margin-bottom:10px;line-height:1.6">
        Copy dari Google Sheet / Excel lalu paste di bawah.<br>
        Urutan kolom: <b>SKU Variasi → Qty (stok masuk)</b>
      </div>
      <textarea id="paste-area-stok"
        style="width:100%;height:160px;font-family:var(--f);font-size:13px;padding:8px;border:2px solid var(--ink);background:var(--cream);resize:vertical;outline:none"
        placeholder="Paste di sini..."></textarea>
      <div id="paste-stok-preview" style="margin-top:10px;display:none">
        <div style="font-size:12px;font-weight:700;color:var(--ink3);margin-bottom:6px" id="paste-stok-count"></div>
        <div class="tbl-wrap" style="max-height:140px;overflow-y:auto">
          <table class="tbl"><thead><tr><th>SKU Variasi</th><th>Stok Masuk</th></tr></thead>
          <tbody id="paste-stok-tbody"></tbody></table>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-sm" onclick="parsePasteStok()"><i class="ti ti-eye"></i> Preview</button>
        <button class="btn btn-primary btn-sm" id="btn-simpan-paste-stok" onclick="simpanPasteStok()" style="display:none"><i class="ti ti-device-floppy"></i> Simpan Semua</button>
        <button class="btn btn-sm" onclick="closeModal('modal-paste-stok')"><i class="ti ti-x"></i> Batal</button>
      </div>
    </div>
  </div>

  <!-- FORM TAMBAH/EDIT STOK MASUK -->
  <div id="form-tambah-stok" style="display:none;margin-bottom:12px">
    <div class="card">
      <div class="card-title" id="stok-form-title"><i class="ti ti-plus"></i> Tambah Stok Masuk</div>
      <input type="hidden" id="inp-id">
      <div class="form-row">
        <div class="form-group" style="flex:2;position:relative">
          <label>SKU Variasi</label>
          <div style="display:flex">
            <input type="text" id="inp-sku" placeholder="Ketik atau pilih SKU..." autocomplete="off"
              oninput="stokSuggestSku()" onfocus="stokSuggestSku()"
              style="flex:1;border-right:none">
            <button onclick="stokToggleSkuFull()"
              style="background:var(--cream2);border:2px solid var(--ink);border-left:none;padding:0 10px;cursor:pointer;font-size:14px">▼</button>
          </div>
          <div id="stok-sku-dropdown"
            style="display:none;position:absolute;top:100%;left:0;right:0;z-index:999;
                   background:var(--cream);border:2px solid var(--ink);border-top:none;
                   max-height:180px;overflow-y:auto;box-shadow:4px 4px 0 var(--ink4)"></div>
        </div>
        <div class="form-group">
          <label>Stok Masuk (Qty)</label>
          <input type="number" id="inp-masuk" placeholder="0" min="0">
        </div>
        <div class="form-group" style="flex:0;justify-content:flex-end">
          <label>&nbsp;</label>
          <button class="btn btn-primary btn-sm" onclick="simpanStok()"><i class="ti ti-device-floppy"></i> Simpan</button>
          <button class="btn btn-sm" onclick="cancelStokForm()" style="margin-top:4px"><i class="ti ti-x"></i> Batal</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title" style="display:flex;align-items:center;gap:8px">
      <i class="ti ti-package"></i> Semua SKU
      <span id="stok-summary" style="font-size:12px;color:var(--ink3);font-weight:400;margin-left:auto"></span>
    </div>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr>
        <th>SKU Variasi</th><th>Katalog</th><th>Boss</th>
        <th>Masuk</th><th>Keluar</th><th>Sisa</th>
        <th>HPP</th><th>Nilai Stok</th><th>Status</th><th>Aksi</th>
      </tr></thead>
      <tbody id="stok-tbody">
        <tr><td colspan="10" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table></div>
  </div>
`;

setTimeout(() => { if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-stok')); }, 80);

// ─── STATE ────────────────────────────────────────────────────
let _stokAllData  = [];   // hasil merge produk + stok + jurnal
let _stokMasukMap = {};   // sku -> {id, qty}  (dari tabel stok)
let _produkForStok = [];  // dari tabel produk

// ─── LOAD UTAMA ───────────────────────────────────────────────
async function loadStok() {
  const tbody = document.getElementById('stok-tbody');
  tbody.innerHTML = '<tr><td colspan="10" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>';

  try {
    // 1. Ambil semua produk (basis SKU)
    const produkData = await dbGet('produk', '&order=katalog.asc,sku_variasi.asc');
    _produkForStok = Array.isArray(produkData) ? produkData : [];

    // 2. Ambil semua stok masuk manual
    const stokData = await dbGet('stok');
    _stokMasukMap = {};
    if (Array.isArray(stokData)) {
      stokData.forEach(s => {
        const key = (s.sku_variasi || '').toUpperCase();
        _stokMasukMap[key] = { id: s.id, qty: s.stok_masuk || 0 };
      });
    }

    // 3. Ambil sum keluar dari jurnal_penjualan per SKU
    const jurnalData = await dbGet('jurnal_penjualan', '&select=sku,qty');
    const keluarMap = {};
    if (Array.isArray(jurnalData)) {
      jurnalData.forEach(j => {
        const key = (j.sku || '').toUpperCase();
        keluarMap[key] = (keluarMap[key] || 0) + (j.qty || 0);
      });
    }

    // 4. Merge: semua SKU dari produk sebagai basis
    _stokAllData = _produkForStok.map(p => {
      const skuKey = (p.sku_variasi || '').toUpperCase();
      const masuk  = _stokMasukMap[skuKey] ? _stokMasukMap[skuKey].qty : 0;
      const keluar = keluarMap[skuKey] || 0;
      const sisa   = masuk - keluar;
      return {
        sku_variasi: p.sku_variasi,
        katalog:     p.katalog,
        boss:        p.boss,
        hpp:         p.hpp || 0,
        stok_masuk:  masuk,
        stok_keluar: keluar,
        sisa,
        nilai_stok:  sisa > 0 ? sisa * (p.hpp || 0) : 0,
        _stok_id:    _stokMasukMap[skuKey] ? _stokMasukMap[skuKey].id : null,
      };
    });

    renderStok(_stokAllData);
  } catch(err) {
    tbody.innerHTML = `<tr><td colspan="10" style="color:var(--danger)">Error: ${err.message}</td></tr>`;
  }
}

// ─── RENDER ───────────────────────────────────────────────────
function renderStok(data) {
  const tbody = document.getElementById('stok-tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="color:var(--ink3);font-style:italic">Belum ada data produk</td></tr>';
    return;
  }

  // Summary
  const totalNilai = data.reduce((s, r) => s + (r.nilai_stok || 0), 0);
  const totalSisa  = data.reduce((s, r) => s + (r.sisa || 0), 0);
  const elSum = document.getElementById('stok-summary');
  if (elSum) elSum.textContent =
    `${data.length} SKU · Sisa: ${totalSisa} pcs · Nilai: Rp${totalNilai.toLocaleString('id-ID')}`;

  tbody.innerHTML = data.map(row => {
    const hpp   = row.hpp   ? `Rp${row.hpp.toLocaleString('id-ID')}` : 'Rp—';
    const nilai = row.nilai_stok > 0 ? `Rp${row.nilai_stok.toLocaleString('id-ID')}` : '—';
    const safeSku = (row.sku_variasi || '').replace(/"/g, '&quot;');
    return `<tr>
      <td><b>${row.sku_variasi || '—'}</b></td>
      <td>${row.katalog || '—'}</td>
      <td>${row.boss || '—'}</td>
      <td style="text-align:center">${row.stok_masuk}</td>
      <td style="text-align:center;color:var(--danger)">${row.stok_keluar}</td>
      <td style="text-align:center"><b>${row.sisa}</b></td>
      <td>${hpp}</td>
      <td style="color:var(--ok);font-weight:700">${nilai}</td>
      <td>${statusBadge(row.sisa)}</td>
      <td>
        <button class="btn btn-sm" data-action="edit-stok" data-sku="${safeSku}" style="margin-right:4px" title="Edit stok masuk"><i class="ti ti-edit"></i></button>
      </td>
    </tr>`;
  }).join('');
}

// ─── FILTER ───────────────────────────────────────────────────
function filterStok() {
  const filtered = _stokAllData.filter(r => {
    if (_filterBoss    && (r.boss    || '') !== _filterBoss)    return false;
    if (_filterKatalog && (r.katalog || '') !== _filterKatalog) return false;
    if (_filterStatus) {
      const sisa = r.sisa;
      if (_filterStatus === 'habis'  && !(sisa <= 0))              return false;
      if (_filterStatus === 'kritis' && !(sisa > 0 && sisa <= 3))  return false;
      if (_filterStatus === 'ati2'   && !(sisa > 3 && sisa <= 8))  return false;
      if (_filterStatus === 'aman'   && !(sisa > 8))               return false;
    }
    return true;
  });
  renderStok(filtered);
}

// ─── EVENT DELEGATION ─────────────────────────────────────────
document.getElementById('page-stok').addEventListener('click', function(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  if (btn.dataset.action === 'edit-stok') {
    editStok(btn.dataset.sku);
  }
});

// ─── FORM TAMBAH/EDIT ─────────────────────────────────────────
function showTambahStok() {
  document.getElementById('stok-form-title').innerHTML = '<i class="ti ti-plus"></i> Tambah Stok Masuk';
  document.getElementById('inp-id').value    = '';
  document.getElementById('inp-sku').value   = '';
  document.getElementById('inp-masuk').value = '';
  document.getElementById('form-tambah-stok').style.display = 'block';
  sketchForm('form-tambah-stok');
  document.getElementById('form-tambah-stok').scrollIntoView({behavior:'smooth'});
}

function cancelStokForm() {
  document.getElementById('form-tambah-stok').style.display = 'none';
  stokTutupDropdown();
}

function editStok(sku) {
  const skuKey = sku.toUpperCase();
  const existing = _stokMasukMap[skuKey];
  document.getElementById('stok-form-title').innerHTML = '<i class="ti ti-edit"></i> Edit Stok Masuk — ' + sku;
  document.getElementById('inp-id').value    = existing ? existing.id : '';
  document.getElementById('inp-sku').value   = sku;
  document.getElementById('inp-masuk').value = existing ? existing.qty : 0;
  document.getElementById('form-tambah-stok').style.display = 'block';
  sketchForm('form-tambah-stok');
  document.getElementById('form-tambah-stok').scrollIntoView({behavior:'smooth'});
}

async function simpanStok() {
  const id  = document.getElementById('inp-id').value;
  const sku = document.getElementById('inp-sku').value.trim();
  const qty = parseInt(document.getElementById('inp-masuk').value) || 0;

  if (!sku) { alert('SKU Variasi wajib diisi!'); return; }

  // Cari data produk untuk ambil katalog & boss
  const prod = _produkForStok.find(p =>
    (p.sku_variasi || '').toUpperCase() === sku.toUpperCase()
  );

  const payload = {
    sku_variasi:  sku.toUpperCase(),
    stok_masuk:   qty,
    stok_keluar:  0,
    katalog:      prod ? prod.katalog : '',
    boss:         prod ? prod.boss    : '',
    hpp:          prod ? prod.hpp     : 0,
  };

  try {
    if (id) {
      await dbUpdate('stok', id, { stok_masuk: qty });
    } else {
      await dbInsert('stok', payload);
    }
    cancelStokForm();
    loadStok();
  } catch(err) { alert('Gagal simpan: ' + err.message); }
}

// ─── SKU AUTOCOMPLETE DI FORM ─────────────────────────────────
function stokSuggestSku() {
  const q   = (document.getElementById('inp-sku').value || '').toLowerCase();
  const dd  = document.getElementById('stok-sku-dropdown');
  const list = _produkForStok.filter(p =>
    !q || (p.sku_variasi || '').toLowerCase().includes(q)
  ).slice(0, 30);

  if (!list.length) { dd.style.display = 'none'; return; }
  dd.innerHTML = list.map(p =>
    `<div style="padding:8px 12px;cursor:pointer;font-size:13px;border-bottom:1px dashed var(--ink4)"
      onmousedown="stokPilihSku('${(p.sku_variasi||'').replace(/'/g,"\\'")}')">
      <b>${p.sku_variasi}</b>
      <span style="color:var(--ink3);font-size:11px;margin-left:6px">${p.katalog || ''}</span>
    </div>`
  ).join('');
  dd.style.display = 'block';
}

function stokToggleSkuFull() {
  document.getElementById('inp-sku').value = '';
  stokSuggestSku();
  document.getElementById('inp-sku').focus();
}

function stokPilihSku(sku) {
  document.getElementById('inp-sku').value = sku;
  stokTutupDropdown();
  document.getElementById('inp-masuk').focus();
}

function stokTutupDropdown() {
  const dd = document.getElementById('stok-sku-dropdown');
  if (dd) dd.style.display = 'none';
}

document.addEventListener('click', function(e) {
  const inp = document.getElementById('inp-sku');
  const dd  = document.getElementById('stok-sku-dropdown');
  if (!inp || !dd) return;
  if (!inp.contains(e.target) && !dd.contains(e.target)) dd.style.display = 'none';
});

// ─── PASTE MASSAL ─────────────────────────────────────────────
function showPasteStok() {
  document.getElementById('paste-area-stok').value = '';
  document.getElementById('paste-stok-preview').style.display = 'none';
  document.getElementById('btn-simpan-paste-stok').style.display = 'none';
  document.getElementById('modal-paste-stok').classList.add('open');
  setTimeout(() => document.getElementById('paste-area-stok').focus(), 100);
}

let _parsedStok = [];

function parsePasteStok() {
  const raw = document.getElementById('paste-area-stok').value.trim();
  if (!raw) { alert('Paste data dulu!'); return; }

  _parsedStok = [];
  const lines = raw.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = line.split('\t').map(c => c.trim());
    if (cols.length < 2) continue;
    const sku = (cols[0] || '').toUpperCase();
    const qty = parseInt((cols[1] || '').replace(/[^0-9]/g, '')) || 0;
    if (!sku) continue;
    _parsedStok.push({ sku_variasi: sku, stok_masuk: qty });
  }

  if (_parsedStok.length === 0) {
    alert('Tidak ada data yang terbaca. Format: SKU Variasi (tab) Qty');
    return;
  }

  document.getElementById('paste-stok-count').textContent =
    `✓ ${_parsedStok.length} SKU siap diimport`;
  document.getElementById('paste-stok-tbody').innerHTML = _parsedStok.map(r =>
    `<tr><td>${r.sku_variasi}</td><td><b>${r.stok_masuk}</b></td></tr>`
  ).join('');
  document.getElementById('paste-stok-preview').style.display = 'block';
  document.getElementById('btn-simpan-paste-stok').style.display = 'inline-block';
}

async function simpanPasteStok() {
  if (_parsedStok.length === 0) return;
  const btn = document.getElementById('btn-simpan-paste-stok');
  btn.textContent = 'Menyimpan...';
  btn.disabled = true;

  try {
    let ok = 0;
    for (const row of _parsedStok) {
      const skuKey = row.sku_variasi.toUpperCase();
      const prod   = _produkForStok.find(p => (p.sku_variasi||'').toUpperCase() === skuKey);
      const existing = _stokMasukMap[skuKey];
      const payload  = {
        sku_variasi: row.sku_variasi,
        stok_masuk:  row.stok_masuk,
        stok_keluar: 0,
        katalog:     prod ? prod.katalog : '',
        boss:        prod ? prod.boss    : '',
        hpp:         prod ? prod.hpp     : 0,
      };
      if (existing) {
        await dbUpdate('stok', existing.id, { stok_masuk: row.stok_masuk });
      } else {
        await dbInsert('stok', payload);
      }
      ok++;
      btn.textContent = `Menyimpan ${ok}/${_parsedStok.length}...`;
    }
    closeModal('modal-paste-stok');
    loadStok();
    alert(`✓ ${ok} SKU berhasil disimpan!`);
  } catch(err) {
    alert('Gagal simpan: ' + err.message);
  } finally {
    btn.textContent = 'Simpan Semua';
    btn.disabled = false;
  }
}

// exportStok dihapus (tombol Export CSV diringkas)

// ─── FILTER STATE ─────────────────────────────────────────────
let _filterBoss    = null;
let _filterKatalog = null;
let _filterStatus  = null;

function stokToggleFilterAll() {
  var dd = document.getElementById('dd-filter-all');
  if (!dd) return;
  if (dd.style.display === 'block') { dd.style.display = 'none'; return; }

  _stokRenderFilterSection('boss',
    [{ val: null, label: 'Semua Supplier' }].concat(
      [...new Set(_stokAllData.map(function(r){ return r.boss||''; }).filter(Boolean))].sort()
      .map(function(v){ return { val: v, label: v }; })
    )
  );
  _stokRenderFilterSection('katalog',
    [{ val: null, label: 'Semua SKU Induk' }].concat(
      [...new Set(_stokAllData.map(function(r){ return r.katalog||''; }).filter(Boolean))].sort()
      .map(function(v){ return { val: v, label: v }; })
    )
  );
  _stokRenderFilterSection('status', [
    { val: null,     label: 'Semua Status' },
    { val: 'habis',  label: '🔴 Habis' },
    { val: 'kritis', label: '🟠 Kritis' },
    { val: 'ati2',   label: '🟡 Ati2' },
    { val: 'aman',   label: '🟢 Aman' },
  ]);

  dd.style.display = 'block';
}

function _stokRenderFilterSection(type, opsi) {
  var currVal = type === 'boss' ? _filterBoss : type === 'katalog' ? _filterKatalog : _filterStatus;
  var el = document.getElementById('dd-filter-' + type);
  if (!el) return;
  el.innerHTML = opsi.map(function(o) {
    var active = o.val === currVal;
    return '<div onclick="stokSetFilter(\'' + type + '\',' + JSON.stringify(o.val) + ')"' +
      ' style="padding:7px 14px;cursor:pointer;font-size:13px;' +
      'background:' + (active ? 'var(--ink)' : 'transparent') + ';' +
      'color:' + (active ? 'var(--cream)' : 'inherit') + ';' +
      'border-bottom:1px dashed var(--ink4)">' + o.label + '</div>';
  }).join('');
}

function stokResetAllFilter() {
  _filterBoss    = null;
  _filterKatalog = null;
  _filterStatus  = null;
  _stokUpdateFilterLabel();
  document.getElementById('dd-filter-all').style.display = 'none';
  filterStok();
}

function _stokUpdateFilterLabel() {
  var parts = [];
  if (_filterBoss)    parts.push(_filterBoss);
  if (_filterKatalog) parts.push(_filterKatalog);
  if (_filterStatus)  parts.push(_filterStatus.charAt(0).toUpperCase() + _filterStatus.slice(1));
  var lbl = document.getElementById('lbl-filter-all');
  if (lbl) lbl.textContent = parts.length ? parts.join(', ') : 'Filter';
  var btn = document.getElementById('btn-filter-all');
  if (btn) {
    btn.style.background = parts.length ? 'var(--ink)' : '';
    btn.style.color      = parts.length ? 'var(--cream)' : '';
  }
}

// stokToggleFilter (per-tombol) sudah digantikan stokToggleFilterAll

function stokSetFilter(type, val) {
  if (type === 'boss')    _filterBoss    = val;
  if (type === 'katalog') _filterKatalog = val;
  if (type === 'status')  _filterStatus  = val;
  // Re-render seksi agar highlight aktif langsung keliatan
  _stokRenderFilterSection(type,
    document.getElementById('dd-filter-' + type).children.length
      ? null  // sudah ada, re-render via toggle
      : null
  );
  // Refresh dropdown yang sedang terbuka
  stokToggleFilterAll(); // tutup dulu
  _stokUpdateFilterLabel();
  filterStok();
}

document.addEventListener('click', function(e) {
  var dd  = document.getElementById('dd-filter-all');
  var btn = document.getElementById('btn-filter-all');
  if (dd && dd.style.display === 'block') {
    if (!dd.contains(e.target) && btn && !btn.contains(e.target)) {
      dd.style.display = 'none';
    }
  }
});

loadStok();
