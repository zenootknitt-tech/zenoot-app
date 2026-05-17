// ─── DASHBOARD.JS v4 — Full Edition ──────────────────────────
// Fitur baru v4: AOV, HPP vs Omset/Laba Kotor, Performa per Channel,
//   Grafik Omset per Katalog, Turnover Rate Stok, Ringkasan Beban,
//   Tooltip hover chart penjualan, Distribusi status stok

document.getElementById('page-dashboard').innerHTML = `

  <!-- ═══ ALERT STRIP ════════════════════════════════════════ -->
  <div id="dash-alerts-wrap"></div>

  <!-- ═══ ROW 1: 4 METRIC CARDS ════════════════════════════════ -->
  <div class="metrics" id="dash-metrics">
    <div class="metric">
      <div class="m-label">Total SKU Aktif</div>
      <div class="m-value" id="d-sku">—</div>
      <div class="m-delta">produk terdaftar</div>
      <div class="doodle"><i class="ti ti-package"></i></div>
    </div>
    <div class="metric">
      <div class="m-label">Nilai Stok</div>
      <div class="m-value" id="d-nilaiStok">—</div>
      <div class="m-delta">HPP × sisa stok</div>
      <div class="doodle"><i class="ti ti-coin"></i></div>
    </div>
    <div class="metric">
      <div class="m-label">SKU Kritis</div>
      <div class="m-value" id="d-kritis">—</div>
      <div class="m-delta">stok ≤ 3</div>
      <div class="doodle"><i class="ti ti-alert-triangle"></i></div>
    </div>
    <div class="metric">
      <div class="m-label">Saldo Kas</div>
      <div class="m-value" id="d-saldo">—</div>
      <div class="m-delta">dari jurnal</div>
      <div class="doodle"><i class="ti ti-receipt"></i></div>
    </div>
  </div>

  <!-- ═══ ROW 2: 4 METRIC CARDS ════════════════════════════════ -->
  <div class="metrics">
    <div class="metric">
      <div class="m-label">Omset Bulan Ini</div>
      <div class="m-value" id="d-omset">—</div>
      <div class="m-delta" id="d-omset-delta">dari jurnal penjualan</div>
      <div class="doodle"><i class="ti ti-trending-up"></i></div>
    </div>
    <div class="metric">
      <div class="m-label">Target Harian</div>
      <div class="m-value" id="d-target-harian">—</div>
      <div class="m-delta">
        <div id="d-target-harian-bar-wrap" style="margin-top:4px;display:none">
          <div style="background:var(--cream4);height:6px;border-radius:3px;overflow:hidden;border:1px solid var(--ink4)">
            <div id="d-target-harian-bar" style="height:100%;background:var(--ok);transition:width .5s;width:0%"></div>
          </div>
          <span id="d-target-harian-pct" style="font-size:10px;color:var(--ink3)">0%</span>
        </div>
      </div>
      <div class="doodle"><i class="ti ti-calendar"></i></div>
    </div>
    <div class="metric">
      <div class="m-label">Target Omset</div>
      <div class="m-value" id="d-target">—</div>
      <div class="m-delta">
        <div id="d-target-bar-wrap" style="margin-top:4px;display:none">
          <div style="background:var(--cream4);height:6px;border-radius:3px;overflow:hidden;border:1px solid var(--ink4)">
            <div id="d-target-bar" style="height:100%;background:var(--ok);transition:width .5s;width:0%"></div>
          </div>
          <span id="d-target-pct" style="font-size:10px;color:var(--ink3)">0%</span>
        </div>
      </div>
      <div class="doodle"><i class="ti ti-target"></i></div>
    </div>
    <div class="metric">
      <div class="m-label">Order Hari Ini</div>
      <div style="display:flex;align-items:baseline;gap:8px;margin-top:4px">
        <div class="m-value" id="d-order-qty" style="margin:0">—</div>
        <div style="font-size:11px;color:var(--ink3);font-weight:400;line-height:1">pcs</div>
        <div class="m-value" id="d-order-omset" style="margin:0;color:var(--ok)">—</div>
      </div>
      <div class="m-delta" id="d-order-hari-delta">belum ada order hari ini</div>
      <div class="doodle"><i class="ti ti-shopping-bag"></i></div>
    </div>
  </div>

  <!-- ═══ ROW 2b: METRIC BARU — AOV + LABA KOTOR + BEBAN ═══════ -->
  <div class="metrics">
    <div class="metric">
      <div class="m-label">AOV Bulan Ini</div>
      <div class="m-value" id="d-aov">—</div>
      <div class="m-delta">rata-rata per transaksi</div>
      <div class="doodle"><i class="ti ti-calculator"></i></div>
    </div>
    <div class="metric">
      <div class="m-label">Est. Laba Kotor</div>
      <div class="m-value" id="d-laba">—</div>
      <div class="m-delta" id="d-laba-delta">omset − HPP terjual</div>
      <div class="doodle"><i class="ti ti-chart-bar"></i></div>
    </div>
    <div class="metric">
      <div class="m-label">Beban Operasional</div>
      <div class="m-value" id="d-beban">—</div>
      <div class="m-delta" id="d-beban-delta">bulan ini</div>
      <div class="doodle"><i class="ti ti-clipboard-list"></i></div>
    </div>
    <div class="metric">
      <div class="m-label">Est. Laba Bersih</div>
      <div class="m-value" id="d-laba-bersih">—</div>
      <div class="m-delta">laba kotor − beban</div>
      <div class="doodle"><i class="ti ti-trophy"></i></div>
    </div>
  </div>

  <!-- ═══ ROW 3: GRAFIK PENJUALAN + TOP SKU ════════════════════ -->
  <div class="grid2" style="margin-bottom:12px">

    <div class="card">
      <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
        <div style="display:flex;align-items:center;gap:10px">
          <span><i class="ti ti-chart-line"></i> Tren Penjualan</span>
          <div style="position:relative">
            <button class="btn btn-sm" id="dash-period-btn" onclick="dashTogglePeriodMenu()" style="display:inline-flex;align-items:center;gap:5px;font-size:12px">
              <span id="dash-period-label">Hari Ini</span>
              <span style="font-size:10px">&#9662;</span>
            </button>
            <div id="dash-period-menu" style="display:none;position:absolute;top:calc(100% + 4px);left:0;z-index:300;background:#1c1a14;color:#f0ece0;min-width:160px;box-shadow:3px 4px 0 rgba(0,0,0,0.25);border-radius:2px">
              <div onclick="setDashPeriod(1,'Hari Ini')"       class="dash-period-item" style="padding:9px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.08)">Hari Ini</div>
              <div onclick="setDashPeriod('kemarin','Kemarin')" class="dash-period-item" style="padding:9px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.08)">Kemarin</div>
              <div onclick="setDashPeriod(7,'7 Hari')"         class="dash-period-item" style="padding:9px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.08)">7 Hari</div>
              <div onclick="setDashPeriod(14,'14 Hari')"       class="dash-period-item" style="padding:9px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.08)">14 Hari</div>
              <div onclick="setDashPeriod(30,'30 Hari')"       class="dash-period-item" style="padding:9px 14px;cursor:pointer;font-size:13px;">30 Hari</div>
            </div>
          </div>
        </div>
      </div>
      <div style="position:relative;height:170px;width:100%">
        <canvas id="dash-chart-penjualan" style="width:100%;height:100%;display:block"></canvas>
        <div id="dash-chart-empty" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;color:var(--ink3);font-style:italic;font-size:13px">
          Belum ada data penjualan
        </div>
        <!-- Tooltip hover -->
        <div id="dash-chart-tooltip" style="display:none;position:absolute;background:var(--cream);border:2px solid var(--ink);padding:5px 10px;font-size:11px;font-family:var(--f);pointer-events:none;box-shadow:3px 3px 0 var(--ink4);z-index:10;white-space:nowrap"></div>
      </div>
      <div id="dash-chart-legend" style="display:flex;gap:14px;margin-top:8px;font-size:11px;color:var(--ink3);flex-wrap:wrap"></div>
    </div>

    <div class="card">
      <div class="card-title"><i class="ti ti-trophy"></i> Top 5 SKU Terlaris</div>
      <div id="dash-top-sku">
        <div style="color:var(--ink3);font-style:italic;font-size:13px">Memuat...</div>
      </div>
    </div>

  </div>

  <!-- ═══ ROW 4: STATUS STOK + PERFORMA BOSS ═══════════════════ -->
  <div class="grid2" style="margin-bottom:12px">

    <div class="card card-lined">
      <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
        <span><i class="ti ti-package"></i> Status Stok</span>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <div id="dash-stok-dist" style="display:flex;gap:4px;flex-wrap:wrap"></div>
          <span id="dash-stok-summary" style="font-size:11px;color:var(--ink3);font-weight:400"></span>
        </div>
      </div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>SKU</th><th>Boss</th><th>Sisa</th><th>Terjual/7hr</th><th>Turnover</th><th>ROP</th><th>Status</th></tr></thead>
        <tbody id="dash-stok-tbody">
          <tr><td colspan="7" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
        </tbody>
      </table></div>
    </div>

    <div class="card">
      <div class="card-title"><i class="ti ti-users"></i> Performa Supplier</div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Supplier</th><th>Qty</th><th>Omset</th><th>%</th></tr></thead>
        <tbody id="dash-boss-tbody">
          <tr><td colspan="4" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
        </tbody>
      </table></div>
    </div>

  </div>

  <!-- ═══ ROW 5: PERFORMA CHANNEL + GRAFIK OMSET PER KATALOG ═══ -->
  <div class="grid2" style="margin-bottom:12px">

    <div class="card">
      <div class="card-title"><i class="ti ti-building-store"></i> Performa per Channel / Toko</div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Channel</th><th>Trx</th><th>Qty</th><th>Omset</th><th>%</th></tr></thead>
        <tbody id="dash-channel-tbody">
          <tr><td colspan="5" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
        </tbody>
      </table></div>
    </div>

    <div class="card">
      <div class="card-title"><i class="ti ti-chart-bar"></i> Omset per Katalog / SKU Induk</div>
      <div style="position:relative;height:220px;width:100%">
        <canvas id="dash-chart-katalog" style="width:100%;height:100%;display:block"></canvas>
        <div id="dash-katalog-empty" style="display:none;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--ink3);font-style:italic;font-size:13px">
          Belum ada data
        </div>
      </div>
    </div>

  </div>

  <!-- ═══ ROW 6: RINGKASAN BEBAN + JURNAL TERAKHIR ════════════ -->
  <div class="grid2" style="margin-bottom:12px">

    <div class="card">
      <div class="card-title"><i class="ti ti-report-money"></i> Ringkasan Beban Operasional</div>
      <div id="dash-beban-wrap">
        <div style="color:var(--ink3);font-style:italic;font-size:13px">Memuat...</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><i class="ti ti-list"></i> Jurnal Terakhir</div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Tgl</th><th>Keterangan</th><th>Debit</th><th>Kredit</th></tr></thead>
        <tbody id="dash-jurnal-tbody">
          <tr><td colspan="4" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
        </tbody>
      </table></div>
    </div>

  </div>

  <!-- ═══ ROW 7: AKTIVITAS FEED ════════════════════════════════ -->
  <div class="grid2" style="margin-bottom:12px">
    <div class="card" style="grid-column:1/-1">
      <div class="card-title"><i class="ti ti-clock"></i> Aktivitas Terbaru</div>
      <div id="dash-aktivitas-feed" style="display:flex;flex-direction:column;gap:0">
        <div style="color:var(--ink3);font-style:italic;font-size:13px">Memuat...</div>
      </div>
    </div>
  </div>

  <!-- ═══ FOOTER ════════════════════════════════════════════════ -->
  <div style="text-align:right;margin-top:4px;display:flex;align-items:center;justify-content:space-between">
    <span id="dash-last-refresh" style="font-size:11px;color:var(--ink3)"></span>
    <button class="btn btn-sm" onclick="loadDashboard()"><i class="ti ti-refresh"></i> Refresh</button>
  </div>

  <!-- MODAL TARGET OMSET -->
  <div class="modal-overlay" id="modal-target" onclick="if(event.target===this)closeModal('modal-target')">
    <div class="modal" style="max-width:360px">
      <div class="modal-title"><i class="ti ti-target"></i> Set Target Omset</div>
      <div style="margin-bottom:14px">
        <label style="font-size:12px;color:var(--ink3);display:block;margin-bottom:6px">Target Omset Bulan Ini (Rp)</label>
        <input type="number" id="inp-target-omset" placeholder="Contoh: 10000000"
          style="font-family:var(--f);font-size:14px;padding:8px 10px;border:2px solid var(--ink);background:var(--cream);width:100%">
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary btn-sm" onclick="simpanTarget()"><i class="ti ti-check"></i> Simpan</button>
        <button class="btn btn-sm" onclick="closeModal('modal-target')"><i class="ti ti-x"></i> Batal</button>
      </div>
    </div>
  </div>
`;

