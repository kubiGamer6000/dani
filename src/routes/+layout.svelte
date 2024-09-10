<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import { auth, db } from "$lib/firebase";
  import { FirebaseApp } from "sveltefire";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  function unregisterServiceWorkers() {
    if (browser && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
  }

  async function detectSWUpdate() {
    if (!browser) return;

    const registration = await navigator.serviceWorker.ready;

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;

      newWorker?.addEventListener("statechange", () => {
        if (newWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            if (confirm("App update available. Refresh?")) {
              newWorker.postMessage({ type: "SKIP_WAITING" });
              window.location.reload();
            }
          }
        }
      });
    });
  }

  onMount(() => {
    unregisterServiceWorkers();
    detectSWUpdate();
  });
</script>

<ModeWatcher />

<FirebaseApp {auth} firestore={db}>
  <slot />
</FirebaseApp>
