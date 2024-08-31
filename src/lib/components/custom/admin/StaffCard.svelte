<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import * as Table from "$lib/components/ui/table";
  import { Button } from "$lib/components/ui/button/index.js";

  import {
    collection,
    where,
    query,
    orderBy,
    limit,
    deleteDoc,
    doc,
    updateDoc,
  } from "firebase/firestore";

  import { db } from "$lib/firebase";

  import { Collection, Doc } from "sveltefire";

  import dayjs from "dayjs";
  import calendar from "dayjs/plugin/calendar";
  dayjs.extend(calendar);

  import CheckInTimer from "$lib/components/custom/CheckInTimer.svelte";

  import Map from "lucide-svelte/icons/map";
  import Trash2 from "lucide-svelte/icons/trash-2";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import type { Shift } from "$lib/types/shift";
  import type { CheckIn } from "$lib/types/checkIn";
  import type { UserData } from "$lib/types/user";

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

  const deleteCheckInGroup = async (shift: Shift, checkIn, user: UserData) => {
    try {
      const checkInRef = doc(db, "checkIns", checkIn?.in.id);
      let checkOutRef = null;
      if (checkIn.out.id) {
        checkOutRef = doc(db, "checkIns", checkIn?.out.id);
      }
      const shiftRef = doc(db, "shifts", shift?.id);

      // Delete the check-in from the database

      await deleteDoc(checkInRef);

      // If there is a check-out, delete it as well

      if (checkOutRef) await deleteDoc(checkOutRef);

      // Now, delete the check-in group from the shift. If there is only one check-in group, delete the whole shift

      if (shift.checkIns.length > 1) {
        await updateDoc(shiftRef, {
          checkIns: shift.checkIns.filter(
            (checkInGroup) => checkInGroup.in.id !== checkIn.in.id
          ),
        });
      } else {
        await deleteDoc(shiftRef);
      }

      // Fix user's lastCheckIn

      const userRef = doc(db, "users", user.id);

      if (shift.isActive) {
        await updateDoc(userRef, {
          isCheckedIn: false,
          lastCheckInTimestamp: null,
        });
      }
    } catch (error) {
      console.error("Error deleting checkInGroup:", error);
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
          <Collection
            ref={query(
              collection(db, "shifts"),
              where("userId", "==", user?.id),
              orderBy("date", "desc"),
              limit(2)
            )}
            let:data={shifts}
          >
            {#if shifts.length !== 0}
              <h3 class="font-semibold text-lg mt-4 mb-2">Shifts</h3>
              {#each shifts as shift}
                <div class="py-2">
                  <h2 class="font-semibold text-lg">
                    {dayjs(shift.date).calendar(null, {
                      sameDay: "[Today]", // The same day ( Today at 2:30 AM )
                      lastDay: "[Yesterday]", // The day before ( Yesterday at 2:30 AM )
                      lastWeek: "dddd", // Last week ( Last Monday at 2:30 AM )
                      sameElse: "DD/MM/YYYY", // Everything else ( 7/10/2011 )
                    })}
                  </h2>
                  <Table.Root class="my-4">
                    <Table.Header>
                      <Table.Row>
                        <Table.Head class="w-[100px]">Activity</Table.Head>
                        <Table.Head>When</Table.Head>

                        <Table.Head class="text-right">Options</Table.Head>
                      </Table.Row>
                    </Table.Header>

                    {#each shift?.checkIns as checkIn}
                      <AlertDialog.Root>
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
                                size="icon"
                                class="mr-1"
                                on:click={() => {
                                  openGoogleMapsLink(checkInData);
                                }}
                              >
                                <Map class="h-4 w-4" />
                              </Button>
                              <AlertDialog.Trigger asChild let:builder>
                                <Button
                                  builders={[builder]}
                                  variant="destructive"
                                  size="icon"
                                >
                                  <Trash2 class="h-4 w-4" />
                                </Button>
                              </AlertDialog.Trigger>
                            </Doc>
                          </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                          <Table.Cell
                            class="font-medium text-md flex items-center"
                          >
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
                                size="icon"
                                class="mr-1"
                                on:click={() => {
                                  openGoogleMapsLink(checkInData);
                                }}
                              >
                                <Map class="h-4 w-4" />
                              </Button>
                            </Doc>
                            <AlertDialog.Trigger asChild let:builder>
                              <Button variant="destructive" size="icon">
                                <Trash2 class="h-4 w-4" />
                              </Button>
                            </AlertDialog.Trigger>
                            <AlertDialog.Content>
                              <AlertDialog.Header>
                                <AlertDialog.Title
                                  >Are you sure you want to delete?</AlertDialog.Title
                                >
                                <AlertDialog.Description>
                                  This will delete the shift between:
                                  <span class="font-bold">
                                    {dayjs(checkIn.in.time.toDate()).format(
                                      "H:mm"
                                    )}
                                    -
                                    {checkIn.out.time != null
                                      ? dayjs(checkIn.out.time.toDate()).format(
                                          "H:mm"
                                        )
                                      : "Ongoing"}
                                  </span>
                                </AlertDialog.Description>
                              </AlertDialog.Header>
                              <AlertDialog.Footer>
                                <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                                <AlertDialog.Action
                                  on:click={() => {
                                    deleteCheckInGroup(shift, checkIn, user);
                                  }}
                                >
                                  <Trash2 class="mr-1 h-4 w-4" />
                                  Delete
                                </AlertDialog.Action>
                              </AlertDialog.Footer>
                            </AlertDialog.Content>
                          </Table.Cell>
                        </Table.Row>
                      </AlertDialog.Root>
                    {/each}
                  </Table.Root>
                </div>
              {/each}
            {:else}
              <h3 class="font-semibold text-lg mt-4 mb-2">No shifts found</h3>
            {/if}
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
