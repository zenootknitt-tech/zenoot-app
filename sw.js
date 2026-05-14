// ─── SERVICE WORKER — zenOt PWA v5 ───────────────────────────
// Cache lengkap: semua file JS + font + icons
// v5: logo hitam, fix update banner

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
  './keuangan.js',
  './notif.js',
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css',
  './logo.png',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.jsdelivr.net/npm/roughjs@4.6.6/bundled/rough.min.js',
];

// ─── SKIP WAITING (trigger dari tombol Update di app) ────────
self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


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
    })
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
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      // Beritahu semua tab: ada versi baru yang aktif
      return self.clients.matchAll({ type: 'window' }).then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({ type: 'SW_UPDATED' });
        });
      });
    })
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

// ─── PUSH NOTIFICATION HANDLER ───────────────────────────────
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch(err) {}
  var title   = data.title   || 'zenOt';
  var options = {
    body:    data.body    || '',
    icon:    data.icon    || './icon-192.png',
    badge:   './icon-192.png',
    tag:     data.tag     || 'zenot-push',
    vibrate: [200, 100, 200],
    data:    { url: data.url || './' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Klik notifikasi → buka app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(url) !== -1 && 'focus' in list[i]) {
          return list[i].focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
