// ─── RESTOCK.JS — dinamis dari Supabase ──────────────────────
// Logic: SKU yang terjual dalam 14 hari terakhir,
//        status produk = aktif (bukan clearance/discontinued),
//        digroup per boss/supplier.

document.getElementById('page-restock').innerHTML = `
  <div class="card" id="restock-wrap">
    <div class="card-title"><i class="ti ti-refresh"></i> Re-Stock — Penjualan 14 Hari Terakhir</div>
    <div id="restock-body" style="color:var(--ink3);font-style:italic;padding:12px 0">
      <i class="ti ti-loader" style="animation:spin 1s linear infinite"></i> Memuat data...
    </div>
  </div>
`;

setTimeout(() => {
  if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-restock'));
  loadRestock();
}, 80);

async function loadRestock() {
  const wrap = document.getElementById('restock-body');
  try {
    // 1. Tanggal 14 hari ke belakang
    const today = new Date();
    const d14   = new Date(today);
    d14.setDate(d14.getDate() - 13); // inklusif hari ini = 14 hari
    const dari  = d14.toISOString().slice(0, 10);

    // 2. Ambil data paralel
    const [penjualan, produkAll] = await Promise.all([
      dbGet('jurnal_penjualan', '&tanggal=gte.' + dari + '&order=tanggal.desc'),
      dbGet('produk', '&order=katalog.asc')
    ]);

    // 3. Buat map produk: sku_variasi → { katalog, boss, hpp, kategori_produk }
    const produkMap = {};
    produkAll.forEach(p => {
      const key = (p.sku_variasi || p.sku || '').trim().toUpperCase();
      if (key) produkMap[key] = p;
    });

    // 4. Hitung qty terjual per SKU (14 hari)
    const qtyMap = {}; // sku → total qty
    penjualan.forEach(row => {
      const sku = (row.sku || '').trim().toUpperCase();
      if (!sku) return;
      qtyMap[sku] = (qtyMap[sku] || 0) + (row.qty || 0);
    });

    // 5. Filter: hanya yang statusnya 'aktif' dan ada penjualan
    // Group by boss
    const bossList = {}; // boss → [ { katalog, sku, qty, hpp } ]

    Object.entries(qtyMap).forEach(([sku, qty]) => {
      const p = produkMap[sku];
      if (!p) return; // SKU tidak dikenal
      const kat = (p.kategori_produk || 'aktif').toLowerCase();
      if (kat !== 'aktif') return; // skip clearance & discontinued
      const boss = (p.boss || '—').trim();
      if (!bossList[boss]) bossList[boss] = [];
      bossList[boss].push({
        katalog: p.katalog || '—',
        sku:     sku,
        qty:     qty,
        hpp:     p.hpp || 0,
        nilai:   (p.hpp || 0) * qty
      });
    });

    // 6. Sort tiap boss: qty terbanyak dulu
    Object.values(bossList).forEach(arr => {
      arr.sort((a, b) => b.qty - a.qty);
    });

    const bossSorted = Object.keys(bossList).sort();

    if (!bossSorted.length) {
      wrap.innerHTML = '<div style="color:var(--ink3);padding:16px 0">Tidak ada SKU aktif yang terjual dalam 14 hari terakhir.</div>';
      return;
    }

    // 7. Render per boss
    const fmtRp = v => v ? 'Rp' + Number(v).toLocaleString('id-ID') : '—';

    const html = `
      <div style="font-size:11px;color:var(--ink3);margin-bottom:14px">
        Periode: <b style="color:var(--ink2)">${fmt14(d14)} – ${fmt14(today)}</b>
        &nbsp;·&nbsp; ${bossSorted.length} supplier &nbsp;·&nbsp;
        ${Object.values(bossList).reduce((s,a)=>s+a.length,0)} SKU aktif
      </div>
      <div class="grid2">
        ${bossSorted.map(boss => {
          const rows = bossList[boss];
          const totalQty  = rows.reduce((s,r) => s + r.qty, 0);
          const totalNilai = rows.reduce((s,r) => s + r.nilai, 0);
          return `
            <div class="card" style="margin-bottom:0">
              <div class="card-title" style="font-size:15px">
                <i class="ti ti-user"></i> ${boss}
                <span style="margin-left:auto;font-size:11px;font-weight:400;color:var(--ink3)">${rows.length} SKU</span>
              </div>
              <table class="tbl">
                <thead>
                  <tr>
                    <th>Katalog</th>
                    <th>Variant</th>
                    <th style="text-align:center">Qty Terjual</th>
                    <th style="text-align:right">Nilai HPP</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map(r => `
                    <tr>
                      <td>${r.katalog}</td>
                      <td><b style="color:var(--ink)">${r.sku}</b></td>
                      <td style="text-align:center;font-weight:700">${r.qty}</td>
                      <td style="text-align:right;color:${r.nilai?'var(--ok)':'var(--ink3)'}">${fmtRp(r.nilai)}</td>
                    </tr>
                  `).join('')}
                  <tr style="font-weight:700;border-top:1px solid rgba(255,255,255,0.08)">
                    <td colspan="2" style="color:var(--ink2)">Total</td>
                    <td style="text-align:center">${totalQty}</td>
                    <td style="text-align:right;color:var(--ok)">${fmtRp(totalNilai)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          `;
        }).join('')}
      </div>
    `;

    wrap.innerHTML = html;
    if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-restock'));

  } catch(err) {
    wrap.innerHTML = `<div style="color:var(--danger)">⚠️ Error: ${err.message}</div>`;
    console.error('[restock]', err);
  }
}

function fmt14(d) {
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}
