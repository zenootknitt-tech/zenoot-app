// ─── KAS.JS — CRUD lengkap + export CSV ──────────────────────

async function loadJurnal() {
  const tbody = document.getElementById('jurnal-tbody');
  tbody.innerHTML = '<tr><td colspan="6" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>';

  try {
    const data = await dbGet('jurnal');
    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="color:var(--ink3);font-style:italic">Belum ada entri jurnal</td></tr>';
      updateSummary([]);
      return;
    }
    updateSummary(data);
    let saldo = 0;
    tbody.innerHTML = data.map(row => {
      saldo += (row.debit || 0) - (row.kredit || 0);
      const tgl = new Date(row.tanggal).toLocaleDateString('id-ID', {day:'2-digit',month:'2-digit',year:'2-digit'});
      const saldoFmt = saldo >= 0
        ? `+Rp${saldo.toLocaleString('id-ID')}`
        : `-Rp${Math.abs(saldo).toLocaleString('id-ID')}`;
      return `
        <tr>
          <td>${tgl}</td>
          <td>${row.keterangan || '—'}</td>
          <td style="color:var(--ok)">${row.debit  ? 'Rp' + row.debit.toLocaleString('id-ID')  : '—'}</td>
          <td style="color:var(--danger)">${row.kredit ? 'Rp' + row.kredit.toLocaleString('id-ID') : '—'}</td>
          <td style="color:${saldo >= 0 ? 'var(--ok)' : 'var(--danger)'}">${saldoFmt}</td>
          <td>
            <button class="btn btn-sm" data-action="edit-kas" data-id="${row.id}" style="margin-right:4px"><i class="ti ti-edit"></i></button>
            <button class="btn btn-sm btn-danger" data-action="hapus-kas" data-id="${row.id}" data-ket="${(row.keterangan||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"><i class="ti ti-trash"></i></button>
          </td>
        \`;
    }).join('');
  } catch(err) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:var(--danger)">Error: ${err.message}</td></tr>`;
  }
}

function updateSummary(data) {
  const masuk  = data.reduce((s, r) => s + (r.debit  || 0), 0);
  const keluar = data.reduce((s, r) => s + (r.kredit || 0), 0);
  const saldo  = masuk - keluar;
  document.getElementById('kas-masuk').textContent  = 'Rp' + masuk.toLocaleString('id-ID');
  document.getElementById('kas-keluar').textContent = 'Rp' + keluar.toLocaleString('id-ID');
  document.getElementById('kas-saldo').textContent  = (saldo >= 0 ? '+' : '') + 'Rp' + saldo.toLocaleString('id-ID');
  document.getElementById('kas-saldo').style.color  = saldo >= 0 ? 'var(--ok)' : 'var(--danger)';
}

document.getElementById('page-kas').innerHTML = `
  <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap">
    <button class="btn btn-sm btn-primary" onclick="showTambahJurnal()"><i class="ti ti-plus"></i> Tambah Entri</button>
    <button class="btn btn-sm" onclick="loadJurnal()"><i class="ti ti-refresh"></i> Refresh</button>
    <button class="btn btn-sm" onclick="exportJurnal()"><i class="ti ti-download"></i> Export CSV</button>
  </div>
  <div class="metrics" style="grid-template-columns:repeat(3,1fr)">
    <div class="metric"><div class="m-label">Kas Masuk</div><div class="m-value" id="kas-masuk">—</div><div class="m-delta">total debit</div></div>
    <div class="metric"><div class="m-label">Kas Keluar</div><div class="m-value" id="kas-keluar">—</div><div class="m-delta">total kredit</div></div>
    <div class="metric"><div class="m-label">Saldo</div><div class="m-value" id="kas-saldo">—</div><div class="m-delta">saldo akhir</div></div>
  </div>

  <!-- FORM TAMBAH/EDIT JURNAL -->
  <div id="form-tambah-jurnal" style="display:none;margin-bottom:12px">
    <div class="card">
      <div class="card-title" id="kas-form-title"><i class="ti ti-plus"></i> Tambah Entri Jurnal</div>
      <input type="hidden" id="jrn-id">
      <div class="form-row">
        <div class="form-group"><label>Tanggal</label><input type="date" id="jrn-tgl"></div>
        <div class="form-group"><label>Keterangan</label><input type="text" id="jrn-ket" placeholder="mis: iklan shopee"></div>
        <div class="form-group"><label>Debit (masuk)</label><input type="number" id="jrn-debit" placeholder="0"></div>
        <div class="form-group"><label>Kredit (keluar)</label><input type="number" id="jrn-kredit" placeholder="0"></div>
        <div class="form-group" style="flex:0;justify-content:flex-end">
          <label>&nbsp;</label>
          <button class="btn btn-primary btn-sm" onclick="simpanJurnal()">Simpan</button>
          <button class="btn btn-sm" onclick="cancelJurnalForm()" style="margin-top:4px">Batal</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><i class="ti ti-list"></i>Jurnal Harian</div>
    <div class="tbl-wrap" style="max-height:65vh;overflow-y:auto;overflow-x:auto"><table class="tbl">
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Debit</th><th>Kredit</th><th>Saldo</th><th>Aksi</th></tr></thead>
      <tbody id="jurnal-tbody">
        <tr><td colspan="6" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table></div>
  </div>
`;

// render sketchy UI untuk halaman kas setelah innerHTML siap
setTimeout(() => { if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-kas')); }, 80);

function showTambahJurnal() {
  document.getElementById('kas-form-title').innerHTML = '<i class="ti ti-plus"></i> Tambah Entri Jurnal';
  document.getElementById('jrn-id').value = '';
  document.getElementById('jrn-tgl').value = new Date().toISOString().split('T')[0];
  document.getElementById('jrn-ket').value = '';
  document.getElementById('jrn-debit').value = '';
  document.getElementById('jrn-kredit').value = '';
  document.getElementById('form-tambah-jurnal').style.display = 'block';
  sketchForm('form-tambah-jurnal');
}

function cancelJurnalForm() {
  document.getElementById('form-tambah-jurnal').style.display = 'none';
}

async function editJurnal(id) {
  try {
    const data = await dbGet('jurnal', `&id=eq.${id}`);
    if (!data || !data[0]) return;
    const r = data[0];
    document.getElementById('kas-form-title').innerHTML = '<i class="ti ti-edit"></i> Edit Entri';
    document.getElementById('jrn-id').value     = r.id;
    document.getElementById('jrn-tgl').value    = r.tanggal ? r.tanggal.split('T')[0] : '';
    document.getElementById('jrn-ket').value    = r.keterangan || '';
    document.getElementById('jrn-debit').value  = r.debit || 0;
    document.getElementById('jrn-kredit').value = r.kredit || 0;
    document.getElementById('form-tambah-jurnal').style.display = 'block';
    document.getElementById('form-tambah-jurnal').scrollIntoView({behavior:'smooth'});
  } catch(err) { alert('Gagal load: ' + err.message); }
}

async function simpanJurnal() {
  const id = document.getElementById('jrn-id').value;
  const data = {
    tanggal:    document.getElementById('jrn-tgl').value,
    keterangan: document.getElementById('jrn-ket').value.trim(),
    debit:      parseInt(document.getElementById('jrn-debit').value)  || 0,
    kredit:     parseInt(document.getElementById('jrn-kredit').value) || 0,
  };
  if (!data.tanggal) { alert('Tanggal wajib diisi!'); return; }
  try {
    if (id) {
      await dbUpdate('jurnal', id, data);
    } else {
      await dbInsert('jurnal', data);
    }
    cancelJurnalForm();
    loadJurnal();
    loadDashboard();
  } catch(err) { alert('Gagal simpan: ' + err.message); }
}

async function hapusJurnal(id, ket) {
  confirmDelete(`Hapus entri "${ket}"?`, async () => {
    try {
      await dbDelete('jurnal', id);
      loadJurnal();
      loadDashboard();
    } catch(err) { alert('Gagal hapus: ' + err.message); }
  });
}

async function exportJurnal() {
  try {
    const data = await dbGet('jurnal');
    if (!data || data.length === 0) { alert('Belum ada data jurnal'); return; }
    const headers = ['Tanggal','Keterangan','Debit','Kredit'];
    const rows = data.map(r => [r.tanggal, r.keterangan, r.debit||0, r.kredit||0]);
    exportCSV('zenoot-jurnal.csv', headers, rows);
  } catch(err) { alert('Gagal export: ' + err.message); }
}

// ─── EVENT DELEGATION ────────────────────────────────────────
document.getElementById('page-kas').addEventListener('click', function(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === 'edit-kas') {
    editJurnal(parseInt(id));
  } else if (btn.dataset.action === 'hapus-kas') {
    hapusJurnal(parseInt(id), btn.dataset.ket);
  }
});

loadJurnal();