// ─── INJECT STYLE ─────────────────────────────────────────────
(function() {
  if (document.getElementById('dash-extra-style')) return;
  const s = document.createElement('style');
  s.id = 'dash-extra-style';
  s.textContent = `
    .dash-alert-item{background:var(--cream4);border:2px solid var(--ink);padding:7px 12px;font-size:13px;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:8px;box-shadow:3px 3px 0 var(--ink4)}
    .dash-alert-item.danger{border-color:var(--danger)}
    .dash-alert-item.warn{border-color:var(--warn)}
    .dash-alert-item i{font-size:15px;flex-shrink:0}
    .dash-period-btn{padding:2px 8px !important;min-height:28px !important;font-size:12px !important}
    .active-period{background:var(--ink) !important;color:var(--cream) !important}
    .dash-top-sku-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px dashed var(--ink4)}
    .dash-top-sku-row:last-child{border-bottom:none;margin-bottom:0}
    .dash-rank{font-size:13px;width:20px;flex-shrink:0;text-align:center}
    .dash-feed-item{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px dashed var(--ink4);font-size:12px}
    .dash-feed-item:last-child{border-bottom:none}
    .dash-feed-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:3px}
    .dash-feed-dot.sell{background:var(--ok)}
    .dash-feed-dot.kas{background:var(--warn)}
    .dash-feed-time{font-size:10px;color:var(--ink4);margin-top:2px}
    .target-link{font-size:11px;color:var(--ink4);cursor:pointer;text-decoration:underline dashed;margin-left:4px}
    .target-link:hover{color:var(--ink2)}
    .dist-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border:2px solid var(--ink);font-size:11px;font-weight:700;font-family:var(--f)}
    .beban-row{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px dashed var(--ink4);font-size:13px}
    .beban-row:last-child{border-bottom:none}
  `;
  document.head.appendChild(s);
})();


// ─── STATE ────────────────────────────────────────────────────
let _dashPeriod     = 1; // default Hari Ini  (bisa juga string 'kemarin')
let _dashJPData     = [];
let _dashStokData   = [];
let _dashChannelMap = {};
let _dashChartPoints = []; // untuk tooltip hover

// ─── HELPERS ─────────────────────────────────────────────────
function _fmtRp(v) {
  return fmtRpFull(v);
}
function _fmtRpShort(v) {
  return fmtRpShort(v);
}
function _fmtTgl(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit'});
  } catch(e) { return '—'; }
}
function _fmtAgo(iso) {
  if (!iso) return '';
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 2)  return 'baru saja';
    if (m < 60) return m + ' mnt lalu';
    const h = Math.floor(m / 60);
    if (h < 24) return h + ' jam lalu';
    return Math.floor(h/24) + ' hari lalu';
  } catch(e) { return ''; }
}
function statusBadgeDash(sisa) {
  if (sisa <= 0) return '<span class="badge badge-crit">Habis!</span>';
  if (sisa <= 3) return '<span class="badge badge-crit">Kritis!</span>';
  if (sisa <= 8) return '<span class="badge badge-warn">Ati2</span>';
  return '<span class="badge badge-ok">Aman</span>';
}

// ─── LOCAL DATE HELPER (WIB-safe, bukan UTC) ─────────────────
// new Date().toISOString() selalu UTC → salah di WIB jam 00-06
// Gunakan _localDateStr() untuk tanggal lokal yang benar
function _localDateStr(d) {
  const dt = d || new Date();
  const y  = dt.getFullYear();
  const m  = String(dt.getMonth()+1).padStart(2,'0');
  const dd = String(dt.getDate()).padStart(2,'0');
  return y + '-' + m + '-' + dd;
}
function _localDateOffset(daysBack) {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  return _localDateStr(d);
}

// ─── TARGET ──────────────────────────────────────────────────
function _getTarget() { return parseInt(localStorage.getItem('zenoot_target_omset') || '0') || 0; }
function simpanTarget() {
  const v = parseInt(document.getElementById('inp-target-omset').value) || 0;
  if (v <= 0) { alert('Target harus lebih dari 0'); return; }
  localStorage.setItem('zenoot_target_omset', String(v));
  closeModal('modal-target');
  loadDashboard();
}
function openTargetModal() {
  document.getElementById('inp-target-omset').value = _getTarget() || '';
  document.getElementById('modal-target').classList.add('open');
  setTimeout(() => { if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('modal-target')); }, 50);
}

// ─── PERIOD TOGGLE ────────────────────────────────────────────
function dashTogglePeriodMenu() {
  var menu = document.getElementById('dash-period-menu');
  if (!menu) return;
  if (menu.style.display === 'block') {
    menu.style.display = 'none';
    return;
  }
  menu.style.display = 'block';
}

