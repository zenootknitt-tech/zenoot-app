// ─── PRICE-LIST.JS v2 ─────────────────────────────────────────
// Harga jual otomatis dari HPP × multiplier per channel
// Dropdown channel → tampil harga untuk channel yang dipilih

document.getElementById('page-price-list').innerHTML = `
  <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
    <button class="btn btn-sm btn-primary" onclick="loadPriceList()">
      <i class="ti ti-refresh"></i> Refresh
    </button>
    <button class="btn btn-sm" onclick="exportPriceList()">
      <i class="ti ti-download"></i> Export CSV
    </button>
    <select id="pl-channel-select"
      style="font-family:var(--f);font-size:13px;padding:5px 10px;border:2px solid var(--ink);background:var(--cream);min-width:160px"
      onchange="onPilihChannelPL()">
      <option value="">— Pilih Channel —</option>
    </select>
    <input type="text" id="pl-search"
      placeholder="Cari SKU / katalog..."
      style="font-family:var(--f);font-size:13px;padding:4px 8px;border:2px solid var(--ink);background:var(--cream);width:180px;margin-left:auto"
      oninput="filterPriceList()">
  </div>

  <!-- INFO BEBAN CHANNEL AKTIF -->
  <div id="pl-info-wrap" style="margin-bottom:14px;display:none">
    <div class="card" style="padding:10px 14px">
      <div style="font-size:11px;font-weight:700;color:var(--ink3);margin-bottom:6px;text-transform:uppercase">⚙ Beban Channel Aktif</div>
      <div id="pl-info-channel" style="font-size:13px;color:var(--ink2)">—</div>
    </div>
  </div>

  <!-- HINT BELUM PILIH CHANNEL -->
  <div id="pl-hint" style="padding:24px;text-align:center;color:var(--ink3);font-style:italic;font-size:14px">
    Pilih channel di atas untuk melihat price list
  </div>

  <!-- TABEL PRICE LIST -->
  <div class="card" id="pl-card" style="display:none">
    <div class="card-title"><i class="ti ti-tag"></i> Price List</div>
    <div class="tbl-wrap" style="max-height:65vh;overflow-y:auto;overflow-x:auto"><table class="tbl">
      <thead>
        <tr>
          <th>Katalog</th>
          <th>SKU Variasi</th>
          <th style="text-align:right">HPP</th>
          <th style="text-align:right" id="pl-th-harga">Harga Jual</th>
          <th style="text-align:center">Margin</th>
        </tr>
      </thead>
      <tbody id="pl-tbody">
        <tr><td colspan="5" style="color:var(--ink3);font-style:italic">Memuat data...</td></tr>
      </tbody>
    </table></div>
    <div id="pl-footer" style="font-size:12px;color:var(--ink3);margin-top:8px;text-align:right"></div>
  </div>
`;

setTimeout(() => { if (typeof rerenderUI === 'function') rerenderUI(document.getElementById('page-price-list')); }, 80);

// ─── CACHE ───────────────────────────────────────────────────
var _plProdukData    = [];
var _plChannelList   = [];
var _plBebanMap      = {};   // channel_id → { beban_persen, npm_persen }
var _plRendered      = [];
var _plChannelAktif  = null; // object channel yang dipilih

// ─── LOAD SEMUA DATA ─────────────────────────────────────────
async function loadPriceList() {
  try {
    const [produk, channels, bebanList] = await Promise.all([
      dbGet('produk',        '&order=katalog.asc'),
      dbGet('channels',      '&order=nama.asc'),
      dbGet('channel_beban', ''),
    ]);

    _plProdukData  = produk   || [];
    _plChannelList = channels || [];
    _plBebanMap    = {};
    (bebanList || []).forEach(b => { _plBebanMap[b.channel_id] = b; });

    // Isi dropdown channel (hanya yang sudah punya beban setting)
    var sel = document.getElementById('pl-channel-select');
    var prevVal = sel.value;
    sel.innerHTML = '<option value="">— Pilih Channel —</option>';

    const katLabel = { toko_utama:'Shopee', reseller:'Reseller', lazada:'Lazada', tiktok:'TikTok', offline:'Offline' };
    const grouped  = {};
    _plChannelList.forEach(ch => {
      const k = ch.kategori || 'lainnya';
      if (!grouped[k]) grouped[k] = [];
      grouped[k].push(ch);
    });

    Object.entries(grouped).forEach(([kat, items]) => {
      var grp = document.createElement('optgroup');
      grp.label = '── ' + (katLabel[kat] || kat) + ' ──';
      items.forEach(ch => {
        var opt    = document.createElement('option');
        opt.value  = ch.id;
        var beban  = _plBebanMap[ch.id];
        var suffix = beban ? ' (' + (beban.beban_persen||0).toFixed(1) + '% + ' + (beban.npm_persen||0).toFixed(1) + '%)' : ' —';
        opt.textContent = ch.nama + suffix;
        grp.appendChild(opt);
      });
      sel.appendChild(grp);
    });

    // Restore pilihan sebelumnya jika masih ada
    if (prevVal) sel.value = prevVal;
    onPilihChannelPL();

  } catch(err) {
    document.getElementById('pl-hint').textContent = 'Error: ' + err.message;
  }
}

