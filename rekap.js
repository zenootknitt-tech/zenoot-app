// ─── REKAP.JS — edit halaman ini untuk update rekap P&L ──────
document.getElementById('page-rekap').innerHTML = `
  <div class="metrics">
    <div class="metric"><div class="m-label">AOV Aktual</div><div class="m-value">Rp86rb</div><div class="m-delta">per order</div></div>
    <div class="metric"><div class="m-label">Basket Size</div><div class="m-value">1.13×</div><div class="m-delta">pcs per order</div></div>
    <div class="metric"><div class="m-label">ROAS Aktual</div><div class="m-value">8.38×</div><div class="m-delta">target 6.5×</div></div>
    <div class="metric"><div class="m-label">Rasio Margin</div><div class="m-value">59.2%</div><div class="m-delta">margin kotor</div></div>
  </div>
  <div class="card">
    <div class="card-title"><i class="ti ti-chart-bar"></i>Rekap Bulanan P&amp;L</div>
    <table class="tbl">
      <thead><tr><th>Item</th><th>Februari</th><th>Rasio Feb</th><th>Maret</th><th>Rasio Mar</th></tr></thead>
      <tbody>
        <tr class="rekap-row-head"><td>Total Pendapatan</td><td>Rp5.423.367</td><td>—</td><td>Rp11.654.672</td><td>—</td></tr>
        <tr class="rekap-row-head"><td>Total Penghasilan</td><td>Rp4.173.024</td><td>—</td><td>Rp8.908.588</td><td>—</td></tr>
        <tr class="rekap-row-head"><td>HPP</td><td>Rp2.120.000</td><td>—</td><td>Rp4.756.000</td><td>—</td></tr>
        <tr><td>Operasional</td><td>Rp3.500.000</td><td><span class="rasio-pill">64.5%</span></td><td>Rp4.000.000</td><td><span class="rasio-pill">34.3%</span></td></tr>
        <tr><td>Iklan</td><td>Rp1.110.000</td><td><span class="rasio-pill">20.5%</span></td><td>Rp1.390.424</td><td><span class="rasio-pill">11.9%</span></td></tr>
        <tr><td>Rasio Admin &amp; Layanan</td><td>-Rp1.250.343</td><td><span class="rasio-pill">23%</span></td><td>-Rp2.746.084</td><td><span class="rasio-pill">-24%</span></td></tr>
        <tr class="rekap-row-sub"><td>↳ Biaya Komisi AMS</td><td>-Rp181.051</td><td>3.3%</td><td>-Rp148.969</td><td>-1%</td></tr>
        <tr class="rekap-row-sub"><td>↳ Biaya Administrasi</td><td>-Rp447.430</td><td>8.3%</td><td>-Rp961.505</td><td>-8%</td></tr>
        <tr class="rekap-row-sub"><td>↳ Biaya Layanan</td><td>-Rp528.658</td><td>9.8%</td><td>-Rp1.325.325</td><td>-11%</td></tr>
        <tr class="rekap-row-sub"><td>↳ Biaya Proses Pesanan</td><td>-Rp58.750</td><td>1.1%</td><td>-Rp128.750</td><td>-1%</td></tr>
        <tr class="rekap-row-sub"><td>↳ Biaya Kampanye</td><td>-Rp34.454</td><td>0.6%</td><td>-Rp181.535</td><td>-2%</td></tr>
        <tr class="rekap-row-sub"><td>↳ Biaya Isi Saldo Otomatis</td><td>—</td><td>—</td><td>-Rp1.112.927</td><td>-10%</td></tr>
        <tr class="rekap-row-head" style="border-top:2px solid var(--ink)"><td>LABA / RUGI</td><td style="color:var(--danger)">-Rp2.556.976</td><td><span class="rasio-pill" style="border-color:var(--danger);color:var(--danger)">-47%</span></td><td style="color:var(--danger)">-Rp1.237.836</td><td><span class="rasio-pill" style="border-color:var(--danger);color:var(--danger)">-10.6%</span></td></tr>
      </tbody>
    </table>
  </div>
`;
