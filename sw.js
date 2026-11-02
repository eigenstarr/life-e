// Network first, cached copy when offline, so the planner opens at the gym with no signal.
// The API and the login flow are never cached.
const CACHE = 'life-planner-v2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.pathname.startsWith('/api/') || url.pathname === '/login.html') return;
  e.respondWith(fetch(e.request).then(res => {
    // Only keep real pages and files, not a redirect to the login page
    if (res.ok && !res.redirected && (url.origin === location.origin || url.hostname.startsWith('fonts.'))) {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return res;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('/'))));
});
