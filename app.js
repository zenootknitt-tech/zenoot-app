// ─── APP.JS — navigasi, channel, sidebar mobile ────────────

// ─── DATE ───────────────────────────────────────────────────
const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const now    = new Date();
document.getElementById('topbar-date').textContent =
  days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();

// ─── MOBILE SIDEBAR ─────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

// ─── NAV ────────────────────────────────────────────────────
function gotoPage(page, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const info = pageMap[page];
  document.getElementById('topbar-title').textContent = info.title;
  document.getElementById('topbar-sub').textContent   = info.sub;
  state.currentPage = page;
  renderSwitchers();
  closeSidebar(); // tutup sidebar otomatis di mobile
}

// ─── CHANNEL SIDEBAR ─────────────────────────────────────────
function renderSidebarChannels(type) {
  const list = document.getElementById('ch-' + type + '-list');
  list.innerHTML = '';
  state[type].channels.forEach(ch => {
    const el = document.createElement('div');
    el.className = 'ch-sidebar-item' + (ch === state[type].active ? ' active-ch' : '');
    el.innerHTML = `<span><span class="ch-dot${ch===state[type].active?' active':''}"></span> ${ch}</span>`;
    el.onclick = () => { state[type].active = ch; saveState(); renderSidebarChannels(type); renderSwitchers(); };
    list.appendChild(el);
  });
}

// ─── CHANNEL SWITCHER BAR ────────────────────────────────────
function renderSwitchers() {
  const targets = {
    ops:  ['dashboard','stok','restock','kas'],
    toko: ['dataorder','rekap','hpp']
  };
  ['ops','toko'].forEach(type => {
    targets[type].forEach(page => {
      const el = document.getElementById(type + '-switcher-' + page);
      if (!el) return;
      el.innerHTML = `<span class="ch-switcher-label">Channel:</span>` +
        state[type].channels.map(ch =>
          `<button class="ch-btn${ch===state[type].active?' active-ch-btn':''}" onclick="switchChannel('${type}','${ch}')">${ch}</button>`
        ).join('');
    });
  });
}

function switchChannel(type, ch) {
  state[type].active = ch;
  saveState();
  renderSidebarChannels(type);
  renderSwitchers();
}

// ─── MODAL ───────────────────────────────────────────────────
function openModalAdd(type) {
  state.modalTarget = type;
  document.getElementById('modal-add-title').textContent =
    'Tambah Channel ' + (type === 'ops' ? 'Operasional' : 'Toko');
  document.getElementById('modal-add-input').value = '';
  document.getElementById('modal-add').classList.add('open');
}

function confirmAdd() {
  const val  = document.getElementById('modal-add-input').value.trim();
  if (!val) return;
  const type = state.modalTarget;
  if (!state[type].channels.includes(val)) {
    state[type].channels.push(val);
    saveState();
    renderSidebarChannels(type);
    renderSwitchers();
  }
  closeModal('modal-add');
}

function openModalEdit(type) {
  state.modalTarget = type;
  document.getElementById('modal-edit-title').textContent =
    'Edit Channel ' + (type === 'ops' ? 'Operasional' : 'Toko');
  const list = document.getElementById('modal-edit-list');
  list.innerHTML = '';
  state[type].channels.forEach((ch, i) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px';
    row.innerHTML = `
      <input type="text" value="${ch}" style="flex:1;font-family:var(--f);font-size:14px;padding:5px 8px;border:2px solid var(--ink);background:var(--cream)" id="edit-ch-${i}">
      <button class="btn btn-sm" onclick="saveEditChannel('${type}',${i})">✓</button>
      <button class="btn btn-sm" onclick="deleteChannel('${type}',${i})" style="color:var(--danger)">✕</button>
    `;
    list.appendChild(row);
  });
  document.getElementById('modal-edit').classList.add('open');
}

function saveEditChannel(type, i) {
  const val = document.getElementById('edit-ch-' + i).value.trim();
  if (val) {
    state[type].channels[i] = val;
    saveState();
    renderSidebarChannels(type);
    renderSwitchers();
    openModalEdit(type);
  }
}

function deleteChannel(type, i) {
  if (state[type].channels.length <= 1) { alert('Minimal harus ada 1 channel!'); return; }
  state[type].channels.splice(i, 1);
  if (!state[type].channels.includes(state[type].active)) state[type].active = state[type].channels[0];
  saveState();
  renderSidebarChannels(type);
  renderSwitchers();
  openModalEdit(type);
}

function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ─── CONFIRM DELETE HELPER ───────────────────────────────────
function confirmDelete(msg, onConfirm) {
  document.getElementById('modal-confirm-msg').textContent = msg;
  document.getElementById('modal-confirm').classList.add('open');
  const btn = document.getElementById('modal-confirm-ok');
  btn.onclick = () => { closeModal('modal-confirm'); onConfirm(); };
}

// ─── EXPORT CSV HELPER ───────────────────────────────────────
function exportCSV(filename, headers, rows) {
  const lines = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v||'').replace(/"/g,'""')}"`).join(','))];
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ─── INIT ────────────────────────────────────────────────────
renderSidebarChannels('ops');
renderSidebarChannels('toko');
renderSwitchers();
