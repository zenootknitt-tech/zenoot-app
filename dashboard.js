// ─── DASHBOARD.JS — edit halaman ini untuk update dashboard ──
document.getElementById('page-dashboard').innerHTML = `
  <div class="alert"><i class="ti ti-alert-triangle"></i>2 SKU kritis! MAYRA_MAUVE &amp; LUNEA_MARUN — restock segera!</div>
  <div id="ops-switcher-dashboard" class="ch-switcher"></div>
  <div class="metrics">
    <div class="metric"><div class="m-label">Total Order</div><div class="m-value">264</div><div class="m-delta">↑ pesanan selesai</div><div class="doodle" style="bottom:6px;right:8px">🛒</div></div>
    <div class="metric"><div class="m-label">Penghasilan</div><div class="m-value">Rp 8,9jt</div><div class="m-delta">setelah potongan</div><div class="doodle" style="bottom:6px;right:8px">💰</div></div>
    <div class="metric"><div class="m-label">ROAS</div><div class="m-value">8.38×</div><div class="m-delta">target 6.5×</div><div class="doodle" style="bottom:6px;right:8px">📈</div></div>
    <div class="metric"><div class="m-label">SKU Kritis</div><div class="m-value">2 sku!</div><div class="m-delta">perlu restock</div><div class="doodle" style="bottom:6px;right:8px">⚠️</div></div>
  </div>
  <div class="grid2">
    <div class="card card-lined">
      <div class="card-title"><i class="ti ti-chart-bar"></i>Top SKU Terjual</div>
      <div class="bar-row"><div class="bar-label">Hitam-L</div><div class="bar-track"><div class="bar-fill" style="width:88%"></div></div><div class="bar-pct">88</div></div>
      <div class="bar-row"><div class="bar-label">Marun-XL</div><div class="bar-track"><div class="bar-fill" style="width:72%"></div></div><div class="bar-pct">72</div></div>
      <div class="bar-row"><div class="bar-label">Hitam-M</div><div class="bar-track"><div class="bar-fill" style="width:65%"></div></div><div class="bar-pct">65</div></div>
      <div class="bar-row"><div class="bar-label">Nevi-L</div><div class="bar-track"><div class="bar-fill" style="width:54%"></div></div><div class="bar-pct">54</div></div>
      <div class="bar-row"><div class="bar-label">Abu Tua-M</div><div class="bar-track"><div class="bar-fill" style="width:41%"></div></div><div class="bar-pct">41</div></div>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-package"></i>Status Stok</div>
      <table class="tbl">
        <thead><tr><th>SKU</th><th>Boss</th><th>Sisa</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>MAYRA_MAUVE</td><td>H Solah</td><td><b>3</b></td><td><span class="badge badge-crit">Kritis!</span></td></tr>
          <tr><td>LUNEA_MARUN</td><td>H Solah</td><td><b>1</b></td><td><span class="badge badge-crit">Kritis!</span></td></tr>
          <tr><td>LAVINA_KREAM</td><td>G.CS</td><td><b>8</b></td><td><span class="badge badge-warn">Ati2</span></td></tr>
          <tr><td>TN_HITAM-L</td><td>Alan</td><td><b>14</b></td><td><span class="badge badge-ok">Aman</span></td></tr>
          <tr><td>MAYRA_MARUN</td><td>H Solah</td><td><b>10</b></td><td><span class="badge badge-ok">Aman</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
`;
