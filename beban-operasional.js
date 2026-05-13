// ─── BEBAN-OPERASIONAL.JS ────────────────────────────────────
// Data acuan % beban & target NPM untuk Toko Utama & Reseller
// Tidak pakai channel switcher — 1 data untuk semua operasional

document.getElementById('page-beban-operasional').innerHTML = `
  <div style="margin-bottom:14px;padding:10px 14px;background:var(--cream2);border:2px dashed var(--ink3);border-radius:4px;font-size:13px;color:var(--ink2);line-height:1.7">
    <b>Cara pakai:</b> Isi komponen beban di sini dalam bentuk <b>% dari HPP</b>.<br>
    Data ini akan jadi <b>acuan otomatis</b> di halaman Price List untuk kalkulasi harga jual.
  </div>

  <!-- TOKO UTAMA -->
  <div class="card" style="margin-bottom:14px">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span><i class="ti ti-store"></i> Beban — Toko Utama</span>
      <button class="btn btn-sm btn-primary" onclick="showFormBeban('toko_utama')"><i class="ti ti-plus"></i> Tambah Baris</button>
    </div>

    <!-- FORM TOKO UTAMA -->
    <div id="form-beban-toko_utama" style="display:none;margin-bottom:12px">
      <div style="background:var(--cream2);border:2px solid var(--ink3);padding:10px;border-radius:4px">
        <input type="hidden" id="bo-id-toko_utama">
        <div class="form-row">
          <div class="form-group">
            <label>Nama Beban</label>
            <input type="text" id="bo-nama-toko_utama" placeholder="mis: Iklan, Packaging, Ongkir">
          </div>
          <div class="form-group">
            <label>Beban Operasional (%)</label>
            <input type="number" id="bo-persen-toko_utama" placeholder="0" step="0.1" min="0" max="100">
          </div>
          <div class="form-group">
            <label>Target NPM (%)</label>
            <input type="number" id="bo-npm-toko_utama" placeholder="0" step="0.1" min="0" max="100">
          </div>
          <div class="form-group" style="flex:0;justify-content:flex-end">
            <label>&nbsp;</label>
            <button class="btn btn-primary btn-sm" onclick="simpanBeban('toko_utama')">Simpan</button>
            <button class="btn btn-sm" onclick="cancelFormBeban('toko_utama')" style="margin-top:4px">Batal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="tbl-wrap"><table class="tbl">
      <thead>
        <tr>
          <th>Nama Beban</th>
          <th style="text-align:center">Beban Ops (%)</th>
          <th style="text-align:center">Target NPM (%)</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody id="bo-tbody-toko_utama">
        <tr><td colspan="4" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
      <tfoot id="bo-tfoot-toko_utama"></tfoot>
    </table></div>
  </div>

  <!-- RESELLER -->
  <div class="card">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span><i class="ti ti-users"></i> Beban — Reseller</span>
      <button class="btn btn-sm btn-primary" onclick="showFormBeban('reseller')"><i class="ti ti-plus"></i> Tambah Baris</button>
    </div>

    <!-- FORM RESELLER -->
    <div id="form-beban-reseller" style="display:none;margin-bottom:12px">
      <div style="background:var(--cream2);border:2px solid var(--ink3);padding:10px;border-radius:4px">
        <input type="hidden" id="bo-id-reseller">
        <div class="form-row">
          <div class="form-group">
            <label>Nama Beban</label>
            <input type="text" id="bo-nama-reseller" placeholder="mis: Komisi Reseller, Packaging">
          </div>
          <div class="form-group">
            <label>Beban Operasional (%)</label>
            <input type="number" id="bo-persen-reseller" placeholder="0" step="0.1" min="0" max="100">
          </div>
          <div class="form-group">
            <label>Target NPM (%)</label>
            <input type="number" id="bo-npm-reseller" placeholder="0" step="0.1" min="0" max="100">
          </div>
          <div class="form-group" style="flex:0;justify-content:flex-end">
            <label>&nbsp;</label>
            <button class="btn btn-primary btn-sm" onclick="simpanBeban('reseller')">Simpan</button>
            <button class="btn btn-sm" onclick="cancelFormBeban('reseller')" style="margin-top:4px">Batal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="tbl-wrap"><table class="tbl">
      <thead>
        <tr>
          <th>Nama Beban</th>
          <th style="text-align:center">Beban Ops (%)</th>
          <th style="text-align:center">Target NPM (%)</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody id="bo-tbody-reseller">
        <tr><td colspan="4" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
      <tfoot id="bo-tfoot-reseller"></tfoot>
    </table></div>
  </div>
`;

