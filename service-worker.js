// ===============================
// 連動スクワット × トレッドミル PWA Service Worker
// ===============================

const CACHE_NAME = "rendo-squat-cache-v2";

// キャッシュ対象ファイル
const urlsToCache = [
  "index.html",
  "manifest.json",
  "192-icons.png",
  "512-icons.png",
  "images/tube_sq.jpeg",
  "images/stick_sq.jpeg",
  "images/rot_sq.jpeg",
  "images/rotation.jpeg",
  "images/split_rot.jpeg",
  "images/sitting_rot.jpeg",
  "images/wall_sq.jpeg",
  "images/elbow_push.jpeg",
  "images/cat_dog.jpeg",
  "images/half_knee_rot.jpeg",
  "images/90_90.jpeg",
  "images/Y.jpeg"
];

// インストール時：キャッシュ作成
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("[Service Worker] Caching app shell...");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// フェッチ時：キャッシュ優先（オフライン対応）
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあれば返す
        if (response) {
          return response;
        }
        // ネットワークから取得してキャッシュ更新
        return fetch(event.request).then(fetchRes => {
          // 画像・CSS・JSを動的キャッシュ（任意）
          const clone = fetchRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
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
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log("[Service Worker] Deleting old cache:", name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});
