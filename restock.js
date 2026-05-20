// ─── RESTOCK.JS — tab per supplier ──────────────────────────
// Logic: SKU aktif yang terjual 14 hari terakhir
// Tab: Semua (grid 2 col) | per Supplier (1 tabel penuh)

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

// Tab aktif saat ini
let _restockActiveTab = 'SEMUA';

async function loadRestock() {
  const wrap = document.getElementById('restock-body');
  if (!wrap) return;
  wrap.innerHTML = '<div style="color:var(--ink3);font-style:italic;padding:12px 0"><i class="ti ti-loader"></i> Memuat data...</div>';

  try {
    const today = new Date();
    const d14   = new Date(today);
    d14.setDate(d14.getDate() - 13);
    const dari  = d14.toISOString().slice(0, 10);

    const isKritisMode = window._restockFilterKritis === true;
    window._restockFilterKritis = false;

    const [penjualan, produkAll, supplierAll, stokRaw, jpAllRaw] = await Promise.all([
      dbGet('jurnal_penjualan', '&tanggal=gte.' + dari + '&order=tanggal.desc'),
      dbGet('produk', '&order=katalog.asc'),
      dbGet('restock_supplier', '&order=boss.asc').catch(() => []),
      isKritisMode ? dbGet('stok') : Promise.resolve([]),
      isKritisMode ? dbGet('jurnal_penjualan', '&select=sku,qty') : Promise.resolve([])
    ]);

    // Hitung sisa per SKU jika mode kritis
    const sisaMap = {};
    if (isKritisMode) {
      const masukMap = {};
      (stokRaw || []).forEach(s => {
        const key = (s.sku_variasi || '').trim().toUpperCase();
        if (key) masukMap[key] = (masukMap[key] || 0) + (s.stok_masuk || 0);
      });
      const keluarMap2 = {};
      (jpAllRaw || []).forEach(r => {
        const key = (r.sku || '').trim().toUpperCase();
        if (key) keluarMap2[key] = (keluarMap2[key] || 0) + (r.qty || 0);
      });
      Object.keys(masukMap).forEach(k => {
        sisaMap[k] = (masukMap[k] || 0) - (keluarMap2[k] || 0);
      });
    }

    // Map supplier
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
    const DEFAULT_SUPPLIER = { lead_time: 7, min_order: 6, kelipatan: 6, budget: 0, catatan: '' };

    // Map produk
    const produkMap = {};
    produkAll.forEach(p => {
      const key = (p.sku_variasi || p.sku || '').trim().toUpperCase();
      if (key) produkMap[key] = p;
    });

    // Hitung qty terjual per SKU
    const qtyMap = {};
    penjualan.forEach(row => {
      const sku = (row.sku || '').trim().toUpperCase();
      if (!sku) return;
      qtyMap[sku] = (qtyMap[sku] || 0) + (row.qty || 0);
    });

    // Group by boss, hitung ROP
    const bossList = {};
    Object.entries(qtyMap).forEach(([sku, qty14]) => {
      const p = produkMap[sku];
      if (!p) return;
      const kat = (p.kategori_produk || 'aktif').toLowerCase();
      if (kat !== 'aktif') return;
      if (isKritisMode && sisaMap[sku] !== undefined && sisaMap[sku] > 3) return;

      const bossKey = (p.boss || '—').trim().toUpperCase();
      const sup     = supplierMap[bossKey] || DEFAULT_SUPPLIER;
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

    const kritisCount = Object.values(bossList).reduce((s,b) => s + b.items.length, 0);
    const bannerKritis = isKritisMode ? `
      <div style="display:flex;align-items:center;gap:10px;background:rgba(224,82,82,0.1);border:1px solid var(--danger);border-radius:6px;padding:10px 14px;margin-bottom:14px">
        <i class="ti ti-alert-triangle" style="color:var(--danger);font-size:16px"></i>
        <span style="color:var(--danger);font-weight:700;font-size:13px">Mode SKU Kritis — ${kritisCount} SKU perlu restock segera</span>
        <button onclick="loadRestock()" style="margin-left:auto;font-size:12px;padding:4px 10px;border-radius:4px;border:1px solid var(--ink3);background:transparent;color:var(--ink2);cursor:pointer">
          Tampilkan Semua
        </button>
      </div>` : '';

    // Simpan data ke window untuk dipakai saat ganti tab
    window._restockData = { bossList, bossSorted, fmtRp, d14, today, totalSKU, grandBudget, bannerKritis };

    // Pastikan tab aktif valid
    if (_restockActiveTab !== 'SEMUA' && !bossSorted.includes(_restockActiveTab)) {
      _restockActiveTab = 'SEMUA';
    }

    renderRestockTabs();

  } catch(err) {
    wrap.innerHTML = `<div style="color:var(--danger)">⚠️ Error: ${err.message}</div>`;
    console.error('[restock]', err);
  }
}

function renderRestockTabs() {
  const wrap = document.getElementById('restock-body');
  if (!wrap || !window._restockData) return;

  const { bossList, bossSorted, fmtRp, d14, today, totalSKU, grandBudget, bannerKritis } = window._restockData;

  // ── Build tab bar ──
  const tabBar = `
    <div style="display:flex;gap:0;margin-bottom:16px;border-bottom:2px solid var(--ink);flex-wrap:wrap">
      <button
        onclick="restockSwitchTab('SEMUA')"
        style="padding:7px 16px;font-family:var(--f);font-size:12px;font-weight:700;
               border:2px solid var(--ink);border-bottom:none;cursor:pointer;margin-bottom:-2px;
               background:${_restockActiveTab === 'SEMUA' ? 'var(--ink)' : 'var(--cream)'};
               color:${_restockActiveTab === 'SEMUA' ? 'var(--cream)' : 'var(--ink)'}">
        <i class="ti ti-layout-grid"></i> Semua
        <span style="margin-left:4px;font-size:10px;opacity:0.7">${totalSKU} SKU</span>
      </button>
      ${bossSorted.map(boss => {
        const { items, sup } = bossList[boss];
        const totalQty = items.reduce((s,r) => s + r.qty_order, 0);
        const isActive = _restockActiveTab === boss;
        return `
          <button
            onclick="restockSwitchTab('${boss}')"
            style="padding:7px 16px;font-family:var(--f);font-size:12px;font-weight:700;
                   border:2px solid var(--ink);border-bottom:none;border-left:none;cursor:pointer;margin-bottom:-2px;
                   background:${isActive ? 'var(--ink)' : 'var(--cream)'};
                   color:${isActive ? 'var(--cream)' : 'var(--ink)'}">
            <i class="ti ti-user"></i> ${boss}
            <span style="margin-left:4px;font-size:10px;opacity:0.7">${totalQty} pcs</span>
          </button>`;
      }).join('')}
    </div>
  `;

  // ── Header info ──
  const header = `
    ${bannerKritis}
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
  `;

  // ── Content berdasarkan tab aktif ──
  let content = '';

  if (_restockActiveTab === 'SEMUA') {
    // Grid 2 kolom — tampilan lama
    content = `<div class="grid2">${bossSorted.map(boss => renderSupplierCard(boss, bossList[boss], fmtRp)).join('')}</div>`;
  } else {
    // 1 supplier — full width, lebih detail
    const bossData = bossList[_restockActiveTab];
    if (!bossData) return;
    content = renderSupplierFull(_restockActiveTab, bossData, fmtRp);
  }

  wrap.innerHTML = tabBar + header + content;
  if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-restock'));
}

function restockSwitchTab(boss) {
  _restockActiveTab = boss;
  renderRestockTabs();
}

// ── Card compact untuk tab Semua (grid 2 kolom) ──
function renderSupplierCard(boss, { items, sup }, fmtRp) {
  const totalQty   = items.reduce((s,r) => s + r.qty_order, 0);
  const totalNilai = items.reduce((s,r) => s + r.nilai, 0);
  const budgetSisa = sup.budget ? sup.budget - totalNilai : null;

  return `
    <div class="card" style="margin-bottom:0">
      <div class="card-title" style="font-size:15px;cursor:pointer" onclick="restockSwitchTab('${boss}')">
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

      <div style="margin-top:10px">
        <button class="btn btn-sm" onclick="restockSwitchTab('${boss}')" style="font-size:11px">
          <i class="ti ti-arrow-right"></i> Lihat Detail
        </button>
      </div>
    </div>
  `;
}

// ── Tampilan full 1 supplier (tab individual) ──
function renderSupplierFull(boss, { items, sup }, fmtRp) {
  const totalQty   = items.reduce((s,r) => s + r.qty_order, 0);
  const totalNilai = items.reduce((s,r) => s + r.nilai, 0);
  const budgetSisa = sup.budget ? sup.budget - totalNilai : null;

  return `
    <div class="card" style="margin-bottom:0">

      <!-- Info supplier -->
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px;padding:10px 14px;
                  background:var(--cream2);border:2px dashed var(--ink3);border-radius:4px">
        <div style="font-size:13px">
          <span style="color:var(--ink3)">Lead Time:</span>
          <b style="color:var(--ink);margin-left:4px">${sup.lead_time} hari</b>
        </div>
        <div style="font-size:13px">
          <span style="color:var(--ink3)">Min Order:</span>
          <b style="color:var(--ink);margin-left:4px">${sup.min_order} pcs</b>
        </div>
        <div style="font-size:13px">
          <span style="color:var(--ink3)">Kelipatan:</span>
          <b style="color:var(--ink);margin-left:4px">× ${sup.kelipatan}</b>
        </div>
        ${sup.budget ? `
          <div style="font-size:13px;margin-left:auto">
            <span style="color:var(--ink3)">Budget:</span>
            <b style="color:var(--warn);margin-left:4px">${fmtRp(sup.budget)}</b>
            <span style="margin-left:8px;color:${budgetSisa >= 0 ? 'var(--ok)' : 'var(--danger)'}">
              ${budgetSisa >= 0 ? '(Sisa ' + fmtRp(budgetSisa) + ')' : '(Over ' + fmtRp(Math.abs(budgetSisa)) + ')'}
            </span>
          </div>
        ` : ''}
        ${sup.catatan ? `<div style="width:100%;font-size:11px;color:var(--ink3)"><i class="ti ti-note"></i> ${sup.catatan}</div>` : ''}
      </div>

      <!-- Tabel full width -->
      <div class="tbl-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>#</th>
              <th>Katalog</th>
              <th>Variant (SKU)</th>
              <th style="text-align:center">Qty 14hr</th>
              <th style="text-align:center">Avg/hari</th>
              <th style="text-align:center">ROP</th>
              <th style="text-align:center;color:var(--warn)">Order</th>
              <th style="text-align:right">HPP</th>
              <th style="text-align:right;color:var(--ok)">Nilai HPP</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((r, i) => `
              <tr>
                <td style="color:var(--ink3);font-size:11px">${i + 1}</td>
                <td style="color:var(--ink3)">${r.katalog}</td>
                <td><b style="color:var(--ink)">${r.sku}</b></td>
                <td style="text-align:center">${r.qty14}</td>
                <td style="text-align:center;color:var(--ink3)">${r.avg_harian}</td>
                <td style="text-align:center;color:var(--ink2)">${r.rop}</td>
                <td style="text-align:center;font-weight:700;font-size:16px;color:var(--warn)">${r.qty_order}</td>
                <td style="text-align:right;color:var(--ink3);font-size:12px">${fmtRp(r.hpp)}</td>
                <td style="text-align:right;font-weight:600;color:${r.nilai ? 'var(--ok)' : 'var(--ink3)'}">
                  ${fmtRp(r.nilai)}
                </td>
              </tr>
            `).join('')}
            <tr style="font-weight:700;border-top:2px solid var(--ink3)">
              <td colspan="6" style="color:var(--ink2)">Total</td>
              <td style="text-align:center;font-size:18px;color:var(--warn)">${totalQty}</td>
              <td></td>
              <td style="text-align:right;color:var(--ok);font-size:15px">${fmtRp(totalNilai)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Bulatkan ke kelipatan terdekat (ke atas), minimum = min_order
function bulatkanKelipatan(nilai, kelipatan, min_order) {
  if (nilai <= 0) nilai = 0.01;
  const k   = kelipatan || 1;
  const raw = Math.ceil(nilai / k) * k;
  return Math.max(raw, min_order || k);
}

function fmtTgl(d) {
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}
