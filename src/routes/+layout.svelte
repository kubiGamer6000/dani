<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import { auth, db } from "$lib/firebase";
  import { FirebaseApp } from "sveltefire";
  import { user } from "$lib/firebase";

  import AuthCheck from "$lib/components/auth/AuthCheck.svelte";

  import { onMount } from "svelte";

  async function detectSWUpdate() {
    const registration = await navigator.serviceWorker.ready;

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;

      newWorker?.addEventListener("statechange", () => {
        if (newWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            if (confirm("New update available! Please refresh.")) {
              newWorker.postMessage({ type: "SKIP_WAITING" });
              window.location.reload();
            }
          }
        }
      });
    });
  }

  async function sendSubscriptonToServer(subscription: PushSubscription) {
    try {
      const res = await fetch("/api/addSubscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: $user?.uid, subscription }),
      });
      if (!res.ok)
        throw new Error(
          `Error saving subscription on server: ${res.statusText} (${res.status})`
        );
    } catch (error) {
      console.error("Error sending subscription to server:", error);
      unsubscribe();
    }
  }

  async function checkSubscriptionStatus() {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      console.log("Push subscription checked:", JSON.stringify(subscription));
      const exists = subscription !== null;
      if (exists) {
        sendSubscriptonToServer(subscription);
      }
    }
    return false;
  }

  async function subscribeUser() {
    if ("serviceWorker" in navigator) {
      try {
        console.log("trying to subscribe");
        const res = await fetch("/api/vapidPubKey");
        const { data } = await res.json();
        console.log(data);

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: data,
        });

        console.log("Push subscription:", JSON.stringify(subscription));
        sendSubscriptonToServer(subscription);
      } catch (error) {
        console.error("Error subscribing user to push notifications:", error);
      }
    }
  }

  async function unsubscribe() {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log(
          "Push subscription unsubscribed:",
          JSON.stringify(subscription)
        );
      }
    }
  }

  onMount(async () => {
    detectSWUpdate();
    if ($user) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
        if ((await checkSubscriptionStatus()) == false) {
          subscribeUser();
        } else {
        }
      } else {
        console.log("user is subscribed");
      }
    }
  });
</script>

<ModeWatcher />

<FirebaseApp {auth} firestore={db}>
  <slot />
</FirebaseApp>
