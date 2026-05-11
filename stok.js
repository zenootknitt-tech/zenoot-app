// ─── STOK.JS — edit halaman ini untuk update data stok ───────
document.getElementById('page-stok').innerHTML = `
  <div id="ops-switcher-stok" class="ch-switcher"></div>
  <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
    <button class="btn btn-sm" onclick="alert('Fitur tambah stok — hubungkan ke Supabase')"><i class="ti ti-plus"></i> Tambah SKU</button>
    <button class="btn btn-sm"><i class="ti ti-filter"></i> Filter Boss</button>
  </div>
  <div class="card">
    <div class="card-title"><i class="ti ti-package"></i>Semua SKU</div>
    <table class="tbl">
      <thead><tr><th>SKU Variasi</th><th>Katalog</th><th>Boss</th><th>Stok Masuk</th><th>Stok Keluar</th><th>Sisa</th><th>HPP</th><th>Nilai Stok</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td>MAYRA_MAUVE</td><td>MAYRA</td><td>H Solah</td><td>12</td><td>9</td><td><b>3</b></td><td>Rp—</td><td>—</td><td><span class="badge badge-crit">Kritis!</span></td></tr>
        <tr><td>MAYRA_MARUN</td><td>MAYRA</td><td>H Solah</td><td>12</td><td>2</td><td><b>10</b></td><td>Rp—</td><td>—</td><td><span class="badge badge-ok">Aman</span></td></tr>
        <tr><td>MAYRA_KHAKI</td><td>MAYRA</td><td>H Solah</td><td>12</td><td>6</td><td><b>6</b></td><td>Rp—</td><td>—</td><td><span class="badge badge-warn">Ati2</span></td></tr>
        <tr><td>LUNEA_MARUN</td><td>LUNEA</td><td>H Solah</td><td>12</td><td>11</td><td><b>1</b></td><td>Rp—</td><td>—</td><td><span class="badge badge-crit">Kritis!</span></td></tr>
        <tr><td>LAVINA_KREAM</td><td>LAVINA</td><td>G.CS</td><td>12</td><td>4</td><td><b>8</b></td><td>Rp—</td><td>—</td><td><span class="badge badge-warn">Ati2</span></td></tr>
        <tr><td>TN_HITAM-L</td><td>TURTLENECK</td><td>Alan</td><td>30</td><td>16</td><td><b>14</b></td><td>Rp41.000</td><td>Rp574.000</td><td><span class="badge badge-ok">Aman</span></td></tr>
        <tr><td>TN_HITAM-M</td><td>TURTLENECK</td><td>Alan</td><td>30</td><td>18</td><td><b>12</b></td><td>Rp41.000</td><td>Rp492.000</td><td><span class="badge badge-ok">Aman</span></td></tr>
        <tr><td>YUNA_SOFT-YELLOW</td><td>YUNA POLO</td><td>H Solah</td><td>12</td><td>12</td><td><b>0</b></td><td>Rp—</td><td>—</td><td><span class="badge badge-crit">Habis!</span></td></tr>
      </tbody>
    </table>
  </div>
`;
