<script lang="ts">
  import { userData, db, user } from "$lib/firebase";
  import { collection, query, where, orderBy } from "firebase/firestore";

  import dayjs from "dayjs";
  import calendar from "dayjs/plugin/calendar";

  dayjs.extend(calendar);

  import { Doc, Collection } from "sveltefire";

  import * as Card from "$lib/components/ui/card/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
</script>

<Card.Root class="mx-auto w-full">
  <Card.Header>
    <Card.Title class="text-3xl">My Check-ins</Card.Title>
    <Card.Description class="text-md"
      >Monitor your check-ins from here.</Card.Description
    >
  </Card.Header>
  <Card.Content>
    {#if $user?.uid}
      <Collection
        ref={query(
          collection(db, "shifts"),
          where("userId", "==", $user?.uid),
          orderBy("date", "desc")
        )}
        let:data={shifts}
      >
        {#each shifts as shift}
          <div class="py-2">
            <h2 class="text-lg font-semibold">
              {dayjs(shift.date).calendar(null, {
                sameDay: "[Today]", // The same day ( Today at 2:30 AM )
                lastDay: "[Yesterday]", // The day before ( Yesterday at 2:30 AM )
                lastWeek: "[Last] dddd", // Last week ( Last Monday at 2:30 AM )
                sameElse: "DD/MM/YYYY", // Everything else ( 7/10/2011 )
              })}
            </h2>
            <Table.Root class="my-4">
              <Table.Header>
                <Table.Row>
                  <Table.Head class="w-[100px]">Activity</Table.Head>
                  <Table.Head class="text-right">When</Table.Head>
                </Table.Row>
              </Table.Header>

              {#each shift?.checkIns as checkIn}
                <Table.Row>
                  <Table.Cell class="font-medium flex items-center w-48">
                    Checked in
                  </Table.Cell>
                  <Table.Cell class="text-right">
                    {dayjs(checkIn.in.time.toDate()).format("H:mm")}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell
                    class="font-medium text-md flex items-center w-48"
                  >
                    Checked out
                  </Table.Cell>
                  <Table.Cell class="text-right">
                    {checkIn.out.time != null
                      ? dayjs(checkIn.out.time.toDate()).format("H:mm")
                      : "Ongoing"}
                  </Table.Cell>
                </Table.Row>
              {/each}
            </Table.Root>
          </div>
        {/each}
      </Collection>
    {:else}
      <p class="text-center">Loading...</p>
    {/if}
  </Card.Content>
  <!-- <Card.Footer>
    <Button class="w-full">Test</Button>
  </Card.Footer> -->
</Card.Root>
