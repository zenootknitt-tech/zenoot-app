// ─── SERVICE WORKER — Zenoot PWA ─────────────────────────────
const CACHE = 'zenoot-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './channels.js',
  './app.js',
  './dashboard.js',
  './stok.js',
  './restock.js',
  './kas.js',
  './dataorder.js',
  './rekap.js',
  './hpp.js',
  './supabase.js',
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Kalam:wght@300;400;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Supabase requests: network first, no cache
  if (e.request.url.includes('supabase.co')) {
    e.respondWith(fetch(e.request).catch(() => new Response('[]', {headers:{'Content-Type':'application/json'}})));
    return;
  }
  // App assets: cache first, fallback network
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
