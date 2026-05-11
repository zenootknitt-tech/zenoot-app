// ─── DATAORDER.JS — edit halaman ini untuk update data order ─
document.getElementById('page-dataorder').innerHTML = `
  <div id="toko-switcher-dataorder" class="ch-switcher"></div>
  <div class="upload-zone" onclick="alert('Upload file Shopee .xlsx/.csv — akan diproses otomatis')">
    <i class="ti ti-upload"></i>
    Upload file Shopee (.xlsx / .csv)<br>
    <span style="font-size:12px">Drag & drop atau klik untuk pilih file</span>
  </div>
  <div class="card">
    <div class="card-title"><i class="ti ti-shopping-cart"></i>Data Order — sample 5 baris</div>
    <div style="overflow-x:auto">
    <table class="tbl">
      <thead><tr><th>No. Pesanan</th><th>SKU</th><th>Variasi</th><th>Qty</th><th>Harga Setelah Diskon</th><th>Total Bayar</th><th>Kota</th><th>Waktu Selesai</th></tr></thead>
      <tbody>
        <tr><td>260202M5Q4T98H</td><td>Turtleneck</td><td>Hitam,XL</td><td>1</td><td>Rp109.094</td><td>Rp83.820</td><td>Kota Bandung</td><td>Feb 2026</td></tr>
        <tr><td>260202MXAFXBY6</td><td>Turtleneck</td><td>Maroon,L</td><td>1</td><td>Rp107.361</td><td>Rp80.063</td><td>Kab Sumedang</td><td>Feb 2026</td></tr>
        <tr><td>260202KDWERC9D</td><td>Turtleneck</td><td>Nevi,S</td><td>1</td><td>Rp107.361</td><td>Rp88.826</td><td>Kab Sukoharjo</td><td>Feb 2026</td></tr>
        <tr><td>260203Q7CS5GK1</td><td>Turtleneck</td><td>Maroon,XL</td><td>2</td><td>Rp103.861</td><td>Rp174.513</td><td>Kota Malang</td><td>Feb 2026</td></tr>
        <tr><td>260204SD2M39R7</td><td>Turtleneck</td><td>Putih,M</td><td>1</td><td>Rp119.000</td><td>Rp111.900</td><td>Kota Bandung</td><td>Feb 2026</td></tr>
      </tbody>
    </table>
    </div>
  </div>
`;
