// ─── PRODUK.JS — Kelola Produk (master SKU + paste massal) ───

document.getElementById('page-produk').innerHTML = `
  <div id="ops-switcher-produk" class="ch-switcher"></div>

  <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
    <button class="btn btn-sm btn-primary" onclick="showFormProduk()"><i class="ti ti-plus"></i> Tambah SKU</button>
    <button class="btn btn-sm" onclick="showPasteProduk()"><i class="ti ti-clipboard"></i> Paste Massal</button>
    <button class="btn btn-sm" onclick="loadProduk()"><i class="ti ti-refresh"></i> Refresh</button>
    <button class="btn btn-sm" onclick="exportProduk()"><i class="ti ti-download"></i> Export CSV</button>
  </div>

  <!-- FORM TAMBAH/EDIT SKU -->
  <div id="form-produk" style="display:none;margin-bottom:12px">
    <div class="card">
      <div class="card-title" id="produk-form-title"><i class="ti ti-plus"></i> Tambah SKU</div>
      <input type="hidden" id="prd-id">
      <div class="form-row">
        <div class="form-group"><label>Katalog</label><input type="text" id="prd-katalog" placeholder="mis: TURTLENECK"></div>
        <div class="form-group"><label>SKU Variasi</label><input type="text" id="prd-sku" placeholder="mis: Turtleneck_HITAM-M"></div>
        <div class="form-group"><label>HPP (Rp)</label><input type="number" id="prd-hpp" placeholder="0"></div>
        <div class="form-group"><label>Boss</label><input type="text" id="prd-boss" placeholder="mis: ALAN"></div>
        <div class="form-group" style="flex:0;justify-content:flex-end">
          <label>&nbsp;</label>
          <button class="btn btn-primary btn-sm" onclick="simpanProduk()">Simpan</button>
          <button class="btn btn-sm" onclick="cancelFormProduk()" style="margin-top:4px">Batal</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL PASTE MASSAL -->
  <div class="modal-overlay" id="modal-paste-produk">
    <div class="modal" style="max-width:520px">
      <div class="modal-title"><i class="ti ti-clipboard"></i> Paste Massal SKU</div>
      <div style="font-size:12px;color:var(--ink3);margin-bottom:10px;line-height:1.6">
        Copy dari Excel lalu paste di bawah.<br>
        Urutan kolom: <b>Katalog → SKU Variasi → HPP → Boss</b>
      </div>
      <textarea id="paste-area-produk"
        style="width:100%;height:180px;font-family:var(--f);font-size:13px;padding:8px;border:2px solid var(--ink);background:var(--cream);resize:vertical;outline:none"
        placeholder="Paste di sini..."></textarea>
      <div id="paste-produk-preview" style="margin-top:10px;display:none">
        <div style="font-size:12px;font-weight:700;color:var(--ink3);margin-bottom:6px" id="paste-produk-count"></div>
        <div class="tbl-wrap" style="max-height:160px;overflow-y:auto">
          <table class="tbl"><thead><tr><th>Katalog</th><th>SKU Variasi</th><th>HPP</th><th>Boss</th></tr></thead>
          <tbody id="paste-produk-tbody"></tbody></table>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-sm" onclick="parsePasteProduk()"><i class="ti ti-eye"></i> Preview</button>
        <button class="btn btn-primary btn-sm" id="btn-simpan-paste-produk" onclick="simpanPasteProduk()" style="display:none"><i class="ti ti-check"></i> Simpan Semua</button>
        <button class="btn btn-sm" onclick="closeModal('modal-paste-produk')">Batal</button>
      </div>
    </div>
  </div>

  <!-- TABEL PRODUK -->
  <div class="card">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span><i class="ti ti-package"></i> Master SKU Produk</span>
      <input type="text" id="produk-search" placeholder="Cari SKU / katalog..."
        style="font-family:var(--f);font-size:13px;padding:4px 8px;border:2px solid var(--ink);background:var(--cream);width:180px"
        oninput="filterProduk()">
    </div>
    <div class="tbl-wrap" style="max-height:65vh;overflow-y:auto"><table class="tbl">
      <thead><tr><th>Katalog</th><th>SKU Variasi</th><th>HPP</th><th>Boss</th><th>Aksi</th></tr></thead>
      <tbody id="produk-tbody">
        <tr><td colspan="5" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table></div>
  </div>
`;

