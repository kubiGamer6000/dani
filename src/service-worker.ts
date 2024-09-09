/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

self.addEventListener("push", (event: any) => {
  console.log("PAYLOAD: ", event.data);

  const registration = (self as any).registration as ServiceWorkerRegistration;
  event.waitUntil(
    registration.showNotification("Dani's Catering", {
      body: event.data?.text() ?? "no payload",
    })
  );
});
