// הסט הבא — service worker for the web version. Caches the app shell so the page opens offline.
var CACHE='nextset-web-4.7';
var SHELL=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./maskable-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
// Pages and the manifest: network first so an update shows on the next open; cached copy when offline. Icons: cache first.
function isPage(req){var u=req.url.split('?')[0];return req.mode==='navigate'||/\/(index\.html|manifest\.webmanifest|sw\.js)?$/.test(u);}
self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;var req=e.request;
 if(isPage(req)){e.respondWith(fetch(req.url,{cache:'no-cache',credentials:'same-origin'}).then(function(res){if(res&&res.ok){var copy=res.clone();caches.open(CACHE).then(function(c){c.put(req,copy);});}return res;}).catch(function(){return caches.match(req,{ignoreSearch:true}).then(function(hit){return hit||caches.match('./index.html');});}));return;}
 e.respondWith(caches.match(req,{ignoreSearch:true}).then(function(hit){return hit||fetch(req).then(function(res){if(res&&res.ok){var copy=res.clone();caches.open(CACHE).then(function(c){c.put(req,copy);});}return res;});}));});
