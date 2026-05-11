// ─── DASHBOARD.JS — live data dari Supabase ─────────────────

document.getElementById('page-dashboard').innerHTML = `
  <div class="alert" id="dash-alert" style="display:none"><i class="ti ti-alert-triangle"></i><span id="dash-alert-msg"></span></div>
  <div id="ops-switcher-dashboard" class="ch-switcher"></div>
  <div class="metrics" id="dash-metrics">
    <div class="metric"><div class="m-label">Total SKU Aktif</div><div class="m-value" id="d-sku">—</div><div class="m-delta">produk terdaftar</div><div class="doodle" style="bottom:6px;right:8px">📦</div></div>
    <div class="metric"><div class="m-label">Nilai Stok</div><div class="m-value" id="d-nilaiStok">—</div><div class="m-delta">HPP × sisa stok</div><div class="doodle" style="bottom:6px;right:8px">💰</div></div>
    <div class="metric"><div class="m-label">SKU Kritis</div><div class="m-value" id="d-kritis">—</div><div class="m-delta">stok ≤ 3</div><div class="doodle" style="bottom:6px;right:8px">⚠️</div></div>
    <div class="metric"><div class="m-label">Saldo Kas</div><div class="m-value" id="d-saldo">—</div><div class="m-delta">dari jurnal</div><div class="doodle" style="bottom:6px;right:8px">🧾</div></div>
  </div>
  <div class="grid2">
    <div class="card card-lined">
      <div class="card-title"><i class="ti ti-package"></i>Status Stok</div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>SKU</th><th>Boss</th><th>Sisa</th><th>Status</th></tr></thead>
        <tbody id="dash-stok-tbody"><tr><td colspan="4" style="color:var(--ink3);font-style:italic">Memuat...</td></tr></tbody>
      </table></div>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-list"></i>Jurnal Terakhir</div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Tgl</th><th>Keterangan</th><th>Debit</th><th>Kredit</th></tr></thead>
        <tbody id="dash-jurnal-tbody"><tr><td colspan="4" style="color:var(--ink3);font-style:italic">Memuat...</td></tr></tbody>
      </table></div>
    </div>
  </div>
  <div style="text-align:right;margin-top:4px">
    <button class="btn btn-sm" onclick="loadDashboard()"><i class="ti ti-refresh"></i> Refresh</button>
  </div>
`;

function statusBadgeDash(sisa) {
  if (sisa <= 0)  return '<span class="badge badge-crit">Habis!</span>';
  if (sisa <= 3)  return '<span class="badge badge-crit">Kritis!</span>';
  if (sisa <= 8)  return '<span class="badge badge-warn">Ati2</span>';
  return '<span class="badge badge-ok">Aman</span>';
}

async function loadDashboard() {
  try {
    const [stokData, jurnalData] = await Promise.all([
      dbGet('stok'),
      dbGet('jurnal', '&limit=5&order=created_at.desc')
    ]);

    // ─ Metrics
    const skuAktif  = stokData.length;
    const kritis    = stokData.filter(r => ((r.stok_masuk||0)-(r.stok_keluar||0)) <= 3).length;
    const nilaiStok = stokData.reduce((s,r) => {
      const sisa = (r.stok_masuk||0) - (r.stok_keluar||0);
      return s + (sisa > 0 && r.hpp ? sisa * r.hpp : 0);
    }, 0);
    const saldo = jurnalData.reduce((s,r) => s + (r.debit||0) - (r.kredit||0), 0);

    document.getElementById('d-sku').textContent       = skuAktif;
    document.getElementById('d-kritis').textContent    = kritis + ' sku' + (kritis > 0 ? '!' : '');
    document.getElementById('d-kritis').style.color    = kritis > 0 ? 'var(--danger)' : 'var(--ok)';
    document.getElementById('d-nilaiStok').textContent = nilaiStok > 0 ? 'Rp' + (nilaiStok/1000000).toFixed(1) + 'jt' : 'Rp0';
    document.getElementById('d-saldo').textContent     = (saldo >= 0 ? '+' : '') + 'Rp' + Math.abs(saldo).toLocaleString('id-ID');
    document.getElementById('d-saldo').style.color     = saldo >= 0 ? 'var(--ok)' : 'var(--danger)';

    // ─ Alert kritis
    if (kritis > 0) {
      const names = stokData
        .filter(r => ((r.stok_masuk||0)-(r.stok_keluar||0)) <= 3)
        .map(r => r.sku_variasi).join(', ');
      document.getElementById('dash-alert-msg').textContent = kritis + ' SKU kritis: ' + names + ' — restock segera!';
      document.getElementById('dash-alert').style.display = 'flex';
    } else {
      document.getElementById('dash-alert').style.display = 'none';
    }

    // ─ Tabel stok (semua, sort by sisa asc)
    const sorted = [...stokData].sort((a,b) => {
      const sa = (a.stok_masuk||0)-(a.stok_keluar||0);
      const sb = (b.stok_masuk||0)-(b.stok_keluar||0);
      return sa - sb;
    });
    document.getElementById('dash-stok-tbody').innerHTML = sorted.length === 0
      ? '<tr><td colspan="4" style="color:var(--ink3);font-style:italic">Belum ada data stok</td></tr>'
      : sorted.map(r => {
          const sisa = (r.stok_masuk||0) - (r.stok_keluar||0);
          return `<tr><td>${r.sku_variasi}</td><td>${r.boss||'—'}</td><td><b>${sisa}</b></td><td>${statusBadgeDash(sisa)}</td></tr>`;
        }).join('');

    // ─ Tabel jurnal terakhir
    const recent = [...jurnalData].reverse().slice(0,5);
    document.getElementById('dash-jurnal-tbody').innerHTML = recent.length === 0
      ? '<tr><td colspan="4" style="color:var(--ink3);font-style:italic">Belum ada jurnal</td></tr>'
      : recent.map(r => {
          const tgl = new Date(r.tanggal).toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit'});
          return `<tr>
            <td>${tgl}</td>
            <td>${r.keterangan||'—'}</td>
            <td style="color:var(--ok)">${r.debit ? 'Rp'+r.debit.toLocaleString('id-ID') : '—'}</td>
            <td style="color:var(--danger)">${r.kredit ? 'Rp'+r.kredit.toLocaleString('id-ID') : '—'}</td>
          </tr>`;
        }).join('');

  } catch(err) {
    document.getElementById('dash-alert-msg').textContent = 'Gagal memuat data: ' + err.message + '. Periksa koneksi.';
    document.getElementById('dash-alert').style.display = 'flex';
  }
}

loadDashboard();
