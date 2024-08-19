<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index";
</script>

<main>
  <h1>Home</h1>
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
    SignUP
  </Button>
</main>