// Permanent listener — persis pola stok.js
document.addEventListener('click', function(e) {
  var menu = document.getElementById('dash-period-menu');
  var btn  = document.getElementById('dash-period-btn');
  if (!menu || menu.style.display !== 'block') return;

  // Klik di item menu — jalankan setDashPeriod
  var item = e.target.closest('.dash-period-item');
  if (item) {
    var p = item.getAttribute('data-period');
    var l = item.getAttribute('data-label');
    setDashPeriod(isNaN(p) ? p : Number(p), l);
    menu.style.display = 'none';
    return;
  }

  // Klik di luar menu & bukan tombol — tutup
  if (!menu.contains(e.target) && btn && !btn.contains(e.target)) {
    menu.style.display = 'none';
  }
});

function setDashPeriod(days, label) {
  _dashPeriod = days;
  var lbl = document.getElementById('dash-period-label');
  if (lbl) lbl.textContent = label || (days + ' Hari');
  var menu = document.getElementById('dash-period-menu');
  if (menu) menu.style.display = 'none';
  // Pastikan data sudah tersedia sebelum render
  if (_dashJPData && _dashJPData.length >= 0) {
    _renderChartPenjualan(_dashJPData);
  }
}

// ─── ALERTS ──────────────────────────────────────────────────
function _renderAlerts(stokData, saldo) {
  const wrap = document.getElementById('dash-alerts-wrap');
  if (!wrap) return;
  const alerts = [];
  const habis      = stokData.filter(r => r.sisa <= 0);
  const kritis     = stokData.filter(r => r.sisa > 0 && r.sisa <= 3);
  if (habis.length)  alerts.push({ cls:'danger', icon:'ti-circle-off',    msg: habis.length + ' SKU HABIS stok: ' + habis.slice(0,3).map(r=>r.sku_variasi).join(', ') + (habis.length>3?' ...':'') + ' — restock segera!' });
  if (kritis.length) alerts.push({ cls:'warn',   icon:'ti-alert-triangle', msg: kritis.length + ' SKU hampir habis: ' + kritis.slice(0,3).map(r=>r.sku_variasi).join(', ') + (kritis.length>3?' ...':'') });
  if (saldo < 0)     alerts.push({ cls:'danger', icon:'ti-coin-off',       msg: 'Saldo kas negatif ' + _fmtRp(Math.abs(saldo)) + ' — cek jurnal kas!' });
  wrap.innerHTML = alerts.map(a =>
    '<div class="dash-alert-item ' + a.cls + '"><i class="ti ' + a.icon + '" style="color:var(--' + (a.cls==='danger'?'danger':'warn') + ')"></i><span>' + a.msg + '</span></div>'
  ).join('');
}