// render sketchy UI untuk halaman produk setelah innerHTML siap
setTimeout(() => { if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-produk')); }, 80);

let _produkData = [];

async function loadProduk() {
  const tbody = document.getElementById('produk-tbody');
  tbody.innerHTML = '<tr><td colspan="5" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>';
  try {
    const data = await dbGet('produk');
    // Supabase kadang return object error bukan array
    if (!Array.isArray(data)) {
      const msg = data?.message || data?.hint || JSON.stringify(data);
      tbody.innerHTML = `<tr><td colspan="5" style="color:var(--danger)">
        ⚠️ Tabel <b>produk</b> belum ada di Supabase.<br>
        <span style="font-size:12px;color:var(--ink3)">Buat dulu di Supabase → Table Editor → New Table → nama: <b>produk</b><br>
        Kolom: id (int8 PK), katalog (text), sku_variasi (text), hpp (int8), boss (text), created_at (timestamptz default now())</span>
      </td></tr>`;
      return;
    }
    _produkData = data;
    renderProduk(_produkData);
  } catch(err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:var(--danger)">Error: ${err.message}</td></tr>`;
  }
}

function renderProduk(data) {
  const tbody = document.getElementById('produk-tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="color:var(--ink3);font-style:italic">Belum ada data produk</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(row => {
    const safeSku = (row.sku_variasi||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    return `<tr>
      <td>${row.katalog || '—'}</td>
      <td><b>${row.sku_variasi}</b></td>
      <td>Rp${(row.hpp||0).toLocaleString('id-ID')}</td>
      <td>${row.boss || '—'}</td>
      <td>
        <button class="btn btn-sm" data-action="edit-prd" data-id="${row.id}" style="margin-right:4px"><i class="ti ti-edit"></i></button>
        <button class="btn btn-sm btn-danger" data-action="hapus-prd" data-id="${row.id}" data-sku="${safeSku}"><i class="ti ti-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function filterProduk() {
  const q = document.getElementById('produk-search').value.toLowerCase();
  const filtered = _produkData.filter(r =>
    (r.sku_variasi||'').toLowerCase().includes(q) ||
    (r.katalog||'').toLowerCase().includes(q) ||
    (r.boss||'').toLowerCase().includes(q)
  );
  renderProduk(filtered);
}

function showFormProduk() {
  document.getElementById('produk-form-title').innerHTML = '<i class="ti ti-plus"></i> Tambah SKU';
  document.getElementById('prd-id').value = '';
  document.getElementById('prd-katalog').value = '';
  document.getElementById('prd-sku').value = '';
  document.getElementById('prd-hpp').value = '';
  document.getElementById('prd-boss').value = '';
  document.getElementById('form-produk').style.display = 'block';
  document.getElementById('form-produk').scrollIntoView({behavior:'smooth'});
  sketchForm('form-produk');
}

function cancelFormProduk() {
  document.getElementById('form-produk').style.display = 'none';
}

async function editProduk(id) {
  const r = _produkData.find(d => d.id == id);  // == agar string '123' cocok dengan bigint 123
  if (!r) return;
  document.getElementById('produk-form-title').innerHTML = '<i class="ti ti-edit"></i> Edit SKU';
  document.getElementById('prd-id').value      = r.id;
  document.getElementById('prd-katalog').value = r.katalog || '';
  document.getElementById('prd-sku').value     = r.sku_variasi || '';
  document.getElementById('prd-hpp').value     = r.hpp || 0;
  document.getElementById('prd-boss').value    = r.boss || '';
  document.getElementById('form-produk').style.display = 'block';
  sketchForm('form-produk');
  document.getElementById('form-produk').scrollIntoView({behavior:'smooth'});
}

async function simpanProduk() {
  const id = document.getElementById('prd-id').value;
  const data = {
    katalog:     document.getElementById('prd-katalog').value.trim().toUpperCase(),
    sku_variasi: document.getElementById('prd-sku').value.trim(),
    hpp:         parseInt(document.getElementById('prd-hpp').value) || 0,
    boss:        document.getElementById('prd-boss').value.trim().toUpperCase(),
  };
  if (!data.sku_variasi) { alert('SKU Variasi wajib diisi!'); return; }
  try {
    if (id) { await dbUpdate('produk', id, data); }
    else    { await dbInsert('produk', data); }
    cancelFormProduk();
    loadProduk();
  } catch(err) { alert('Gagal simpan: ' + err.message); }
}

async function hapusProduk(id, sku) {
  confirmDelete(`Hapus SKU "${sku}"?`, async () => {
    try { await dbDelete('produk', id); loadProduk(); }
    catch(err) { alert('Gagal hapus: ' + err.message); }
  });
}

// ─── PASTE MASSAL ─────────────────────────────────────────────
function showPasteProduk() {
  document.getElementById('paste-area-produk').value = '';
  document.getElementById('paste-produk-preview').style.display = 'none';
  document.getElementById('btn-simpan-paste-produk').style.display = 'none';
  document.getElementById('modal-paste-produk').classList.add('open');
  setTimeout(() => document.getElementById('paste-area-produk').focus(), 100);
}

let _parsedProduk = [];

function parsePasteProduk() {
  const raw = document.getElementById('paste-area-produk').value.trim();
  if (!raw) { alert('Paste data dulu!'); return; }

  _parsedProduk = [];
  const lines = raw.split('\n');

  for (const line of lines) {
    if (!line.trim()) continue;
    // Split by tab (dari Excel) atau multiple spaces
    const cols = line.split('\t').map(c => c.trim());

    // Minimal 2 kolom (katalog + sku)
    if (cols.length < 2) continue;

    const katalog = cols[0] || '';
    const sku     = cols[1] || '';
    const hpp     = parseInt((cols[2]||'').replace(/[^0-9]/g,'')) || 0;
    const boss    = (cols[3]||'').trim().toUpperCase();

    if (!sku) continue;
    _parsedProduk.push({ katalog: katalog.toUpperCase(), sku_variasi: sku, hpp, boss });
  }

  if (_parsedProduk.length === 0) {
    alert('Tidak ada data yang bisa dibaca. Pastikan copy dari Excel dengan format: Katalog → SKU → HPP → Boss');
    return;
  }

  // Render preview
  document.getElementById('paste-produk-count').textContent =
    `✓ ${_parsedProduk.length} SKU siap diimport`;
  document.getElementById('paste-produk-tbody').innerHTML = _parsedProduk.map(r => `
    <tr>
      <td>${r.katalog}</td>
      <td>${r.sku_variasi}</td>
      <td>Rp${r.hpp.toLocaleString('id-ID')}</td>
      <td>${r.boss||'—'}</td>
    </tr>`).join('');
  document.getElementById('paste-produk-preview').style.display = 'block';
  document.getElementById('btn-simpan-paste-produk').style.display = 'inline-block';
}

async function simpanPasteProduk() {
  if (_parsedProduk.length === 0) return;
  const btn = document.getElementById('btn-simpan-paste-produk');
  btn.textContent = 'Menyimpan...';
  btn.disabled = true;

  try {
    // Insert satu per satu (Supabase REST tidak support bulk insert via anon key easily)
    let ok = 0;
    for (const row of _parsedProduk) {
      await dbInsert('produk', row);
      ok++;
      btn.textContent = `Menyimpan ${ok}/${_parsedProduk.length}...`;
    }
    closeModal('modal-paste-produk');
    loadProduk();
    alert(`✓ ${ok} SKU berhasil disimpan!`);
  } catch(err) {
    alert('Gagal simpan: ' + err.message);
  } finally {
    btn.textContent = 'Simpan Semua';
    btn.disabled = false;
  }
}

async function exportProduk() {
  if (_produkData.length === 0) { alert('Belum ada data'); return; }
  exportCSV('zenoot-produk.csv',
    ['Katalog','SKU Variasi','HPP','Boss'],
    _produkData.map(r => [r.katalog, r.sku_variasi, r.hpp, r.boss])
  );
}

loadProduk();

// ─── EVENT DELEGATION untuk tombol edit/hapus di tabel produk ──
document.getElementById('page-produk').addEventListener('click', function(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const id     = parseInt(btn.dataset.id);  // produk.id = bigint, harus parseInt
  if (action === 'edit-prd') {
    editProduk(id);
  } else if (action === 'hapus-prd') {
    const sku = btn.dataset.sku;
    hapusProduk(id, sku);
  }
});
