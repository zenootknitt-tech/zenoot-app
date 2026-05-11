// ─── HPP.JS — edit halaman ini untuk update data HPP produk ──
document.getElementById('page-hpp').innerHTML = `
  <div id="toko-switcher-hpp" class="ch-switcher"></div>
  <div style="display:flex;gap:10px;margin-bottom:12px">
    <button class="btn btn-sm btn-primary"><i class="ti ti-plus"></i> Tambah Produk</button>
    <button class="btn btn-sm"><i class="ti ti-download"></i> Export</button>
  </div>
  <div class="card">
    <div class="card-title"><i class="ti ti-calculator"></i>Daftar HPP Produk</div>
    <table class="tbl">
      <thead><tr><th>SKU Induk</th><th>Nomor Referensi SKU</th><th>Nama Variasi</th><th>HPP</th></tr></thead>
      <tbody>
        <tr><td>Turtleneck</td><td>Turtleneck_HITAM-XL</td><td>Hitam,XL</td><td>Rp41.000</td></tr>
        <tr><td>Turtleneck</td><td>Turtleneck_MARUN-L</td><td>Maroon,L</td><td>Rp41.000</td></tr>
        <tr><td>Turtleneck</td><td>Turtleneck_NEVI-S</td><td>Nevi,S</td><td>Rp41.000</td></tr>
        <tr><td>Turtleneck</td><td>Turtleneck_HITAM-L</td><td>Hitam,L</td><td>Rp41.000</td></tr>
        <tr><td>Turtleneck</td><td>Turtleneck_PUTIH-M</td><td>Putih,M</td><td>Rp41.000</td></tr>
        <tr><td>Turtleneck</td><td>Turtleneck_Abu muda-XL</td><td>Abu Muda Misty,XL</td><td>Rp41.000</td></tr>
        <tr><td>TURTLENECK</td><td>Turtleneck_Hitam</td><td>Hitam,All Size</td><td>Rp41.000</td></tr>
        <tr><td>TURTLENECK</td><td>Turtleneck_Nevi</td><td>Nevy,All Size</td><td>Rp41.000</td></tr>
      </tbody>
    </table>
  </div>
`;
