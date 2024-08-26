<script lang="ts">
  import { db, user, userData } from "$lib/firebase";

  import { Doc, Collection } from "sveltefire";

  import * as Card from "$lib/components/ui/card/index.js";
  import * as Table from "$lib/components/ui/table/index.js";

  import WeekSelector from "$lib/components/WeekSelector.svelte";
  import { collection, query, where } from "firebase/firestore";

  import AuthCheck from "$lib/components/auth/AuthCheck.svelte";

  import dayjs from "dayjs";
  import { getStartOfWeek } from "$lib/utils/rotaUtils";

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

  let currentWeekStart: Date = getStartOfWeek(new Date());

  function changeWeek(offset: number) {}

  const getDayOfWeek = (mondayDate: Date, dayName: DayOfWeek): Date => {
    const dayIndex = days.indexOf(dayName);
    if (dayIndex === -1) throw new Error("Invalid day name");
    return dayjs(mondayDate).add(dayIndex, "day").toDate();
  };
</script>

<AuthCheck>
  <WeekSelector
    {currentWeekStart}
    on:prev={() => changeWeek(-1)}
    on:next={() => changeWeek(1)}
  />

  <h2 class="text-lg font-semibold">Rota</h2>
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
              where("rota_id", "==", currentWeekStart),
              where("user_id", "==", $user?.uid)
            )}
            let:data={shifts}
          ></Collection>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Root>
</AuthCheck>
