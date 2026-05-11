// ─── HPP.JS — data diambil dari Supabase ─────────────────────

async function loadHpp() {
  const tbody = document.getElementById('hpp-tbody');
  tbody.innerHTML = '<tr><td colspan="4" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>';

  const data = await dbGet('hpp');

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="color:var(--ink3);font-style:italic">Belum ada data HPP</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(row => `
    <tr>
      <td>${row.sku_induk}</td>
      <td>${row.nomor_referensi || '—'}</td>
      <td>${row.nama_variasi || '—'}</td>
      <td>Rp${(row.harga || 0).toLocaleString('id-ID')}</td>
    </tr>
  `).join('');
}

document.getElementById('page-hpp').innerHTML = `
  <div id="toko-switcher-hpp" class="ch-switcher"></div>
  <div style="display:flex;gap:10px;margin-bottom:12px">
    <button class="btn btn-sm btn-primary" onclick="showTambahHpp()"><i class="ti ti-plus"></i> Tambah Produk</button>
    <button class="btn btn-sm" onclick="loadHpp()"><i class="ti ti-refresh"></i> Refresh</button>
    <button class="btn btn-sm"><i class="ti ti-download"></i> Export</button>
  </div>

  <!-- FORM TAMBAH HPP -->
  <div id="form-tambah-hpp" style="display:none;margin-bottom:12px">
    <div class="card">
      <div class="card-title"><i class="ti ti-plus"></i> Tambah HPP Baru</div>
      <div class="form-row">
        <div class="form-group"><label>SKU Induk</label><input type="text" id="hpp-sku-induk" placeholder="mis: Turtleneck"></div>
        <div class="form-group"><label>Nomor Referensi</label><input type="text" id="hpp-ref" placeholder="mis: Turtleneck_HITAM-XL"></div>
        <div class="form-group"><label>Nama Variasi</label><input type="text" id="hpp-variasi" placeholder="mis: Hitam,XL"></div>
        <div class="form-group"><label>HPP (Rp)</label><input type="number" id="hpp-harga" placeholder="0"></div>
        <div class="form-group" style="flex:0;justify-content:flex-end">
          <label>&nbsp;</label>
          <button class="btn btn-primary btn-sm" onclick="simpanHpp()">Simpan</button>
          <button class="btn btn-sm" onclick="document.getElementById('form-tambah-hpp').style.display='none'" style="margin-top:4px">Batal</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><i class="ti ti-calculator"></i>Daftar HPP Produk</div>
    <table class="tbl">
      <thead><tr><th>SKU Induk</th><th>Nomor Referensi SKU</th><th>Nama Variasi</th><th>HPP</th></tr></thead>
      <tbody id="hpp-tbody">
        <tr><td colspan="4" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table>
  </div>
`;

function showTambahHpp() {
  document.getElementById('form-tambah-hpp').style.display = 'block';
}

async function simpanHpp() {
  const data = {
    sku_induk:        document.getElementById('hpp-sku-induk').value.trim(),
    nomor_referensi:  document.getElementById('hpp-ref').value.trim(),
    nama_variasi:     document.getElementById('hpp-variasi').value.trim(),
    harga:            parseInt(document.getElementById('hpp-harga').value) || 0,
  };
  if (!data.sku_induk) { alert('SKU Induk wajib diisi!'); return; }
  await dbInsert('hpp', data);
  document.getElementById('form-tambah-hpp').style.display = 'none';
  loadHpp();
}

loadHpp();
