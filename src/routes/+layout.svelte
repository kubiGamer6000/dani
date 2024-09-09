<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import { auth, db } from "$lib/firebase";
  import { FirebaseApp } from "sveltefire";
  import { user } from "$lib/firebase";

  import AuthCheck from "$lib/components/auth/AuthCheck.svelte";

  import { onMount } from "svelte";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }

  async function detectSWUpdate() {
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

  onMount(async () => {
    detectSWUpdate();
  });
</script>

<ModeWatcher />

<FirebaseApp {auth} firestore={db}>
  <slot />
</FirebaseApp>
