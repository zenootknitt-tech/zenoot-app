// ─── SERVICE WORKER — zenOt PWA v4 ───────────────────────────
// Cache lengkap: semua file JS + font + icons

var CACHE = 'zenot-auto';

var ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './supabase.js',
  './rough-ui.js',
  './channels.js',
  './hpp.js',
  './dashboard.js',
  './produk.js',
  './stok.js',
  './restock.js',
  './kas.js',
  './jurnal-penjualan.js',
  './price-list.js',
  './dataorder.js',
  './rekap.js',
  './channel-master.js',
  './beban-operasional.js',
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css',
  './logo.png',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.jsdelivr.net/npm/roughjs@4.6.6/bundled/rough.min.js',
];

// ─── INSTALL ─────────────────────────────────────────────────
self.addEventListener('install', function(e) {
  CACHE = 'zenot-' + Date.now();
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      // addAll satu-satu agar satu file gagal tidak blokir semua
      return Promise.all(
        ASSETS.map(function(url) {
          return c.add(url).catch(function(err) {
            console.warn('[SW] Gagal cache:', url, err);
          });
        })
      );
    }).then(function() { return self.skipWaiting(); })
  );
});

// ─── ACTIVATE ────────────────────────────────────────────────
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) {
          return k.startsWith('zenot-') && k !== CACHE;
        }).map(function(k) {
          return caches.delete(k);
        })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// ─── FETCH: network-first ────────────────────────────────────
self.addEventListener('fetch', function(e) {
  // Supabase: selalu network, jangan cache
  if (e.request.url.indexOf('supabase.co') !== -1) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
      })
    );
    return;
  }
  // Google Fonts & CDN: cache-first (jarang berubah)
  if (e.request.url.indexOf('fonts.googleapis.com') !== -1 ||
      e.request.url.indexOf('fonts.gstatic.com') !== -1 ||
      e.request.url.indexOf('cdn.jsdelivr.net') !== -1) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        if (cached) return cached;
        return fetch(e.request).then(function(res) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
          return res;
        });
      })
    );
    return;
  }
  // App assets: network-first, fallback cache
  e.respondWith(
    fetch(e.request).then(function(res) {
      if (res.ok) {
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
      }
      return res;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
