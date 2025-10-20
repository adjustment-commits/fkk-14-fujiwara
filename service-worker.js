// ===============================
// ADJUSTMENT LAB PWA Service Worker
// ===============================

const CACHE_NAME = 'adjustment-lab-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/extra/nutrition/index.html',
  '/extra/recovery/index.html',
  '/extra/thinking/index.html',
  '/images/icon_growth_nutrition.png',
  '/images/icon_recovery_lab.png',
  '/images/icon_think_lab.png'
];

// --- インストール時：キャッシュ登録 ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Caching app shell...');
        return cache.addAll(urlsToCache);
      })
  );
});

// --- フェッチ時：キャッシュ優先（ネットフォールバック） ---
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});

// --- アクティベート時：古いキャッシュを削除 ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
});
