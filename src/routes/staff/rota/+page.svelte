<script lang="ts">
  import { db, user } from "$lib/firebase";

  import { Collection } from "sveltefire";

  import * as Table from "$lib/components/ui/table/index.js";

  import { collection, query, where, orderBy } from "firebase/firestore";

  import AuthCheck from "$lib/components/auth/AuthCheck.svelte";

  import dayjs from "dayjs";
  import { getStartOfWeek, formatShift } from "$lib/utils/rotaUtils";

  import { onMount, onDestroy } from "svelte";
  import { page } from "$app/stores";

  $: console.log("Current route:", $page.url.pathname);

  onMount(() => {
    console.log("Mounted:", $page.url.pathname);
  });

  onDestroy(() => {
    console.log("Destroyed:", $page.url.pathname);
  });

  type DayOfWeek =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

  const days: DayOfWeek[] = [
    "Monday",

    "Tuesday",

    "Wednesday",

    "Thursday",

    "Friday",

    "Saturday",

    "Sunday",
  ];

  let currentWeekStart = getStartOfWeek(new Date());

  function changeWeek(offset: number) {
    const newWeekStartDate = new Date(currentWeekStart);
    newWeekStartDate.setDate(newWeekStartDate.getDate() + offset * 7);
    currentWeekStart = newWeekStartDate;
  }
</script>

<AuthCheck>
  <!-- <WeekSelector
    {currentWeekStart}
    on:prev={() => changeWeek(-1)}
    on:next={() => changeWeek(1)}
  /> -->
  <h2 class="p-2 text-3xl font-semibold">Rota</h2>
  <Table.Root class="my-4">
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]">Day</Table.Head>
        <Table.Head class="text-right">Shift</Table.Head>
      </Table.Row>
    </Table.Header>

    {#each days as day}
      <Table.Row>
        <Table.Cell class="font-medium flex items-center w-48">
          {day}
        </Table.Cell>
        <Table.Cell class="text-right">
          <Collection
            ref={query(
              collection(db, "rotaShifts"),
              where("day", "==", day),
              where(
                "rota_id",
                "==",
                dayjs(currentWeekStart).format("YYYY-MM-DD")
              ),
              where("user_id", "==", $user?.uid),
              orderBy("start_time", "asc")
            )}
            let:data={shifts}
          >
            {#each shifts as shift}
              {formatShift(shift)}
              <br />
            {/each}
          </Collection>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Root>
</AuthCheck>
