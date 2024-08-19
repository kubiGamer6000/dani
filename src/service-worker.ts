/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { build, files, version } from "$service-worker";

console.log(build, files, version);

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

// install

self.addEventListener("install", (event) => {
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
});

// activate
self.addEventListener("activate", (event) => {
  async function removeOldCaches() {
    const keys = await caches.keys();
    keys.forEach((key) => {
      if (key !== CACHE) {
        caches.delete(key);
      }
    });
  }

  event.waitUntil(removeOldCaches());
});
// listen to fetch events

self.addEventListener("fetch", (event) => {
  //   if (event.request.method !== "GET") {
  //     return;
  //   }
  //   async function respond() {
  //     const url = new URL(event.request.url);
  //     const cache = await caches.open(CACHE);
  //     // serve build files from the cache
  //     if (ASSETS.includes(url.pathname)) {
  //       const cachedResponse = await cache.match(url.pathname);
  //       if (cachedResponse) {
  //         return cachedResponse;
  //       }
  //     }
  //     try {
  //       const fetchResponse = await fetch(event.request);
  //       const isNotExtension =
  //         url.protocol === "http:" || url.protocol === "https:";
  //       const isSuccess = fetchResponse.status === 200;
  //       if (isNotExtension && isSuccess) {
  //         cache.put(event.request, fetchResponse.clone());
  //       }
  //       return fetchResponse;
  //     } catch (error) {
  //       //fall back to cache
  //       const cachedResponse = await cache.match(url.pathname);
  //       if (cachedResponse) {
  //         return cachedResponse;
  //       }
  //     }
  //     return new Response("Offline", { status: 404 });
  //   }
  //   event.respondWith(respond());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("push", (event: any) => {
  const payload = event.data?.text() ?? "no payload";
  const registration = (self as any).registration as ServiceWorkerRegistration;
  event.waitUntil(
    registration.showNotification("Dani's Catering", {
      body: payload,
    })
  );
});
