<script lang="ts">
  import { page } from "$app/stores";

  import Home from "lucide-svelte/icons/house";
  import CalendarCheck from "lucide-svelte/icons/calendar-check";
  import Menu from "lucide-svelte/icons/menu";
  import Users from "lucide-svelte/icons/users";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";

  import AuthCheck from "$lib/components/auth/AuthCheck.svelte";

  import { Badge } from "$lib/components/ui/badge/index.ts";
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.ts";
  import * as Sheet from "$lib/components/ui/sheet/index.ts";
  import { user } from "$lib/firebase";

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
      return subscription !== null;
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
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
      if ((await checkSubscriptionStatus()) == false) {
        subscribeUser();
      } else {
      }
    } else {
      console.log("user is subscribed");
      if ((await checkSubscriptionStatus()) == false) {
        subscribeUser();
      }
    }
  });
</script>

<AuthCheck>
  <div
    class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
  >
    <div class="bg-muted/40 hidden border-r md:block">
      <div class="flex h-full max-h-screen flex-col gap-2">
        <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" class="flex items-center gap-2 font-semibold">
            <!-- <Package2 class="h-6 w-6" /> -->
            <h1>🍆</h1>
            <span class="">Dani's Catering</span>
          </a>
        </div>
        <div class="flex-1">
          <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
            <a
              href="##"
              class="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
            >
              <Home class="h-4 w-4" />
              Dashboard
            </a>
            <a
              href="##"
              class="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
            >
              <CalendarCheck class="h-4 w-4" />
              Events
              <Badge
                class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              >
                7
              </Badge>
            </a>
            <a
              href="##"
              class="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
            >
              <Users class="h-4 w-4" />
              Employees
            </a>
          </nav>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <header
        class="bg-muted/40 flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6 justify-between"
      >
        <Sheet.Root>
          <Sheet.Trigger asChild let:builder>
            <Button
              variant="outline"
              size="icon"
              class="shrink-0 md:hidden"
              builders={[builder]}
            >
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle navigation menu</span>
            </Button>
          </Sheet.Trigger>
          <Sheet.Content side="left" class="flex flex-col">
            <nav class="grid gap-2 text-lg font-medium">
              <a
                href="/admin/"
                class="flex items-center gap-2 text-lg font-semibold"
              >
                <h1>🍆</h1>
                <span class="sr-only">Dani's Catering</span>
              </a>
              <a
                href="/admin/"
                class="hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
                class:bg-muted={$page.route.id === "/admin"}
                class:text-foreground={$page.route.id === "/admin"}
                class:text-muted-foreground={$page.route.id != "/admin"}
              >
                <Home class="h-5 w-5" />
                Dashboard
              </a>
              <a
                href="/admin/events"
                class="hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
                class:bg-muted={$page.route.id?.includes("events")}
                class:text-foreground={$page.route.id?.includes("events")}
                class:text-muted-foreground={!$page.route.id?.includes(
                  "events"
                )}
              >
                <CalendarCheck class="h-5 w-5" />
                Events
                <Badge
                  class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                >
                  6
                </Badge>
              </a>
              <a
                href="/admin/staff"
                class=" hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
                class:bg-muted={$page.route.id?.includes("staff")}
                class:text-foreground={$page.route.id?.includes("staff")}
                class:text-muted-foreground={!$page.route.id?.includes("staff")}
              >
                <Users class="h-5 w-5" />
                Staff
              </a>
            </nav>
          </Sheet.Content>
        </Sheet.Root>
        <!-- <div class="w-full flex-1">
        <form>
          <div class="relative">
            <Search
              class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4"
            />
            <Input
              type="search"
              placeholder="Search products..."
              class="bg-background w-full appearance-none pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div> -->
        <h1 class="font-semibold">Dani's Catering</h1>
        <!-- <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button
            builders={[builder]}
            variant="secondary"
            size="icon"
            class="rounded-full"
          >
            <Bell class="h-4 w-4" />
            <span class="sr-only">Toggle notifications</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>My Account</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Settings</DropdownMenu.Item>
          <DropdownMenu.Item>Support</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Logout</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root> -->
        <Button on:click={toggleMode} variant="outline" size="icon">
          <Sun
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Moon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </header>

      <slot></slot>
    </div>
  </div>
</AuthCheck>
