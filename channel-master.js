// ─── CHANNEL-MASTER.JS — Master Data Channel ─────────────────
// 3 kategori fixed: Toko Utama, Reseller, Offline
// Toko Utama = dipakai sebagai switcher di halaman Toko
// Reseller & Offline = input manual, halaman tersendiri nanti

document.getElementById('page-channel').innerHTML = `
  <div style="margin-bottom:14px;padding:10px 14px;background:var(--cream2);border:2px dashed var(--ink3);border-radius:4px;font-size:13px;color:var(--ink2);line-height:1.7">
    <b>Master Data Channel</b> — sumber data global untuk seluruh aplikasi.<br>
    <b>Shopee</b> akan muncul sebagai pilihan channel di halaman Toko (Data Order, Rekap).
  </div>

  <!-- TOKO UTAMA -->
  <div class="card" style="margin-bottom:14px">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span style="display:flex;align-items:center;gap:7px">
        <svg width="18" height="18" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;opacity:0.75">
          <path d="M19 2C10.163 2 3 9.163 3 18c0 6.077 3.32 11.373 8.25 14.22L10 36l4.5-2.25A16.9 16.9 0 0019 34c8.837 0 16-7.163 16-16S27.837 2 19 2z" fill="currentColor" opacity="0.15"/>
          <path d="M24.5 13.5c0-3.038-2.462-5.5-5.5-5.5S13.5 10.462 13.5 13.5H11L12.5 28h13L27 13.5h-2.5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
          <circle cx="16" cy="13.5" r="1.2" fill="currentColor"/>
          <circle cx="22" cy="13.5" r="1.2" fill="currentColor"/>
        </svg>
        Shopee
      </span>
      <button class="btn btn-sm btn-primary" onclick="showFormChannel('toko_utama')">
        <i class="ti ti-plus"></i> Tambah
      </button>
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
      <span style="display:inline-flex;align-items:center;gap:6px"><i class="ti ti-users" style="font-size:16px"></i> Reseller</span>
      <button class="btn btn-sm btn-primary" onclick="showFormChannel('reseller')">
        <i class="ti ti-plus"></i> Tambah
      </button>
    </div>
</div>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Nama Reseller</th><th>Keterangan</th><th>Aksi</th></tr></thead>
      <tbody id="ch-tbody-reseller">
        <tr><td colspan="3" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table></div>
  </div>

  <!-- LAZADA -->
  <div class="card" style="margin-bottom:14px">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span><i class="ti ti-shopping-bag"></i> Lazada</span>
      <button class="btn btn-sm btn-primary" onclick="showFormChannel('lazada')">
        <i class="ti ti-plus"></i> Tambah
      </button>
    </div>
</div>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Nama Toko Lazada</th><th>Keterangan</th><th>Aksi</th></tr></thead>
      <tbody id="ch-tbody-lazada">
        <tr><td colspan="3" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table></div>
  </div>

  <!-- TIKTOK -->
  <div class="card" style="margin-bottom:14px">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span style="display:inline-flex;align-items:center;gap:6px">
        <svg width="16" height="16" viewBox="0 0 40 40" fill="none" style="flex-shrink:0"><path d="M28 8c0 4 3.2 7.2 7.2 7.2v4.8c-2.7 0-5.2-.9-7.2-2.4v11.2c0 5.5-4.5 10-10 10S8 34.3 8 28.8s4.5-10 10-10c.5 0 1 0 1.5.1v5c-.5-.1-1-.1-1.5-.1-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5V8h5z" fill="currentColor"/></svg>
        TikTok</span>
      <button class="btn btn-sm btn-primary" onclick="showFormChannel('tiktok')">
        <i class="ti ti-plus"></i> Tambah
      </button>
    </div>
</div>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Nama Toko TikTok</th><th>Keterangan</th><th>Aksi</th></tr></thead>
      <tbody id="ch-tbody-tiktok">
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
    loadChannelByKategori('lazada'),
    loadChannelByKategori('tiktok'),
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
  hideModal('modal-channel');
}

async function simpanChannelModal() {
  var kat = document.getElementById('ch-edit-kat').value;
  simpanChannel(kat);
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

document.body.insertAdjacentHTML('beforeend', `<div class="modal-overlay" id="modal-channel" onclick="if(event.target===this)hideModal('modal-channel')">
  <div class="modal" style="max-width:440px;width:100%">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:10px;border-bottom:2px dashed var(--ink3)">
      <div class="modal-title" id="ch-modal-title" style="margin:0;border:none;padding:0;font-size:18px"><i class="ti ti-plus"></i> Tambah Channel</div>
      <button onclick="hideModal('modal-channel')" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--ink3);line-height:1;padding:4px 8px">&#10005;</button>
    </div>
    <input type="hidden" id="ch-edit-kat">
    <input type="hidden" id="ch-edit-id">
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">
      <div class="form-group" style="flex:1 1 180px">
        <label id="ch-modal-label">Nama Channel</label>
        <input type="text" id="ch-modal-nama" placeholder="mis: SHP.ZENOOT">
      </div>
      <div class="form-group" style="flex:1 1 180px">
        <label>Keterangan <span style="color:var(--ink3);font-weight:400">(opsional)</span></label>
        <input type="text" id="ch-modal-ket" placeholder="keterangan...">
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-primary btn-sm" onclick="simpanChannelModal()"><i class="ti ti-device-floppy"></i> Simpan</button>
      <button class="btn btn-sm" onclick="hideModal('modal-channel')"><i class="ti ti-x"></i> Batal</button>
    </div>
  </div>
</div>`);