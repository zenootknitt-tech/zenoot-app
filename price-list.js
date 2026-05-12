// ─── PRICE-LIST.JS ───────────────────────────────────────────
// Kalkulasi harga jual otomatis dari HPP (Kelola Produk) +
// % Beban & NPM (Beban Operasional) — untuk Toko Utama & Reseller
// Tidak pakai channel switcher — 1 data untuk semua operasional

document.getElementById('page-price-list').innerHTML = `
  <div style="margin-bottom:14px;padding:10px 14px;background:var(--cream2);border:2px dashed var(--ink3);border-radius:4px;font-size:13px;color:var(--ink2);line-height:1.7">
    <b>Cara baca:</b> Harga jual dihitung otomatis dari <b>HPP × (1 + Total Beban% + Target NPM%)</b>.<br>
    Ubah % beban di halaman <b>Beban Operasional</b> — Price List ini akan ikut terupdate otomatis.
  </div>

  <!-- TOMBOL -->
  <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
    <button class="btn btn-sm btn-primary" onclick="loadPriceList()">
      <i class="ti ti-refresh"></i> Refresh
    </button>
    <button class="btn btn-sm" onclick="exportPriceList()">
      <i class="ti ti-download"></i> Export CSV
    </button>
    <input type="text" id="pl-search"
      placeholder="Cari SKU / katalog..."
      style="font-family:var(--f);font-size:13px;padding:4px 8px;border:2px solid var(--ink);background:var(--cream);width:180px;margin-left:auto"
      oninput="filterPriceList()">
  </div>

  <!-- INFO BEBAN AKTIF -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
    <div class="card" style="padding:10px 14px">
      <div style="font-size:11px;font-weight:700;color:var(--ink3);margin-bottom:6px;text-transform:uppercase">⚙ Beban Toko Utama</div>
      <div id="pl-info-toko" style="font-size:13px;color:var(--ink2)">Memuat...</div>
    </div>
    <div class="card" style="padding:10px 14px">
      <div style="font-size:11px;font-weight:700;color:var(--ink3);margin-bottom:6px;text-transform:uppercase">⚙ Beban Reseller</div>
      <div id="pl-info-reseller" style="font-size:13px;color:var(--ink2)">Memuat...</div>
    </div>
  </div>

  <!-- TABEL PRICE LIST -->
  <div class="card">
    <div class="card-title"><i class="ti ti-tag"></i> Price List</div>
    <div class="tbl-wrap" style="max-height:65vh;overflow-y:auto"><table class="tbl">
      <thead>
        <tr>
          <th>Katalog</th>
          <th>SKU Variasi</th>
          <th style="text-align:right">HPP</th>
          <th style="text-align:right">Harga Toko Utama</th>
          <th style="text-align:right">Harga Reseller</th>
          <th style="text-align:center">Margin Toko</th>
          <th style="text-align:center">Margin Reseller</th>
        </tr>
      </thead>
      <tbody id="pl-tbody">
        <tr><td colspan="7" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>
      </tbody>
    </table></div>
    <div id="pl-footer" style="font-size:12px;color:var(--ink3);margin-top:8px;text-align:right"></div>
  </div>
`;