// ─── CHART HARI INI (per jam) ────────────────────────────────
function _renderChartHariIni(jpData, canvas, tooltip) {
  const todayStr = _localDateStr(); // FIX: pakai lokal WIB bukan UTC
  const labels = [], totals = [];

  // FIX: loop 0-23 saja (jam 24 tidak valid)
  for (let h = 0; h <= 23; h++) {
    const hStr = String(h).padStart(2,'0');
    labels.push(hStr + ':00');
    const jam = jpData
      .filter(r => {
        if (!r.tanggal || String(r.tanggal).slice(0,10) !== todayStr) return false;
        const wkt = String(r.waktu || '00:00');
        return wkt.slice(0,2) === hStr;
      })
      .reduce((s,r) => s + (Number(r.total)||0), 0);
    totals.push(jam);
  }

  const total   = totals.reduce((s,v)=>s+v,0);
  const emptyEl = document.getElementById('dash-chart-empty');
  const leg     = document.getElementById('dash-chart-legend');

  if (total === 0) {
    canvas.style.display = 'none';
    if (emptyEl) { emptyEl.style.display='flex'; emptyEl.textContent='Belum ada penjualan hari ini'; }
    if (leg) leg.innerHTML = '';
    return;
  }

  // FIX: retry canvas DULU sebelum lanjut render (canvas bisa belum punya ukuran)
  if (!canvas.offsetWidth || canvas.offsetWidth < 10) {
    setTimeout(() => _renderChartHariIni(jpData, canvas, tooltip), 80);
    return;
  }

  canvas.style.display = 'block';
  if (emptyEl) emptyEl.style.display = 'none';

  const dpr = window.devicePixelRatio || 1;
  const W   = canvas.offsetWidth;
  const H   = canvas.offsetHeight || 160;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const padL=44, padR=16, padT=14, padB=34;
  const cW=W-padL-padR, cH=H-padT-padB;
  const maxVal = Math.max(...totals, 1);
  const step   = cW / (totals.length - 1 || 1);
  const colLine='#2a6e3a', colFill='rgba(42,110,58,0.1)', colGrid='rgba(28,26,20,0.08)', colLabel='#6b6354';

  // Grid
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i <= 4; i++) {
    const y = padT + cH - (cH * i / 4);
    ctx.strokeStyle=colGrid; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+cW,y); ctx.stroke();
    ctx.fillStyle=colLabel; ctx.font='10px sans-serif'; ctx.textAlign='right';
    ctx.fillText(_fmtRpShort(maxVal*i/4), padL-4, y+3);
  }

  // Area fill
  ctx.beginPath();
  totals.forEach((v,i) => { const x=padL+i*step, y=padT+cH-(v/maxVal)*cH; i===0?ctx.moveTo(x,padT+cH):ctx.lineTo(x,y); });
  ctx.lineTo(padL+(totals.length-1)*step, padT+cH);
  ctx.closePath(); ctx.fillStyle=colFill; ctx.fill();

  // Line
  ctx.beginPath(); ctx.strokeStyle=colLine; ctx.lineWidth=2; ctx.lineJoin='round';
  totals.forEach((v,i) => { const x=padL+i*step, y=padT+cH-(v/maxVal)*cH; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.stroke();

  // X labels — tampilkan setiap 3 jam agar muat (00,03,06,09,12,15,18,21)
  labels.forEach((lbl,i) => {
    if (i % 3 !== 0) return;
    const x = padL + i * step;
    ctx.fillStyle=colLabel; ctx.font='10px sans-serif'; ctx.textAlign='center';
    ctx.fillText(lbl, x, padT+cH+14);
  });

  // Legend
  if (leg) {
    const colLegend = '#2a6e3a';
    leg.innerHTML =
      '<span style="display:flex;align-items:center;gap:4px"><span style="width:14px;height:3px;background:'+colLegend+';display:inline-block;border-radius:2px"></span>Hari Ini: '+_fmtRp(total)+'</span>';
  }
}


// ─── CHART KEMARIN (per jam) ─────────────────────────────────
function _renderChartKemarin(jpData, canvas, tooltip) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = _localDateStr(yesterday);
  const labels = [], totals = [];

  for (let h = 0; h <= 23; h++) {
    const hStr = String(h).padStart(2,'0');
    labels.push(hStr + ':00');
    const jam = jpData
      .filter(r => {
        if (!r.tanggal || String(r.tanggal).slice(0,10) !== yStr) return false;
        const wkt = String(r.waktu || '00:00');
        return wkt.slice(0,2) === hStr;
      })
      .reduce((s,r) => s + (Number(r.total)||0), 0);
    totals.push(jam);
  }

  const total   = totals.reduce((s,v)=>s+v,0);
  const emptyEl = document.getElementById('dash-chart-empty');
  const leg     = document.getElementById('dash-chart-legend');

  if (total === 0) {
    canvas.style.display = 'none';
    if (emptyEl) { emptyEl.style.display='flex'; emptyEl.textContent='Belum ada penjualan kemarin'; }
    if (leg) leg.innerHTML = '';
    return;
  }

  if (!canvas.offsetWidth || canvas.offsetWidth < 10) {
    setTimeout(() => _renderChartKemarin(jpData, canvas, tooltip), 80);
    return;
  }

  canvas.style.display = 'block';
  if (emptyEl) emptyEl.style.display = 'none';

  const dpr = window.devicePixelRatio || 1;
  const W   = canvas.offsetWidth;
  const H   = canvas.offsetHeight || 160;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const padL=44, padR=16, padT=14, padB=34;
  const cW=W-padL-padR, cH=H-padT-padB;
  const maxVal = Math.max(...totals, 1);
  const step   = cW / (totals.length - 1 || 1);
  const colLine='#2a6e3a', colFill='rgba(42,110,58,0.1)', colGrid='rgba(28,26,20,0.08)', colLabel='#6b6354';

  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i <= 4; i++) {
    const y = padT + cH - (cH * i / 4);
    ctx.strokeStyle=colGrid; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+cW,y); ctx.stroke();
    ctx.fillStyle=colLabel; ctx.font='10px sans-serif'; ctx.textAlign='right';
    ctx.fillText(_fmtRpShort(maxVal*i/4), padL-4, y+3);
  }

  ctx.beginPath();
  totals.forEach((v,i) => { const x=padL+i*step, y=padT+cH-(v/maxVal)*cH; i===0?ctx.moveTo(x,padT+cH):ctx.lineTo(x,y); });
  ctx.lineTo(padL+(totals.length-1)*step, padT+cH);
  ctx.closePath(); ctx.fillStyle=colFill; ctx.fill();

  ctx.beginPath(); ctx.strokeStyle=colLine; ctx.lineWidth=2; ctx.lineJoin='round';
  totals.forEach((v,i) => { const x=padL+i*step, y=padT+cH-(v/maxVal)*cH; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.stroke();

  labels.forEach((lbl,i) => {
    if (i % 3 !== 0) return;
    const x = padL + i * step;
    ctx.fillStyle=colLabel; ctx.font='10px sans-serif'; ctx.textAlign='center';
    ctx.fillText(lbl, x, padT+cH+14);
  });

  if (leg) {
    const d = yesterday;
    const tgl = String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0');
    leg.innerHTML = '<span style="display:flex;align-items:center;gap:4px"><span style="width:14px;height:3px;background:#2a6e3a;display:inline-block;border-radius:2px"></span>Kemarin (' + tgl + '): ' + _fmtRp(total) + '</span>';
  }
}
// ─── CHART PENJUALAN + TOOLTIP HOVER ─────────────────────────
function _renderChartPenjualan(jpData) {
  const canvas  = document.getElementById('dash-chart-penjualan');
  const tooltip = document.getElementById('dash-chart-tooltip');
  if (!canvas) return;

  // Mode Hari Ini: tampil per jam 00-23
  if (_dashPeriod === 1) {
    _renderChartHariIni(jpData, canvas, tooltip);
    return;
  }

  // Mode Kemarin: tampil per jam 00-23, date = kemarin
  if (_dashPeriod === 'kemarin') {
    _renderChartKemarin(jpData, canvas, tooltip);
    return;
  }

  const today = new Date();
  const labels = [], totals = [], dates = [];
  for (let i = _dashPeriod - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = _localDateStr(d); // FIX: pakai lokal WIB bukan UTC
    dates.push(key);
    labels.push(String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0'));
    const dayTotal = jpData
      .filter(r => r.tanggal && String(r.tanggal).slice(0,10) === key)
      .reduce((s,r) => s + (Number(r.total)||0), 0);
    totals.push(dayTotal);
  }

  // FIX: retry canvas DULU sebelum lanjut (canvas bisa belum punya ukuran saat pertama load)
  if (!canvas.offsetWidth || canvas.offsetWidth < 10) {
    setTimeout(() => _renderChartPenjualan(jpData), 80);
    return;
  }

  const maxVal  = Math.max(...totals, 1);
  const hasData = totals.some(v => v > 0);
  const emptyEl = document.getElementById('dash-chart-empty');
  if (emptyEl) { emptyEl.style.display = hasData ? 'none' : 'flex'; }
  if (!hasData) return;

  const dpr = window.devicePixelRatio || 1;
  const W   = canvas.offsetWidth;
  const H   = canvas.offsetHeight || 160;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const padL=44, padR=36, padT=14, padB=34;
  const cW=W-padL-padR, cH=H-padT-padB;
  const colLine='#2a6e3a', colFill='rgba(42,110,58,0.1)', colGrid='rgba(28,26,20,0.08)', colLabel='#6b6354';

  for (let i=0; i<=4; i++) {
    const y = padT + cH - cH*i/4;
    ctx.strokeStyle=colGrid; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+cW,y); ctx.stroke();
    ctx.fillStyle=colLabel; ctx.font='10px sans-serif'; ctx.textAlign='right';
    ctx.fillText(_fmtRpShort(maxVal*i/4), padL-4, y+3);
  }

  const step = cW / Math.max(labels.length-1, 1);

  ctx.fillStyle='rgba(200,160,0,0.12)';
  ctx.fillRect(padL+cW-step*0.6, padT, step*0.6+padR, cH);

  ctx.beginPath();
  ctx.moveTo(padL, padT+cH);
  totals.forEach((v,i) => { const x=padL+i*step, y=padT+cH-(v/maxVal)*cH; i===0?ctx.lineTo(x,y):ctx.lineTo(x,y); });
  ctx.lineTo(padL+(totals.length-1)*step, padT+cH);
  ctx.closePath(); ctx.fillStyle=colFill; ctx.fill();

  ctx.beginPath(); ctx.strokeStyle=colLine; ctx.lineWidth=2; ctx.lineJoin='round';
  totals.forEach((v,i) => { const x=padL+i*step, y=padT+cH-(v/maxVal)*cH; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.stroke();

  // Simpan koordinat titik untuk tooltip
  _dashChartPoints = [];
  const skip = Math.ceil(labels.length/7);
  totals.forEach((v,i) => {
    const x=padL+i*step, y=padT+cH-(v/maxVal)*cH;
    _dashChartPoints.push({ x, y, label: labels[i], date: dates[i], val: v });
    ctx.beginPath(); ctx.arc(x,y,3.5,0,Math.PI*2);
    ctx.fillStyle=v>0?colLine:colGrid; ctx.fill();
    ctx.strokeStyle='#fff'; ctx.lineWidth=1; ctx.stroke();
    if (i%skip===0 || i===labels.length-1) {
      ctx.fillStyle=colLabel; ctx.font='10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(labels[i], x, H-padB+14);
    }
    if (i===totals.length-1 && v>0) {
      ctx.fillStyle='#2a6e3a'; ctx.font='bold 10px sans-serif';
      // Kalau titik terakhir dekat tepi kanan, geser label ke dalam
      const labelW = ctx.measureText(_fmtRpShort(v)).width;
      if (x + labelW/2 > W - padR) {
        ctx.textAlign='right';
        ctx.fillText(_fmtRpShort(v), Math.min(x, W-padR-2), y-9);
      } else {
        ctx.textAlign='center';
        ctx.fillText(_fmtRpShort(v), x, y-9);
      }
    }
  });

  // Tooltip hover
  if (tooltip) {
    canvas.onmousemove = function(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let closest = null, minDist = 30;
      _dashChartPoints.forEach(pt => {
        const dist = Math.abs(mx - pt.x);
        if (dist < minDist) { minDist = dist; closest = pt; }
      });
      if (closest) {
        const txn = jpData.filter(r => r.tanggal && String(r.tanggal).slice(0,10) === closest.date);
        const qty = txn.reduce((s,r)=>s+(Number(r.qty)||0),0);
        tooltip.innerHTML = '<b>' + closest.label + '</b>  ' + _fmtRp(closest.val) + '  ·  ' + qty + ' pcs  ·  ' + txn.length + ' trx';
        const tooltipX = Math.min(closest.x + 10, W - 170);
        const tooltipY = Math.max(closest.y - 36, 0);
        tooltip.style.left  = tooltipX + 'px';
        tooltip.style.top   = tooltipY + 'px';
        tooltip.style.display = 'block';
      } else {
        tooltip.style.display = 'none';
      }
    };
    canvas.onmouseleave = function() { tooltip.style.display = 'none'; };
  }

  const leg = document.getElementById('dash-chart-legend');
  if (leg) {
    const total = totals.reduce((a,b)=>a+b,0);
    const half  = Math.floor(totals.length/2);
    const prev  = totals.slice(0,half).reduce((a,b)=>a+b,0);
    const curr  = totals.slice(half).reduce((a,b)=>a+b,0);
    const delta = prev>0 ? ((curr-prev)/prev*100).toFixed(0) : null;
    const dStr  = delta!==null ? (delta>=0?'▲ +':'▼ ') + delta + '% vs paruh pertama' : '';
    const dCol  = delta>=0?'var(--ok)':'var(--danger)';
    leg.innerHTML =
      '<span style="display:flex;align-items:center;gap:4px"><span style="width:14px;height:3px;background:'+colLine+';display:inline-block;border-radius:2px"></span>'+(document.getElementById('dash-period-label')?document.getElementById('dash-period-label').textContent:_dashPeriod+' hari')+': '+_fmtRp(total)+'</span>' +
      (dStr ? '<span style="color:'+dCol+';font-weight:700">'+dStr+'</span>' : '');
  }
}

// ─── TOP SKU ─────────────────────────────────────────────────
function _renderTopSku(jpData) {
  const el = document.getElementById('dash-top-sku');
  if (!el) return;
  const map = {};
  jpData.forEach(r => {
    if (!r.sku) return;
    if (!map[r.sku]) map[r.sku] = {qty:0,omset:0};
    map[r.sku].qty   += (r.qty||0);
    map[r.sku].omset += (r.total||0);
  });
  const sorted = Object.entries(map).sort((a,b)=>b[1].omset-a[1].omset).slice(0,5);
  if (!sorted.length) { el.innerHTML='<div style="color:var(--ink3);font-style:italic;font-size:13px">Belum ada data penjualan bulan ini</div>'; return; }
  const maxO  = sorted[0][1].omset;
  const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
  el.innerHTML = sorted.map(([sku,d],i) => {
    const pct = maxO>0 ? (d.omset/maxO*100).toFixed(0) : 0;
    return '<div class="dash-top-sku-row">' +
      '<span class="dash-rank">'+medals[i]+'</span>' +
      '<div style="flex:1">' +
        '<div style="font-size:13px;font-weight:700;color:var(--ink);margin-bottom:2px">'+sku+'</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<div style="flex:1;background:var(--cream4);height:6px;border-radius:3px;border:1px solid var(--ink4);overflow:hidden"><div style="width:'+pct+'%;height:100%;background:var(--ok);border-radius:3px"></div></div>' +
          '<span style="font-size:11px;color:var(--ink3);white-space:nowrap">'+d.qty+' pcs</span>' +
        '</div>' +
      '</div>' +
      '<span style="font-size:12px;color:var(--ink3);white-space:nowrap;margin-left:6px">'+_fmtRp(d.omset)+'</span>' +
    '</div>';
  }).join('');
}

// ─── BOSS CHART ──────────────────────────────────────────────
function _renderBoss(jpData, stokData) {
  const skuBossMap = {};
  stokData.forEach(r => {
    if (r.sku_variasi && r.boss)
      skuBossMap[(r.sku_variasi||'').toUpperCase()] = r.boss;
  });
  const bossMap = {};
  jpData.forEach(r => {
    const boss = skuBossMap[(r.sku||'').toUpperCase()] || 'Lainnya';
    if (!bossMap[boss]) bossMap[boss] = {qty:0,omset:0};
    bossMap[boss].qty   += (r.qty||0);
    bossMap[boss].omset += (Number(r.total)||0);
  });
  const sorted     = Object.entries(bossMap).sort((a,b)=>b[1].omset-a[1].omset);
  const totalOmset = sorted.reduce((s,[,d])=>s+d.omset, 0);
  const colors     = ['#2a6e3a','#2266cc','#c8a000','#b03020','#6b3fa0','#1a8a7a'];

  const tbody = document.getElementById('dash-boss-tbody');
  if (tbody) {
    const EMPTY_ROW_BOSS = '<tr><td colspan="4" style="color:var(--ink4);text-align:center">—</td></tr>';
    if (!sorted.length) {
      const rows = Array(5).fill(EMPTY_ROW_BOSS);
      tbody.innerHTML = rows.join('');
    } else {
      const rows = sorted.slice(0, 5).map(([boss,d],i) => {
        const pct = totalOmset>0?(d.omset/totalOmset*100).toFixed(0):0;
        return '<tr>' +
          '<td><b>'+boss+'</b></td>' +
          '<td>'+d.qty+'</td>' +
          '<td><b style="color:var(--ok)">'+_fmtRp(d.omset)+'</b></td>' +
          '<td><div style="display:flex;align-items:center;gap:4px">'+
            '<div style="width:40px;background:var(--cream4);height:5px;border-radius:2px;overflow:hidden;border:1px solid var(--ink4)">'+
              '<div style="width:'+pct+'%;height:100%;background:'+colors[i%colors.length]+'"></div>'+
            '</div>'+
            '<span style="font-size:11px;color:var(--ink3)">'+pct+'%</span>'+
          '</div></td>' +
        '</tr>';
      });
      while (rows.length < 5) rows.push(EMPTY_ROW_BOSS);
      tbody.innerHTML = rows.join('');
    }
  }

  const canvas = document.getElementById('dash-chart-boss');
  if (!canvas || !sorted.length || totalOmset===0) return;
  const dpr = window.devicePixelRatio||1;
  const wrap = canvas.parentElement;
  const W = wrap ? (wrap.offsetWidth  || 260) : 260;
  const H = wrap ? (wrap.offsetHeight || 200) : 200;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const cx = W/2, cy = H/2;
  const r  = Math.min(cx, cy) - 10;
  const inner = r * 0.46;
  let angle = -Math.PI/2;
  sorted.forEach(([,d],i) => {
    const slice = (d.omset/totalOmset)*Math.PI*2;
    if (slice<=0) return;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,angle,angle+slice);
    ctx.closePath();
    ctx.fillStyle=colors[i%colors.length]; ctx.fill();
    ctx.strokeStyle='#fff'; ctx.lineWidth=2.5; ctx.stroke();
    angle += slice;
  });
  ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2);
  ctx.fillStyle='#ede7d9'; ctx.fill();
  ctx.fillStyle='#1c1a14'; ctx.font='bold 12px sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(_fmtRpShort(totalOmset),cx,cy-7);
  ctx.font='10px sans-serif'; ctx.fillStyle='#6b6354';
  ctx.fillText('total omset',cx,cy+8);

  const legendEl = document.getElementById('dash-boss-legend');
  if (legendEl) {
    legendEl.innerHTML = sorted.map(([boss,d],i) => {
      const pct = totalOmset>0?(d.omset/totalOmset*100).toFixed(0):0;
      return '<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;white-space:nowrap">' +
        '<span style="width:9px;height:9px;border-radius:50%;background:'+colors[i%colors.length]+';flex-shrink:0;display:inline-block;box-shadow:0 0 0 1px rgba(255,255,255,0.6)"></span>' +
        '<span style="font-size:11px;font-weight:700;color:var(--ink);text-shadow:0 0 3px rgba(237,231,217,0.9),0 0 6px rgba(237,231,217,0.9)">'+boss+'</span>' +
        '<span style="font-size:11px;font-weight:700;color:'+colors[i%colors.length]+';text-shadow:0 0 3px rgba(237,231,217,0.9),0 0 6px rgba(237,231,217,0.9)">'+pct+'%</span>' +
      '</div>';
    }).join('');
  }
}

// ─── PERFORMA CHANNEL — BARU ──────────────────────────────────
function _renderChannel(jpData) {
  const tbody  = document.getElementById('dash-channel-tbody');
  const canvas = document.getElementById('dash-chart-channel');
  if (!tbody) return;

  // Build channel map dari _dashChannelMap (sudah di-load)
  const chMap = {};
  jpData.forEach(r => {
    const ch  = _dashChannelMap[r.channel_id];
    const key = ch ? (ch.nama || ('Ch#'+r.channel_id)) : 'Tidak Diketahui';
    if (!chMap[key]) chMap[key] = {trx:0, qty:0, omset:0, kategori: ch ? (ch.kategori||'') : ''};
    chMap[key].trx++;
    chMap[key].qty   += (Number(r.qty)||0);
    chMap[key].omset += (Number(r.total)||0);
  });

  const sorted     = Object.entries(chMap).sort((a,b)=>b[1].omset-a[1].omset);
  const totalOmset = sorted.reduce((s,[,d])=>s+d.omset, 0);
  const colors     = ['#2a6e3a','#2266cc','#c8a000','#b03020','#6b3fa0','#1a8a7a','#888'];

  const EMPTY_ROW_CH = '<tr><td colspan="5" style="color:var(--ink4);text-align:center">—</td></tr>';
  if (!sorted.length) {
    const rows = Array(5).fill(EMPTY_ROW_CH);
    tbody.innerHTML = rows.join('');
    return;
  }

  const chRows = sorted.slice(0, 5).map(([chNama, d], i) => {
    const pct = totalOmset>0 ? (d.omset/totalOmset*100).toFixed(0) : 0;
    // Pass object {nama, kategori} ke chBadge agar icon akurat
    const badgeHtml = chBadge({ nama: chNama, kategori: d.kategori });
    return '<tr>' +
      '<td>'+badgeHtml+'</td>' +
      '<td style="text-align:center">'+d.trx+'</td>' +
      '<td style="text-align:center">'+d.qty+'</td>' +
      '<td><b style="color:var(--ok)">'+_fmtRp(d.omset)+'</b></td>' +
      '<td><div style="display:flex;align-items:center;gap:4px">'+
        '<div style="width:36px;background:var(--cream4);height:5px;border-radius:2px;overflow:hidden;border:1px solid var(--ink4)">'+
          '<div style="width:'+pct+'%;height:100%;background:'+colors[i%colors.length]+'"></div>'+
        '</div>'+
        '<span style="font-size:11px;color:var(--ink3)">'+pct+'%</span>'+
      '</div></td>' +
    '</tr>';
  });
  while (chRows.length < 5) chRows.push(EMPTY_ROW_CH);
  tbody.innerHTML = chRows.join('');

  // Donut chart channel — full wrapper size
  if (!canvas || totalOmset===0) return;
  const dpr = window.devicePixelRatio||1;
  const wrap = canvas.parentElement;
  const W = wrap ? (wrap.offsetWidth  || 260) : 260;
  const H = wrap ? (wrap.offsetHeight || 200) : 200;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const cx=W/2, cy=H/2, r=Math.min(cx,cy)-10, inner=r*0.46;
  let angle=-Math.PI/2;
  sorted.forEach(([,d],i) => {
    const slice=(d.omset/totalOmset)*Math.PI*2;
    if(slice<=0) return;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,angle,angle+slice);
    ctx.closePath();
    ctx.fillStyle=colors[i%colors.length]; ctx.fill();
    ctx.strokeStyle='#fff'; ctx.lineWidth=2.5; ctx.stroke();
    angle+=slice;
  });
  ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2);
  ctx.fillStyle='#ede7d9'; ctx.fill();
  ctx.fillStyle='#1c1a14'; ctx.font='bold 12px sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(_fmtRpShort(totalOmset),cx,cy-7);
  ctx.font='10px sans-serif'; ctx.fillStyle='#6b6354';
  ctx.fillText(sorted.length+' channel',cx,cy+8);

  // Legend
  const legendEl = document.getElementById('dash-channel-legend');
  if (legendEl) {
    legendEl.innerHTML = sorted.map(([ch,d],i) => {
      const pct = totalOmset>0?(d.omset/totalOmset*100).toFixed(0):0;
      return '<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;white-space:nowrap">' +
        '<span style="width:9px;height:9px;border-radius:50%;background:'+colors[i%colors.length]+';flex-shrink:0;display:inline-block;box-shadow:0 0 0 1px rgba(255,255,255,0.6)"></span>' +
        '<span style="font-size:11px;font-weight:700;color:var(--ink);text-shadow:0 0 3px rgba(237,231,217,0.9),0 0 6px rgba(237,231,217,0.9)">'+ch+'</span>' +
        '<span style="font-size:11px;font-weight:700;color:'+colors[i%colors.length]+';text-shadow:0 0 3px rgba(237,231,217,0.9),0 0 6px rgba(237,231,217,0.9)">'+pct+'%</span>' +
      '</div>';
    }).join('');
  }
}

