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

    const getWeekStart = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      return new Date(d.setDate(diff));
    };

    const thisWeekStart = getWeekStart(today);
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

    if (start >= thisWeekStart && start < nextWeekStart) {
      return `This week (${dateRange})`;
    } else if (
      start >= nextWeekStart &&
      start < new Date(nextWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
    ) {
      return `Next week (${dateRange})`;
    } else if (start >= lastWeekStart && start < thisWeekStart) {
      return `Last week (${dateRange})`;
    } else {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return `${formatDate(start)} (${days[(start.getDay() + 6) % 7]}) - ${formatDate(end)} (${days[(end.getDay() + 6) % 7]})`;
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
