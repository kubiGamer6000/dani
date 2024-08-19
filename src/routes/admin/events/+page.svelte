<script lang="ts">
  import Breadcrumbs from "$lib/components/custom/Breadcrumbs.svelte";
  import { page } from "$app/stores";
</script>

<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
  <Breadcrumbs path={$page.url.pathname} />
  <h1>Events</h1>
</main>
