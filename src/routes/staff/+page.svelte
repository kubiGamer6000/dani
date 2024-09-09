<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { userData } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { onMount, onDestroy } from "svelte";

  import { page } from "$app/stores";

  $: console.log("Current route:", $page.url.pathname);

  onMount(() => {
    console.log("Mounted:", $page.url.pathname);
  });

  onDestroy(() => {
    console.log("Destroyed:", $page.url.pathname);
  });
</script>

<main
  class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen align-center justify-center"
>
  <Card.Root>
    <Card.Header>
      <Card.Title class="text-3xl">Hey, {$userData?.name}</Card.Title>
      <Card.Description class="text-lg">
        Welcome to the Dani's Catering app!
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <Button class="w-full">Go to app</Button>
    </Card.Content>
    <!-- <Card.Footer></Card.Footer> -->
  </Card.Root>
</main>
