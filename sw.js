const CACHE_NAME = "hisya-jomi-v1";
const ASSETS = [
  "./",
  "./hisya_o_jomi_calculator_pwa.html",
  "./manifest.webmanifest",
  "./icon.svg"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
    return res;
  }).catch(() => caches.match("./hisya_o_jomi_calculator_pwa.html"))));
});