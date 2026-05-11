// ─── KAS.JS — data diambil dari Supabase ─────────────────────

async function loadJurnal() {
  const tbody = document.getElementById('jurnal-tbody');
  tbody.innerHTML = '<tr><td colspan="5" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>';

  const data = await dbGet('jurnal');

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="color:var(--ink3);font-style:italic">Belum ada entri jurnal</td></tr>';
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
        <td>${row.debit ? 'Rp' + row.debit.toLocaleString('id-ID') : '—'}</td>
        <td>${row.kredit ? 'Rp' + row.kredit.toLocaleString('id-ID') : '—'}</td>
        <td style="color:${saldo >= 0 ? 'var(--ok)' : 'var(--danger)'}">${saldoFmt}</td>
      </tr>`;
  }).join('');
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
  <div id="ops-switcher-kas" class="ch-switcher"></div>
  <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap">
    <button class="btn btn-sm btn-primary" onclick="showTambahJurnal()"><i class="ti ti-plus"></i> Tambah Entri</button>
    <button class="btn btn-sm" onclick="loadJurnal()"><i class="ti ti-refresh"></i> Refresh</button>
  </div>
  <div class="metrics" style="grid-template-columns:repeat(3,1fr)">
    <div class="metric"><div class="m-label">Kas Masuk</div><div class="m-value" id="kas-masuk">—</div><div class="m-delta">total debit</div></div>
    <div class="metric"><div class="m-label">Kas Keluar</div><div class="m-value" id="kas-keluar">—</div><div class="m-delta">total kredit</div></div>
    <div class="metric"><div class="m-label">Saldo</div><div class="m-value" id="kas-saldo">—</div><div class="m-delta">saldo akhir</div></div>
  </div>

  <!-- FORM TAMBAH JURNAL -->
  <div id="form-tambah-jurnal" style="display:none;margin-bottom:12px">
    <div class="card">
      <div class="card-title"><i class="ti ti-plus"></i> Tambah Entri Jurnal</div>
      <div class="form-row">
        <div class="form-group"><label>Tanggal</label><input type="date" id="jrn-tgl"></div>
        <div class="form-group"><label>Keterangan</label><input type="text" id="jrn-ket" placeholder="mis: iklan shopee"></div>
        <div class="form-group"><label>Debit (masuk)</label><input type="number" id="jrn-debit" placeholder="0"></div>
        <div class="form-group"><label>Kredit (keluar)</label><input type="number" id="jrn-kredit" placeholder="0"></div>
        <div class="form-group" style="flex:0;justify-content:flex-end">
          <label>&nbsp;</label>
          <button class="btn btn-primary btn-sm" onclick="simpanJurnal()">Simpan</button>
          <button class="btn btn-sm" onclick="document.getElementById('form-tambah-jurnal').style.display='none'" style="margin-top:4px">Batal</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><i class="ti ti-list"></i>Jurnal Harian</div>
    <table class="tbl">
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Debit</th><th>Kredit</th><th>Saldo</th></tr></thead>
      <tbody id="jurnal-tbody">
        <tr><td colspan="5" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
      </tbody>
    </table>
  </div>
`;

function showTambahJurnal() {
  document.getElementById('form-tambah-jurnal').style.display = 'block';
  document.getElementById('jrn-tgl').value = new Date().toISOString().split('T')[0];
}

async function simpanJurnal() {
  const data = {
    tanggal:     document.getElementById('jrn-tgl').value,
    keterangan:  document.getElementById('jrn-ket').value.trim(),
    debit:       parseInt(document.getElementById('jrn-debit').value)  || 0,
    kredit:      parseInt(document.getElementById('jrn-kredit').value) || 0,
  };
  if (!data.tanggal) { alert('Tanggal wajib diisi!'); return; }
  await dbInsert('jurnal', data);
  document.getElementById('form-tambah-jurnal').style.display = 'none';
  loadJurnal();
}

loadJurnal();