// render sketchy UI untuk halaman page-beban-operasional setelah innerHTML siap
setTimeout(() => { if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-beban-operasional')); }, 80);

// ─── LOAD DATA ───────────────────────────────────────────────
async function loadBebanOperasional() {
  await Promise.all([
    loadBebanByTipe('toko_utama'),
    loadBebanByTipe('reseller')
  ]);
}

async function loadBebanByTipe(tipe) {
  const tbody = document.getElementById('bo-tbody-' + tipe);
  const tfoot = document.getElementById('bo-tfoot-' + tipe);
  tbody.innerHTML = `<tr><td colspan="4" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>`;

  try {
    const data = await dbGet('beban_operasional', `&tipe=eq.${tipe}&order=created_at.asc`);

    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="color:var(--ink3);font-style:italic">Belum ada data beban</td></tr>`;
      tfoot.innerHTML = '';
      return;
    }

    tbody.innerHTML = data.map(row => {
      const safeNama = (row.nama_beban||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      return `<tr>
        <td>${row.nama_beban || '—'}</td>
        <td style="text-align:center;color:var(--danger);font-weight:600">${(row.beban_persen || 0).toFixed(1)}%</td>
        <td style="text-align:center;color:var(--ok);font-weight:600">${(row.npm_persen || 0).toFixed(1)}%</td>
        <td>
          <button class="btn btn-sm" data-action="edit-beban" data-id="${row.id}" data-tipe="${tipe}" style="margin-right:4px"><i class="ti ti-edit"></i></button>
          <button class="btn btn-sm btn-danger" data-action="hapus-beban" data-id="${row.id}" data-tipe="${tipe}" data-nama="${safeNama}"><i class="ti ti-trash"></i></button>
        </td>
      </tr>`;
    }).join('');

    // Total footer
    const totalBeban = data.reduce((s, r) => s + (r.beban_persen || 0), 0);
    const totalNpm   = data.reduce((s, r) => s + (r.npm_persen   || 0), 0);
    tfoot.innerHTML = `
      <tr style="border-top:2px solid var(--ink);font-weight:700">
        <td>TOTAL</td>
        <td style="text-align:center;color:var(--danger)">${totalBeban.toFixed(1)}%</td>
        <td style="text-align:center;color:var(--ok)">${totalNpm.toFixed(1)}%</td>
        <td></td>
      </tr>`;

  } catch(err) {
    tbody.innerHTML = `<tr><td colspan="4" style="color:var(--danger)">Error: ${err.message}</td></tr>`;
  }
}

// ─── FORM SHOW/HIDE ──────────────────────────────────────────
function showFormBeban(tipe) {
  document.getElementById('bo-id-' + tipe).value    = '';
  document.getElementById('bo-nama-' + tipe).value  = '';
  document.getElementById('bo-persen-' + tipe).value = '';
  document.getElementById('bo-npm-' + tipe).value   = '';
  document.getElementById('form-beban-' + tipe).style.display = 'block';
  sketchForm('form-beban-' + tipe);
  document.getElementById('form-beban-' + tipe).scrollIntoView({behavior:'smooth'});
}

function cancelFormBeban(tipe) {
  document.getElementById('form-beban-' + tipe).style.display = 'none';
}

// ─── EDIT ────────────────────────────────────────────────────
async function editBeban(id, tipe) {
  try {
    const data = await dbGet('beban_operasional', `&id=eq.${id}`);
    if (!data || !data[0]) return;
    const r = data[0];
    document.getElementById('bo-id-' + tipe).value     = r.id;
    document.getElementById('bo-nama-' + tipe).value   = r.nama_beban   || '';
    document.getElementById('bo-persen-' + tipe).value = r.beban_persen || '';
    document.getElementById('bo-npm-' + tipe).value    = r.npm_persen   || '';
    document.getElementById('form-beban-' + tipe).style.display = 'block';
  sketchForm('form-beban-' + tipe);
    document.getElementById('form-beban-' + tipe).scrollIntoView({behavior:'smooth'});
  } catch(err) { alert('Gagal load: ' + err.message); }
}

// ─── SIMPAN ──────────────────────────────────────────────────
async function simpanBeban(tipe) {
  const id = document.getElementById('bo-id-' + tipe).value;
  const data = {
    tipe:         tipe,
    nama_beban:   document.getElementById('bo-nama-' + tipe).value.trim(),
    beban_persen: parseFloat(document.getElementById('bo-persen-' + tipe).value) || 0,
    npm_persen:   parseFloat(document.getElementById('bo-npm-' + tipe).value)    || 0,
  };
  if (!data.nama_beban) { alert('Nama beban wajib diisi!'); return; }
  try {
    if (id) {
      await dbUpdate('beban_operasional', id, data);
    } else {
      await dbInsert('beban_operasional', data);
    }
    cancelFormBeban(tipe);
    loadBebanByTipe(tipe);
  } catch(err) { alert('Gagal simpan: ' + err.message); }
}

// ─── HAPUS ───────────────────────────────────────────────────
async function hapusBeban(id, nama, tipe) {
  confirmDelete(`Hapus beban "${nama}"?`, async () => {
    try {
      await dbDelete('beban_operasional', id);
      loadBebanByTipe(tipe);
    } catch(err) { alert('Gagal hapus: ' + err.message); }
  });
}

// ─── EVENT DELEGATION ────────────────────────────────────────
document.getElementById('page-beban-operasional').addEventListener('click', function(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const id     = btn.dataset.id;
  const tipe   = btn.dataset.tipe;
  if (action === 'edit-beban') {
    editBeban(id, tipe);
  } else if (action === 'hapus-beban') {
    hapusBeban(id, btn.dataset.nama, tipe);
  }
});

// ─── INIT ────────────────────────────────────────────────────
loadBebanOperasional();