// ─── GRAFIK OMSET PER KATALOG — BARU ─────────────────────────
function _renderKatalog(jpData, stokData) {
  const canvas = document.getElementById('dash-chart-katalog');
  if (!canvas) return;

  // Map sku → katalog
  const skuKatalogMap = {};
  stokData.forEach(r => {
    if (r.sku_variasi && r.katalog)
      skuKatalogMap[(r.sku_variasi||'').toUpperCase()] = r.katalog;
  });

  const katMap = {};
  jpData.forEach(r => {
    const kat = skuKatalogMap[(r.sku||'').toUpperCase()] || 'Lainnya';
    if (!katMap[kat]) katMap[kat] = {qty:0,omset:0};
    katMap[kat].qty   += (Number(r.qty)||0);
    katMap[kat].omset += (Number(r.total)||0);
  });

  const sorted = Object.entries(katMap).sort((a,b)=>b[1].omset-a[1].omset).slice(0,8);
  const emptyEl = document.getElementById('dash-katalog-empty');

  if (!sorted.length) {
    if (emptyEl) emptyEl.style.display='flex';
    return;
  }
  if (emptyEl) emptyEl.style.display='none';

  const maxO   = sorted[0][1].omset;
  const colors = ['#2a6e3a','#2266cc','#c8a000','#b03020','#6b3fa0','#1a8a7a','#888','#c84080'];

  const dpr = window.devicePixelRatio||1;
  const W   = canvas.offsetWidth || 280;
  const H   = canvas.offsetHeight || 200;
  canvas.width = W*dpr; canvas.height = H*dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);

  const padL=10, padR=10, padT=10, padB=10;
  const labelRightW = 90; // ruang label kanan, cukup untuk Rp999rb + qty
  const barH    = Math.floor((H-padT-padB-(sorted.length-1)*8) / sorted.length);
  const trackW  = W - padL - padR - labelRightW;

  sorted.forEach(([kat,d],i) => {
    const y   = padT + i*(barH+8);
    const pct = maxO>0 ? d.omset/maxO : 0;
    const bw  = Math.round(pct * trackW);

    // Background track
    ctx.fillStyle='rgba(28,26,20,0.06)';
    ctx.fillRect(padL, y, trackW, barH);

    // Bar
    ctx.fillStyle=colors[i%colors.length];
    if (bw > 0) ctx.fillRect(padL, y, bw, barH);

    // Label katalog (kiri, di dalam bar jika panjang, atau di luar)
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = pct > 0.25 ? '#fff' : '#1c1a14';
    ctx.fillText(kat, padL+5, y+barH/2);

    // Nilai omset (kanan bar) — clipped agar tidak keluar canvas
    ctx.save();
    ctx.rect(padL+trackW, 0, labelRightW-padR, H);
    ctx.clip();
    ctx.fillStyle = '#1c1a14';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(_fmtRpShort(d.omset), padL+trackW+6, y+barH/2-5);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#6b6354';
    ctx.fillText(d.qty+' pcs', padL+trackW+6, y+barH/2+7);
    ctx.restore();
  });
}

