// ─── SERVICE WORKER — zenOt PWA ───────────────────────────────
// VERSI OTOMATIS — tidak perlu ganti angka manual.
// Cache name pakai timestamp sw.js ini di-deploy.
// Setiap kali sw.js diubah & push ke GitHub → cache otomatis bust.

var CACHE = 'zenot-' + self.location.search.slice(1) || 'zenot-base';

// Fallback: jika sw.js diakses tanpa ?v=, pakai tanggal hari ini
// supaya tetap fresh meski lupa update sw.js
if (CACHE === 'zenot-base') {
  CACHE = 'zenot-' + new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

var ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './logo.png',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css',
  'https://cdn.jsdelivr.net/npm/roughjs@4.6.6/bundled/rough.min.js',
];

// JS app files — tidak pakai ?v= di sini, browser cache bust via index.html
var APP_SCRIPTS = [
  './rough-ui.js', './supabase.js', './app.js', './dashboard.js',
  './produk.js', './stok.js', './restock.js', './kas.js',
  './jurnal-penjualan.js', './produk-terjual.js', './price-list.js',
  './dataorder.js', './rekap.js', './channel-master.js',
  './beban-operasional.js', './keuangan.js', './notif.js',
  './hpp.js', './channels.js',
];

// ─── SKIP WAITING ────────────────────────────────────────────
self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// ─── INSTALL ─────────────────────────────────────────────────
self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
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
      var adaCacheLama = keys.some(function(k) {
        return k.startsWith('zenot-') && k !== CACHE;
      });
      return Promise.all(
        keys.filter(function(k) {
          return k.startsWith('zenot-') && k !== CACHE;
        }).map(function(k) { return caches.delete(k); })
      ).then(function() {
        return self.clients.claim();
      }).then(function() {
        return self.clients.matchAll({ type: 'window' }).then(function(clients) {
          clients.forEach(function(c) { c.postMessage({ type: 'SW_UPDATED' }); });
          if (adaCacheLama && self.registration.showNotification) {
            return self.registration.showNotification('🚀 zenOt Diperbarui!', {
              body: 'Versi terbaru sudah siap. Ketuk untuk reload.',
              icon: './icon-192.png',
              badge: './icon-192.png',
              tag: 'zenot-app-update',
              vibrate: [100, 50, 100],
              requireInteraction: false,
              data: { url: './', action: 'reload' }
            });
          }
        });
      });
    })
  );
});

// ─── FETCH: network-first untuk JS app, cache-first untuk CDN ─
self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  // Supabase → selalu network
  if (url.indexOf('supabase.co') !== -1) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
      })
    );
    return;
  }

  // CDN (fonts, tabler, roughjs) → cache-first
  if (url.indexOf('fonts.googleapis.com') !== -1 ||
      url.indexOf('fonts.gstatic.com')    !== -1 ||
      url.indexOf('cdn.jsdelivr.net')     !== -1) {
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

  // App assets (JS, CSS, HTML) → NETWORK-FIRST, tidak cache JS app
  // supaya perubahan file langsung terasa tanpa perlu bump versi
  var isAppScript = APP_SCRIPTS.some(function(s) {
    return url.indexOf(s.replace('./', '')) !== -1;
  });

  if (isAppScript) {
    // JS app: selalu ambil dari network, fallback cache
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }

  // File lain (index.html, style.css, gambar dll) → network-first + update cache
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

// ─── PUSH NOTIFICATION ───────────────────────────────────────
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch(err) {}
  e.waitUntil(self.registration.showNotification(data.title || 'zenOt', {
    body:    data.body  || '',
    icon:    './icon-192.png',
    badge:   './icon-192.png',
    tag:     data.tag   || 'zenot-push',
    vibrate: [200, 100, 200],
    data:    { url: data.url || './' }
  }));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url    = (e.notification.data && e.notification.data.url) || './';
  var action = (e.notification.data && e.notification.data.action) || '';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.indexOf(url) !== -1 && 'focus' in c) {
          c.focus();
          if (action === 'reload') c.postMessage({ type: 'SW_DO_RELOAD' });
          return;
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
