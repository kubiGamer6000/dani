<script lang="ts">
  import { user, auth } from "$lib/firebase";
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button/index";
  import * as Card from "$lib/components/ui/card/index";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";

  import { signOut } from "firebase/auth";

  // Custom logging function
  function log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [Settings] ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  }

  let notifPermGranted: boolean | null = null;
  let isSubscribed = false;

  onMount(async () => {
    log("Component mounted");
    notifPermGranted = Notification.permission === "granted";
    log(`Notification permission status: ${notifPermGranted}`);

    if (notifPermGranted) {
      isSubscribed = await checkSubscriptionStatus();
      log(`User subscription status: ${isSubscribed}`);

      if (!isSubscribed) {
        await subscribeUser();
      }
    }
  });

  function requestNotificationPermission() {
    log("Requesting notification permission");
    Notification.requestPermission().then(async (permission) => {
      log(`Notification permission result: ${permission}`);
      if (permission === "granted") {
        notifPermGranted = true;
        await subscribeUser();
      }
    });
  }

  async function sendSubscriptonToServer(subscription: PushSubscription) {
    log("Sending subscription to server", subscription);
    try {
      const res = await fetch("/api/addSubscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      });
      if (!res.ok) {
        throw new Error(
          `Error saving subscription on server: ${res.statusText} (${res.status})`
        );
      }
      log("Subscription successfully sent to server");
    } catch (error) {
      log("Error sending subscription to server", error);
      await unsubscribe();
    }
  }

  async function checkSubscriptionStatus() {
    log("Checking subscription status");
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      log("Push subscription checked", subscription);
      const exists = subscription !== null;
      if (exists) {
        await sendSubscriptonToServer(subscription);
      }
      return exists;
    }
    log("Service worker not supported");
    return false;
  }

  async function subscribeUser() {
    log("Attempting to subscribe user");
    if ("serviceWorker" in navigator) {
      try {
        const res = await fetch("/api/vapidPubKey");
        if (!res.ok) {
          throw new Error(`Failed to fetch VAPID key: ${res.statusText}`);
        }
        const { data } = await res.json();
        log("Received VAPID public key", data);

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: data,
        });
        isSubscribed = true;
        log("Push subscription created", subscription);
        await sendSubscriptonToServer(subscription);
      } catch (error: any) {
        log("Error subscribing user to push notifications", error);
        // Display an error message to the user
        alert(`Failed to subscribe: ${error.message}`);
      }
    } else {
      log("Service worker not supported");
      alert("Push notifications are not supported in your browser.");
    }
  }

  async function unsubscribe() {
    log("Attempting to unsubscribe user");
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        log("Push subscription unsubscribed", subscription);
        isSubscribed = false;
      } else {
        log("No subscription found to unsubscribe");
      }
    } else {
      log("Service worker not supported");
    }
  }
</script>

<main class="p-4">
  <div class="flex flex-col items-center h-screen">
    <h1 class="text-4xl w-full font-semibold p-4 mb-4">Settings</h1>
    <Card.Root>
      <Card.Header>
        <Card.Title>Push Notifications</Card.Title>
        <Card.Description
          >Enable/disable push notifications from here...</Card.Description
        >
      </Card.Header>
      <Card.Content class="flex flex-col gap-4">
        {#if notifPermGranted === null}
          <p>Checking permissions...</p>
        {:else if notifPermGranted === false}
          <Button class="w-full" on:click={requestNotificationPermission}>
            Enable notifications
          </Button>
        {:else}
          <p>
            You are <span class="font-semibold">
              {isSubscribed ? "subscribed" : "not subscribed"}
            </span> to push notifications.
          </p>
          {#if isSubscribed}
            <Button class="w-full" variant="destructive" on:click={unsubscribe}
              >Unsubscribe</Button
            >
            <form method="post" action="?/testNotification" use:enhance>
              <Button class="w-full" type="submit" variant="outline">
                Test Notification
              </Button>
            </form>
          {:else}
            <Button class="w-full" on:click={subscribeUser}>Subscribe</Button>
          {/if}
        {/if}
        <Button
          class="w-full"
          variant="outline"
          on:click={() => {
            const redirectTo = $page.url.searchParams.get("redirectTo") || "/";
            goto(`/${redirectTo.slice(1)}`);
          }}>Go back</Button
        >
        <Button
          class="w-full"
          variant="destructive"
          on:click={async () => {
            const res = await fetch("/api/signin", { method: "DELETE" });
            await signOut(auth);
          }}>Log out</Button
        >
      </Card.Content>
    </Card.Root>
  </div>
</main>
