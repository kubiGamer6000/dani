<!-- src/routes/admin/rota/+page.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { rotaStore } from "$lib/stores/rotaStore";
  import RotaTable from "$lib/components/RotaTable.svelte";
  import WeekSelector from "$lib/components/WeekSelector.svelte";

  import { Button } from "$lib/components/ui/button";

  onMount(async () => {
    await rotaStore.loadUsers();
    await rotaStore.loadRota($rotaStore.currentWeekStart);
  });

  function changeWeek(offset: number) {
    console.log("calling changeWeek(" + offset + ")");
    const newWeekStart = rotaStore.changeWeek(
      offset,
      $rotaStore.currentWeekStart
    );
    console.log("new $rotaStore.newWeekStart: ", $rotaStore.newWeekStart);
    rotaStore.loadRota(newWeekStart);
  }

  async function createRota() {
    await rotaStore.createRota($rotaStore.currentWeekStart);
  }
</script>

<div class=" p-4">
  <h1 class="text-3xl font-semibold mb-6">Rota Management</h1>

  <WeekSelector
    currentWeekStart={$rotaStore.currentWeekStart}
    on:prev={() => changeWeek(-1)}
    on:next={() => changeWeek(1)}
  />

  {#if $rotaStore.rota === null}
    <p class="my-4">No rota created for the selected week.</p>
    <Button on:click={createRota}>Create Rota</Button>
  {:else}
    <RotaTable />
  {/if}
</div>
