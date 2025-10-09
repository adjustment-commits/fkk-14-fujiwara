// ===============================
// 連動スクワット × トレッドミル PWA Service Worker
// ===============================

const CACHE_NAME = "rendo-squat-cache-v1";

// キャッシュ対象（必要に応じて増やせる）
const urlsToCache = [
  "index.html",
  "manifest.json",
  "icons-192.png",
  "icons-512.png"
];

// インストール時：キャッシュを作成
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Caching app shell...");
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ時：キャッシュ→ネットワークの順で応答
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).then(fetchRes => {
          // 動的キャッシュも可能（必要なら以下を解除）
          // const clone = fetchRes.clone();
          // caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return fetchRes;
        });
      })
      .catch(() => caches.match("index.html"))
  );
});

// アクティベート時：古いキャッシュ削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});