// ─── DISTRIBUSI STATUS STOK — BARU ───────────────────────────
function _renderStokDist(stokData) {
  const el = document.getElementById('dash-stok-dist');
  if (!el) return;

  const aman   = stokData.filter(r => r.sisa > 8).length;
  const ati2   = stokData.filter(r => r.sisa > 3 && r.sisa <= 8).length;
  const kritis = stokData.filter(r => r.sisa > 0 && r.sisa <= 3).length;
  const habis  = stokData.filter(r => r.sisa <= 0).length;
  const total  = stokData.length;

  const pills = [
    { label:'Aman',   count: aman,   color: 'var(--ok)',     bg: 'rgba(42,110,58,0.1)' },
    { label:'Ati2',   count: ati2,   color: 'var(--warn)',   bg: 'rgba(200,160,0,0.1)' },
    { label:'Kritis', count: kritis, color: 'var(--danger)', bg: 'rgba(176,48,32,0.1)' },
    { label:'Habis',  count: habis,  color: 'var(--danger)', bg: 'rgba(176,48,32,0.18)' },
  ];

  el.innerHTML = pills.map(p =>
    '<span class="dist-pill" style="color:'+p.color+';background:'+p.bg+';border-color:'+p.color+';padding:2px 7px;font-size:10px">' +
      p.label + ' <b>' + p.count + '</b>' +
    '</span>'
  ).join('');
}

// ─── TURNOVER RATE STOK — BARU ───────────────────────────────
function _turnoverLabel(masuk, keluar) {
  if (!masuk || masuk <= 0) return '<span style="color:var(--ink4)">—</span>';
  const rate = keluar / masuk;
  if (rate >= 0.8) return '<span style="color:var(--ok);font-weight:700">🔥 Cepat</span>';
  if (rate >= 0.5) return '<span style="color:var(--warn);font-weight:700">⚡ Sedang</span>';
  if (rate >= 0.2) return '<span style="color:var(--ink3)">🐢 Lambat</span>';
  return '<span style="color:var(--ink4)">💤 Stagnan</span>';
}

// ─── RINGKASAN BEBAN OPERASIONAL — BARU ──────────────────────
function _renderBeban(bebanData, omsetBln) {
  const el = document.getElementById('dash-beban-wrap');
  if (!el) return;
  if (!bebanData || !bebanData.length) {
    el.innerHTML = '<div style="color:var(--ink3);font-style:italic;font-size:13px">Belum ada data beban. Isi di menu Beban Operasional.</div>';
    return;
  }

  // Hitung total beban (nominal)
  let totalNominal = 0;
  const rows = bebanData.map(r => {
    const nominal = Number(r.nominal || r.jumlah || 0);
    totalNominal += nominal;
    return { nama: r.nama_beban || r.nama || '—', nominal, persen: Number(r.beban_persen||0) };
  });

  const pctDariOmset = omsetBln>0 ? (totalNominal/omsetBln*100).toFixed(1) : null;
  const labaBersihEst = omsetBln - totalNominal;

  el.innerHTML =
    rows.map(r =>
      '<div class="beban-row">' +
        '<span style="font-size:13px">' + r.nama + '</span>' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          (r.persen>0 ? '<span style="font-size:11px;color:var(--ink3)">'+r.persen+'%</span>' : '') +
          '<span style="font-size:13px;font-weight:700;color:var(--danger)">' + _fmtRp(r.nominal) + '</span>' +
        '</div>' +
      '</div>'
    ).join('') +
    '<div class="beban-row" style="margin-top:6px;border-top:2px solid var(--ink)">' +
      '<span style="font-size:13px;font-weight:700">Total Beban</span>' +
      '<span style="font-size:14px;font-weight:700;color:var(--danger)">' + _fmtRp(totalNominal) +
        (pctDariOmset ? ' <span style="font-size:11px;font-weight:400;color:var(--ink3)">('+pctDariOmset+'% omset)</span>' : '') +
      '</span>' +
    '</div>';
}

