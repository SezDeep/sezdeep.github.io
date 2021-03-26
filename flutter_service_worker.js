'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "4d69a33b1586898927fa6aca9b597acb",
"assets/assets/files/cv.pdf": "8dab62b1494766cc3371521c20f56172",
"assets/assets/images/android.png": "ed3f87b9abd95bc3acbe99586a251597",
"assets/assets/images/c.png": "e1fac5f2db0ff8289b6f792cdb6b34e9",
"assets/assets/images/csharp.png": "cbf37aca26db87fcc8db45252550c48c",
"assets/assets/images/cv01.jpg": "9202becd0c9c47e1ceaca4e579b415d7",
"assets/assets/images/cv02.jpg": "b8e18cf6c707f7e4ac5db9031b557b05",
"assets/assets/images/cv03.jpg": "21cec3bf304a12b40752d220c679e5d9",
"assets/assets/images/cv04.jpg": "b180e09a29009a03d004d86ecf7b673e",
"assets/assets/images/flutter.png": "e95ed7dd9c2c4dda38e075564ec309e3",
"assets/assets/images/github.png": "f23714d05020e83cc917c043bf1721f7",
"assets/assets/images/gmail.png": "8cf6b70c11f86433fb4713b5bb00aa48",
"assets/assets/images/instagram.png": "3fd7547e2bad2b342b03f03b086fab30",
"assets/assets/images/java.png": "9709cdfefd9a087d31d37612ffd497fd",
"assets/assets/images/mysql.png": "afd1708aec579df3849d658a8ac1286b",
"assets/assets/images/php.png": "77a7ebe400ffd7db469a384ecec71682",
"assets/assets/images/python.png": "3e80a38a04cfe35f199a13de12f3ef6b",
"assets/assets/images/sdcalculator01.jpeg": "3db0348fc210f6f60fff0ed0a360ee18",
"assets/assets/images/sdcalculator02.jpeg": "f671095fee48919544861d325b271c42",
"assets/assets/images/sdcalculator03.jpeg": "a6b49eac4b5ddf255d7b4331dde0d487",
"assets/assets/images/sdplanner01.jpeg": "66fc93aa34dfd50bc8385c7c0143d2f4",
"assets/assets/images/sdplanner02.jpeg": "f9279f4b517aeaf265284bd9d76d732d",
"assets/assets/images/sdplanner03.jpeg": "06b1cd6d9488889a67aee205c9ab4e03",
"assets/assets/images/sdplanner04.jpeg": "7e934b0bfcff042ba78599f0bf69c0f2",
"assets/assets/images/sezdeep.png": "8bff8086cf0ed66519ffa5de46768873",
"assets/assets/images/sezdeep01.jpg": "722feb97e76d64beee0d68444dfa7de4",
"assets/assets/images/sezdeep02.jpg": "d25faf131e1a42f8fbe88d992e37495d",
"assets/assets/images/sezdeep03.jpg": "5a754f6ddc4558307b68e3d7a77f5cac",
"assets/assets/images/shape.png": "cbb41cbc5a22097e8e61ddb5b617d9dc",
"assets/assets/images/stack.png": "27f6fc37e253c678d4e8454ae7e3d337",
"assets/assets/images/twitter.png": "36e23af4884f5eb79dd56bf3cc0a7bc3",
"assets/assets/images/whatsapp.png": "d8bf0ede7dc5e12cdad12c0a0dd413a0",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "699f891742ecef90f077ccf869047138",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "123f50f2781c062b01f729059ba4c9aa",
"/": "123f50f2781c062b01f729059ba4c9aa",
"main.dart.js": "66dc75b09cba164c4f1e8c0fb95e9c73",
"manifest.json": "5a2c0526f1fe73e6f211bc7a9d15c210",
"version.json": "426313f2f3133c2f20415344c4a22df3"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
