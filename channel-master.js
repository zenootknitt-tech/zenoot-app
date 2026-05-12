// ─── CHANNEL-MASTER.JS — Master Data Channel ─────────────────
// 3 kategori fixed: Toko Utama, Reseller, Offline
// Toko Utama = dipakai sebagai switcher di halaman Toko
// Reseller & Offline = input manual, halaman tersendiri nanti

document.getElementById('page-channel').innerHTML = `
  <div style="margin-bottom:14px;padding:10px 14px;background:var(--cream2);border:2px dashed var(--ink3);border-radius:4px;font-size:13px;color:var(--ink2);line-height:1.7">
    <b>Master Data Channel</b> — sumber data global untuk seluruh aplikasi.<br>
    <b>Toko Utama</b> akan muncul sebagai pilihan channel di halaman Toko (Data Order, Rekap).
  </div>

  <!-- TOKO UTAMA -->
  <div class="card" style="margin-bottom:14px">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span><i class="ti ti-store"></i> Toko Utama</span>
      <button class="btn btn-sm btn-primary" onclick="showFormChannel('toko_utama')">
        <i class="ti ti-plus"></i> Tambah
      </button>
    </div>
    <div id="form-channel-toko_utama" style="display:none;margin-bottom:10px">
      <div style="background:var(--cream2);border:2px solid var(--ink3);padding:10px;border-radius:4px">
        <input type="hidden" id="ch-id-toko_utama">
        <div class="form-row">
          <div class="form-group">
            <label>Nama Channel</label>
            <input type="text" id="ch-nama-toko_utama" placeholder="mis: SHP.Zenoot, TKP.Alley">
          </div>
          <div class="form-group">
            <label>Keterangan</label>
            <input type="text" id="ch-ket-toko_utama" placeholder="opsional">
          </div>
          <div class="form-group" style="flex:0;justify-content:flex-end">
            <label>&nbsp;</label>
            <button class="btn btn-primary btn-sm" onclick="simpanChannel('toko_utama')">Simpan</button>
            <button class="btn btn-sm" onclick="cancelFormChannel('toko_utama')" style="margin-top:4px">Batal</button>
          </div>
        </div>
      </div>
    </div>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Nama Channel</th><th>Keterangan</th><th>Aksi</th></tr></thead>
      <tbody id="ch-tbody-toko_utama">
        <tr><td colspan="3" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table></div>
  </div>

  <!-- RESELLER -->
  <div class="card" style="margin-bottom:14px">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span><i class="ti ti-users"></i> Reseller</span>
      <button class="btn btn-sm btn-primary" onclick="showFormChannel('reseller')">
        <i class="ti ti-plus"></i> Tambah
      </button>
    </div>
    <div id="form-channel-reseller" style="display:none;margin-bottom:10px">
      <div style="background:var(--cream2);border:2px solid var(--ink3);padding:10px;border-radius:4px">
        <input type="hidden" id="ch-id-reseller">
        <div class="form-row">
          <div class="form-group">
            <label>Nama Reseller</label>
            <input type="text" id="ch-nama-reseller" placeholder="mis: Agen A, Mitra B">
          </div>
          <div class="form-group">
            <label>Keterangan</label>
            <input type="text" id="ch-ket-reseller" placeholder="opsional">
          </div>
          <div class="form-group" style="flex:0;justify-content:flex-end">
            <label>&nbsp;</label>
            <button class="btn btn-primary btn-sm" onclick="simpanChannel('reseller')">Simpan</button>
            <button class="btn btn-sm" onclick="cancelFormChannel('reseller')" style="margin-top:4px">Batal</button>
          </div>
        </div>
      </div>
    </div>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Nama Reseller</th><th>Keterangan</th><th>Aksi</th></tr></thead>
      <tbody id="ch-tbody-reseller">
        <tr><td colspan="3" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table></div>
  </div>

  <!-- OFFLINE -->
  <div class="card">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span><i class="ti ti-map-pin"></i> Offline</span>
      <button class="btn btn-sm btn-primary" onclick="showFormChannel('offline')">
        <i class="ti ti-plus"></i> Tambah
      </button>
    </div>
    <div id="form-channel-offline" style="display:none;margin-bottom:10px">
      <div style="background:var(--cream2);border:2px solid var(--ink3);padding:10px;border-radius:4px">
        <input type="hidden" id="ch-id-offline">
        <div class="form-row">
          <div class="form-group">
            <label>Nama Channel Offline</label>
            <input type="text" id="ch-nama-offline" placeholder="mis: Bazaar JKT, Pop-up BDG">
          </div>
          <div class="form-group">
            <label>Keterangan</label>
            <input type="text" id="ch-ket-offline" placeholder="opsional">
          </div>
          <div class="form-group" style="flex:0;justify-content:flex-end">
            <label>&nbsp;</label>
            <button class="btn btn-primary btn-sm" onclick="simpanChannel('offline')">Simpan</button>
            <button class="btn btn-sm" onclick="cancelFormChannel('offline')" style="margin-top:4px">Batal</button>
          </div>
        </div>
      </div>
    </div>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Nama Channel</th><th>Keterangan</th><th>Aksi</th></tr></thead>
      <tbody id="ch-tbody-offline">
        <tr><td colspan="3" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table></div>
  </div>
`;