// ─── AKTIVITAS FEED ───────────────────────────────────────────
function _renderAktivitas(jpData, jurnalData) {
  const feed = document.getElementById('dash-aktivitas-feed');
  if (!feed) return;
  const items = [];
  jpData.slice(0,6).forEach(r => {
    const ch = _dashChannelMap[r.channel_id];
    items.push({
      type:'sell',
      text:'Jual <b>'+(r.sku||'?')+'</b> ×'+(r.qty||0)+' — '+_fmtRp(r.total),
      sub: (ch?ch.nama+' · ':'')+_fmtTgl(r.tanggal),
      ts:  r.created_at||r.tanggal
    });
  });
  jurnalData.slice(0,3).forEach(r => {
    items.push({
      type:'kas',
      text: r.keterangan||'Transaksi kas',
      sub:  (r.debit?'+ '+_fmtRp(r.debit):'− '+_fmtRp(r.kredit))+' · '+_fmtTgl(r.tanggal),
      ts:   r.created_at||r.tanggal
    });
  });
  items.sort((a,b) => {
    const ta=a.ts?new Date(a.ts).getTime():0, tb=b.ts?new Date(b.ts).getTime():0;
    return tb-ta;
  });
  if (!items.length) { feed.innerHTML='<div style="color:var(--ink3);font-style:italic;font-size:13px">Belum ada aktivitas</div>'; return; }
  feed.innerHTML = items.slice(0,8).map(item =>
    '<div class="dash-feed-item">' +
      '<div class="dash-feed-dot '+item.type+'"></div>' +
      '<div style="flex:1;min-width:0">' +
        '<div style="font-size:12px;color:var(--ink);line-height:1.4">'+item.text+'</div>' +
        '<div class="dash-feed-time">'+item.sub+' · '+_fmtAgo(item.ts)+'</div>' +
      '</div>' +
    '</div>'
  ).join('');
}

