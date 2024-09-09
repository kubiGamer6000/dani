<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index";
  import * as Card from "$lib/components/ui/card/index";
  import { userData } from "$lib/firebase";

  import AuthCheck from "$lib/components/auth/AuthCheck.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<main
  class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen align-center justify-center"
>
  <AuthCheck>
    <Card.Root>
      <Card.Header>
        <Card.Title class="text-3xl">
          {#if !$userData?.name}
            <Skeleton class="h-[36px] w-[200px]" />
          {:else}
            Hey, {$userData?.name}
          {/if}
        </Card.Title>
        <Card.Description class="text-lg">
          {#if !$userData?.name}
            <Skeleton class="h-[24px] w-[300px]" />
          {:else}
            Welcome to the Dani's Catering app!
          {/if}
        </Card.Description>
      </Card.Header>
      <Card.Content>
        {#if $userData?.role}
          {#if $userData?.role === "staff"}
            <Button
              class="w-full"
              on:click={() => {
                goto("/staff/shifts");
              }}
            >
              Go to app
            </Button>
          {/if}
          {#if $userData?.role === "admin"}
            <Button
              class="w-full"
              on:click={() => {
                goto("/admin");
              }}
            >
              Go to admin
            </Button>
          {/if}
          <Button
            variant="secondary"
            on:click={() => {
              goto("/settings");
            }}
            class="w-full mt-3"
          >
            Settings
          </Button>
          <Button
            variant="outline"
            on:click={() => {
              goto("/login");
            }}
            class="w-full mt-3"
          >
            Log out
          </Button>
        {:else}
          <Skeleton class="h-[40px] w-full mb-3" />
          <Skeleton class="h-[40px] w-full mb-3" />
          <Skeleton class="h-[40px] w-full" />
        {/if}
      </Card.Content>
    </Card.Root>
  </AuthCheck>
</main>
