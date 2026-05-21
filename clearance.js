// ─── CLEARANCE.JS — monitor SKU non-aktif yang masih ada stok ──
// Standalone page, navigasi dari Re-Stock > Summary
// Kategori: discontinued, seasonal, clearance

document.getElementById('page-clearance').innerHTML = `
  <div class="card">
    <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span><i class="ti ti-tag"></i> Clearance Monitor</span>

        <!-- Filter Kategori -->
        <button class="btn btn-sm" id="cl-kat-btn" onclick="clToggleKat()"
          style="display:flex;align-items:center;gap:4px;font-size:12px">
          <i class="ti ti-filter"></i>
          <span id="cl-kat-label">Semua Kategori</span>
          <span id="cl-kat-badge" style="display:none;background:var(--accent);color:#fff;font-size:9px;padding:1px 4px;border-radius:8px;font-weight:700">●</span>
          <span style="font-size:10px">&#9662;</span>
        </button>

        <!-- Filter Supplier -->
        <button class="btn btn-sm" id="cl-sup-btn" onclick="clToggleSup()"
          style="display:flex;align-items:center;gap:4px;font-size:12px">
          <i class="ti ti-user"></i>
          <span id="cl-sup-label">Semua Supplier</span>
          <span id="cl-sup-badge" style="display:none;background:var(--accent);color:#fff;font-size:9px;padding:1px 4px;border-radius:8px;font-weight:700">●</span>
          <span style="font-size:10px">&#9662;</span>
        </button>

        <!-- Reset -->
        <button class="btn btn-sm" id="cl-reset-btn" onclick="clResetFilter()"
          style="display:none;align-items:center;gap:4px;font-size:12px;border-color:var(--danger);color:var(--danger)">
          <i class="ti ti-x"></i> Reset
        </button>
      </div>

      <!-- Kanan: tombol kembali ke restock -->
      <button class="btn btn-sm" onclick="gotoPage('restock',null)" style="font-size:12px">
        <i class="ti ti-arrow-left"></i> Kembali ke Re-Stock
      </button>
    </div>

    <!-- Metric strip -->
    <div class="metrics" style="grid-template-columns:repeat(3,1fr);margin-bottom:14px" id="cl-metrics">
      <div class="metric">
        <div class="m-label">SKU Non-Aktif</div>
        <div class="m-value" id="cl-total-sku">—</div>
        <div class="m-delta">masih ada stok</div>
      </div>
      <div class="metric">
        <div class="m-label">Total Sisa Pcs</div>
        <div class="m-value" id="cl-total-pcs">—</div>
        <div class="m-delta">semua kategori</div>
      </div>
      <div class="metric">
        <div class="m-label">Nilai Stok Tertahan</div>
        <div class="m-value" id="cl-total-nilai">—</div>
        <div class="m-delta">HPP × sisa</div>
      </div>
    </div>

    <!-- Tabel scrollable -->
    <div class="tbl-wrap" style="max-height:65vh;overflow-y:auto;overflow-x:auto;-webkit-overflow-scrolling:touch;scroll-behavior:smooth">
      <table class="tbl">
        <thead style="position:sticky;top:0;z-index:10;box-shadow:0 2px 0 0 var(--ink3)">
          <tr>
            <th onclick="clSort('kat')" style="cursor:pointer;user-select:none;background:var(--cream3)">Kategori <span id="cl-sort-kat">↕</span></th>
            <th style="background:var(--cream3)">Katalog</th>
            <th onclick="clSort('sku')" style="cursor:pointer;user-select:none;background:var(--cream3)">SKU <span id="cl-sort-sku">↕</span></th>
            <th style="background:var(--cream3)">Boss</th>
            <th onclick="clSort('sisa')" style="cursor:pointer;user-select:none;text-align:center;background:var(--cream3)">Sisa <span id="cl-sort-sisa">↕</span></th>
            <th style="text-align:center;background:var(--cream3)">Terjual 14hr</th>
            <th style="text-align:right;background:var(--cream3)">HPP/pcs</th>
            <th onclick="clSort('nilai')" style="cursor:pointer;user-select:none;text-align:right;background:var(--cream3)">Nilai Stok <span id="cl-sort-nilai">↕</span></th>
          </tr>
        </thead>
        <tbody id="cl-tbody">
          <tr><td colspan="8" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>
        </tbody>
      </table>
    </div>
    <div id="cl-footer" style="font-size:12px;color:var(--ink3);margin-top:8px;text-align:right"></div>
  </div>
`;

setTimeout(() => {
  if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-clearance'));
  loadClearance();
}, 80);

