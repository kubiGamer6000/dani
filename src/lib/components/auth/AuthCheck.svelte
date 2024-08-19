<script lang="ts">
  import { goto } from "$app/navigation";
  import { user } from "$lib/firebase";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { SignedIn, SignedOut } from "sveltefire";
</script>

<SignedIn>
  <slot />
</SignedIn>

<SignedOut>
  <main
    class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen items-center justify-center"
  >
    <Card.Root class="mx-auto max-w-sm">
      <Card.Header>
        <Card.Title class="text-2xl">Access Denied</Card.Title>
        <Card.Description
          >You are not logged in or don't have permission to access this page...</Card.Description
        >
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4">
          <Button
            on:click={() => {
              goto("/login");
            }}
            class="w-full">Log in</Button
          >
          <Button
            variant="outline"
            on:click={() => {
              goto("/signup");
            }}
            class="w-full">Sign up</Button
          >
        </div>
      </Card.Content>
    </Card.Root>
  </main>
</SignedOut>