// ─── MAIN LOAD ────────────────────────────────────────────────
async function loadDashboard() {
  try {
    const today    = _localDateStr(); // FIX: WIB bukan UTC
    const todayYM  = today.slice(0,7);

    const [produkData, stokRaw, jurnalData, jpData, jurnalAllData, channelData, bebanData] = await Promise.all([
      dbGet('produk', '&order=katalog.asc,sku_variasi.asc'),
      dbGet('stok'),
      dbGet('jurnal', '&order=created_at.desc&limit=8'),
      dbGet('jurnal_penjualan', '&order=tanggal.desc'),
      dbGet('jurnal'),
      dbGet('channels').catch(() => []),
      dbGet('beban_operasional', '&tipe=eq.toko_utama').catch(() => [])
    ]);

    const stokMasukMap = {};
    (stokRaw || []).forEach(s => {
      const key = (s.sku_variasi || '').toUpperCase();
      if (key) stokMasukMap[key] = { id: s.id, qty: s.stok_masuk || 0 };
    });

    const keluarMap = {};
    (jpData || []).forEach(j => {
      const key = (j.sku || '').toUpperCase();
      if (key) keluarMap[key] = (keluarMap[key] || 0) + (j.qty || 0);
    });

    _dashStokData = (produkData || []).map(p => {
      const skuKey = (p.sku_variasi || '').toUpperCase();
      const masuk  = stokMasukMap[skuKey] ? stokMasukMap[skuKey].qty : 0;
      const keluar = keluarMap[skuKey] || 0;
      const sisa   = masuk - keluar;
      return {
        sku_variasi:  p.sku_variasi,
        katalog:      p.katalog,
        boss:         p.boss,
        hpp:          p.hpp || 0,
        stok_masuk:   masuk,
        stok_keluar:  keluar,
        sisa,
        nilai_stok:   sisa > 0 ? sisa * (p.hpp || 0) : 0
      };
    });

    _dashJPData     = jpData     || [];
    _dashChannelMap = {};
    (channelData||[]).forEach(ch => { _dashChannelMap[ch.id] = ch; });

    // ─ Metric 1-4
    const kritis    = _dashStokData.filter(r => r.sisa <= 3).length;
    const nilaiStok = _dashStokData.reduce((s,r) => s + (r.nilai_stok || 0), 0);
    const saldo     = (jurnalAllData||[]).reduce((s,r) => s+(r.debit||0)-(r.kredit||0), 0);

    document.getElementById('d-sku').textContent       = _dashStokData.length;
    document.getElementById('d-kritis').textContent    = kritis + ' sku' + (kritis>0?'!':'');
    document.getElementById('d-kritis').style.color    = kritis>0?'var(--danger)':'var(--ok)';
    document.getElementById('d-nilaiStok').textContent = _fmtRp(nilaiStok);
    document.getElementById('d-saldo').textContent     = (saldo>=0?'+':'')+_fmtRp(Math.abs(saldo));
    document.getElementById('d-saldo').style.color     = saldo>=0?'var(--ok)':'var(--danger)';

    // ─ Metric 5-8
    const jpBulan   = _dashJPData.filter(r => r.tanggal && String(r.tanggal).slice(0,7) === todayYM);
    const jpHariIni = _dashJPData.filter(r => r.tanggal && String(r.tanggal).slice(0,10) === today);
    const omsetBln  = jpBulan.reduce((s,r)=>s+(Number(r.total)||0),0);
    const omsetHari = jpHariIni.reduce((s,r)=>s+(Number(r.total)||0),0);
    const aov       = jpBulan.length>0 ? Math.round(omsetBln/jpBulan.length) : 0;

    document.getElementById('d-omset').textContent = _fmtRp(omsetBln);
    const omsetDeltaEl = document.getElementById('d-omset-delta');
    if (omsetDeltaEl) omsetDeltaEl.textContent = 'dari jurnal penjualan';

    const qtyHariIni = jpHariIni.reduce((s,r) => s + (Number(r.qty)||0), 0);
    const elQty  = document.getElementById('d-order-qty');
    const elOmHr = document.getElementById('d-order-omset');
    const elDelta = document.getElementById('d-order-hari-delta');
    if (elQty)   elQty.textContent  = qtyHariIni || '0';
    if (elOmHr)  elOmHr.textContent = omsetHari>0 ? _fmtRp(omsetHari) : 'Rp0';
    if (elDelta) elDelta.textContent = jpHariIni.length + ' transaksi hari ini';

    // ─ AOV — BARU
    const elAov = document.getElementById('d-aov');
    if (elAov) {
      elAov.textContent = aov>0 ? _fmtRp(aov) : '—';
    }

    // ─ HPP terjual & Laba Kotor — BARU
    const hppMap = {};
    _dashStokData.forEach(r => { hppMap[(r.sku_variasi||'').toUpperCase()] = r.hpp||0; });
    const totalHppTerjual = jpBulan.reduce((s,r) => {
      const hpp = hppMap[(r.sku||'').toUpperCase()] || 0;
      return s + hpp * (Number(r.qty)||0);
    }, 0);
    const labaKotor = omsetBln - totalHppTerjual;
    const elLaba    = document.getElementById('d-laba');
    const elLabaDelta = document.getElementById('d-laba-delta');
    if (elLaba) {
      elLaba.textContent = _fmtRp(labaKotor);
      elLaba.style.color = labaKotor >= 0 ? 'var(--ok)' : 'var(--danger)';
    }
    if (elLabaDelta) {
      const marjin = omsetBln>0 ? (labaKotor/omsetBln*100).toFixed(1) : 0;
      elLabaDelta.textContent = 'marjin ' + marjin + '%';
    }

    // ─ Beban & Laba Bersih — BARU
    let totalBebanNominal = 0;
    const bebanArr = bebanData || [];
    bebanArr.forEach(r => { totalBebanNominal += Number(r.nominal || r.jumlah || 0); });

    // Fallback kalau nominal 0: coba hitung dari persen × omset
    if (totalBebanNominal === 0 && omsetBln > 0) {
      bebanArr.forEach(r => { totalBebanNominal += (Number(r.beban_persen||0)/100) * omsetBln; });
    }

    const elBeban = document.getElementById('d-beban');
    const elBebanDelta = document.getElementById('d-beban-delta');
    if (elBeban) {
      elBeban.textContent = totalBebanNominal>0 ? _fmtRp(totalBebanNominal) : '—';
      elBeban.style.color = 'var(--danger)';
    }
    if (elBebanDelta && totalBebanNominal>0 && omsetBln>0) {
      elBebanDelta.textContent = (totalBebanNominal/omsetBln*100).toFixed(1) + '% dari omset';
    }

    const labaBersih = labaKotor - totalBebanNominal;
    const elLabaBersih = document.getElementById('d-laba-bersih');
    if (elLabaBersih) {
      elLabaBersih.textContent = omsetBln>0 ? _fmtRp(labaBersih) : '—';
      elLabaBersih.style.color = labaBersih>=0 ? 'var(--ok)' : 'var(--danger)';
    }

    // ─ Target Omset — hitung dari nominal beban + rasio Shopee
    let target = _getTarget();
    if (bebanArr.length > 0) {
      // Cara baru: sum kolom nominal
      const totalNominal = bebanArr.reduce((s,r) => s + (Number(r.nominal)||0), 0);
      if (totalNominal > 0) {
        // Ambil rasio rata-rata channel Shopee dari channel_beban
        try {
          const [chData, chBeban] = await Promise.all([
            dbGet('channels', '&kategori=eq.toko_utama').catch(()=>[]),
            dbGet('channel_beban', '').catch(()=>[])
          ]);
          const bebanChMap = {};
          (chBeban||[]).forEach(b => { bebanChMap[b.channel_id] = b; });
          let sumR = 0, cntR = 0;
          (chData||[]).forEach(ch => {
            if (bebanChMap[ch.id]) { sumR += (bebanChMap[ch.id].beban_persen||0); cntR++; }
          });
          const rasio = cntR > 0 ? sumR / cntR : 0;
          if (rasio > 0) target = Math.round(totalNominal / (rasio / 100));
        } catch(e) { /* fallback ke target localStorage */ }
      } else {
        // Fallback cara lama: coba baca dari nama_beban
        const bebanRow   = bebanArr.find(r => r.nama_beban && !isNaN(Number(String(r.nama_beban).replace(/[.,]/g,''))));
        const totalRasio = bebanArr.reduce((s,r) => s + (Number(r.beban_persen)||0), 0);
        if (bebanRow && totalRasio > 0) {
          const nominalBeban = Number(String(bebanRow.nama_beban).replace(/[.,]/g,''));
          target = Math.round(nominalBeban / (totalRasio / 100));
        }
      }
    }

    const targetEl = document.getElementById('d-target');
    if (targetEl) targetEl.textContent = target>0 ? _fmtRp(target) : '—';
    if (target>0) {
      const omsetNum = Number(omsetBln) || 0;
      const pct      = Math.min(omsetNum/target*100, 100).toFixed(1);
      const barWrap  = document.getElementById('d-target-bar-wrap');
      const bar      = document.getElementById('d-target-bar');
      const pctEl    = document.getElementById('d-target-pct');
      if (barWrap) barWrap.style.display = 'block';
      if (bar)     { bar.style.width = pct+'%'; bar.style.background = pct>=100?'var(--ok)':pct>=60?'var(--warn)':'var(--danger)'; }
      if (pctEl)   pctEl.textContent = pct+'% tercapai';
    }

    const hariDlmBulan  = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
    const targetHarian  = target>0 ? Math.round(target / hariDlmBulan) : 0;
    const thEl          = document.getElementById('d-target-harian');
    if (thEl) thEl.textContent = targetHarian>0 ? _fmtRp(targetHarian) : '—';
    if (targetHarian>0) {
      const pctH     = Math.min((Number(omsetHari)||0) / targetHarian * 100, 100).toFixed(1);
      const bwH      = document.getElementById('d-target-harian-bar-wrap');
      const barH     = document.getElementById('d-target-harian-bar');
      const pctHEl   = document.getElementById('d-target-harian-pct');
      if (bwH)   bwH.style.display = 'block';
      if (barH)  { barH.style.width = pctH+'%'; barH.style.background = pctH>=100?'var(--ok)':pctH>=60?'var(--warn)':'var(--danger)'; }
      if (pctHEl) pctHEl.textContent = _fmtRp(omsetHari)+' · '+pctH+'% tercapai';
    }

    // ─ Alerts
    _renderAlerts(_dashStokData, saldo);

    // ─ Distribusi Status Stok — BARU
    _renderStokDist(_dashStokData);

    // ─ Tabel stok: ROP + Turnover + REORDER — DIUPDATE
    // Selalu 5 baris, urutan prioritas Habis → Kritis → Ati2 → Aman
    const LEAD_TIME      = 7; // hari pesan ke supplier
    const SAFETY_DAYS    = 2; // buffer hari penjualan

    // Hitung terjual 7 hari terakhir per SKU
    const _batas7 = _localDateOffset(7); // FIX: WIB bukan UTC
    const _sold7Map = {};
    _dashJPData
      .filter(r => r.tanggal && String(r.tanggal).slice(0,10) >= _batas7)
      .forEach(r => {
        const k = (r.sku||'').toUpperCase();
        _sold7Map[k] = (_sold7Map[k] || 0) + (Number(r.qty)||0);
      });

    const _sortByPriority = (a, b) => {
      const pri = r => r.sisa <= 0 ? 0 : r.sisa <= 3 ? 1 : r.sisa <= 8 ? 2 : 3;
      return pri(a) !== pri(b) ? pri(a) - pri(b) : a.sisa - b.sisa;
    };
    const stokSorted = [..._dashStokData].sort(_sortByPriority);
    const stokTampil = stokSorted.slice(0, 5);
    const EMPTY_ROW  = '<tr><td colspan="7" style="color:var(--ink4);text-align:center">—</td></tr>';

    const stokSum = document.getElementById('dash-stok-summary');
    if (stokSum) stokSum.textContent = _dashStokData.length+' SKU';

    const stokRows = stokTampil.map(r => {
      const skuKey     = (r.sku_variasi||'').toUpperCase();
      const sold7      = _sold7Map[skuKey] || 0;
      const avgPerHari = sold7 / 7;
      const safety     = Math.ceil(avgPerHari * SAFETY_DAYS);
      const rop        = Math.ceil(avgPerHari * LEAD_TIME) + safety;
      const isReorder  = sold7 > 0 && r.sisa <= rop;

      const sold7Cell = sold7 > 0
        ? '<span style="color:var(--ok);font-weight:700">'+sold7+'×</span>'
        : '<span style="color:var(--ink4)">—</span>';
      const ropCell = sold7 > 0
        ? '<span style="font-weight:700;color:'+(isReorder?'var(--danger)':'var(--ink3)')+'">'+rop+'</span>'
        : '<span style="color:var(--ink4)">—</span>';
      const statusCell = isReorder
        ? '<span style="color:var(--danger);font-weight:700;white-space:nowrap">🔴 REORDER!</span>'
        : statusBadgeDash(r.sisa);

      return '<tr>' +
        '<td><b>'+r.sku_variasi+'</b></td>' +
        '<td>'+(r.boss||'—')+'</td>' +
        '<td><b><span style="color:'+(r.sisa<=0?'var(--danger)':r.sisa<=3?'var(--danger)':'var(--warn)')+'">'+r.sisa+'</span></b></td>'+
        '<td>'+sold7Cell+'</td>'+
        '<td>'+_turnoverLabel(r.stok_masuk, r.stok_keluar)+'</td>'+
        '<td>'+ropCell+'</td>'+
        '<td>'+statusCell+'</td>'+
      '</tr>';
    });
    // Pad to always 5 rows
    while (stokRows.length < 5) stokRows.push(EMPTY_ROW);
    document.getElementById('dash-stok-tbody').innerHTML = stokRows.join('');

    // ─ Jurnal terakhir
    const jurnalRecent = (jurnalData||[]).slice(0,5);
    document.getElementById('dash-jurnal-tbody').innerHTML = jurnalRecent.length===0
      ? '<tr><td colspan="4" style="color:var(--ink3);font-style:italic">Belum ada jurnal</td></tr>'
      : jurnalRecent.map(r => '<tr><td>'+_fmtTgl(r.tanggal||r.created_at)+'</td><td>'+(r.keterangan||'—')+'</td><td style="color:var(--ok)">'+(r.debit?_fmtRp(r.debit):'—')+'</td><td style="color:var(--danger)">'+(r.kredit?_fmtRp(r.kredit):'—')+'</td></tr>').join('');

    // ─ Render semua chart & widget
    const _jpForChart  = _dashJPData;
    const _jpForRender = jpBulan.length>0 ? jpBulan : _dashJPData;
    const _stokForBoss = _dashStokData;
    setTimeout(() => {
      _renderChartPenjualan(_jpForChart);
      _renderTopSku(_jpForRender);
      _renderBoss(_jpForRender, _stokForBoss);
      _renderChannel(_jpForRender);           // BARU
      _renderKatalog(_jpForRender, _dashStokData); // BARU
      _renderBeban(bebanArr, omsetBln);       // BARU
      if (typeof rerenderUI === "function") rerenderUI(document.getElementById("page-dashboard"));
    }, 300); // FIX: dinaikkan agar canvas punya offsetWidth saat dirender

    // ─ Aktivitas feed
    _renderAktivitas(_dashJPData.slice(0,6), jurnalData||[]);

    // ─ Timestamp
    const tsEl = document.getElementById('dash-last-refresh');
    if (tsEl) tsEl.textContent = 'Terakhir diperbarui: '+new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});

  } catch(err) {
    const wrap = document.getElementById('dash-alerts-wrap');
    if (wrap) wrap.innerHTML = '<div class="dash-alert-item danger"><i class="ti ti-wifi-off" style="color:var(--danger)"></i><span>Gagal memuat data: '+err.message+'. Periksa koneksi internet.</span></div>';
    console.error('[dashboard] error:', err);
  }
}

loadDashboard();