// render sketchy UI untuk halaman page-price-list setelah innerHTML siap
setTimeout(() => { if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-price-list')); }, 80);

// ─── CACHE ───────────────────────────────────────────────────
let _plProdukData  = [];
let _plBebanToko   = { total_beban: 0, total_npm: 0 };
let _plBebanReseller = { total_beban: 0, total_npm: 0 };
let _plRendered    = [];

// ─── LOAD SEMUA DATA ─────────────────────────────────────────
async function loadPriceList() {
  document.getElementById('pl-tbody').innerHTML =
    '<tr><td colspan="7" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>';
  document.getElementById('pl-info-toko').textContent     = 'Memuat...';
  document.getElementById('pl-info-reseller').textContent = 'Memuat...';

  try {
    // Ambil produk & beban paralel
    const [produk, bebanToko, bebanReseller] = await Promise.all([
      dbGet('produk', '&order=katalog.asc'),
      dbGet('beban_operasional', '&tipe=eq.toko_utama'),
      dbGet('beban_operasional', '&tipe=eq.reseller'),
    ]);

    // Hitung total % per tipe
    _plBebanToko = hitungTotalBeban(bebanToko || []);
    _plBebanReseller = hitungTotalBeban(bebanReseller || []);
    _plProdukData = produk || [];

    // Tampilkan info beban aktif
    renderInfoBeban('pl-info-toko',     _plBebanToko);
    renderInfoBeban('pl-info-reseller', _plBebanReseller);

    // Render tabel
    renderPriceList(_plProdukData);

  } catch(err) {
    document.getElementById('pl-tbody').innerHTML =
      `<tr><td colspan="7" style="color:var(--danger)">Error: ${err.message}</td></tr>`;
  }
}

// ─── HITUNG TOTAL BEBAN ──────────────────────────────────────
function hitungTotalBeban(data) {
  const total_beban = data.reduce((s, r) => s + (r.beban_persen || 0), 0);
  const total_npm   = data.reduce((s, r) => s + (r.npm_persen   || 0), 0);
  return { total_beban, total_npm, rows: data };
}

// ─── INFO BEBAN ──────────────────────────────────────────────
function renderInfoBeban(elId, beban) {
  const el = document.getElementById(elId);
  if (!beban.rows || beban.rows.length === 0) {
    el.innerHTML = '<span style="color:var(--ink3);font-style:italic">Belum ada data beban</span>';
    return;
  }
  const multiplier = (1 + (beban.total_beban + beban.total_npm) / 100).toFixed(3);
  el.innerHTML = `
    Beban: <b style="color:var(--danger)">${beban.total_beban.toFixed(1)}%</b> &nbsp;|&nbsp;
    NPM: <b style="color:var(--ok)">${beban.total_npm.toFixed(1)}%</b> &nbsp;|&nbsp;
    Multiplier: <b>×${multiplier}</b>
  `;
}

// ─── RENDER TABEL ────────────────────────────────────────────
function renderPriceList(data) {
  const tbody = document.getElementById('pl-tbody');

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="color:var(--ink3);font-style:italic">Belum ada produk di Kelola Produk</td></tr>';
    document.getElementById('pl-footer').textContent = '';
    _plRendered = [];
    return;
  }

  const multToko     = 1 + (_plBebanToko.total_beban     + _plBebanToko.total_npm)     / 100;
  const multReseller = 1 + (_plBebanReseller.total_beban + _plBebanReseller.total_npm) / 100;

  _plRendered = data.map(row => {
    const hpp          = row.hpp || 0;
    const hargaToko    = Math.ceil(hpp * multToko);
    const hargaReseller= Math.ceil(hpp * multReseller);
    const marginToko   = hpp > 0 ? (((hargaToko - hpp) / hpp) * 100).toFixed(1) : 0;
    const marginReseller = hpp > 0 ? (((hargaReseller - hpp) / hpp) * 100).toFixed(1) : 0;
    return { ...row, hargaToko, hargaReseller, marginToko, marginReseller };
  });

  tbody.innerHTML = _plRendered.map(row => {
    const fmtRp = v => 'Rp' + v.toLocaleString('id-ID');
    return `
      <tr>
        <td>${row.katalog || '—'}</td>
        <td style="font-weight:600;color:var(--accent)">${row.sku || '—'}</td>
        <td style="text-align:right;color:var(--ink2)">${fmtRp(row.hpp || 0)}</td>
        <td style="text-align:right;font-weight:700;color:var(--ink)">${fmtRp(row.hargaToko)}</td>
        <td style="text-align:right;font-weight:700;color:var(--ink)">${fmtRp(row.hargaReseller)}</td>
        <td style="text-align:center">
          <span style="color:var(--ok);font-weight:600">${row.marginToko}%</span>
        </td>
        <td style="text-align:center">
          <span style="color:var(--ok);font-weight:600">${row.marginReseller}%</span>
        </td>
      </tr>`;
  }).join('');

  document.getElementById('pl-footer').textContent = `${data.length} SKU ditampilkan`;
}

// ─── FILTER PENCARIAN ────────────────────────────────────────
function filterPriceList() {
  const q = document.getElementById('pl-search').value.toLowerCase().trim();
  if (!q) { renderPriceList(_plProdukData); return; }
  const filtered = _plProdukData.filter(r =>
    (r.sku     || '').toLowerCase().includes(q) ||
    (r.katalog || '').toLowerCase().includes(q)
  );
  renderPriceList(filtered);
}

// ─── EXPORT CSV ──────────────────────────────────────────────
function exportPriceList() {
  if (!_plRendered || _plRendered.length === 0) { alert('Belum ada data'); return; }
  const headers = ['Katalog','SKU Variasi','HPP','Harga Toko Utama','Harga Reseller','Margin Toko (%)','Margin Reseller (%)'];
  const rows = _plRendered.map(r => [
    r.katalog, r.sku, r.hpp,
    r.hargaToko, r.hargaReseller,
    r.marginToko, r.marginReseller
  ]);
  exportCSV('zenoot-price-list.csv', headers, rows);
}

// ─── INIT ────────────────────────────────────────────────────
loadPriceList();
