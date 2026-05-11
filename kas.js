// ─── KAS.JS — edit halaman ini untuk update kas & jurnal ─────
document.getElementById('page-kas').innerHTML = `
  <div id="ops-switcher-kas" class="ch-switcher"></div>
  <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap">
    <button class="btn btn-sm btn-primary" onclick="alert('Tambah jurnal — hubungkan ke Supabase')"><i class="ti ti-plus"></i> Tambah Entri</button>
  </div>
  <div class="metrics" style="grid-template-columns:repeat(3,1fr)">
    <div class="metric"><div class="m-label">Kas Masuk</div><div class="m-value">Rp 8,9jt</div><div class="m-delta">Mar 2026</div></div>
    <div class="metric"><div class="m-label">Kas Keluar</div><div class="m-value">Rp 10,1jt</div><div class="m-delta">operasional + iklan</div></div>
    <div class="metric"><div class="m-label">Saldo</div><div class="m-value" style="color:var(--danger)">-1,2jt</div><div class="m-delta">rugi bulan ini</div></div>
  </div>
  <div class="card">
    <div class="card-title"><i class="ti ti-list"></i>Jurnal Harian</div>
    <div class="form-row" style="margin-bottom:12px">
      <div class="form-group"><label>Tanggal</label><input type="date"></div>
      <div class="form-group"><label>Keterangan</label><input type="text" placeholder="mis: iklan shopee"></div>
      <div class="form-group"><label>Debit (masuk)</label><input type="number" placeholder="0"></div>
      <div class="form-group"><label>Kredit (keluar)</label><input type="number" placeholder="0"></div>
      <div class="form-group" style="flex:0"><label>&nbsp;</label><button class="btn btn-primary btn-sm">Simpan</button></div>
    </div>
    <table class="tbl">
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Debit</th><th>Kredit</th><th>Saldo</th></tr></thead>
      <tbody>
        <tr><td>10/05/26</td><td>Penghasilan Shopee Mar</td><td>Rp8.908.588</td><td>—</td><td>+8,9jt</td></tr>
        <tr><td>10/05/26</td><td>Operasional</td><td>—</td><td>Rp4.000.000</td><td>+4,9jt</td></tr>
        <tr><td>10/05/26</td><td>Iklan Shopee</td><td>—</td><td>Rp1.390.424</td><td>+3,5jt</td></tr>
        <tr><td>10/05/26</td><td>HPP (116 pcs)</td><td>—</td><td>Rp4.756.000</td><td>-1,2jt</td></tr>
      </tbody>
    </table>
  </div>
`;
