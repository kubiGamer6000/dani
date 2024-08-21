<script lang="ts">
  import { page } from "$app/stores";

  import { toggleMode } from "mode-watcher";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";

  import { Button } from "$lib/components/ui/button/index.ts";

  import Breadcrumbs from "$lib/components/custom/Breadcrumbs.svelte";
</script>

<div class="flex min-h-screen w-full flex-col">
  <header
    class="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6"
  >
    <nav
      class="  gap-6 text-lg font-medium flex flex-row w-full justify-between items-center"
    >
      <a
        href="/"
        class="text-foreground font-semibold text-2xl w-56 hover:text-foreground transition-colors"
      >
        🍆 Dani's Catering
      </a>
      <Button on:click={toggleMode} variant="outline" size="icon">
        <Sun
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </nav>
  </header>
  <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen">
    <Breadcrumbs path={$page.url.pathname} />

    <slot />
  </main>
</div>
