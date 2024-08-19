<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import * as Table from "$lib/components/ui/table";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  import { collection, where, query, orderBy, limit } from "firebase/firestore";

  import { db } from "$lib/firebase";

  import { Collection, Doc } from "sveltefire";

  import dayjs from "dayjs";
  import calendar from "dayjs/plugin/calendar";
  dayjs.extend(calendar);

  import Search from "lucide-svelte/icons/search";

  import type { UserData } from "$lib/types/user";
  import type { CheckIn } from "$lib/types/checkIn";

  import CheckInTimer from "$lib/components/custom/CheckInTimer.svelte";

  import Map from "lucide-svelte/icons/map";

  const staffQuery = query(
    collection(db, "users"),
    where("role", "==", "staff")
  );

  const minToString = (minutes: number) =>
    `${Math.floor(minutes / 60)} hours ${Math.round(minutes % 60)} min`;

  const getToday = () => {
    return dayjs().format("YYYY-MM-DD");
  };
  const sortUsers = (users: any) => {
    return users.sort(
      (a: any, b: any) =>
        b.isCheckedIn - a.isCheckedIn ||
        b.lastCheckInTimestamp.toDate().getTime() -
          a.lastCheckInTimestamp.toDate().getTime()
    );
  };

  const openGoogleMapsLink = (checkInData: any) => {
    const link = `https://www.google.com/maps/search/?api=1&query=${checkInData.location.latitude},${checkInData.location.longitude}`;
    if (typeof window !== "undefined") {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      alert("Window is undefined");
    }
  };

  $: searchQuery = "";
</script>

<div class="flex flex-col items-center p-2">
  <!-- <div class="w-full my-4">
    <Search class="text-muted-foreground relative left-2.5 top-7 h-4 w-4" />
    <Input
      type="search"
      placeholder="Search..."
      class="bg-background w-full rounded-lg pl-8 "
      bind:value={searchQuery}
    />
  </div> -->
  <Collection ref={staffQuery} let:data={users}>
    {#each users as user}
      <Card.Root class={`w-full mb-4 ${user?.isCheckedIn ? "" : "bg-muted"}`}>
        <Card.Header>
          <Card.Title class="text-3xl">{user?.name}</Card.Title>

          <Card.Description class="text-md">
            <p>
              Today:
              <Doc ref={`shifts/${user?.id}_${getToday()}`} let:data={shift}>
                {minToString(shift.totalDuration)}
              </Doc>
            </p>
            <p class="mt-2">
              Currently checked {user?.isCheckedIn ? "in for" : `out`}
              {#if user?.isCheckedIn}
                <span class="font-semibold">
                  <CheckInTimer userData={user} />
                </span>
              {/if}
            </p>
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <h3 class="font-semibold mt-4 mb-2">Shifts</h3>

          <Collection
            ref={query(
              collection(db, "shifts"),
              where("userId", "==", user?.id),
              orderBy("date", "desc"),
              limit(2)
            )}
            let:data={shifts}
          >
            {#each shifts as shift}
              <div class="py-2">
                <h2 class="font-semibold text-lg">
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
                      <Table.Head>When</Table.Head>
                      <Table.Head class="text-right">Where</Table.Head>
                    </Table.Row>
                  </Table.Header>

                  {#each shift?.checkIns as checkIn}
                    <Table.Row>
                      <Table.Cell class="font-medium flex items-center">
                        Checked in
                      </Table.Cell>
                      <Table.Cell>
                        {dayjs(checkIn.in.time.toDate()).format("H:mm")}
                      </Table.Cell>
                      <Table.Cell class="text-right">
                        <Doc
                          ref={`checkIns/${checkIn.in.id}`}
                          let:data={checkInData}
                        >
                          <Button
                            variant="outline"
                            on:click={() => {
                              openGoogleMapsLink(checkInData);
                            }}
                          >
                            <Map class="mr-2 h-4 w-4" />
                            Open
                          </Button>
                        </Doc>
                      </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell class="font-medium text-md flex items-center">
                        Checked out
                      </Table.Cell>
                      <Table.Cell>
                        {checkIn.out.time != null
                          ? dayjs(checkIn.out.time.toDate()).format("H:mm")
                          : "Ongoing"}
                      </Table.Cell>
                      <Table.Cell class="text-right">
                        <Doc
                          ref={`checkIns/${checkIn.out.id}`}
                          let:data={checkInData}
                        >
                          <Button
                            variant="outline"
                            on:click={() => {
                              openGoogleMapsLink(checkInData);
                            }}
                          >
                            <Map class="mr-2 h-4 w-4" />
                            Open
                          </Button>
                        </Doc>
                      </Table.Cell>
                    </Table.Row>
                  {/each}
                </Table.Root>
              </div>
            {/each}
          </Collection>
        </Card.Content>
        <Card.Footer>
          <Button href={"##"}>View Details</Button>
        </Card.Footer>
      </Card.Root>
    {/each}
    <Card.Root slot="loading" class="w-full mb-4">
      <Card.Header class="space-y-4">
        <Card.Title>
          <Skeleton class="h-10 w-[250px] rounded-xl" />
        </Card.Title>
        <Card.Description>
          <div class="space-y-2">
            <Skeleton class="h-4 w-[150px] rounded-full" />
            <Skeleton class="h-4 w-[150px] rounded-full" />
          </div>
        </Card.Description>
      </Card.Header>
      <Card.Content></Card.Content>
      <Card.Footer>
        <Button class="disabled" href={"##"}>View Details</Button>
      </Card.Footer>
    </Card.Root>
  </Collection>
</div>
