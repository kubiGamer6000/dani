<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index";

  import * as Card from "$lib/components/ui/card/index";

  import { userData } from "$lib/firebase";

  import AnimatedRoute from "$lib/components/custom/AnimatedRoute.svelte";

  import AuthCheck from "$lib/components/auth/AuthCheck.svelte";
</script>

<main
  class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen align-center justify-center"
>
  <AuthCheck>
    <Card.Root>
      <Card.Header>
        <Card.Title class="text-3xl">Hey, {$userData?.name}</Card.Title>
        <Card.Description class="text-lg">
          Welcome to the Dani's Catering app!
        </Card.Description>
      </Card.Header>
      <Card.Content>
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
      </Card.Content>
      <!-- <Card.Footer></Card.Footer> -->
    </Card.Root>
  </AuthCheck>

  <!-- <h1 class="text-center font-semibold text-2xl">Home</h1>
  <a href="/settings"> <Button>Settings</Button></a>
  <a href="/admin/staff"><Button>Admin</Button></a>
  <a href="/staff/shifts"><Button>Staff</Button></a>
  <a href="/events"><Button>Login</Button></a>
  <Button
    on:click={() => {
      goto("/login");
    }}
  >
    Login
  </Button>
  <Button
    on:click={() => {
      goto("/signup");
    }}
  >
    Sign up
  </Button> -->
</main>