// render sketchy UI untuk halaman page-channel setelah innerHTML siap
setTimeout(() => { if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-channel')); }, 80);

// ─── LOAD SEMUA ──────────────────────────────────────────────
async function loadChannelMaster() {
  await Promise.all([
    loadChannelByKategori('toko_utama'),
    loadChannelByKategori('reseller'),
    loadChannelByKategori('offline'),
  ]);
}

async function loadChannelByKategori(kat) {
  const tbody = document.getElementById('ch-tbody-' + kat);
  tbody.innerHTML = `<tr><td colspan="3" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>`;
  try {
    const data = await dbGet('channels', `&kategori=eq.${kat}&order=nama.asc`);
    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" style="color:var(--ink3);font-style:italic">Belum ada data</td></tr>`;
      return;
    }
    tbody.innerHTML = data.map(row => {
      const safeNama = (row.nama||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      return `<tr>
        <td style="font-weight:600">${row.nama || '—'}</td>
        <td style="color:var(--ink3);font-size:13px">${row.keterangan || '—'}</td>
        <td>
          <button class="btn btn-sm" data-action="edit-ch" data-id="${row.id}" data-kat="${kat}" style="margin-right:4px"><i class="ti ti-edit"></i></button>
          <button class="btn btn-sm btn-danger" data-action="hapus-ch" data-id="${row.id}" data-kat="${kat}" data-nama="${safeNama}"><i class="ti ti-trash"></i></button>
        </td>
      </tr>`;
    }).join('');
    // Refresh dropdown JP kalau sudah diload
    if (typeof loadChannelDropdownJP === 'function') loadChannelDropdownJP();
  } catch(err) {
    tbody.innerHTML = `<tr><td colspan="3" style="color:var(--danger)">Error: ${err.message}</td></tr>`;
  }
}

// ─── FORM ────────────────────────────────────────────────────
function showFormChannel(kat) {
  document.getElementById('ch-id-' + kat).value   = '';
  document.getElementById('ch-nama-' + kat).value = '';
  document.getElementById('ch-ket-' + kat).value  = '';
  document.getElementById('form-channel-' + kat).style.display = 'block';
  sketchForm('form-channel-' + kat);
  document.getElementById('form-channel-' + kat).scrollIntoView({behavior:'smooth'});
}

function cancelFormChannel(kat) {
  document.getElementById('form-channel-' + kat).style.display = 'none';
}

// ─── EDIT ────────────────────────────────────────────────────
async function editChannel(id, kat) {
  try {
    const data = await dbGet('channels', `&id=eq.${id}`);
    if (!data || !data[0]) return;
    const r = data[0];
    document.getElementById('ch-id-' + kat).value   = r.id;
    document.getElementById('ch-nama-' + kat).value = r.nama       || '';
    document.getElementById('ch-ket-' + kat).value  = r.keterangan || '';
    document.getElementById('form-channel-' + kat).style.display = 'block';
  sketchForm('form-channel-' + kat);
    document.getElementById('form-channel-' + kat).scrollIntoView({behavior:'smooth'});
  } catch(err) { alert('Gagal load: ' + err.message); }
}

// ─── SIMPAN ──────────────────────────────────────────────────
async function simpanChannel(kat) {
  const id = document.getElementById('ch-id-' + kat).value;
  const data = {
    tipe:        null,
    kategori:    kat,
    nama:        document.getElementById('ch-nama-' + kat).value.trim(),
    keterangan:  document.getElementById('ch-ket-' + kat).value.trim(),
  };
  if (!data.nama) { alert('Nama channel wajib diisi!'); return; }
  try {
    if (id) {
      await dbUpdate('channels', id, data);
    } else {
      await dbInsert('channels', data);
    }
    cancelFormChannel(kat);
    loadChannelByKategori(kat);
  } catch(err) { alert('Gagal simpan: ' + err.message); }
}

// ─── HAPUS ───────────────────────────────────────────────────
async function hapusChannel(id, nama, kat) {
  confirmDelete(`Hapus channel "${nama}"?`, async () => {
    try {
      await dbDelete('channels', id);
      loadChannelByKategori(kat);
    } catch(err) { alert('Gagal hapus: ' + err.message); }
  });
}

// ─── EVENT DELEGATION untuk tombol edit/hapus di tabel channel ─
document.getElementById('page-channel').addEventListener('click', function(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const id     = btn.dataset.id;   // UUID string, jangan parseInt
  const kat    = btn.dataset.kat;
  if (action === 'edit-ch') {
    editChannel(id, kat);
  } else if (action === 'hapus-ch') {
    const nama = btn.dataset.nama;
    hapusChannel(id, nama, kat);
  }
});

// ─── INIT ────────────────────────────────────────────────────
loadChannelMaster();
