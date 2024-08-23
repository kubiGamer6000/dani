<!-- src/lib/components/WeekSelector.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";

  import ArrowLeft from "lucide-svelte/icons/arrow-left";
  import ArrowRight from "lucide-svelte/icons/arrow-right";

  export let currentWeekStart: Date;

  const dispatch = createEventDispatcher();

  $: formattedDate = formatDateRange(currentWeekStart);

  function formatDateRange(startDate: Date): string {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay() + 1);

    const nextWeekStart = new Date(thisWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      return `${day}/${month}`;
    };

    const dateRange = `${formatDate(start)} - ${formatDate(end)}`;

    if (start.getTime() === thisWeekStart.getTime()) {
      return `This week (${dateRange})`;
    } else if (start.getTime() === nextWeekStart.getTime()) {
      return `Next week (${dateRange})`;
    } else if (start.getTime() === lastWeekStart.getTime()) {
      return `Last week (${dateRange})`;
    } else {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return `${formatDate(start)} (${days[start.getDay()]}) - ${formatDate(end)} (${days[end.getDay()]})`;
    }
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
