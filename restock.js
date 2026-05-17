// ─── RESTOCK.JS — dinamis dari Supabase ──────────────────────
// Logic: SKU yang terjual dalam 14 hari terakhir,
//        status produk = aktif (bukan clearance/discontinued),
//        ROP dihitung dari lead_time & kelipatan per supplier.

document.getElementById('page-restock').innerHTML = `
  <div class="card" id="restock-wrap">
    <div class="card-title">
      <i class="ti ti-refresh"></i> Re-Stock — Penjualan 14 Hari Terakhir
      <button class="btn btn-sm" onclick="loadRestock()" style="margin-left:auto">
        <i class="ti ti-refresh"></i> Refresh
      </button>
    </div>
    <div id="restock-body" style="color:var(--ink3);font-style:italic;padding:12px 0">
      <i class="ti ti-loader"></i> Memuat data...
    </div>
  </div>
`;

setTimeout(() => {
  if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-restock'));
  loadRestock();
}, 80);

async function loadRestock() {
  const wrap = document.getElementById('restock-body');
  if (!wrap) return;
  wrap.innerHTML = '<div style="color:var(--ink3);font-style:italic;padding:12px 0"><i class="ti ti-loader"></i> Memuat data...</div>';

  try {
    // 1. Tanggal 14 hari ke belakang
    const today = new Date();
    const d14   = new Date(today);
    d14.setDate(d14.getDate() - 13);
    const dari  = d14.toISOString().slice(0, 10);

    // 2. Ambil semua data paralel
    const [penjualan, produkAll, supplierAll] = await Promise.all([
      dbGet('jurnal_penjualan', '&tanggal=gte.' + dari + '&order=tanggal.desc'),
      dbGet('produk', '&order=katalog.asc'),
      dbGet('restock_supplier', '&order=boss.asc').catch(() => [])
    ]);

    // 3. Map supplier: boss (uppercase) → { lead_time, min_order, kelipatan, budget }
    const supplierMap = {};
    (supplierAll || []).forEach(s => {
      const key = (s.boss || '').trim().toUpperCase();
      supplierMap[key] = {
        lead_time : s.lead_time  || 7,
        min_order : s.min_order  || 6,
        kelipatan : s.kelipatan  || s.min_order || 6,
        budget    : s.budget     || 0,
        catatan   : s.catatan    || ''
      };
    });

    // Default jika boss tidak ada di tabel supplier
    const DEFAULT_SUPPLIER = { lead_time: 7, min_order: 6, kelipatan: 6, budget: 0, catatan: '' };

    // 4. Map produk: sku_variasi (uppercase) → produk row
    const produkMap = {};
    produkAll.forEach(p => {
      const key = (p.sku_variasi || p.sku || '').trim().toUpperCase();
      if (key) produkMap[key] = p;
    });

    // 5. Hitung qty terjual per SKU
    const qtyMap = {};
    penjualan.forEach(row => {
      const sku = (row.sku || '').trim().toUpperCase();
      if (!sku) return;
      qtyMap[sku] = (qtyMap[sku] || 0) + (row.qty || 0);
    });

    // 6. Filter aktif, group by boss, hitung ROP
    const bossList = {};

    Object.entries(qtyMap).forEach(([sku, qty14]) => {
      const p = produkMap[sku];
      if (!p) return;
      const kat = (p.kategori_produk || 'aktif').toLowerCase();
      if (kat !== 'aktif') return;

      const bossKey = (p.boss || '—').trim().toUpperCase();
      const sup     = supplierMap[bossKey] || DEFAULT_SUPPLIER;

      // Hitung ROP
      const avg_harian = qty14 / 14;
      const rop_raw    = avg_harian * sup.lead_time;
      const qty_order  = bulatkanKelipatan(rop_raw, sup.kelipatan, sup.min_order);
      const nilai      = (p.hpp || 0) * qty_order;

      if (!bossList[bossKey]) bossList[bossKey] = { items: [], sup };
      bossList[bossKey].items.push({
        katalog    : p.katalog || '—',
        sku,
        qty14,
        avg_harian : avg_harian.toFixed(2),
        rop        : rop_raw.toFixed(1),
        qty_order,
        hpp        : p.hpp || 0,
        nilai
      });
    });

    // Sort tiap boss: qty_order terbesar dulu
    Object.values(bossList).forEach(b => {
      b.items.sort((a, z) => z.qty_order - a.qty_order);
    });

    const bossSorted = Object.keys(bossList).sort();

    if (!bossSorted.length) {
      wrap.innerHTML = '<div style="color:var(--ink3);padding:16px 0">Tidak ada SKU aktif yang terjual dalam 14 hari terakhir.</div>';
      return;
    }

    const fmtRp = v => v ? 'Rp' + Number(v).toLocaleString('id-ID') : '—';
    const totalSKU    = Object.values(bossList).reduce((s,b) => s + b.items.length, 0);
    const grandBudget = Object.values(bossList).reduce((s,b) => s + b.items.reduce((ss,r) => ss + r.nilai, 0), 0);

    const html = `
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px">
        <div style="font-size:12px;color:var(--ink3)">
          Periode: <b style="color:var(--ink2)">${fmtTgl(d14)} – ${fmtTgl(today)}</b>
          &nbsp;·&nbsp; ${bossSorted.length} supplier
          &nbsp;·&nbsp; ${totalSKU} SKU aktif
        </div>
        <div style="margin-left:auto;font-size:13px;font-weight:700;color:var(--ok)">
          Total Budget Restock: ${fmtRp(grandBudget)}
        </div>
      </div>

      <div class="grid2">
        ${bossSorted.map(boss => {
          const { items, sup } = bossList[boss];
          const totalQty   = items.reduce((s,r) => s + r.qty_order, 0);
          const totalNilai = items.reduce((s,r) => s + r.nilai, 0);
          const budgetSisa = sup.budget ? sup.budget - totalNilai : null;

          return `
            <div class="card" style="margin-bottom:0">
              <div class="card-title" style="font-size:15px">
                <i class="ti ti-user"></i> ${boss}
                <span style="margin-left:8px;font-size:11px;font-weight:400;color:var(--ink3)">
                  LT ${sup.lead_time}h · min ${sup.min_order}pcs · ×${sup.kelipatan}
                </span>
                <span style="margin-left:auto;font-size:11px;font-weight:400;color:var(--ink3)">${items.length} SKU</span>
              </div>

              ${sup.budget ? `
                <div style="margin-bottom:10px;padding:6px 10px;background:var(--cream3);border-radius:6px;font-size:12px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px">
                  <span style="color:var(--ink3)">Budget: <b style="color:var(--warn)">${fmtRp(sup.budget)}</b></span>
                  <span style="color:${budgetSisa >= 0 ? 'var(--ok)' : 'var(--danger)'}">
                    ${budgetSisa >= 0 ? 'Sisa: ' + fmtRp(budgetSisa) : 'Over: ' + fmtRp(Math.abs(budgetSisa))}
                  </span>
                </div>
              ` : ''}

              <table class="tbl">
                <thead>
                  <tr>
                    <th>Katalog</th>
                    <th>Variant</th>
                    <th style="text-align:center">Qty 14hr</th>
                    <th style="text-align:center">Avg/hari</th>
                    <th style="text-align:center">ROP</th>
                    <th style="text-align:center">Order</th>
                    <th style="text-align:right">Nilai HPP</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(r => `
                    <tr>
                      <td style="color:var(--ink3)">${r.katalog}</td>
                      <td><b style="color:var(--ink)">${r.sku}</b></td>
                      <td style="text-align:center">${r.qty14}</td>
                      <td style="text-align:center;color:var(--ink3)">${r.avg_harian}</td>
                      <td style="text-align:center;color:var(--ink2)">${r.rop}</td>
                      <td style="text-align:center;font-weight:700;font-size:15px;color:var(--warn)">${r.qty_order}</td>
                      <td style="text-align:right;color:${r.nilai ? 'var(--ok)' : 'var(--ink3)'}">
                        ${fmtRp(r.nilai)}
                      </td>
                    </tr>
                  `).join('')}
                  <tr style="font-weight:700;border-top:1px solid rgba(255,255,255,0.08)">
                    <td colspan="5" style="color:var(--ink2)">Total</td>
                    <td style="text-align:center;color:var(--warn)">${totalQty}</td>
                    <td style="text-align:right;color:var(--ok)">${fmtRp(totalNilai)}</td>
                  </tr>
                </tbody>
              </table>

              ${sup.catatan ? `<div style="margin-top:8px;font-size:11px;color:var(--ink3)"><i class="ti ti-note"></i> ${sup.catatan}</div>` : ''}
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

// Bulatkan ke kelipatan terdekat (ke atas), minimum = min_order
function bulatkanKelipatan(nilai, kelipatan, min_order) {
  if (nilai <= 0) nilai = 0.01; // pastikan minimal 1 kelipatan
  const k   = kelipatan || 1;
  const raw = Math.ceil(nilai / k) * k;
  return Math.max(raw, min_order || k);
}

function fmtTgl(d) {
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}
