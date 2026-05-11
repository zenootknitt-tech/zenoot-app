// ─── STOK.JS — data diambil dari Supabase ────────────────────

function statusBadge(sisa) {
  if (sisa <= 0)  return '<span class="badge badge-crit">Habis!</span>';
  if (sisa <= 3)  return '<span class="badge badge-crit">Kritis!</span>';
  if (sisa <= 8)  return '<span class="badge badge-warn">Ati2</span>';
  return '<span class="badge badge-ok">Aman</span>';
}

async function loadStok() {
  const tbody = document.getElementById('stok-tbody');
  tbody.innerHTML = '<tr><td colspan="9" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>';
  
  const data = await dbGet('stok');
  
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="color:var(--ink3);font-style:italic">Belum ada data stok</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(row => {
    const sisa  = (row.stok_masuk || 0) - (row.stok_keluar || 0);
    const nilai = row.hpp ? `Rp${(sisa * row.hpp).toLocaleString('id-ID')}` : '—';
    const hpp   = row.hpp ? `Rp${row.hpp.toLocaleString('id-ID')}` : 'Rp—';
    return `
      <tr>
        <td>${row.sku_variasi}</td>
        <td>${row.katalog || '—'}</td>
        <td>${row.boss || '—'}</td>
        <td>${row.stok_masuk || 0}</td>
        <td>${row.stok_keluar || 0}</td>
        <td><b>${sisa}</b></td>
        <td>${hpp}</td>
        <td>${sisa > 0 && row.hpp ? nilai : '—'}</td>
        <td>${statusBadge(sisa)}</td>
      </tr>`;
  }).join('');
}

document.getElementById('page-stok').innerHTML = `
  <div id="ops-switcher-stok" class="ch-switcher"></div>
  <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
    <button class="btn btn-sm btn-primary" onclick="showTambahStok()"><i class="ti ti-plus"></i> Tambah SKU</button>
    <button class="btn btn-sm" onclick="loadStok()"><i class="ti ti-refresh"></i> Refresh</button>
  </div>

  <!-- FORM TAMBAH SKU -->
  <div id="form-tambah-stok" style="display:none;margin-bottom:12px">
    <div class="card">
      <div class="card-title"><i class="ti ti-plus"></i> Tambah SKU Baru</div>
      <div class="form-row">
        <div class="form-group"><label>SKU Variasi</label><input type="text" id="inp-sku" placeholder="mis: MAYRA_MAUVE"></div>
        <div class="form-group"><label>Katalog</label><input type="text" id="inp-katalog" placeholder="mis: MAYRA"></div>
        <div class="form-group"><label>Boss</label><input type="text" id="inp-boss" placeholder="mis: H Solah"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Stok Masuk</label><input type="number" id="inp-masuk" placeholder="0"></div>
        <div class="form-group"><label>Stok Keluar</label><input type="number" id="inp-keluar" placeholder="0"></div>
        <div class="form-group"><label>HPP (Rp)</label><input type="number" id="inp-hpp" placeholder="0"></div>
        <div class="form-group" style="flex:0;justify-content:flex-end">
          <label>&nbsp;</label>
          <button class="btn btn-primary btn-sm" onclick="simpanStok()">Simpan</button>
          <button class="btn btn-sm" onclick="document.getElementById('form-tambah-stok').style.display='none'" style="margin-top:4px">Batal</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><i class="ti ti-package"></i>Semua SKU</div>
    <table class="tbl">
      <thead><tr><th>SKU Variasi</th><th>Katalog</th><th>Boss</th><th>Stok Masuk</th><th>Stok Keluar</th><th>Sisa</th><th>HPP</th><th>Nilai Stok</th><th>Status</th></tr></thead>
      <tbody id="stok-tbody">
        <tr><td colspan="9" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table>
  </div>
`;

function showTambahStok() {
  document.getElementById('form-tambah-stok').style.display = 'block';
}

async function simpanStok() {
  const data = {
    sku_variasi:  document.getElementById('inp-sku').value.trim(),
    katalog:      document.getElementById('inp-katalog').value.trim(),
    boss:         document.getElementById('inp-boss').value.trim(),
    stok_masuk:   parseInt(document.getElementById('inp-masuk').value) || 0,
    stok_keluar:  parseInt(document.getElementById('inp-keluar').value) || 0,
    hpp:          parseInt(document.getElementById('inp-hpp').value) || 0,
  };
  if (!data.sku_variasi) { alert('SKU Variasi wajib diisi!'); return; }
  await dbInsert('stok', data);
  document.getElementById('form-tambah-stok').style.display = 'none';
  loadStok();
}

// Load otomatis saat halaman dibuka
loadStok();
