<script lang="ts">
  import AuthCheck from "$lib/components/auth/AuthCheck.svelte";
</script>

<AuthCheck>
  <slot></slot>
</AuthCheck>
