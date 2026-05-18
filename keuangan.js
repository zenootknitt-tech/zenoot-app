// ─── KEUANGAN.JS — Hutang, Neraca, Rasio, Net Worth, Valuasi ─

let _keuHutangAll = [];
let _keuKasAkun   = [];
let _keuKasJurnal = [];

document.getElementById('page-keuangan').innerHTML = `
<style>
  .keu-tabs { display:flex; gap:6px; margin-bottom:14px; flex-wrap:wrap; }
  .keu-tab  { padding:6px 14px; border:2px solid var(--ink); background:var(--cream); font-family:var(--f); font-size:13px; font-weight:700; cursor:pointer; border-radius:2px; color:var(--ink); }
  .keu-tab.active { background:var(--ink); color:var(--cream); }
  .keu-panel { display:none; }
  .keu-panel.active { display:block; }
  .rasio-card {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:10px; margin-bottom:16px;
  }
  .rasio-item {
    background:var(--cream2); border:2px solid var(--ink3); padding:12px 14px; border-radius:2px;
  }
  .rasio-item .r-label { font-size:11px; color:var(--ink3); font-weight:700; text-transform:uppercase; margin-bottom:4px; }
  .rasio-item .r-value { font-size:20px; font-weight:700; font-family:var(--f2); }
  .rasio-item .r-desc  { font-size:11px; color:var(--ink3); margin-top:2px; }
  .rasio-item.r-ok     { border-color:var(--ok); }
  .rasio-item.r-warn   { border-color:var(--warn); }
  .rasio-item.r-danger { border-color:var(--danger); }
  .hutang-status-aktif  { color:var(--warn); font-weight:700; font-size:12px; }
  .hutang-status-lunas  { color:var(--ok);   font-weight:700; font-size:12px; }
  .val-card { background:var(--cream2); border:2px solid var(--ink); padding:14px 16px; margin-bottom:10px; border-radius:2px; }
  .val-card .v-method { font-size:11px; color:var(--ink3); font-weight:700; text-transform:uppercase; }
  .val-card .v-value  { font-size:22px; font-weight:700; font-family:var(--f2); color:var(--ink); margin:4px 0; }
  .val-card .v-desc   { font-size:12px; color:var(--ink2); }
  .neraca-section { margin-bottom:4px; }
  .neraca-head td { font-weight:700; background:var(--cream2); border-top:2px solid var(--ink); }
  .neraca-sub  td { padding-left:20px !important; }
  .neraca-total td{ font-weight:700; border-top:2px dashed var(--ink3); border-bottom:2px solid var(--ink); }
</style>

<div class="keu-tabs">
  <button class="keu-tab active" onclick="keuGotoTab('hutang')">🏦 Hutang</button>
  <button class="keu-tab" onclick="keuGotoTab('neraca')">⚖ Neraca</button>
  <button class="keu-tab" onclick="keuGotoTab('rasio')">📐 Rasio & Net Worth</button>
  <button class="keu-tab" onclick="keuGotoTab('valuasi')">💎 Valuasi Bisnis</button>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- PANEL: HUTANG                                              -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div id="keu-panel-hutang" class="keu-panel active">

  <!-- Summary -->
  <div class="rasio-card" style="margin-bottom:14px">
    <div class="rasio-item"><div class="r-label">Total Hutang</div><div class="r-value" id="keu-total-hutang">—</div><div class="r-desc">pokok semua pinjaman</div></div>
    <div class="rasio-item"><div class="r-label">Sudah Dibayar</div><div class="r-value" id="keu-total-bayar">—</div><div class="r-desc">total cicilan terbayar</div></div>
    <div class="rasio-item"><div class="r-label">Sisa Hutang</div><div class="r-value" id="keu-total-sisa" style="color:var(--danger)">—</div><div class="r-desc">belum terlunasi</div></div>
    <div class="rasio-item"><div class="r-label">Cicilan/Bulan</div><div class="r-value" id="keu-total-cicilan">—</div><div class="r-desc">total kewajiban bulanan</div></div>
  </div>

  <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
    <button class="btn btn-sm btn-primary" onclick="keuShowFormHutang()"><i class="ti ti-plus"></i> Tambah Hutang</button>
    <button class="btn btn-sm" onclick="keuLoadHutang()"><i class="ti ti-refresh"></i> Refresh</button>
  </div>

  <!-- Form hutang -->
  <!-- Tabel hutang -->
  <div class="card">
    <div class="card-title"><i class="ti ti-list"></i> Daftar Hutang</div>
    <div class="tbl-wrap" style="overflow-x:auto"><table class="tbl">
      <thead><tr><th>Kreditur</th><th>Jenis</th><th style="text-align:right">Pokok</th><th style="text-align:right">Bunga</th><th style="text-align:right">Cicilan/bln</th><th style="text-align:right">Sudah Bayar</th><th style="text-align:right">Sisa</th><th>Jatuh Tempo</th><th>Status</th><th>Aksi</th></tr></thead>
      <tbody id="keu-hutang-tbody"><tr><td colspan="10" style="color:var(--ink3);font-style:italic">Memuat...</td></tr></tbody>
    </table></div>
  </div>

  <!-- Riwayat pembayaran -->
  <div class="card" style="margin-top:14px">
    <div class="card-title"><i class="ti ti-history"></i> Catat Pembayaran Cicilan</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:10px">
      <div class="form-group" style="flex:1 1 160px"><label>Pilih Hutang</label>
        <select id="keu-bayar-hutang-id" style="width:100%"><option value="">— Pilih —</option></select>
      </div>
      <div class="form-group" style="flex:0 1 120px"><label>Tanggal</label><input type="date" id="keu-bayar-tgl"></div>
      <div class="form-group" style="flex:1 1 120px"><label>Nominal (Rp)</label><input type="text" inputmode="numeric" id="keu-bayar-nominal" placeholder="0"></div>
      <div class="form-group" style="flex:2 1 160px"><label>Keterangan</label><input type="text" id="keu-bayar-ket" placeholder="mis: cicilan bulan Mei"></div>
      <button class="btn btn-primary btn-sm" onclick="keuSimpanPembayaran()" style="margin-bottom:2px"><i class="ti ti-check"></i> Catat</button>
    </div>
    <div class="tbl-wrap" style="max-height:240px;overflow-y:auto;overflow-x:auto"><table class="tbl">
      <thead><tr><th>Tanggal</th><th>Kreditur</th><th>Keterangan</th><th style="text-align:right">Nominal</th><th>Aksi</th></tr></thead>
      <tbody id="keu-bayar-tbody"><tr><td colspan="5" style="color:var(--ink3);font-style:italic">Memuat...</td></tr></tbody>
    </table></div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- PANEL: NERACA                                              -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div id="keu-panel-neraca" class="keu-panel">
  <div style="display:flex;gap:8px;margin-bottom:12px">
    <button class="btn btn-sm btn-primary" onclick="keuRenderNeraca()"><i class="ti ti-refresh"></i> Refresh</button>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px" id="keu-neraca-grid">
    <!-- ASET -->
    <div class="card">
      <div class="card-title" style="color:var(--ok)"><i class="ti ti-trending-up"></i> ASET</div>
      <table class="tbl"><tbody id="keu-neraca-aset"></tbody></table>
      <div style="margin-top:8px;padding-top:8px;border-top:2px solid var(--ink);display:flex;justify-content:space-between;font-weight:700">
        <span>Total Aset</span><span id="keu-neraca-total-aset" style="color:var(--ok)">—</span>
      </div>
    </div>
    <!-- KEWAJIBAN + MODAL -->
    <div class="card">
      <div class="card-title" style="color:var(--danger)"><i class="ti ti-trending-down"></i> KEWAJIBAN</div>
      <table class="tbl"><tbody id="keu-neraca-kewajiban"></tbody></table>
      <div style="margin-top:8px;padding-top:8px;border-top:2px dashed var(--ink3);display:flex;justify-content:space-between;font-weight:700">
        <span>Total Kewajiban</span><span id="keu-neraca-total-kewajiban" style="color:var(--danger)">—</span>
      </div>
      <div class="card-title" style="color:var(--ink);margin-top:14px"><i class="ti ti-user"></i> MODAL</div>
      <table class="tbl"><tbody id="keu-neraca-modal"></tbody></table>
      <div style="margin-top:8px;padding-top:8px;border-top:2px solid var(--ink);display:flex;justify-content:space-between;font-weight:700">
        <span>Kewajiban + Modal</span><span id="keu-neraca-total-km" style="color:var(--ink)">—</span>
      </div>
    </div>
  </div>
  <div style="padding:12px 16px;background:var(--cream2);border:2px solid var(--ink);border-radius:2px;display:flex;justify-content:space-between;align-items:center">
    <span style="font-weight:700">✅ Neraca Seimbang?</span>
    <span id="keu-neraca-check" style="font-weight:700;font-size:15px">—</span>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- PANEL: RASIO & NET WORTH                                   -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div id="keu-panel-rasio" class="keu-panel">
  <div style="display:flex;gap:8px;margin-bottom:12px">
    <button class="btn btn-sm btn-primary" onclick="keuRenderRasio()"><i class="ti ti-refresh"></i> Refresh</button>
  </div>

  <div class="card" style="margin-bottom:14px">
    <div class="card-title"><i class="ti ti-activity"></i> Net Worth (Kekayaan Bersih)</div>
    <div class="rasio-card">
      <div class="rasio-item" id="keu-networth-card">
        <div class="r-label">Net Worth</div>
        <div class="r-value" id="keu-networth-val">—</div>
        <div class="r-desc">Total Aset − Total Hutang</div>
      </div>
      <div class="rasio-item">
        <div class="r-label">Total Aset</div>
        <div class="r-value" id="keu-rasio-aset">—</div>
        <div class="r-desc">dari Kas & Jurnal</div>
      </div>
      <div class="rasio-item">
        <div class="r-label">Total Hutang</div>
        <div class="r-value" id="keu-rasio-hutang" style="color:var(--danger)">—</div>
        <div class="r-desc">sisa semua pinjaman</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><i class="ti ti-chart-pie"></i> Rasio Solvabilitas</div>
    <div class="rasio-card">
      <div class="rasio-item" id="keu-dta-card">
        <div class="r-label">Debt to Asset Ratio</div>
        <div class="r-value" id="keu-dta-val">—</div>
        <div class="r-desc" id="keu-dta-desc">Total Hutang ÷ Total Aset</div>
      </div>
      <div class="rasio-item" id="keu-dte-card">
        <div class="r-label">Debt to Equity Ratio</div>
        <div class="r-value" id="keu-dte-val">—</div>
        <div class="r-desc" id="keu-dte-desc">Total Hutang ÷ Modal</div>
      </div>
      <div class="rasio-item" id="keu-cr-card">
        <div class="r-label">Coverage Ratio</div>
        <div class="r-value" id="keu-cr-val">—</div>
        <div class="r-desc" id="keu-cr-desc">Kas ÷ Cicilan/Bulan</div>
      </div>
    </div>
    <div style="margin-top:10px;padding:10px 12px;background:var(--cream2);border:1.5px dashed var(--ink3);font-size:12px;color:var(--ink2);line-height:1.8">
      <b>Panduan:</b><br>
      DTA &lt; 0.4 = 🟢 Sehat &nbsp;|&nbsp; 0.4–0.6 = 🟡 Waspadai &nbsp;|&nbsp; &gt; 0.6 = 🔴 Berisiko<br>
      DTE &lt; 1.0 = 🟢 Sehat &nbsp;|&nbsp; 1.0–2.0 = 🟡 Perhatikan &nbsp;|&nbsp; &gt; 2.0 = 🔴 Berbahaya<br>
      Coverage &gt; 3x = 🟢 Aman &nbsp;|&nbsp; 1–3x = 🟡 Cukup &nbsp;|&nbsp; &lt; 1x = 🔴 Kritis
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- PANEL: VALUASI BISNIS                                      -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div id="keu-panel-valuasi" class="keu-panel">
  <div style="display:flex;gap:8px;margin-bottom:12px">
    <button class="btn btn-sm btn-primary" onclick="keuRenderValuasi()"><i class="ti ti-refresh"></i> Refresh</button>
  </div>
  <div style="margin-bottom:12px;padding:10px 14px;background:var(--cream2);border:2px dashed var(--ink3);font-size:13px;color:var(--ink2);line-height:1.7">
    Valuasi dihitung otomatis dari data Kas & Jurnal + Hutang. Multiplier bisa disesuaikan.
  </div>

  <!-- Input multiplier -->
  <div class="card" style="margin-bottom:14px">
    <div class="card-title"><i class="ti ti-adjustments"></i> Parameter Valuasi</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
      <div class="form-group" style="flex:1 1 130px">
        <label>Multiplier Laba <span style="color:var(--ink3);font-weight:400">(umumnya 2-5x)</span></label>
        <input type="number" id="keu-mult-laba" value="3" step="0.5" min="1" max="20">
      </div>
      <div class="form-group" style="flex:1 1 130px">
        <label>Multiplier Revenue <span style="color:var(--ink3);font-weight:400">(umumnya 0.5-2x)</span></label>
        <input type="number" id="keu-mult-rev" value="1" step="0.1" min="0.1" max="10">
      </div>
      <div class="form-group" style="flex:1 1 130px">
        <label>Periode Laba (bulan)</label>
        <input type="number" id="keu-periode-laba" value="12" step="1" min="1">
      </div>
      <button class="btn btn-primary btn-sm" onclick="keuRenderValuasi()" style="margin-bottom:2px">Hitung</button>
    </div>
  </div>

  <!-- Hasil valuasi -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:14px">
    <div class="val-card">
      <div class="v-method">📊 Metode Asset-Based</div>
      <div class="v-value" id="keu-val-aset">—</div>
      <div class="v-desc">Nilai Aset Bersih (Aset − Hutang)</div>
    </div>
    <div class="val-card">
      <div class="v-method">📈 Metode Earnings-Based</div>
      <div class="v-value" id="keu-val-earnings">—</div>
      <div class="v-desc" id="keu-val-earnings-desc">Laba Bersih × Multiplier</div>
    </div>
    <div class="val-card">
      <div class="v-method">💰 Metode Revenue-Based</div>
      <div class="v-value" id="keu-val-revenue">—</div>
      <div class="v-desc" id="keu-val-revenue-desc">Total Pendapatan × Multiplier</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><i class="ti ti-calculator"></i> Estimasi Nilai Bisnis</div>
    <div style="text-align:center;padding:20px">
      <div style="font-size:13px;color:var(--ink2);margin-bottom:6px">Rata-rata 3 Metode</div>
      <div style="font-size:32px;font-weight:700;font-family:var(--f2)" id="keu-val-rata">—</div>
      <div style="font-size:12px;color:var(--ink3);margin-top:4px">estimasi valuasi bisnis zenOt</div>
    </div>
    <div style="padding:10px 12px;background:var(--cream2);border-top:1.5px dashed var(--ink3);font-size:12px;color:var(--ink2)">
      ⚠ Valuasi adalah estimasi — angka aktual bergantung pada kondisi pasar, aset tak berwujud (brand, pelanggan loyal), dan negosiasi.
    </div>
  </div>
</div>
`;

