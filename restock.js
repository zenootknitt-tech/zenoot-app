// ─── RESTOCK.JS — edit halaman ini untuk update data restock ─
document.getElementById('page-restock').innerHTML = `
  <div id="ops-switcher-restock" class="ch-switcher"></div>
  <div class="grid2">
    <div class="card">
      <div class="card-title"><i class="ti ti-user"></i>H Solah — Restock</div>
      <table class="tbl">
        <thead><tr><th>Katalog</th><th>Variant</th><th>Qty</th><th>Nilai</th></tr></thead>
        <tbody>
          <tr><td>MAYRA</td><td>MAYRA_MAUVE</td><td>12</td><td>—</td></tr>
          <tr><td>MAYRA</td><td>MAYRA_MARUN</td><td>12</td><td>—</td></tr>
          <tr><td>MAYRA</td><td>MAYRA_KHAKI</td><td>12</td><td>—</td></tr>
          <tr><td>LUNEA</td><td>LUNEA_MARUN</td><td>12</td><td>—</td></tr>
          <tr><td>YUNA POLO</td><td>YUNA_SOFT-YELLOW</td><td>12</td><td>—</td></tr>
          <tr><td>YUNA POLO</td><td>YUNA_HITAM</td><td>12</td><td>—</td></tr>
          <tr style="font-weight:700"><td colspan="2">Total</td><td>72</td><td>—</td></tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-user"></i>G.CS — Restock</div>
      <table class="tbl">
        <thead><tr><th>Katalog</th><th>Variant</th><th>Qty</th><th>Nilai</th></tr></thead>
        <tbody>
          <tr><td>LAVINA</td><td>LAVINA_KREAM</td><td>6</td><td>—</td></tr>
          <tr><td>LAVINA</td><td>LAVINA_KHAKI</td><td>6</td><td>—</td></tr>
          <tr><td>PITA BLUS</td><td>PITA_BLUS-MARUN</td><td>6</td><td>—</td></tr>
          <tr style="font-weight:700"><td colspan="2">Total</td><td>18</td><td>—</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="card">
    <div class="card-title"><i class="ti ti-user"></i>Alan — Restock</div>
    <table class="tbl">
      <thead><tr><th>Katalog</th><th>Variant</th><th>Qty Order</th><th>Nilai</th></tr></thead>
      <tbody>
        <tr><td>TURTLENECK</td><td>TN_HITAM-M</td><td colspan="2" style="color:var(--ink3);font-style:italic">data kosong — isi di Supabase</td></tr>
      </tbody>
    </table>
  </div>
`;
