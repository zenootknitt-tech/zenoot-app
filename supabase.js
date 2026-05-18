// ─── SUPABASE.JS ─────────────────────────────────────────────
const SUPABASE_URL = 'https://hkhntwgurticesuwcmyz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraG50d2d1cnRpY2VzdXdjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NzE1NjIsImV4cCI6MjA5NDA0NzU2Mn0.DSw0s6ik7ghdl947eEROgCQ00Qc6hA-h7sl3_RihcWc';

// ─── ANONYMOUS AUTH ───────────────────────────────────────────
// Menyimpan session anonymous agar RLS policy terpenuhi (auth.uid() valid)
let _authToken   = null;  // JWT access token dari session anonymous
let _authExpiry  = 0;     // Unix timestamp (ms) kedaluwarsa token
let _authPromise = null;  // Promise in-flight agar tidak double request

const _SESSION_KEY = 'zenoot_anon_session';

// Coba restore session dari localStorage
(function _restoreSession() {
  try {
    const raw = localStorage.getItem(_SESSION_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    // Anggap masih valid jika belum expired (dengan buffer 60 detik)
    if (s.access_token && s.expires_at && Date.now() < (s.expires_at * 1000 - 60000)) {
      _authToken  = s.access_token;
      _authExpiry = s.expires_at * 1000;
    }
  } catch(e) { /* abaikan jika localStorage corrupt */ }
})();

async function _ensureAuth() {
  // Jika token masih valid (ada sisa > 60 detik), pakai langsung
  if (_authToken && Date.now() < _authExpiry - 60000) return _authToken;

  // Jika sudah ada request in-flight, tunggu itu saja
  if (_authPromise) return _authPromise;

  _authPromise = (async () => {
    try {
      // Coba refresh dulu jika ada refresh_token tersimpan
      let refreshed = false;
      try {
        const raw = localStorage.getItem(_SESSION_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          if (s.refresh_token) {
            const res = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
              method: 'POST',
              headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: s.refresh_token })
            });
            if (res.ok) {
              const data = await res.json();
              if (data.access_token) {
                _authToken  = data.access_token;
                _authExpiry = (data.expires_at || (Math.floor(Date.now()/1000) + (data.expires_in || 3600))) * 1000;
                localStorage.setItem(_SESSION_KEY, JSON.stringify({
                  access_token:  data.access_token,
                  refresh_token: data.refresh_token || s.refresh_token,
                  expires_at:    data.expires_at || Math.floor(Date.now()/1000) + (data.expires_in || 3600)
                }));
                refreshed = true;
              }
            }
          }
        }
      } catch(e) { /* lanjut ke sign-in baru */ }

      if (!refreshed) {
        // Sign-in anonymous baru
        const res = await fetch(SUPABASE_URL + '/auth/v1/signup', {
          method: 'POST',
          headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        if (res.ok) {
          const data = await res.json();
          if (data.access_token) {
            _authToken  = data.access_token;
            _authExpiry = (data.expires_at || (Math.floor(Date.now()/1000) + (data.expires_in || 3600))) * 1000;
            localStorage.setItem(_SESSION_KEY, JSON.stringify({
              access_token:  data.access_token,
              refresh_token: data.refresh_token || '',
              expires_at:    data.expires_at || Math.floor(Date.now()/1000) + (data.expires_in || 3600)
            }));
          }
        }
        // Jika sign-in anonymous gagal (misal: fitur dinonaktifkan di Supabase),
        // fallback ke anon key — error RLS akan tetap untuk tabel yang strict.
        // Tabel lain yang tidak strict tetap berjalan normal.
      }
    } catch(e) {
      console.warn('[supabase] _ensureAuth error:', e.message);
    } finally {
      _authPromise = null;
    }
    return _authToken;
  })();

  return _authPromise;
}

// Jalankan auth saat script pertama load (background, tidak block UI)
_ensureAuth().catch(() => {});

function _headers(extra) {
  // Gunakan auth token jika tersedia, fallback ke anon key
  const bearer = _authToken || SUPABASE_KEY;
  const h = {
    'apikey':        SUPABASE_KEY,
    'Authorization': 'Bearer ' + bearer,
    'Content-Type':  'application/json'
  };
  if (extra) Object.assign(h, extra);
  return h;
}

// Helper: buat headers dengan auth yang sudah di-await
async function _headersAsync(extra) {
  await _ensureAuth();
  return _headers(extra);
}

// ─── DB FUNCTIONS ─────────────────────────────────────────────
async function dbGet(table, filter) {
  filter = filter || '';
  const res  = await fetch(SUPABASE_URL + '/rest/v1/' + table + '?select=*' + filter, {
    headers: await _headersAsync()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.hint || 'GET ' + table + ' error ' + res.status);
  return Array.isArray(data) ? data : [];
}

async function dbInsert(table, payload) {
  const res  = await fetch(SUPABASE_URL + '/rest/v1/' + table, {
    method:  'POST',
    headers: await _headersAsync({ 'Prefer': 'return=representation' }),
    body:    JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.hint || 'INSERT ' + table + ' error ' + res.status);
  return data;
}

async function dbUpdate(table, id, payload) {
  const res  = await fetch(SUPABASE_URL + '/rest/v1/' + table + '?id=eq.' + id, {
    method:  'PATCH',
    headers: await _headersAsync({ 'Prefer': 'return=representation' }),
    body:    JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.hint || 'UPDATE ' + table + ' error ' + res.status);
  return data;
}

async function dbDelete(table, id) {
  const res = await fetch(SUPABASE_URL + '/rest/v1/' + table + '?id=eq.' + id, {
    method:  'DELETE',
    headers: await _headersAsync()
  });
  if (!res.ok) {
    let msg = 'DELETE ' + table + ' error ' + res.status;
    try { const d = await res.json(); msg = d.message || d.hint || msg; } catch(e) {}
    throw new Error(msg);
  }
}