setTimeout(() => { if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-keuangan')); }, 80);
document.body.insertAdjacentHTML('beforeend', `
<!-- MODAL: TAMBAH/EDIT HUTANG -->
<div class="modal-overlay" id="modal-keu-hutang" onclick="if(event.target===this)hideModal('modal-keu-hutang')">
  <div class="modal" style="max-width:560px;width:100%">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:10px;border-bottom:2px dashed var(--ink3)">
      <div class="modal-title" id="keu-hutang-form-title" style="margin:0;border:none;padding:0;font-size:18px"><i class="ti ti-plus"></i> Tambah Hutang</div>
      <button onclick="hideModal('modal-keu-hutang')" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--ink3);line-height:1;padding:4px 8px">&#10005;</button>
    </div>
    <input type="hidden" id="keu-htg-id">
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">
      <div class="form-group" style="flex:2 1 160px"><label>Nama Kreditur</label><input type="text" id="keu-htg-kreditur" placeholder="mis: KUR BRI, Pak Hasan..."></div>
      <div class="form-group" style="flex:1 1 120px"><label>Jenis Hutang</label>
        <select id="keu-htg-jenis" style="width:100%">
          <option value="bank">🏦 Bank / KUR</option>
          <option value="keluarga">👨‍👩‍👧 Keluarga / Sodara</option>
          <option value="investor">💼 Investor / Modal</option>
          <option value="lainnya">📋 Lainnya</option>
        </select>
      </div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">
      <div class="form-group" style="flex:1 1 130px"><label>Pokok Pinjaman (Rp)</label><input type="text" inputmode="numeric" id="keu-htg-pokok" placeholder="0"></div>
      <div class="form-group" style="flex:1 1 120px"><label>Bunga / Tahun (%)</label><input type="number" id="keu-htg-bunga" placeholder="0" step="0.1"></div>
      <div class="form-group" style="flex:1 1 120px"><label>Tenor (bulan)</label><input type="number" id="keu-htg-tenor" placeholder="mis: 24"></div>
      <div class="form-group" style="flex:1 1 130px"><label>Cicilan / Bulan (Rp)</label><input type="text" inputmode="numeric" id="keu-htg-cicilan" placeholder="0"></div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">
      <div class="form-group" style="flex:1 1 130px"><label>Tanggal Mulai</label><input type="date" id="keu-htg-tgl-mulai"></div>
      <div class="form-group" style="flex:1 1 130px"><label>Jatuh Tempo</label><input type="date" id="keu-htg-jatuh-tempo"></div>
      <div class="form-group" style="flex:2 1 180px"><label>Keterangan</label><input type="text" id="keu-htg-ket" placeholder="mis: modal tambah stok koleksi baru"></div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-primary btn-sm" onclick="keuSimpanHutang()"><i class="ti ti-device-floppy"></i> Simpan</button>
      <button class="btn btn-sm" onclick="hideModal('modal-keu-hutang')"><i class="ti ti-x"></i> Batal</button>
    </div>
  </div>
</div>
`);

// ─── TAB ─────────────────────────────────────────────────────
function keuGotoTab(tab) {
  const tabs = ['hutang','neraca','rasio','valuasi'];
  document.querySelectorAll('.keu-tab').forEach((t,i) => t.classList.toggle('active', tabs[i] === tab));
  document.querySelectorAll('.keu-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('keu-panel-' + tab).classList.add('active');
  if (tab === 'neraca')  keuRenderNeraca();
  if (tab === 'rasio')   keuRenderRasio();
  if (tab === 'valuasi') keuRenderValuasi();
}

// ─── HUTANG ──────────────────────────────────────────────────
async function keuLoadHutang() {
  try {
    const [hutang, bayar] = await Promise.all([
      dbGet('hutang', '&order=created_at.desc'),
      dbGet('hutang_bayar', '&order=tanggal.desc'),
    ]);
    _keuHutangAll = hutang || [];
    keuRenderHutangTabel(_keuHutangAll, bayar || []);
    keuRenderBayarTabel(bayar || [], _keuHutangAll);
    keuUpdateHutangSummary(_keuHutangAll, bayar || []);
    keuPopulateBayarDropdown(_keuHutangAll);
  } catch(e) {
    document.getElementById('keu-hutang-tbody').innerHTML = `<tr><td colspan="10" style="color:var(--danger)">Error: ${e.message}</td></tr>`;
  }
}

function keuGetSudahBayar(hutangId, bayarList) {
  return bayarList.filter(b => String(b.hutang_id) === String(hutangId)).reduce((s,b) => s + (b.nominal||0), 0);
}

function keuRenderHutangTabel(hutang, bayar) {
  const tbody = document.getElementById('keu-hutang-tbody');
  if (!hutang.length) { tbody.innerHTML = `<tr><td colspan="10" style="color:var(--ink3);font-style:italic">Belum ada hutang</td></tr>`; return; }
  const fmtRp = v => fmtRpFull(v||0);
  const jenisLabel = { bank:'🏦 Bank/KUR', keluarga:'👨‍👩‍👧 Keluarga', investor:'💼 Investor', lainnya:'📋 Lainnya' };
  tbody.innerHTML = hutang.map(h => {
    const sudahBayar = keuGetSudahBayar(h.id, bayar);
    const sisa       = (h.pokok||0) - sudahBayar;
    const isLunas    = sisa <= 0;
    const jatuhTempo = h.jatuh_tempo ? new Date(h.jatuh_tempo).toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
    const safeKreditur = (h.kreditur||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    return `<tr>
      <td style="font-weight:700">${h.kreditur||'—'}</td>
      <td style="font-size:12px">${jenisLabel[h.jenis]||h.jenis||'—'}</td>
      <td style="text-align:right">${fmtRp(h.pokok)}</td>
      <td style="text-align:right;font-size:12px;color:var(--ink3)">${h.bunga ? h.bunga+'%/thn' : '—'}</td>
      <td style="text-align:right">${h.cicilan_per_bulan ? fmtRp(h.cicilan_per_bulan) : '—'}</td>
      <td style="text-align:right;color:var(--ok)">${fmtRp(sudahBayar)}</td>
      <td style="text-align:right;font-weight:700;color:${isLunas?'var(--ok)':'var(--danger)'}">${isLunas ? '✅ LUNAS' : fmtRp(sisa)}</td>
      <td style="font-size:12px">${jatuhTempo}</td>
      <td><span class="${isLunas ? 'hutang-status-lunas' : 'hutang-status-aktif'}">${isLunas ? '✅ Lunas' : '⏳ Aktif'}</span></td>
      <td>
        <button class="btn btn-sm" data-action="edit-hutang" data-id="${h.id}" style="margin-right:4px"><i class="ti ti-edit"></i></button>
        <button class="btn btn-sm btn-danger" data-action="hapus-hutang" data-id="${h.id}" data-nama="${safeKreditur}"><i class="ti ti-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function keuRenderBayarTabel(bayar, hutang) {
  const tbody = document.getElementById('keu-bayar-tbody');
  if (!bayar.length) { tbody.innerHTML = `<tr><td colspan="5" style="color:var(--ink3);font-style:italic">Belum ada pembayaran</td></tr>`; return; }
  const htgMap = {}; hutang.forEach(h => htgMap[h.id] = h);
  const fmtRp = v => fmtRpFull(v||0);
  tbody.innerHTML = bayar.map(b => {
    const tgl = new Date(b.tanggal).toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'2-digit'});
    const h   = htgMap[b.hutang_id];
    return `<tr>
      <td>${tgl}</td>
      <td style="font-weight:700">${h ? h.kreditur : '—'}</td>
      <td>${b.keterangan||'—'}</td>
      <td style="text-align:right;color:var(--ok);font-weight:700">${fmtRp(b.nominal)}</td>
      <td><button class="btn btn-sm btn-danger" data-action="hapus-bayar" data-id="${b.id}"><i class="ti ti-trash"></i></button></td>
    </tr>`;
  }).join('');
}

function keuUpdateHutangSummary(hutang, bayar) {
  const totalPokok   = hutang.reduce((s,h) => s+(h.pokok||0), 0);
  const totalBayar   = bayar.reduce((s,b) => s+(b.nominal||0), 0);
  const totalSisa    = hutang.reduce((s,h) => s + Math.max(0,(h.pokok||0) - keuGetSudahBayar(h.id, bayar)), 0);
  const totalCicilan = hutang.filter(h => {
    const sisa = (h.pokok||0) - keuGetSudahBayar(h.id, bayar);
    return sisa > 0;
  }).reduce((s,h) => s+(h.cicilan_per_bulan||0), 0);
  const fmtRp = v => fmtRpFull(v);
  document.getElementById('keu-total-hutang').textContent  = fmtRp(totalPokok);
  document.getElementById('keu-total-bayar').textContent   = fmtRp(totalBayar);
  document.getElementById('keu-total-sisa').textContent    = fmtRp(totalSisa);
  document.getElementById('keu-total-cicilan').textContent = fmtRp(totalCicilan);
}

function keuPopulateBayarDropdown(hutang) {
  const sel = document.getElementById('keu-bayar-hutang-id');
  sel.innerHTML = '<option value="">— Pilih Hutang —</option>' +
    hutang.map(h => `<option value="${h.id}">${h.kreditur} (Rp${(h.pokok||0).toLocaleString('id-ID')})</option>`).join('');
}

function keuShowFormHutang(data) {
  document.getElementById('keu-hutang-form-title').innerHTML = '<i class="ti ti-plus"></i> Tambah Hutang';
  document.getElementById('keu-htg-id').value            = '';
  document.getElementById('keu-htg-kreditur').value      = data?.kreditur || '';
  document.getElementById('keu-htg-jenis').value         = data?.jenis || 'bank';
  idrSet('keu-htg-pokok', data?.pokok || 0);
  document.getElementById('keu-htg-bunga').value         = data?.bunga || '';
  document.getElementById('keu-htg-tenor').value         = data?.tenor || '';
  idrSet('keu-htg-cicilan', data?.cicilan_per_bulan || 0);
  document.getElementById('keu-htg-tgl-mulai').value     = data?.tgl_mulai ? data.tgl_mulai.split('T')[0] : '';
  document.getElementById('keu-htg-jatuh-tempo').value   = data?.jatuh_tempo ? data.jatuh_tempo.split('T')[0] : '';
  document.getElementById('keu-htg-ket').value           = data?.keterangan || '';
  showModal('modal-keu-hutang');
}

function keuCancelFormHutang() { hideModal('modal-keu-hutang'); }

async function keuSimpanHutang() {
  const id = document.getElementById('keu-htg-id').value;
  const data = {
    kreditur:         document.getElementById('keu-htg-kreditur').value.trim(),
    jenis:            document.getElementById('keu-htg-jenis').value,
    pokok:            idrVal('keu-htg-pokok'),
    bunga:            parseFloat(document.getElementById('keu-htg-bunga').value) || 0,
    tenor:            parseInt(document.getElementById('keu-htg-tenor').value) || null,
    cicilan_per_bulan:idrVal('keu-htg-cicilan'),
    tgl_mulai:        document.getElementById('keu-htg-tgl-mulai').value || null,
    jatuh_tempo:      document.getElementById('keu-htg-jatuh-tempo').value || null,
    keterangan:       document.getElementById('keu-htg-ket').value.trim() || null,
  };
  if (!data.kreditur) { alert('Nama kreditur wajib diisi!'); return; }
  if (!data.pokok)    { alert('Pokok pinjaman wajib diisi!'); return; }
  try {
    if (id) { await dbUpdate('hutang', id, data); } else { await dbInsert('hutang', data); }
    keuCancelFormHutang(); keuLoadHutang();
  } catch(e) { alert('Gagal simpan: ' + e.message); }
}

async function keuEditHutang(id) {
  const h = _keuHutangAll.find(x => String(x.id) === String(id)); if (!h) return;
  document.getElementById('keu-hutang-form-title').innerHTML = '<i class="ti ti-edit"></i> Edit Hutang';
  document.getElementById('keu-htg-id').value = h.id;
  keuShowFormHutang(h);
}

async function keuHapusHutang(id, nama) {
  confirmDelete(`Hapus hutang "${nama}"?`, async () => {
    try { await dbDelete('hutang', id); keuLoadHutang(); } catch(e) { alert('Gagal hapus: ' + e.message); }
  });
}

async function keuSimpanPembayaran() {
  const hutangId = document.getElementById('keu-bayar-hutang-id').value;
  const tgl      = document.getElementById('keu-bayar-tgl').value;
  const nominal  = idrVal('keu-bayar-nominal');
  const ket      = document.getElementById('keu-bayar-ket').value.trim();
  if (!hutangId) { alert('Pilih hutang dulu!'); return; }
  if (!tgl)      { alert('Tanggal wajib diisi!'); return; }
  if (!nominal)  { alert('Nominal wajib diisi!'); return; }
  try {
    await dbInsert('hutang_bayar', { hutang_id: hutangId, tanggal: tgl, nominal, keterangan: ket || null });
    idrSet('keu-bayar-nominal', 0);
    document.getElementById('keu-bayar-ket').value = '';
    keuLoadHutang();
  } catch(e) { alert('Gagal simpan: ' + e.message); }
}

async function keuHapusBayar(id) {
  confirmDelete('Hapus catatan pembayaran ini?', async () => {
    try { await dbDelete('hutang_bayar', id); keuLoadHutang(); } catch(e) { alert('Gagal hapus: ' + e.message); }
  });
}

// ─── LOAD DATA KAS & JURNAL ──────────────────────────────────
async function keuLoadKasData() {
  try {
    const [akun, jurnal] = await Promise.all([
      dbGet('kas_akun', '&order=kode.asc'),
      dbGet('jurnal', '&order=tanggal.asc'),
    ]);
    _keuKasAkun   = akun   || [];
    _keuKasJurnal = jurnal || [];
  } catch(e) { _keuKasAkun = []; _keuKasJurnal = []; }
}

function keuHitungSaldoAkun() {
  const akunMap = {}; _keuKasAkun.forEach(a => { akunMap[a.id] = {...a, saldoDebit:0, saldoKredit:0}; });
  _keuKasJurnal.forEach(r => {
    const n = r.nominal || r.debit || 0;
    if (akunMap[r.akun_debit_id])  akunMap[r.akun_debit_id].saldoDebit   += n;
    if (akunMap[r.akun_kredit_id]) akunMap[r.akun_kredit_id].saldoKredit += n;
  });
  return akunMap;
}

function keuGetTotalByKelompok(akunMap, kelompok) {
  return Object.values(akunMap).filter(a => a.kelompok === kelompok).reduce((s,a) => {
    const saldo = ['aset','beban'].includes(a.kelompok) ? a.saldoDebit - a.saldoKredit : a.saldoKredit - a.saldoDebit;
    return s + Math.max(0, saldo);
  }, 0);
}

// ─── NERACA ──────────────────────────────────────────────────
async function keuRenderNeraca() {
  await keuLoadKasData();
  const bayar = await dbGet('hutang_bayar').catch(() => []) || [];
  const akunMap = keuHitungSaldoAkun();
  const fmtRp = v => fmtRpFull(v||0);

  // ASET
  const asetAkun = Object.values(akunMap).filter(a => a.kelompok === 'aset');
  let totalAset = 0;
  document.getElementById('keu-neraca-aset').innerHTML = asetAkun.map(a => {
    const saldo = Math.max(0, a.saldoDebit - a.saldoKredit); totalAset += saldo;
    return `<tr><td style="padding-left:12px">${a.nama}</td><td style="text-align:right;color:var(--ok)">${fmtRp(saldo)}</td></tr>`;
  }).join('') || `<tr><td colspan="2" style="color:var(--ink3);font-style:italic">Belum ada akun aset</td></tr>`;
  // Tambah Persediaan Barang (dari stok produk — semua kategori tetap aset)
  try {
    const [produkArr, stokArr, jualArr] = await Promise.all([
      dbGet('produk', '').catch(()=>[]),
      dbGet('stok',   '').catch(()=>[]),
      dbGet('jurnal_penjualan', '&select=sku,qty').catch(()=>[])
    ]);
    const stokMap  = {};
    (stokArr||[]).forEach(s => { stokMap[(s.sku_variasi||'').toUpperCase()] = s.stok_masuk||0; });
    const keluarMap = {};
    (jualArr||[]).forEach(j => { const k=(j.sku||'').toUpperCase(); keluarMap[k]=(keluarMap[k]||0)+(j.qty||0); });
    let nilaiPersediaan = 0;
    (produkArr||[]).forEach(p => {
      const key   = (p.sku_variasi||'').toUpperCase();
      const masuk = stokMap[key] || 0;
      const keluar= keluarMap[key] || 0;
      const sisa  = masuk - keluar;
      if (sisa > 0) nilaiPersediaan += sisa * (p.hpp||0);
    });
    if (nilaiPersediaan > 0) {
      const persediaanRow = `<tr><td style="padding-left:12px">Persediaan Barang</td><td style="text-align:right;color:var(--ok)">${fmtRp(nilaiPersediaan)}</td></tr>`;
      document.getElementById('keu-neraca-aset').innerHTML += persediaanRow;
      totalAset += nilaiPersediaan;
    }
  } catch(e) { console.warn('[NERACA-PERSEDIAAN]', e); }

  document.getElementById('keu-neraca-total-aset').textContent = fmtRp(totalAset);

  // KEWAJIBAN — dari hutang sisa
  const sisaHutang = _keuHutangAll.reduce((s,h) => s + Math.max(0,(h.pokok||0) - keuGetSudahBayar(h.id, bayar)), 0);
  const kwjAkun = Object.values(akunMap).filter(a => a.kelompok === 'kewajiban');
  let totalKwj = sisaHutang;
  let kwjHtml = _keuHutangAll.length
    ? `<tr><td style="padding-left:12px">Hutang Pinjaman</td><td style="text-align:right;color:var(--danger)">${fmtRp(sisaHutang)}</td></tr>`
    : '';
  kwjAkun.forEach(a => { const s = Math.max(0,a.saldoKredit-a.saldoDebit); totalKwj+=s; kwjHtml+=`<tr><td style="padding-left:12px">${a.nama}</td><td style="text-align:right;color:var(--danger)">${fmtRp(s)}</td></tr>`; });
  document.getElementById('keu-neraca-kewajiban').innerHTML = kwjHtml || `<tr><td colspan="2" style="color:var(--ink3);font-style:italic">Tidak ada kewajiban</td></tr>`;
  document.getElementById('keu-neraca-total-kewajiban').textContent = fmtRp(totalKwj);

  // MODAL
  const modalAkun = Object.values(akunMap).filter(a => a.kelompok === 'modal');
  const pendAkun  = Object.values(akunMap).filter(a => a.kelompok === 'pendapatan');
  const bebanAkun = Object.values(akunMap).filter(a => a.kelompok === 'beban');
  const totalPend  = pendAkun.reduce((s,a)  => s+Math.max(0,a.saldoKredit-a.saldoDebit),0);
  const totalBeban = bebanAkun.reduce((s,a) => s+Math.max(0,a.saldoDebit-a.saldoKredit),0);
  const labaRugi   = totalPend - totalBeban;
  let totalModal = labaRugi;
  let modalHtml = '';
  modalAkun.forEach(a => { const s=a.saldoKredit-a.saldoDebit; totalModal+=s; modalHtml+=`<tr><td style="padding-left:12px">${a.nama}</td><td style="text-align:right;color:${s<0?'var(--danger)':'inherit'}">${s<0?'( '+fmtRp(Math.abs(s))+' )':fmtRp(s)}</td></tr>`; });
  modalHtml += `<tr><td style="padding-left:12px;color:${labaRugi>=0?'var(--ok)':'var(--danger)'}">${labaRugi>=0?'Laba':'Rugi'} Berjalan</td><td style="text-align:right;color:${labaRugi>=0?'var(--ok)':'var(--danger)'}">${labaRugi<0?'(':''} ${fmtRp(Math.abs(labaRugi))} ${labaRugi<0?')':''}</td></tr>`;
  document.getElementById('keu-neraca-modal').innerHTML = modalHtml || `<tr><td colspan="2" style="color:var(--ink3);font-style:italic">Belum ada akun modal</td></tr>`;

  const totalKM = totalKwj + totalModal;
  document.getElementById('keu-neraca-total-km').textContent = fmtRp(totalKM);

  const seimbang = Math.abs(totalAset - totalKM) < 1;
  document.getElementById('keu-neraca-check').textContent = seimbang ? '✅ Seimbang' : `⚠ Selisih ${fmtRp(Math.abs(totalAset-totalKM))}`;
  document.getElementById('keu-neraca-check').style.color = seimbang ? 'var(--ok)' : 'var(--danger)';
}

// ─── RASIO & NET WORTH ────────────────────────────────────────
async function keuRenderRasio() {
  await keuLoadKasData();
  const bayar = await dbGet('hutang_bayar').catch(() => []) || [];
  const akunMap = keuHitungSaldoAkun();
  const fmtRp = v => fmtRpFull(Math.abs(v));

  const totalAset    = keuGetTotalByKelompok(akunMap, 'aset');
  const totalHutang  = _keuHutangAll.reduce((s,h) => s+Math.max(0,(h.pokok||0)-keuGetSudahBayar(h.id,bayar)), 0);
  const totalModal   = keuGetTotalByKelompok(akunMap, 'modal');
  const netWorth     = totalAset - totalHutang;
  const totalCicilan = _keuHutangAll.filter(h => {
    const sisa=(h.pokok||0)-keuGetSudahBayar(h.id,bayar); return sisa>0;
  }).reduce((s,h) => s+(h.cicilan_per_bulan||0), 0);

  // Net Worth
  document.getElementById('keu-rasio-aset').textContent   = fmtRp(totalAset);
  document.getElementById('keu-rasio-hutang').textContent = fmtRp(totalHutang);
  document.getElementById('keu-networth-val').textContent = (netWorth<0?'-':'') + fmtRp(netWorth);
  document.getElementById('keu-networth-val').style.color = netWorth>=0?'var(--ok)':'var(--danger)';
  document.getElementById('keu-networth-card').className  = 'rasio-item ' + (netWorth>=0?'r-ok':'r-danger');

  // DTA
  const dta = totalAset ? totalHutang / totalAset : 0;
  document.getElementById('keu-dta-val').textContent  = (dta*100).toFixed(1)+'%';
  document.getElementById('keu-dta-desc').textContent = `${fmtRp(totalHutang)} ÷ ${fmtRp(totalAset)}`;
  document.getElementById('keu-dta-card').className   = 'rasio-item ' + (dta<0.4?'r-ok':dta<0.6?'r-warn':'r-danger');

  // DTE
  const equity = totalModal + (netWorth>0?netWorth:0);
  const dte    = equity ? totalHutang / equity : 0;
  document.getElementById('keu-dte-val').textContent  = dte.toFixed(2)+'x';
  document.getElementById('keu-dte-desc').textContent = `${fmtRp(totalHutang)} ÷ ${fmtRp(equity)}`;
  document.getElementById('keu-dte-card').className   = 'rasio-item ' + (dte<1?'r-ok':dte<2?'r-warn':'r-danger');

  // Coverage
  const kasAset = Object.values(akunMap).filter(a=>a.kelompok==='aset').reduce((s,a)=>s+Math.max(0,a.saldoDebit-a.saldoKredit),0);
  const cr      = totalCicilan ? kasAset / totalCicilan : 0;
  document.getElementById('keu-cr-val').textContent  = cr ? cr.toFixed(1)+'x' : '∞';
  document.getElementById('keu-cr-desc').textContent = totalCicilan ? `${fmtRp(kasAset)} ÷ ${fmtRp(totalCicilan)}/bln` : 'Tidak ada cicilan aktif';
  document.getElementById('keu-cr-card').className   = 'rasio-item ' + (!totalCicilan?'r-ok':cr>=3?'r-ok':cr>=1?'r-warn':'r-danger');
}

// ─── VALUASI ─────────────────────────────────────────────────
async function keuRenderValuasi() {
  await keuLoadKasData();
  const bayar = await dbGet('hutang_bayar').catch(() => []) || [];
  const akunMap    = keuHitungSaldoAkun();
  const fmtRp = v => fmtRpFull(Math.abs(v));
  const multLaba   = parseFloat(document.getElementById('keu-mult-laba').value) || 3;
  const multRev    = parseFloat(document.getElementById('keu-mult-rev').value) || 1;
  const periodeQ   = parseInt(document.getElementById('keu-periode-laba').value) || 12;

  const totalAset   = keuGetTotalByKelompok(akunMap, 'aset');
  const totalHutang = _keuHutangAll.reduce((s,h)=>s+Math.max(0,(h.pokok||0)-keuGetSudahBayar(h.id,bayar)),0);
  const asetBersih  = totalAset - totalHutang;

  const totalPend   = keuGetTotalByKelompok(akunMap, 'pendapatan');
  const totalBeban  = keuGetTotalByKelompok(akunMap, 'beban');
  const labaBersih  = totalPend - totalBeban;

  // Asset-based
  const valAset     = asetBersih;
  // Earnings-based: annualized
  const bulanData   = periodeQ || 1;
  const labaAnnual  = (labaBersih / bulanData) * 12;
  const valEarnings = Math.max(0, labaAnnual * multLaba);
  // Revenue-based
  const revAnnual   = (totalPend / bulanData) * 12;
  const valRevenue  = revAnnual * multRev;

  const rataRata = (Math.max(0,valAset) + valEarnings + valRevenue) / 3;

  document.getElementById('keu-val-aset').textContent    = (valAset<0?'-':'') + fmtRp(valAset);
  document.getElementById('keu-val-aset').style.color    = valAset>=0?'var(--ink)':'var(--danger)';
  document.getElementById('keu-val-earnings').textContent = fmtRp(valEarnings);
  document.getElementById('keu-val-earnings-desc').textContent = `Laba bersih (annual) × ${multLaba}x`;
  document.getElementById('keu-val-revenue').textContent  = fmtRp(valRevenue);
  document.getElementById('keu-val-revenue-desc').textContent  = `Pendapatan (annual) × ${multRev}x`;
  document.getElementById('keu-val-rata').textContent     = fmtRp(rataRata);
}

// ─── EVENT DELEGATION ────────────────────────────────────────
document.getElementById('page-keuangan').addEventListener('click', function(e) {
  const btn = e.target.closest('[data-action]'); if (!btn) return;
  const id = btn.dataset.id, action = btn.dataset.action;
  if (action === 'edit-hutang')  keuEditHutang(id);
  if (action === 'hapus-hutang') keuHapusHutang(id, btn.dataset.nama);
  if (action === 'hapus-bayar')  keuHapusBayar(id);
});

// ─── INIT ─────────────────────────────────────────────────────
// Load saat page keuangan pertama dibuka
const _keuOrigGotoPage = typeof gotoPage === 'function' ? gotoPage : null;
document.addEventListener('DOMContentLoaded', () => {});

// Patch gotoPage agar load data saat buka halaman keuangan
const _origGotoPageKeu = window.gotoPage;
window.gotoPage = function(page, btn) {
  if (_origGotoPageKeu) _origGotoPageKeu(page, btn);
  if (page === 'keuangan') {
    keuLoadHutang();
    keuLoadKasData();
  }
};
