<script lang="ts">
  import { navigating, page } from "$app/stores";

  import Home from "lucide-svelte/icons/house";
  import CalendarCheck from "lucide-svelte/icons/calendar-check";
  import Menu from "lucide-svelte/icons/menu";
  import Users from "lucide-svelte/icons/users";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import CalendarRange from "lucide-svelte/icons/calendar-range";

  import Breadcrumbs from "$lib/components/custom/Breadcrumbs.svelte";

  import { Badge } from "$lib/components/ui/badge/index.ts";
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.ts";
  import * as Sheet from "$lib/components/ui/sheet/index.ts";
  import AnimatedRoute from "$lib/components/custom/AnimatedRoute.svelte";
  import { Settings } from "lucide-svelte";

  let open = false;
  $: if ($navigating) open = false;
</script>

<div
  class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
>
  <div class="bg-muted/40 hidden border-r md:block">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <a href="/" class="flex items-center gap-2 font-semibold">
          <!-- <Package2 class="h-6 w-6" /> -->
          <img class="h-6 w-6" src="/logo.webp" alt="Logo" />
          <span class="">Dani's Catering</span>
        </a>
      </div>
      <div class="flex-1">
        <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
          <a
            href="/admin"
            class={`${$page.route.id === "/admin" ? "bg-muted text-primary" : "text-muted-foreground"} hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all`}
          >
            <Home class="h-4 w-4" />
            Dashboard
          </a>
          <a
            href="/admin/events"
            class={`${$page.route.id?.includes("events") ? "bg-muted text-primary" : "text-muted-foreground"} hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all`}
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
            href="/admin/staff"
            class={`${$page.route.id?.includes("staff") ? "bg-muted text-primary" : "text-muted-foreground"} hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all`}
          >
            <Users class="h-4 w-4" />
            Staff
          </a>
          <a
            href="/admin/rota"
            class={`${$page.route.id?.includes("rota") ? "bg-muted text-primary" : "text-muted-foreground"} hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all`}
          >
            <CalendarRange class="h-4 w-4" />
            Rota
          </a>
          <a
            href={`/settings?redirectTo=${$page.url.pathname}`}
            class={`text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all`}
          >
            <Settings class="h-4 w-4" />
            Settings
          </a>
        </nav>
      </div>
    </div>
  </div>
  <div class="flex flex-col">
    <header
      class="bg-muted/40 flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6 justify-between"
    >
      <Sheet.Root bind:open>
        <Sheet.Trigger>
          <Button variant="outline" size="icon" class="shrink-0 md:hidden">
            <Menu class="h-5 w-5" />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </Sheet.Trigger>
        <Sheet.Content side="left" class="flex flex-col">
          <nav class="grid gap-2 text-lg font-medium">
            <a
              href="/admin"
              class="flex items-center gap-2 text-lg font-semibold"
            >
              <h1>🍆</h1>
              <span class="sr-only">Dani's Catering</span>
            </a>
            <a
              href="/admin"
              class={`${$page.route.id === "/admin" ? "bg-muted text-foreground" : "bg-background text-muted-foreground"} hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2`}
            >
              <Home class="h-5 w-5" />
              Dashboard
            </a>
            <a
              href="/admin/events"
              class={`${$page.route.id?.includes("events") ? "bg-muted text-foreground" : "bg-background text-muted-foreground"} hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2`}
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
              class={`${$page.route.id?.includes("staff") ? "bg-muted text-foreground" : "bg-background text-muted-foreground"} hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2`}
            >
              <Users class="h-5 w-5" />
              Staff
            </a>
            <a
              href="/admin/rota"
              class={`${$page.route.id?.includes("rota") ? "bg-muted text-foreground" : "bg-background text-muted-foreground"} hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2`}
            >
              <CalendarRange class="h-5 w-5" />
              Rota
            </a>
            <a
              href={`/settings?redirectTo=${$page.url.pathname}`}
              class={"bg-background text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"}
            >
              <Settings class="h-5 w-5" />
              Settings
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
      <div class="flex items-center">
        <img class="h-8 w-8 mr-2" src="/logo.webp" alt="Logo" />
        <h1 class="font-semibold">Dani's Catering</h1>
      </div>

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

    <main
      class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen max-w-full overflow-x-hidden"
    >
      <Breadcrumbs path={$page.url.pathname} />

      <AnimatedRoute>
        <slot />
      </AnimatedRoute>
    </main>
  </div>
</div>
