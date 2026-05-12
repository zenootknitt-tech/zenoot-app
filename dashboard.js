// ─── DASHBOARD.JS v3 — Enterprise Edition ────────────────────
// Fitur: metrics, grafik penjualan 7/14/30 hari, top SKU, performa boss,
//        aktivitas order hari ini, alert otomatis, omset vs target,
//        turnover stok, timeline aktivitas terakhir

document.getElementById('page-dashboard').innerHTML = `

  <!-- ═══ ALERT STRIP ════════════════════════════════════════ -->
  <div id="dash-alerts-wrap"></div>

  <!-- ═══ ROW 1: 4 METRIC CARDS ════════════════════════════════ -->
  <div class="metrics" id="dash-metrics">
    <div class="metric">
      <div class="m-label">Total SKU Aktif</div>
      <div class="m-value" id="d-sku">—</div>
      <div class="m-delta">produk terdaftar</div>
      <div class="doodle" style="bottom:6px;right:8px">📦</div>
    </div>
    <div class="metric">
      <div class="m-label">Nilai Stok</div>
      <div class="m-value" id="d-nilaiStok">—</div>
      <div class="m-delta">HPP × sisa stok</div>
      <div class="doodle" style="bottom:6px;right:8px">💰</div>
    </div>
    <div class="metric">
      <div class="m-label">SKU Kritis</div>
      <div class="m-value" id="d-kritis">—</div>
      <div class="m-delta">stok ≤ 3</div>
      <div class="doodle" style="bottom:6px;right:8px">⚠️</div>
    </div>
    <div class="metric">
      <div class="m-label">Saldo Kas</div>
      <div class="m-value" id="d-saldo">—</div>
      <div class="m-delta">dari jurnal</div>
      <div class="doodle" style="bottom:6px;right:8px">🧾</div>
    </div>
  </div>

  <!-- ═══ ROW 2: 4 METRIC CARDS (tambahan) ═════════════════════ -->
  <div class="metrics" style="grid-template-columns:repeat(4,1fr)">
    <div class="metric">
      <div class="m-label">Omset Bulan Ini</div>
      <div class="m-value" id="d-omset">—</div>
      <div class="m-delta" id="d-omset-delta">dari jurnal penjualan</div>
      <div class="doodle" style="bottom:6px;right:8px">📈</div>
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
      <div class="doodle" style="bottom:6px;right:8px">🎯</div>
    </div>
    <div class="metric">
      <div class="m-label">Order Hari Ini</div>
      <div class="m-value" id="d-order-hari">—</div>
      <div class="m-delta" id="d-order-hari-delta">transaksi masuk</div>
      <div class="doodle" style="bottom:6px;right:8px">🛍️</div>
    </div>
    <div class="metric">
      <div class="m-label">Avg Order Value</div>
      <div class="m-value" id="d-aov">—</div>
      <div class="m-delta">rata2 per transaksi bulan ini</div>
      <div class="doodle" style="bottom:6px;right:8px">💳</div>
    </div>
  </div>

  <!-- ═══ ROW 3: GRAFIK PENJUALAN + TOP SKU ════════════════════ -->
  <div class="grid2" style="margin-bottom:12px">

    <div class="card">
      <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
        <span><i class="ti ti-chart-line"></i> Tren Penjualan</span>
        <div style="display:flex;gap:4px">
          <button class="btn btn-sm dash-period-btn active-period" onclick="setDashPeriod(7,this)">7H</button>
          <button class="btn btn-sm dash-period-btn" onclick="setDashPeriod(14,this)">14H</button>
          <button class="btn btn-sm dash-period-btn" onclick="setDashPeriod(30,this)">30H</button>
        </div>
      </div>
      <div style="position:relative;height:170px;width:100%">
        <canvas id="dash-chart-penjualan" style="width:100%;height:100%;display:block"></canvas>
        <div id="dash-chart-empty" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;color:var(--ink3);font-style:italic;font-size:13px">
          Belum ada data penjualan
        </div>
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
      <div class="card-title" style="display:flex;align-items:center;justify-content:space-between">
        <span><i class="ti ti-package"></i> Status Stok</span>
        <span id="dash-stok-summary" style="font-size:11px;color:var(--ink3);font-weight:400"></span>
      </div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>SKU</th><th>Boss</th><th>Sisa</th><th>Terjual</th><th>Status</th></tr></thead>
        <tbody id="dash-stok-tbody">
          <tr><td colspan="5" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
        </tbody>
      </table></div>
    </div>

    <div class="card">
      <div class="card-title"><i class="ti ti-users"></i> Performa per Boss</div>
      <div style="position:relative;height:150px;margin-bottom:8px">
        <canvas id="dash-chart-boss" style="width:100%;height:100%;display:block"></canvas>
      </div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Boss</th><th>Qty</th><th>Omset</th><th>%</th></tr></thead>
        <tbody id="dash-boss-tbody">
          <tr><td colspan="4" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
        </tbody>
      </table></div>
    </div>

  </div>

  <!-- ═══ ROW 5: JURNAL TERAKHIR + AKTIVITAS FEED ═══════════════ -->
  <div class="grid2" style="margin-bottom:12px">

    <div class="card">
      <div class="card-title"><i class="ti ti-list"></i> Jurnal Terakhir</div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Tgl</th><th>Keterangan</th><th>Debit</th><th>Kredit</th></tr></thead>
        <tbody id="dash-jurnal-tbody">
          <tr><td colspan="4" style="color:var(--ink3);font-style:italic">Memuat...</td></tr>
        </tbody>
      </table></div>
    </div>

    <div class="card">
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
  `;
  document.head.appendChild(s);
})();