// ─── STATE ───────────────────────────────────────────────────
let _clAllData  = [];
let _clFilterKat = '';
let _clFilterSup = '';
let _clSort     = { col: 'nilai', dir: 'desc' };

const _clKatLabel = {
  discontinued : '🚫 Discontinued',
  seasonal     : '🌙 Seasonal',
  clearance    : '🏷️ Clearance'
};

// ─── LOAD DATA ───────────────────────────────────────────────
async function loadClearance() {
  const tbody = document.getElementById('cl-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="8" style="color:var(--ink3);font-style:italic"><i class="ti ti-loader"></i> Memuat data...</td></tr>';

  try {
    const today = new Date();
    const d14   = new Date(today);
    d14.setDate(d14.getDate() - 13);
    const dari14 = d14.toISOString().slice(0, 10);

    const [produkAll, stokRaw, jpAllRaw, jp14Raw] = await Promise.all([
      dbGet('produk', '&order=katalog.asc'),
      dbGet('stok'),
      dbGet('jurnal_penjualan', '&select=sku,qty'),
      dbGet('jurnal_penjualan', '&select=sku,qty&tanggal=gte.' + dari14)
    ]);

    // Hitung sisa stok per SKU
    const masukMap = {};
    (stokRaw || []).forEach(s => {
      const k = (s.sku_variasi || '').trim().toUpperCase();
      if (k) masukMap[k] = (masukMap[k] || 0) + (s.stok_masuk || 0);
    });
    const keluarMap = {};
    (jpAllRaw || []).forEach(r => {
      const k = (r.sku || '').trim().toUpperCase();
      if (k) keluarMap[k] = (keluarMap[k] || 0) + (r.qty || 0);
    });

    // Hitung qty terjual 14 hari per SKU
    const qty14Map = {};
    (jp14Raw || []).forEach(r => {
      const k = (r.sku || '').trim().toUpperCase();
      if (k) qty14Map[k] = (qty14Map[k] || 0) + (r.qty || 0);
    });

    // Build clearance list — hanya non-aktif yang sisa > 0
    _clAllData = [];
    produkAll.forEach(p => {
      const kat = (p.kategori_produk || 'aktif').toLowerCase();
      if (kat === 'aktif') return;

      const skuKey = (p.sku_variasi || p.sku || '').trim().toUpperCase();
      if (!skuKey) return;

      const masuk = masukMap[skuKey] || 0;
      const keluar = keluarMap[skuKey] || 0;
      const sisa  = masuk - keluar;
      if (sisa <= 0) return; // sudah habis, tidak perlu monitor

      _clAllData.push({
        kat,
        katalog : p.katalog || '—',
        sku     : skuKey,
        boss    : p.boss || '—',
        sisa,
        qty14   : qty14Map[skuKey] || 0,
        hpp     : p.hpp || 0,
        nilai   : sisa * (p.hpp || 0)
      });
    });

    clRenderAll();

  } catch(err) {
    const tbody = document.getElementById('cl-tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="8" style="color:var(--danger)">⚠️ Error: ${err.message}</td></tr>`;
    console.error('[clearance]', err);
  }
}

// ─── RENDER ──────────────────────────────────────────────────
function clRenderAll() {
  // Filter
  let data = _clAllData.filter(r => {
    if (_clFilterKat && r.kat  !== _clFilterKat) return false;
    if (_clFilterSup && r.boss !== _clFilterSup) return false;
    return true;
  });

  // Sort
  const { col, dir } = _clSort;
  data = [...data].sort((a, b) => {
    let va = a[col]; let vb = b[col];
    if (typeof va === 'string') {
      va = va.toLowerCase(); vb = vb.toLowerCase();
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ?  1 : -1;
      return 0;
    }
    return dir === 'asc' ? va - vb : vb - va;
  });

  const fmtRp = v => v ? 'Rp' + Number(v).toLocaleString('id-ID') : '—';
  const tbody  = document.getElementById('cl-tbody');
  const footer = document.getElementById('cl-footer');

  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="color:var(--ink3);font-style:italic;padding:20px">Tidak ada SKU non-aktif yang masih memiliki stok.</td></tr>';
    footer.textContent = '';
    clUpdateMetrics([]);
    clUpdateSortIcons();
    return;
  }

  tbody.innerHTML = data.map(r => {
    const katLabel = _clKatLabel[r.kat] || r.kat;
    return `<tr style="opacity:0.85">
      <td style="font-size:11px;white-space:nowrap">${katLabel}</td>
      <td style="color:var(--ink3)">${r.katalog}</td>
      <td><b style="color:var(--ink2)">${r.sku}</b></td>
      <td style="color:var(--ink3);font-size:12px">${r.boss}</td>
      <td style="text-align:center;font-weight:700;color:${r.sisa <= 3 ? 'var(--warn)' : 'var(--ink2)'}">${r.sisa}</td>
      <td style="text-align:center;color:${r.qty14 > 0 ? 'var(--ok)' : 'var(--ink3)'}">${r.qty14 || '—'}</td>
      <td style="text-align:right;color:var(--ink3);font-size:12px">${fmtRp(r.hpp)}</td>
      <td style="text-align:right;font-weight:700;color:var(--warn)">${fmtRp(r.nilai)}</td>
    </tr>`;
  }).join('');

  // Total row
  const totalPcs   = data.reduce((s, r) => s + r.sisa,  0);
  const totalNilai = data.reduce((s, r) => s + r.nilai, 0);
  tbody.innerHTML += `
    <tr style="font-weight:700;border-top:2px solid var(--ink3)">
      <td colspan="4" style="color:var(--ink2)">Total</td>
      <td style="text-align:center;color:var(--ink2)">${totalPcs}</td>
      <td></td>
      <td></td>
      <td style="text-align:right;color:var(--warn)">${fmtRp(totalNilai)}</td>
    </tr>`;

  footer.textContent = `Menampilkan ${data.length} SKU`;
  clUpdateMetrics(data);
  clUpdateSortIcons();
}

function clUpdateMetrics(data) {
  const fmtRp = v => v ? 'Rp' + Number(v).toLocaleString('id-ID') : 'Rp0';
  const el = id => document.getElementById(id);
  const base = data;
  if (el('cl-total-sku'))   el('cl-total-sku').textContent   = base.length + ' SKU';
  if (el('cl-total-pcs'))   el('cl-total-pcs').textContent   = base.reduce((s,r) => s + r.sisa, 0).toLocaleString('id-ID') + ' pcs';
  if (el('cl-total-nilai')) el('cl-total-nilai').textContent = fmtRp(base.reduce((s,r) => s + r.nilai, 0));
}

// ─── SORT ────────────────────────────────────────────────────
function clSort(col) {
  if (_clSort.col === col) _clSort.dir = _clSort.dir === 'asc' ? 'desc' : 'asc';
  else { _clSort.col = col; _clSort.dir = col === 'nilai' || col === 'sisa' ? 'desc' : 'asc'; }
  clRenderAll();
}
function clUpdateSortIcons() {
  ['kat','sku','sisa','nilai'].forEach(c => {
    const el = document.getElementById('cl-sort-' + c);
    if (!el) return;
    el.textContent = _clSort.col === c ? (_clSort.dir === 'asc' ? '↑' : '↓') : '↕';
    el.style.color = _clSort.col === c ? 'var(--accent)' : 'var(--ink3)';
  });
}

// ─── FILTER KATEGORI PANEL ───────────────────────────────────
function clToggleKat() {
  let panel = document.getElementById('cl-kat-panel');
  if (!panel) {
    // Build panel sekali, mount ke body (sama seperti JP)
    panel = document.createElement('div');
    panel.id = 'cl-kat-panel';
    panel.style.cssText = 'display:none;position:fixed;top:0;left:0;z-index:99999;'
      + 'background:var(--cream2);border-radius:10px;min-width:190px;'
      + 'box-shadow:0 8px 32px rgba(0,0,0,0.6),0 2px 8px rgba(0,0,0,0.4)';

    const opts = [
      { val: '',              label: 'Semua Kategori' },
      { val: 'clearance',    label: '🏷️ Clearance'    },
      { val: 'discontinued', label: '🚫 Discontinued'  },
      { val: 'seasonal',     label: '🌙 Seasonal'      }
    ];
    panel.innerHTML = '<div style="padding:8px 6px">'
      + '<div style="font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;margin-bottom:6px;padding:0 8px;letter-spacing:.5px">Filter Kategori</div>'
      + opts.map(o => `
          <div onclick="clPilihKat('${o.val}')"
            style="padding:9px 12px;cursor:pointer;font-size:13px;font-weight:500;border-radius:6px;margin:1px 4px;
                   transition:background .1s"
            onmouseover="this.style.background='var(--cream3)'"
            onmouseout="this.style.background=''"
            data-val="${o.val}">
            ${o.label}
          </div>`).join('')
      + '</div>';
    document.body.appendChild(panel);
  }

  const isOpen = panel.style.display !== 'none';
  if (!isOpen) {
    const btn  = document.getElementById('cl-kat-btn');
    const rect = btn.getBoundingClientRect();
    panel.style.top  = (rect.bottom + 4) + 'px';
    panel.style.left = rect.left + 'px';
    panel.style.display = 'block';
    setTimeout(() => document.addEventListener('click', clCloseKatOutside), 50);
  } else {
    panel.style.display = 'none';
    document.removeEventListener('click', clCloseKatOutside);
  }
}

function clCloseKatOutside(e) {
  const panel = document.getElementById('cl-kat-panel');
  const btn   = document.getElementById('cl-kat-btn');
  if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
    panel.style.display = 'none';
    document.removeEventListener('click', clCloseKatOutside);
  }
}

