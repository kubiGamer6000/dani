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
    documentId,
    writeBatch,
    getDoc,
  } from "firebase/firestore";

  import type { DocumentData } from "firebase/firestore";

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

  // SvelteKit doesn't allow casting DocumentData to Shift directly in the markup (since you can't use 'as' in the markup), so we need to cast it manually
  function DocumentDataToShift(data: DocumentData): Shift {
    return data as Shift;
  }

  import type { CheckIn } from "$lib/types/checkIn";
  import type { UserData } from "$lib/types/user";

  function DocumentDataToUserData(data: DocumentData): UserData {
    return data as UserData;
  }

  const staffQuery = query(
    collection(db, "users"),
    where("role", "==", "staff")
  );

  const minToString = (minutes: number) =>
    `${Math.floor(minutes / 60)} hours ${Math.round(minutes % 60)} min`;

  const getToday = () => {
    return dayjs().format("DD-MM-YYYY");
  };

  const sortUsers = (users: any) => {
    return users.sort(
      (a: any, b: any) =>
        b.isCheckedIn - a.isCheckedIn ||
        b.lastCheckInTimestamp.toDate().getTime() -
          a.lastCheckInTimestamp.toDate().getTime()
    );
  };

  const openGoogleMapsLink = (location: any) => {
    const link = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    if (typeof window !== "undefined") {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      alert("Window is undefined");
    }
  };

  const deleteCheckInGroup = async (
    shift: Shift,
    checkInId: string,
    user: UserData
  ) => {
    try {
      if (!shift.id) {
        console.error("Shift ID is undefined");
        return;
      }

      const batch = writeBatch(db);
      const shiftRef = doc(db, "dailyShifts", shift.id);
      const checkInRef = doc(shiftRef, "checkIns", checkInId);

      // Get the check-in data before deleting
      const checkInSnap = await getDoc(checkInRef);
      const checkInData = checkInSnap.data() as CheckIn;

      // Delete the check-in from the subcollection
      batch.delete(checkInRef);

      // Update the shift document
      const updatedCheckIns = shift.checkIns.filter((id) => id !== checkInId);
      const updatedCheckInDuration =
        (shift.checkInDuration ?? 0) - (checkInData?.duration ?? 0);

      batch.update(shiftRef, {
        checkIns: updatedCheckIns,
        checkInDuration: updatedCheckInDuration,
        isActive: updatedCheckIns.length > 0,
      });

      // Update user document
      if (!user.id) {
        console.error("User ID is undefined");
        return;
      }
      const userRef = doc(db, "users", user.id);
      if (updatedCheckIns.length === 0) {
        // If no check-ins left, reset user's check-in status
        batch.update(userRef, {
          isCheckedIn: false,
          lastCheckInTimestamp: null,
          lastShift: null,
        });
      } else {
        // Find the last check-in and update user's lastCheckInTimestamp
        const lastCheckInId = updatedCheckIns[updatedCheckIns.length - 1];
        if (lastCheckInId) {
          const lastCheckInRef = doc(shiftRef, "checkIns", lastCheckInId);
          const lastCheckInSnap = await getDoc(lastCheckInRef);
          const lastCheckInData = lastCheckInSnap.data() as CheckIn | undefined;

          if (lastCheckInData?.start.timestamp) {
            batch.update(userRef, {
              lastCheckInTimestamp: lastCheckInData.start.timestamp,
            });
          } else {
            // TODO: Implement actual error handling
            console.log("lastCheckInData.start.timestamp is null");
            batch.update(userRef, {
              lastCheckInTimestamp: null,
            });
          }
        } else {
          // TODO: Implement actual error handling
          console.log("No last check-in found");
          batch.update(userRef, {
            lastCheckInTimestamp: null,
          });
        }
      }

      // Commit all the batch operations
      await batch.commit();

      // If there are no check-ins left, delete the shift document
      if (updatedCheckIns.length === 0) {
        await deleteDoc(shiftRef);
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
              <Doc
                ref={`dailyShifts/${user?.id}_${getToday()}`}
                let:data={shift}
              >
                {minToString(shift.checkInDuration)}
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
              collection(db, "dailyShifts"),
              where(documentId(), ">=", `${user?.id}_`),
              where(documentId(), "<=", `${user?.id}_\uf8ff`),
              orderBy(documentId(), "desc"),
              limit(3)
            )}
            let:data={shifts}
          >
            {#if shifts.length !== 0}
              <h3 class="font-semibold text-lg mt-4 mb-2">Shifts</h3>
              {#each shifts as shift}
                <div class="py-2">
                  <h2 class="font-semibold text-lg">
                    {dayjs(shift.date.toDate()).calendar(null, {
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

                    {#each shift?.checkIns as checkInId}
                      checkIn
                      <Doc
                        ref={`dailyShifts/${shift.id}/checkIns/${checkInId}`}
                        let:data={checkIn}
                      >
                        <AlertDialog.Root>
                          <Table.Row>
                            <Table.Cell class="font-medium flex items-center">
                              Checked in
                            </Table.Cell>
                            <Table.Cell>
                              {dayjs(checkIn.start.timestamp.toDate()).format(
                                "H:mm"
                              )}
                            </Table.Cell>
                            <Table.Cell class="text-right">
                              <Button
                                variant="outline"
                                size="icon"
                                class="mr-1"
                                on:click={() => {
                                  openGoogleMapsLink(checkIn.start.location);
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
                            </Table.Cell>
                          </Table.Row>

                          <Table.Row>
                            <Table.Cell
                              class="font-medium text-md flex items-center"
                            >
                              Checked out
                            </Table.Cell>
                            <Table.Cell>
                              {checkIn.end.timestamp != null
                                ? dayjs(checkIn.end.timestamp.toDate()).format(
                                    "H:mm"
                                  )
                                : "Ongoing"}
                            </Table.Cell>
                            <Table.Cell class="text-right">
                              <Button
                                variant="outline"
                                size="icon"
                                class="mr-1"
                                on:click={() => {
                                  openGoogleMapsLink(checkIn.end.location);
                                }}
                              >
                                <Map class="h-4 w-4" />
                              </Button>

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
                                      {dayjs(
                                        checkIn.start.timestamp.toDate()
                                      ).format("H:mm")}
                                      -
                                      {checkIn.end.timestamp != null
                                        ? dayjs(
                                            checkIn.end.timestamp.toDate()
                                          ).format("H:mm")
                                        : "Ongoing"}
                                    </span>
                                  </AlertDialog.Description>
                                </AlertDialog.Header>
                                <AlertDialog.Footer>
                                  <AlertDialog.Cancel>Cancel</AlertDialog.Cancel
                                  >
                                  <AlertDialog.Action
                                    on:click={async () => {
                                      await deleteCheckInGroup(
                                        DocumentDataToShift(shift),
                                        checkInId,
                                        DocumentDataToUserData(user)
                                      );
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
                      </Doc>
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