setTimeout(() => { if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-dashboard')); }, 80);

// ─── STATE ────────────────────────────────────────────────────
let _dashPeriod     = 7;
let _dashJPData     = [];
let _dashStokData   = [];
let _dashChannelMap = {};

// ─── HELPERS ─────────────────────────────────────────────────
function _fmtRp(v) {
  if (!v && v !== 0) return '—';
  v = Number(v);
  if (v >= 1000000) return 'Rp' + (v/1000000).toFixed(1) + 'jt';
  if (v >= 1000)    return 'Rp' + Math.round(v/1000) + 'rb';
  return 'Rp' + v.toLocaleString('id-ID');
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
function setDashPeriod(days, btn) {
  _dashPeriod = days;
  document.querySelectorAll('.dash-period-btn').forEach(b => b.classList.remove('active-period'));
  if (btn) btn.classList.add('active-period');
  _renderChartPenjualan(_dashJPData);
}

// ─── ALERTS ──────────────────────────────────────────────────
function _renderAlerts(stokData, saldo) {
  const wrap = document.getElementById('dash-alerts-wrap');
  if (!wrap) return;
  const alerts = [];
  const habis      = stokData.filter(r => ((r.stok_masuk||0)-(r.stok_keluar||0)) <= 0);
  const kritis     = stokData.filter(r => { const s=(r.stok_masuk||0)-(r.stok_keluar||0); return s>0 && s<=3; });
  if (habis.length)  alerts.push({ cls:'danger', icon:'ti-circle-off',    msg: habis.length + ' SKU HABIS stok: ' + habis.slice(0,3).map(r=>r.sku_variasi).join(', ') + (habis.length>3?' ...':'') + ' — restock segera!' });
  if (kritis.length) alerts.push({ cls:'warn',   icon:'ti-alert-triangle', msg: kritis.length + ' SKU hampir habis: ' + kritis.slice(0,3).map(r=>r.sku_variasi).join(', ') + (kritis.length>3?' ...':'') });
  if (saldo < 0)     alerts.push({ cls:'danger', icon:'ti-coin-off',       msg: 'Saldo kas negatif ' + _fmtRp(Math.abs(saldo)) + ' — cek jurnal kas!' });
  wrap.innerHTML = alerts.map(a =>
    '<div class="dash-alert-item ' + a.cls + '"><i class="ti ' + a.icon + '" style="color:var(--' + (a.cls==='danger'?'danger':'warn') + ')"></i><span>' + a.msg + '</span></div>'
  ).join('');
}

// ─── CHART PENJUALAN ─────────────────────────────────────────
function _renderChartPenjualan(jpData) {
  const canvas = document.getElementById('dash-chart-penjualan');
  if (!canvas) return;

  const today = new Date();
  const labels = [], totals = [];
  for (let i = _dashPeriod - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    labels.push(String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0'));
    totals.push(jpData.filter(r => r.tanggal && r.tanggal.startsWith(key)).reduce((s,r) => s+(r.total||0), 0));
  }

  const maxVal  = Math.max(...totals, 1);
  const hasData = totals.some(v => v > 0);
  const emptyEl = document.getElementById('dash-chart-empty');
  if (emptyEl) { emptyEl.style.display = hasData ? 'none' : 'flex'; }
  if (!hasData) return;

  const dpr = window.devicePixelRatio || 1;
  const W   = canvas.offsetWidth  || 280;
  const H   = canvas.offsetHeight || 160;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const padL=44, padR=8, padT=14, padB=34;
  const cW=W-padL-padR, cH=H-padT-padB;
  const colLine='#2a6e3a', colFill='rgba(42,110,58,0.1)', colGrid='rgba(28,26,20,0.08)', colLabel='#6b6354';

  // Grid + Y labels
  for (let i=0; i<=4; i++) {
    const y = padT + cH - cH*i/4;
    ctx.strokeStyle=colGrid; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+cW,y); ctx.stroke();
    ctx.fillStyle=colLabel; ctx.font='10px sans-serif'; ctx.textAlign='right';
    ctx.fillText(_fmtRp(maxVal*i/4), padL-4, y+3);
  }

  const step = cW / Math.max(labels.length-1, 1);

  // Highlight hari ini
  ctx.fillStyle='rgba(200,160,0,0.12)';
  ctx.fillRect(padL+cW-step*0.6, padT, step*0.6+padR, cH);

  // Area fill
  ctx.beginPath();
  ctx.moveTo(padL, padT+cH);
  totals.forEach((v,i) => { const x=padL+i*step, y=padT+cH-(v/maxVal)*cH; i===0?ctx.lineTo(x,y):ctx.lineTo(x,y); });
  ctx.lineTo(padL+(totals.length-1)*step, padT+cH);
  ctx.closePath(); ctx.fillStyle=colFill; ctx.fill();

  // Line
  ctx.beginPath(); ctx.strokeStyle=colLine; ctx.lineWidth=2; ctx.lineJoin='round';
  totals.forEach((v,i) => { const x=padL+i*step, y=padT+cH-(v/maxVal)*cH; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.stroke();

  // Dots + labels
  const skip = Math.ceil(labels.length/7);
  totals.forEach((v,i) => {
    const x=padL+i*step, y=padT+cH-(v/maxVal)*cH;
    ctx.beginPath(); ctx.arc(x,y,3.5,0,Math.PI*2);
    ctx.fillStyle=v>0?colLine:colGrid; ctx.fill();
    ctx.strokeStyle='#fff'; ctx.lineWidth=1; ctx.stroke();
    if (i%skip===0 || i===labels.length-1) {
      ctx.fillStyle=colLabel; ctx.font='10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(labels[i], x, H-padB+14);
    }
    if (i===totals.length-1 && v>0) {
      ctx.fillStyle='#2a6e3a'; ctx.font='bold 10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(_fmtRp(v), x, y-9);
    }
  });

  // Legend
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
      '<span style="display:flex;align-items:center;gap:4px"><span style="width:14px;height:3px;background:'+colLine+';display:inline-block;border-radius:2px"></span>'+_dashPeriod+' hari: '+_fmtRp(total)+'</span>' +
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
  stokData.forEach(r => { if (r.sku_variasi && r.boss) skuBossMap[r.sku_variasi] = r.boss; });

  const bossMap = {};
  jpData.forEach(r => {
    const boss = skuBossMap[r.sku] || 'Lainnya';
    if (!bossMap[boss]) bossMap[boss] = {qty:0,omset:0};
    bossMap[boss].qty   += (r.qty||0);
    bossMap[boss].omset += (r.total||0);
  });

  const sorted     = Object.entries(bossMap).sort((a,b)=>b[1].omset-a[1].omset);
  const totalOmset = sorted.reduce((s,[,d])=>s+d.omset, 0);
  const colors     = ['#2a6e3a','#2266cc','#c8a000','#b03020','#6b3fa0','#1a8a7a'];

  const tbody = document.getElementById('dash-boss-tbody');
  if (tbody) {
    if (!sorted.length) {
      tbody.innerHTML = '<tr><td colspan="4" style="color:var(--ink3);font-style:italic">Belum ada data</td></tr>';
    } else {
      tbody.innerHTML = sorted.map(([boss,d],i) => {
        const pct = totalOmset>0?(d.omset/totalOmset*100).toFixed(0):0;
        return '<tr>' +
          '<td><b>'+boss+'</b></td>' +
          '<td>'+d.qty+'</td>' +
          '<td><b style="color:var(--ok)">'+_fmtRp(d.omset)+'</b></td>' +
          '<td><div style="display:flex;align-items:center;gap:4px"><div style="width:40px;background:var(--cream4);height:5px;border-radius:2px;overflow:hidden;border:1px solid var(--ink4)"><div style="width:'+pct+'%;height:100%;background:'+colors[i%colors.length]+'"></div></div><span style="font-size:11px;color:var(--ink3)">'+pct+'%</span></div></td>' +
        '</tr>';
      }).join('');
    }
  }

  // Donut chart
  const canvas = document.getElementById('dash-chart-boss');
  if (!canvas || !sorted.length || totalOmset===0) return;
  const dpr = window.devicePixelRatio||1;
  const W = canvas.offsetWidth||200, H = canvas.offsetHeight||150;
  canvas.width=W*dpr; canvas.height=H*dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  const cx=W/2, cy=H/2, r=Math.min(cx,cy)-14, inner=r*0.52;
  let angle = -Math.PI/2;
  sorted.forEach(([,d],i) => {
    const slice = (d.omset/totalOmset)*Math.PI*2;
    if (slice<=0) return;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,angle,angle+slice);
    ctx.closePath();
    ctx.fillStyle=colors[i%colors.length]; ctx.fill();
    ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();
    angle += slice;
  });
  // Hole
  ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2);
  ctx.fillStyle='#ede7d9'; ctx.fill();
  // Center text
  ctx.fillStyle='#1c1a14'; ctx.font='bold 11px sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(_fmtRp(totalOmset),cx,cy-6);
  ctx.font='9px sans-serif'; ctx.fillStyle='#6b6354';
  ctx.fillText('omset',cx,cy+6);
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
    const today    = new Date().toISOString().split('T')[0];
    const todayYM  = today.slice(0,7);

    // Load semua data paralel
    const [stokData, jurnalData, jpData, jurnalAllData, channelData] = await Promise.all([
      dbGet('stok'),
      dbGet('jurnal', '&order=created_at.desc&limit=8'),
      dbGet('jurnal_penjualan', '&order=tanggal.desc&limit=300'),
      dbGet('jurnal'),
      dbGet('channels').catch(() => [])
    ]);

    _dashStokData   = stokData   || [];
    _dashJPData     = jpData     || [];
    _dashChannelMap = {};
    (channelData||[]).forEach(ch => { _dashChannelMap[ch.id] = ch; });

    // ─ Metric 1-4
    const kritis    = _dashStokData.filter(r => ((r.stok_masuk||0)-(r.stok_keluar||0)) <= 3).length;
    const nilaiStok = _dashStokData.reduce((s,r) => { const sisa=(r.stok_masuk||0)-(r.stok_keluar||0); return s+(sisa>0&&r.hpp?sisa*r.hpp:0); }, 0);
    const saldo     = (jurnalAllData||[]).reduce((s,r) => s+(r.debit||0)-(r.kredit||0), 0);

    document.getElementById('d-sku').textContent       = _dashStokData.length;
    document.getElementById('d-kritis').textContent    = kritis + ' sku' + (kritis>0?'!':'');
    document.getElementById('d-kritis').style.color    = kritis>0?'var(--danger)':'var(--ok)';
    document.getElementById('d-nilaiStok').textContent = _fmtRp(nilaiStok);
    document.getElementById('d-saldo').textContent     = (saldo>=0?'+':'')+_fmtRp(Math.abs(saldo));
    document.getElementById('d-saldo').style.color     = saldo>=0?'var(--ok)':'var(--danger)';

    // ─ Metric 5-8
    const jpBulan   = _dashJPData.filter(r => r.tanggal && r.tanggal.startsWith(todayYM));
    const jpHariIni = _dashJPData.filter(r => r.tanggal && r.tanggal.startsWith(today));
    const omsetBln  = jpBulan.reduce((s,r)=>s+(r.total||0),0);
    const omsetHari = jpHariIni.reduce((s,r)=>s+(r.total||0),0);
    const aov       = jpBulan.length>0 ? Math.round(omsetBln/jpBulan.length) : 0;
    const target    = _getTarget();

    document.getElementById('d-omset').textContent          = _fmtRp(omsetBln);
    document.getElementById('d-order-hari').textContent     = jpHariIni.length + ' transaksi';
    document.getElementById('d-order-hari-delta').textContent = omsetHari>0 ? _fmtRp(omsetHari)+' hari ini' : 'belum ada order hari ini';
    document.getElementById('d-aov').textContent            = _fmtRp(aov);

    // Target
    const targetEl = document.getElementById('d-target');
    if (targetEl) {
      targetEl.innerHTML = target>0
        ? _fmtRp(target)+'<span class="target-link" onclick="openTargetModal()" title="Ubah target">✏️</span>'
        : '<span class="target-link" onclick="openTargetModal()">+ Set target</span>';
    }
    if (target>0) {
      const pct = Math.min(omsetBln/target*100,100).toFixed(0);
      const barWrap = document.getElementById('d-target-bar-wrap');
      const bar     = document.getElementById('d-target-bar');
      const pctEl   = document.getElementById('d-target-pct');
      if (barWrap) barWrap.style.display='block';
      if (bar)     { bar.style.width=pct+'%'; bar.style.background=pct>=100?'var(--ok)':pct>=60?'var(--warn)':'var(--danger)'; }
      if (pctEl)   pctEl.textContent=pct+'% tercapai';
    }

    // ─ Alerts
    _renderAlerts(_dashStokData, saldo);

    // ─ Tabel stok (dengan kolom terjual/turnover)
    const stokSorted = [..._dashStokData].sort((a,b)=>((a.stok_masuk||0)-(a.stok_keluar||0))-((b.stok_masuk||0)-(b.stok_keluar||0)));
    const stokSum = document.getElementById('dash-stok-summary');
    if (stokSum) stokSum.textContent = _dashStokData.length+' SKU · Nilai '+_fmtRp(nilaiStok);
    const stokJualMap = {};
    _dashJPData.forEach(r => { if (r.sku) stokJualMap[r.sku] = (stokJualMap[r.sku]||0)+(r.qty||0); });
    document.getElementById('dash-stok-tbody').innerHTML = stokSorted.length===0
      ? '<tr><td colspan="5" style="color:var(--ink3);font-style:italic">Belum ada data stok</td></tr>'
      : stokSorted.map(r => {
          const sisa = (r.stok_masuk||0)-(r.stok_keluar||0);
          const sold = stokJualMap[r.sku_variasi] || 0;
          return '<tr><td><b>'+r.sku_variasi+'</b></td><td>'+(r.boss||'—')+'</td><td><b>'+sisa+'</b></td>'+
            '<td>'+(sold>0?'<span style="color:var(--ok);font-weight:700">'+sold+' terjual</span>':'<span style="color:var(--ink4)">—</span>')+'</td>'+
            '<td>'+statusBadgeDash(sisa)+'</td></tr>';
        }).join('');

    // ─ Jurnal terakhir
    const jurnalRecent = (jurnalData||[]).slice(0,5);
    document.getElementById('dash-jurnal-tbody').innerHTML = jurnalRecent.length===0
      ? '<tr><td colspan="4" style="color:var(--ink3);font-style:italic">Belum ada jurnal</td></tr>'
      : jurnalRecent.map(r => '<tr><td>'+_fmtTgl(r.tanggal||r.created_at)+'</td><td>'+(r.keterangan||'—')+'</td><td style="color:var(--ok)">'+(r.debit?_fmtRp(r.debit):'—')+'</td><td style="color:var(--danger)">'+(r.kredit?_fmtRp(r.kredit):'—')+'</td></tr>').join('');

    // ─ Chart penjualan
    _renderChartPenjualan(_dashJPData);

    // ─ Top SKU (prioritaskan bulan ini)
    _renderTopSku(jpBulan.length>0 ? jpBulan : _dashJPData);

    // ─ Boss
    _renderBoss(jpBulan.length>0 ? jpBulan : _dashJPData, _dashStokData);

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
