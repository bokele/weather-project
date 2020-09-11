const staticCacheName = "site-static-v2";
const dynamicCacheName = "site-dynamic-v1";
const assets = [
  "/",
  "public/index.html",
  "/js/app.js",
  "/css/app.css",
  "/images/icons/unknown.png",
  "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap",
  "/pages/fallback.html",
  "/.firebaseserc",
  "/firebase.json",
];

// cache size limit function

const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener("install", (evt) => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener("fetch", (evt) => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(evt.request).then((fetchRes) => {
            return caches.open(dynamicCacheName).then((cache) => {
              cache.put(evt.request.url, fetchRes.clone());
              limitCacheSize(dynamicCacheName, 31);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        // if (!evt.request.url) {
        //   console.log("asasdsad");
        return caches.match("/pages/fallback.html");
        // }
      })
  );
});