// ─── SAAT PILIH CHANNEL ──────────────────────────────────────
function onPilihChannelPL() {
  var sel       = document.getElementById('pl-channel-select');
  var channelId = sel.value;
  var hint      = document.getElementById('pl-hint');
  var card      = document.getElementById('pl-card');
  var infoWrap  = document.getElementById('pl-info-wrap');

  if (!channelId) {
    hint.style.display    = '';
    card.style.display    = 'none';
    infoWrap.style.display= 'none';
    _plChannelAktif = null;
    return;
  }

  _plChannelAktif = _plChannelList.find(ch => ch.id === channelId) || null;
  var beban       = _plBebanMap[channelId] || { beban_persen: 0, npm_persen: 0 };

  hint.style.display     = 'none';
  card.style.display     = '';
  infoWrap.style.display = '';

  // Update header kolom
  document.getElementById('pl-th-harga').textContent = 'Harga — ' + (_plChannelAktif ? _plChannelAktif.nama : '');

  // Info beban
  var mult = (1 + ((beban.beban_persen||0) + (beban.npm_persen||0)) / 100).toFixed(3);
  var namaChannel = _plChannelAktif ? _plChannelAktif.nama : channelId;
  var infoEl = document.getElementById('pl-info-channel');
  if (!_plBebanMap[channelId]) {
    infoEl.innerHTML = '<span style="color:var(--danger)">⚠️ Channel <b>' + namaChannel + '</b> belum ada setting beban — harga = HPP (multiplier ×1.000). Setting di halaman Channel.</span>';
  } else {
    infoEl.innerHTML =
      '<b>' + namaChannel + '</b> &nbsp;|&nbsp; ' +
      'Beban: <b style="color:var(--danger)">' + (beban.beban_persen||0).toFixed(1) + '%</b> &nbsp;|&nbsp; ' +
      'NPM: <b style="color:var(--ok)">'   + (beban.npm_persen||0).toFixed(1)   + '%</b> &nbsp;|&nbsp; ' +
      'Multiplier: <b>×' + mult + '</b>';
  }

  renderPriceList(_plProdukData);
}

// ─── RENDER TABEL ────────────────────────────────────────────
function renderPriceList(data) {
  var tbody = document.getElementById('pl-tbody');
  if (!_plChannelAktif && !document.getElementById('pl-channel-select').value) return;

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="color:var(--ink3);font-style:italic">Belum ada produk di Kelola Produk</td></tr>';
    document.getElementById('pl-footer').textContent = '';
    _plRendered = [];
    return;
  }

  var channelId = document.getElementById('pl-channel-select').value;
  var beban     = _plBebanMap[channelId] || { beban_persen: 0, npm_persen: 0 };
  var mult      = 1 + ((beban.beban_persen||0) + (beban.npm_persen||0)) / 100;

  _plRendered = data.map(row => {
    var hpp    = row.hpp || 0;
    var harga  = Math.ceil(hpp * mult);
    var margin = hpp > 0 ? (((harga - hpp) / hpp) * 100).toFixed(1) : 0;
    return Object.assign({}, row, { hargaJual: harga, margin: margin });
  });

  tbody.innerHTML = _plRendered.map(row => {
    return '<tr>' +
      '<td>' + (row.katalog || '—') + '</td>' +
      '<td style="font-weight:600;color:var(--accent)">' + (row.sku || '—') + '</td>' +
      '<td style="text-align:right;color:var(--ink2)">' + fmtRpFull(row.hpp || 0) + '</td>' +
      '<td style="text-align:right;font-weight:700;color:var(--ink)">' + fmtRpFull(row.hargaJual) + '</td>' +
      '<td style="text-align:center"><span style="color:var(--ok);font-weight:600">' + row.margin + '%</span></td>' +
    '</tr>';
  }).join('');

  document.getElementById('pl-footer').textContent = data.length + ' SKU ditampilkan';
}

// ─── FILTER PENCARIAN ────────────────────────────────────────
function filterPriceList() {
  var q = document.getElementById('pl-search').value.toLowerCase().trim();
  if (!q) { renderPriceList(_plProdukData); return; }
  var filtered = _plProdukData.filter(r =>
    (r.sku     || '').toLowerCase().includes(q) ||
    (r.katalog || '').toLowerCase().includes(q)
  );
  renderPriceList(filtered);
}

// ─── EXPORT CSV ──────────────────────────────────────────────
function exportPriceList() {
  if (!_plRendered || !_plRendered.length) { alert('Pilih channel dan pastikan ada data dulu'); return; }
  var chNama = _plChannelAktif ? _plChannelAktif.nama : 'channel';
  var headers = ['Katalog','SKU Variasi','HPP','Harga Jual (' + chNama + ')','Margin (%)'];
  var rows = _plRendered.map(r => [r.katalog, r.sku, r.hpp, r.hargaJual, r.margin]);
  exportCSV('zenoot-price-list-' + chNama.replace(/\./g,'-') + '.csv', headers, rows);
}

// ─── EXPOSE untuk dipanggil dari luar (misal setelah update beban) ─
window.loadPriceList = loadPriceList;

// ─── INIT ────────────────────────────────────────────────────
loadPriceList();
