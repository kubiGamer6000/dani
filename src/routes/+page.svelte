<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index";
</script>

<main
  class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen align-center"
>
  <h1 class="text-center font-semibold text-2xl">Home</h1>
  <Button
    on:click={() => {
      goto("/settings");
    }}
  >
    Settings
  </Button>
  <Button
    on:click={() => {
      goto("/admin/staff");
    }}
  >
    Admin
  </Button>
  <Button
    on:click={() => {
      goto("/staff/shifts");
    }}
  >
    Staff
  </Button>
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
  </Button>
</main>
