// ─── SERVICE WORKER — Zenoot PWA ─────────────────────────────
// ✅ Versi otomatis — tidak perlu update manual lagi!

// Setiap kali sw.js diubah & di-deploy, browser akan detect perubahan
// dan install ulang SW otomatis (karena file sw.js itu sendiri berubah).
// Cache name pakai timestamp waktu install supaya selalu fresh.
let CACHE = 'zenoot-auto';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './channels.js',
  './app.js',
  './dashboard.js',
  './produk.js',
  './stok.js',
  './restock.js',
  './kas.js',
  './dataorder.js',
  './rekap.js',
  './hpp.js',
  './supabase.js',
  'https://fonts.googleapis.com/css2?family=Handlee&family=Caveat:wght@400;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css',
];

// ─── INSTALL: buat cache baru dengan nama unik per install ───
self.addEventListener('install', e => {
  // Pakai timestamp supaya cache name selalu unik tiap install baru
  CACHE = 'zenoot-' + Date.now();
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting()) // langsung aktif, tidak tunggu tab ditutup
  );
});

// ─── ACTIVATE: hapus semua cache lama otomatis ───────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('zenoot-') && k !== CACHE)
          .map(k => {
            console.log('[SW] Hapus cache lama:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim()) // ambil alih semua tab yang terbuka
  );
});

// ─── FETCH: network-first supaya update langsung kelihatan ───
self.addEventListener('fetch', e => {
  // Supabase: selalu network, jangan pernah cache
  if (e.request.url.includes('supabase.co')) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response('[]', { headers: { 'Content-Type': 'application/json' } })
      )
    );
    return;
  }

  // App assets: coba network dulu, kalau gagal (offline) pakai cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request)) // fallback offline
  );
});
