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

<div
  class="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between mb-4 space-y-4 sm:space-y-0"
>
  <span class="text-xl font-medium mb-2 sm:mb-0 sm:mr-4 sm:self-center"
    >{formattedDate}</span
  >
  <div class="flex w-full sm:w-auto justify-between sm:justify-end space-x-2">
    <Button
      variant="outline"
      class="text-sm sm:text-md flex-1 sm:flex-initial"
      on:click={() => dispatch("prev")}
    >
      <ArrowLeft class="w-4 h-4 mr-2" />
      <span class="hidden sm:inline">Previous</span>
      <span class="sm:hidden">Prev</span>
    </Button>
    <Button
      variant="outline"
      class="text-sm sm:text-md flex-1 sm:flex-initial"
      on:click={() => dispatch("next")}
    >
      <span class="hidden sm:inline">Next</span>
      <span class="sm:hidden">Next</span>
      <ArrowRight class="w-4 h-4 ml-2" />
    </Button>
  </div>
</div>
