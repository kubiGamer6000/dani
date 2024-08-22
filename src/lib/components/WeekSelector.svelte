<!-- src/lib/components/WeekSelector.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";

  import ArrowLeft from "lucide-svelte/icons/arrow-left";
  import ArrowRight from "lucide-svelte/icons/arrow-right";

  import dayjs from "dayjs";

  export let currentWeekStart: Date;

  const dispatch = createEventDispatcher();

  $: formattedDate = formatDateRange(currentWeekStart);

  function formatDateRange(startDate: Date): string {
    const start = dayjs(startDate);
    const end = start.add(6, "day");

    return `${start.format("DD/MM")} (Mon) - ${end.format("DD/MM")} (Sun)`;
  }
</script>

<div class="flex items-center justify-between mb-4">
  <Button variant="outline" class="text-md" on:click={() => dispatch("prev")}>
    <ArrowLeft class="w-4 h-4 mr-2" />
    Previous Week
  </Button>
  <span class="text-xl font-medium">{formattedDate}</span>
  <Button variant="outline" class="text-md" on:click={() => dispatch("next")}>
    Next Week
    <ArrowRight class="w-4 h-4 ml-2" />
  </Button>
</div>
