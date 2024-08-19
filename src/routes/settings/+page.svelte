<script lang="ts">
  import { user } from "$lib/firebase";

  import { onMount } from "svelte";

  import { Button } from "$lib/components/ui/button/index";
  import * as Card from "$lib/components/ui/card/index";
  import { goto } from "$app/navigation";

  let notifPermGranted: boolean | null = null;
  let isSubscribed = false;

  onMount(async () => {
    notifPermGranted = Notification.permission === "granted";

    if (notifPermGranted) {
      isSubscribed = await checkSubscriptionStatus();

      if (!isSubscribed) {
        await subscribeUser();
      }
    }
  });

  function requestNotificationPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("You are now subscribed to notifications!");
      }
    });
  }

  async function sendSubscriptonToServer(subscription: PushSubscription) {
    try {
      const res = await fetch("/api/addSubscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
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
        isSubscribed = true;
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
        isSubscribed = false;
      }
    }
  }
</script>

<main class="p-4">
  <div class="flex flex-col items-center h-screen">
    <h1 class="text-4xl w-full font-semibold p-4 mb-4">Settings</h1>
    <Card.Root>
      <Card.Header>
        <Card.Title class="text-3xl">Push Notifications</Card.Title>
        <Card.Description class="text-md"
          >Enable/disable push notifications from here...</Card.Description
        >
      </Card.Header>
      <Card.Content>
        {#if notifPermGranted === null}
          <p>Checking permissions...</p>
        {:else if notifPermGranted === false}
          <Button class="button" on:click={requestNotificationPermission}>
            Enable notifications
          </Button>
        {:else}
          <p class="mb-4 text-lg">
            You are <span class="font-semibold"
              >{isSubscribed ? "subscribed" : "not subscribed"}</span
            > to push notifications.
          </p>
          {#if isSubscribed}
            <Button class="w-full" variant="outline" on:click={unsubscribe}
              >Unsubscribe</Button
            >
            <form method="post" action="?/testNotification">
              <Button class="w-full" type="submit" variant="secondary"
                >Test Notification</Button
              >
            </form>
          {/if}
        {/if}
      </Card.Content>
      <Card.Footer>
        <Button class="w-full" on:click={() => goto("/")}>Go To Home</Button>
      </Card.Footer>
    </Card.Root>
  </div>
</main>
