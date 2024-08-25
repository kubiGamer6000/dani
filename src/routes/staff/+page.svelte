<script lang="ts">
  import StaffCheckIn from "$lib/components/custom/staff/StaffCheckIn.svelte";
  import MyCheckIns from "$lib/components/custom/staff/MyCheckIns.svelte";

  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { userData } from "$lib/firebase";
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