function clPilihKat(val) {
  _clFilterKat = val;
  // Update label tombol
  const labels = { '': 'Semua Kategori', clearance: 'Clearance', discontinued: 'Discontinued', seasonal: 'Seasonal' };
  const lblEl  = document.getElementById('cl-kat-label');
  if (lblEl) lblEl.textContent = labels[val] || 'Semua Kategori';
  // Badge
  const badge = document.getElementById('cl-kat-badge');
  if (badge) badge.style.display = val ? 'inline' : 'none';
  // Reset btn — tampil kalau ada filter aktif (kat atau sup)
  const resetBtn = document.getElementById('cl-reset-btn');
  if (resetBtn) resetBtn.style.display = (val || _clFilterSup) ? 'inline-flex' : 'none';
  // Tutup panel
  const panel = document.getElementById('cl-kat-panel');
  if (panel) panel.style.display = 'none';
  document.removeEventListener('click', clCloseKatOutside);
  clRenderAll();
}

function clResetFilter() {
  clPilihKat('');
  clPilihSup('');
}

// ─── FILTER SUPPLIER PANEL ───────────────────────────────────
function clToggleSup() {
  let panel = document.getElementById('cl-sup-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'cl-sup-panel';
    panel.style.cssText = 'display:none;position:fixed;top:0;left:0;z-index:99999;'
      + 'background:var(--cream2);border-radius:10px;min-width:190px;'
      + 'box-shadow:0 8px 32px rgba(0,0,0,0.6),0 2px 8px rgba(0,0,0,0.4)';
    document.body.appendChild(panel);
  }

  const isOpen = panel.style.display !== 'none';
  if (!isOpen) {
    // Build opsi dinamis dari data
    const bossList = ['', ...new Set(_clAllData.map(r => r.boss).filter(Boolean)).values()].sort((a,b) => a.localeCompare(b));
    panel.innerHTML = '<div style="padding:8px 6px">'
      + '<div style="font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;margin-bottom:6px;padding:0 8px;letter-spacing:.5px">Filter Supplier</div>'
      + bossList.map(b => `
          <div onclick="clPilihSup('${b}')"
            style="padding:9px 12px;cursor:pointer;font-size:13px;font-weight:${b === _clFilterSup ? '700' : '500'};border-radius:6px;margin:1px 4px;
                   ${b === _clFilterSup ? 'background:var(--cream3);' : ''}transition:background .1s"
            onmouseover="this.style.background='var(--cream3)'"
            onmouseout="this.style.background='${b === _clFilterSup ? 'var(--cream3)' : ''}'">
            ${b === '' ? '<i class="ti ti-users" style="font-size:11px;margin-right:4px"></i> Semua Supplier' : '<i class="ti ti-user" style="font-size:11px;margin-right:4px"></i> ' + b}
          </div>`).join('')
      + '</div>';

    const btn  = document.getElementById('cl-sup-btn');
    const rect = btn.getBoundingClientRect();
    panel.style.top  = (rect.bottom + 4) + 'px';
    panel.style.left = rect.left + 'px';
    panel.style.display = 'block';
    setTimeout(() => document.addEventListener('click', clCloseSupOutside), 50);
  } else {
    panel.style.display = 'none';
    document.removeEventListener('click', clCloseSupOutside);
  }
}

function clCloseSupOutside(e) {
  const panel = document.getElementById('cl-sup-panel');
  const btn   = document.getElementById('cl-sup-btn');
  if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
    panel.style.display = 'none';
    document.removeEventListener('click', clCloseSupOutside);
  }
}

function clPilihSup(val) {
  _clFilterSup = val;
  const lblEl = document.getElementById('cl-sup-label');
  if (lblEl) lblEl.textContent = val || 'Semua Supplier';
  const badge = document.getElementById('cl-sup-badge');
  if (badge) badge.style.display = val ? 'inline' : 'none';
  const resetBtn = document.getElementById('cl-reset-btn');
  if (resetBtn) resetBtn.style.display = (val || _clFilterKat) ? 'inline-flex' : 'none';
  const panel = document.getElementById('cl-sup-panel');
  if (panel) panel.style.display = 'none';
  document.removeEventListener('click', clCloseSupOutside);
  clRenderAll();
}
