// ─── STOK.JS — CRUD lengkap + export CSV ─────────────────────

function statusBadge(sisa) {
  if (sisa <= 0)  return '<span class="badge badge-crit">Habis!</span>';
  if (sisa <= 3)  return '<span class="badge badge-crit">Kritis!</span>';
  if (sisa <= 8)  return '<span class="badge badge-warn">Ati2</span>';
  return '<span class="badge badge-ok">Aman</span>';
}

async function loadStok() {
  const tbody = document.getElementById('stok-tbody');
  tbody.innerHTML = '<tr><td colspan="10" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>';

  try {
    const data = await dbGet('stok');
    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="color:var(--ink3);font-style:italic">Belum ada data stok</td></tr>';
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
          <td>
            <button class="btn btn-sm" onclick="editStok(${row.id})" style="margin-right:4px">✎</button>
            <button class="btn btn-sm btn-danger" onclick="hapusStok(${row.id},'${row.sku_variasi}')">✕</button>
          </td>
        </tr>`;
    }).join('');
  } catch(err) {
    tbody.innerHTML = `<tr><td colspan="10" style="color:var(--danger)">Error: ${err.message}</td></tr>`;
  }
}

document.getElementById('page-stok').innerHTML = `
  <div id="ops-switcher-stok" class="ch-switcher"></div>
  <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
    <button class="btn btn-sm btn-primary" onclick="showTambahStok()"><i class="ti ti-plus"></i> Tambah SKU</button>
    <button class="btn btn-sm" onclick="loadStok()"><i class="ti ti-refresh"></i> Refresh</button>
    <button class="btn btn-sm" onclick="exportStok()"><i class="ti ti-download"></i> Export CSV</button>
  </div>

  <!-- FORM TAMBAH/EDIT SKU -->
  <div id="form-tambah-stok" style="display:none;margin-bottom:12px">
    <div class="card">
      <div class="card-title" id="stok-form-title"><i class="ti ti-plus"></i> Tambah SKU Baru</div>
      <input type="hidden" id="inp-id">
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
          <button class="btn btn-sm" onclick="cancelStokForm()" style="margin-top:4px">Batal</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><i class="ti ti-package"></i>Semua SKU</div>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>SKU Variasi</th><th>Katalog</th><th>Boss</th><th>Masuk</th><th>Keluar</th><th>Sisa</th><th>HPP</th><th>Nilai Stok</th><th>Status</th><th>Aksi</th></tr></thead>
      <tbody id="stok-tbody">
        <tr><td colspan="10" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table></div>
  </div>
`;

function showTambahStok() {
  document.getElementById('stok-form-title').innerHTML = '<i class="ti ti-plus"></i> Tambah SKU Baru';
  document.getElementById('inp-id').value = '';
  document.getElementById('inp-sku').value = '';
  document.getElementById('inp-katalog').value = '';
  document.getElementById('inp-boss').value = '';
  document.getElementById('inp-masuk').value = '';
  document.getElementById('inp-keluar').value = '';
  document.getElementById('inp-hpp').value = '';
  document.getElementById('form-tambah-stok').style.display = 'block';
}

function cancelStokForm() {
  document.getElementById('form-tambah-stok').style.display = 'none';
}

async function editStok(id) {
  try {
    const data = await dbGet('stok', `&id=eq.${id}`);
    if (!data || !data[0]) return;
    const r = data[0];
    document.getElementById('stok-form-title').innerHTML = '<i class="ti ti-edit"></i> Edit SKU';
    document.getElementById('inp-id').value       = r.id;
    document.getElementById('inp-sku').value      = r.sku_variasi || '';
    document.getElementById('inp-katalog').value  = r.katalog || '';
    document.getElementById('inp-boss').value     = r.boss || '';
    document.getElementById('inp-masuk').value    = r.stok_masuk || 0;
    document.getElementById('inp-keluar').value   = r.stok_keluar || 0;
    document.getElementById('inp-hpp').value      = r.hpp || 0;
    document.getElementById('form-tambah-stok').style.display = 'block';
    document.getElementById('form-tambah-stok').scrollIntoView({behavior:'smooth'});
  } catch(err) { alert('Gagal load data: ' + err.message); }
}

async function simpanStok() {
  const id = document.getElementById('inp-id').value;
  const data = {
    sku_variasi:  document.getElementById('inp-sku').value.trim(),
    katalog:      document.getElementById('inp-katalog').value.trim(),
    boss:         document.getElementById('inp-boss').value.trim(),
    stok_masuk:   parseInt(document.getElementById('inp-masuk').value)  || 0,
    stok_keluar:  parseInt(document.getElementById('inp-keluar').value) || 0,
    hpp:          parseInt(document.getElementById('inp-hpp').value)    || 0,
  };
  if (!data.sku_variasi) { alert('SKU Variasi wajib diisi!'); return; }
  try {
    if (id) {
      await dbUpdate('stok', id, data);
    } else {
      await dbInsert('stok', data);
    }
    cancelStokForm();
    loadStok();
    loadDashboard();
  } catch(err) { alert('Gagal simpan: ' + err.message); }
}

async function hapusStok(id, sku) {
  confirmDelete(`Hapus SKU "${sku}"? Data tidak bisa dikembalikan.`, async () => {
    try {
      await dbDelete('stok', id);
      loadStok();
      loadDashboard();
    } catch(err) { alert('Gagal hapus: ' + err.message); }
  });
}

async function exportStok() {
  try {
    const data = await dbGet('stok');
    if (!data || data.length === 0) { alert('Belum ada data stok'); return; }
    const headers = ['SKU Variasi','Katalog','Boss','Stok Masuk','Stok Keluar','Sisa','HPP','Nilai Stok','Status'];
    const rows = data.map(r => {
      const sisa = (r.stok_masuk||0) - (r.stok_keluar||0);
      const status = sisa <= 0 ? 'Habis' : sisa <= 3 ? 'Kritis' : sisa <= 8 ? 'Ati2' : 'Aman';
      return [r.sku_variasi, r.katalog, r.boss, r.stok_masuk, r.stok_keluar, sisa, r.hpp, sisa*r.hpp, status];
    });
    exportCSV('zenoot-stok.csv', headers, rows);
  } catch(err) { alert('Gagal export: ' + err.message); }
}

loadStok();
