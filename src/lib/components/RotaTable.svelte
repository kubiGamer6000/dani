<script lang="ts">
  import { rotaStore } from "$lib/stores/rotaStore";

  import {
    parseShiftTime,
    calculateTotalHours,
    dateToTimestamp,
    formatShift,
  } from "$lib/utils/rotaUtils";

  import type { EditableShift } from "$lib/types/rotaTypes";

  import { onMount } from "svelte";

  import * as Table from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import * as Alert from "$lib/components/ui/alert";
  import { ScrollArea } from "$lib/components/ui/scroll-area";

  import CircleAlert from "lucide-svelte/icons/circle-alert";
  import CircleCheck from "lucide-svelte/icons/circle-check";
  import Pencil from "lucide-svelte/icons/pencil";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";
  import Check from "lucide-svelte/icons/check";
  import Delete from "lucide-svelte/icons/delete";

  import { fade, fly } from "svelte/transition";

  import { get } from "svelte/store";
  import { Doc } from "sveltefire";

  import dayjs from "dayjs";

  import { Skeleton } from "$lib/components/ui/skeleton";

  let saving = false;

  // Assume we have 7 days and 5 users for this example
  const dayCount = 7;
  const userCount = 5;

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

  const getDayOfWeek = (mondayDate: Date, dayName: DayOfWeek): Date => {
    const dayIndex = days.indexOf(dayName);
    if (dayIndex === -1) throw new Error("Invalid day name");
    return dayjs(mondayDate).add(dayIndex, "day").toDate();
  };

  let errorMessage = "";

  let successMessage = "";

  let shiftInputs: { [key: string]: string } = {};

  let invalidFields: { [key: string]: boolean } = {};

  // Initialize shift inputs on component mount

  onMount(() => {
    updateShiftInputs();
  });

  function updateShiftInputs() {
    const storeState = get(rotaStore);
    const newShiftInputs: { [key: string]: string } = {};

    storeState.users.forEach((user) => {
      days.forEach((day) => {
        const key = `${user.id}-${day}`;
        newShiftInputs[key] = getShiftsForUserAndDay(user.id, day)
          .map(formatShift)
          .join(", ");
      });
    });

    shiftInputs = newShiftInputs;
  }
  // Helper function to get shifts for a specific user and day

  function getShiftsForUserAndDay(
    userId: string,

    day: string
  ): EditableShift[] {
    return $rotaStore.shifts.filter(
      (shift) =>
        shift.user_id === userId &&
        shift.day.toLowerCase() === day.toLowerCase()
    );
  }

  // Validate a single shift string

  function validateShift(shiftStr: string): boolean {
    if (!shiftStr.trim()) return true; // Empty field is valid

    const parts = shiftStr.split(",");

    return parts.every((part) => {
      const [start, end] = part.split("-").map((t) => t.trim());

      const timeRegex = /^(([01]?[0-9]|2[0-3]):[0-5][0-9]|[01]?[0-9]|2[0-3])$/;

      return timeRegex.test(start) && timeRegex.test(end);
    });
  }

  // Validate all shifts before submission

  function validateAllShifts(): boolean {
    let isValid = true;

    invalidFields = {};

    $rotaStore.users.forEach((user) => {
      days.forEach((day) => {
        const key = `${user.id}-${day}`;

        const shiftStr = shiftInputs[key] || "";

        if (!validateShift(shiftStr)) {
          invalidFields[key] = true;

          isValid = false;
        }
      });
    });

    return isValid;
  }

  // Handle shift input changes

  function handleShiftInput(userId: string, day: string, value: string) {
    const key = `${userId}-${day}`;

    shiftInputs[key] = value;
  }

  // Validate shift on input blur

  function handleShiftBlur(userId: string, day: string) {
    const key = `${userId}-${day}`;

    const value = shiftInputs[key] || "";

    invalidFields[key] = !validateShift(value);
  }

  // Format shift for display

  // Handle batch edit for all users on a specific day

  function handleBatchEdit(day: string, value: string) {
    // if (!validateShift(value)) {
    //   errorMessage = `Invalid shift format for batch edit on ${day}: ${value}`;

    //   return;
    // }

    $rotaStore.users.forEach((user) => {
      const key = `${user.id}-${day}`;

      shiftInputs[key] = value;
    });
  }

  // Calculate total hours for a user

  function getUserTotalHours(userId: string): number {
    const userShifts = $rotaStore.shifts.filter(
      (shift) => shift.user_id === userId
    );

    return calculateTotalHours(userShifts);
  }

  // Function to clear all shifts
  function clearTable() {
    shiftInputs = {};
    $rotaStore.users.forEach((user) => {
      days.forEach((day) => {
        const key = `${user.id}-${day}`;
        shiftInputs[key] = "";
      });
    });
    invalidFields = {};
    errorMessage = "";

    setTimeout(() => (successMessage = ""), 3000);
  }

  // Handle saving the rota

  async function handleSave() {
    if (!validateAllShifts()) {
      errorMessage =
        "Please correct the highlighted fields. Use the format HH:MM - HH:MM for shifts.";

      return;
    }

    saving = true;

    const newShifts: EditableShift[] = [];

    $rotaStore.users.forEach((user) => {
      days.forEach((day) => {
        const shiftStr = shiftInputs[`${user.id}-${day}`] || "";

        if (shiftStr.trim()) {
          const shiftParts = shiftStr.split(",").map((s) => s.trim());

          shiftParts.forEach((part) => {
            const [start, end] = part.split("-").map((t) => t.trim());

            newShifts.push({
              user_id: user.id,

              day,

              start_time: dateToTimestamp(parseShiftTime(start)!),

              end_time: dateToTimestamp(parseShiftTime(end)!),
            });
          });
        }
      });
    });

    rotaStore.updateShifts(newShifts);

    await rotaStore.saveRota(newShifts);
    saving = false;

    successMessage = "Rota saved successfully!";

    setTimeout(() => (successMessage = ""), 3000);
  }
</script>

<div class="w-full">
  {#if errorMessage}
    <div transition:fly={{ y: -20, duration: 300 }} class="mb-4">
      <Alert.Root variant="destructive">
        <CircleAlert class="w-4 h-4" />
        <Alert.Title>Invalid data</Alert.Title>
        <Alert.Description>{errorMessage}</Alert.Description>
      </Alert.Root>
    </div>
  {/if}

  {#if successMessage}
    <div transition:fly={{ y: -20, duration: 300 }} class="mb-4">
      <Alert.Root variant="default" class="border-green-600 text-green-600">
        <CircleCheck class="w-4 h-4" color="#16a34a" />
        <Alert.Title>Success!</Alert.Title>
        <Alert.Description>{successMessage}</Alert.Description>
      </Alert.Root>
    </div>
  {/if}
  <ScrollArea
    class="w-96 md:w-['32rem'] lg:w-full whitespace-nowrap"
    orientation="horizontal"
  >
    <div class="flex">
      {#if !$rotaStore.isLoadingRota && !$rotaStore.isLoadingUsers}
        <Table.Root class="w-full text-sm md:text-base">
          <Table.Header>
            <Table.Row>
              <Table.Head class="sticky left-0 z-10 bg-muted"
                >Employee</Table.Head
              >
              {#each days as day}
                <Table.Head class="min-w-[100px]">
                  {day.slice(0, 3)}
                  {dayjs(getDayOfWeek($rotaStore.newWeekStart, day)).format(
                    "DD/MM"
                  )}
                </Table.Head>
              {/each}
              <Table.Head class="min-w-[80px]">Total Time</Table.Head>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {#if $rotaStore.isEditing}
              <Table.Row>
                <Table.Cell class="sticky left-0 bg-background"></Table.Cell>
                {#each days as day}
                  <Table.Cell>
                    <div transition:fade={{ duration: 200 }}>
                      <Input
                        type="text"
                        class="w-full "
                        placeholder="Batch edit"
                        on:input={(e) =>
                          handleBatchEdit(day, e.currentTarget.value)}
                      />
                    </div>
                  </Table.Cell>
                {/each}
                <Table.Cell></Table.Cell>
              </Table.Row>
            {/if}

            {#each $rotaStore.users as user (user.id)}
              <Table.Row>
                <Table.Cell class="sticky left-0 bg-background font-medium">
                  {user.name}
                </Table.Cell>

                {#each days as day}
                  <Table.Cell>
                    {#if $rotaStore.isEditing}
                      <div transition:fade={{ duration: 200 }}>
                        <Input
                          type="text"
                          class={`w-full  transition-colors duration-200 ${
                            invalidFields[`${user.id}-${day}`]
                              ? "border-red-500"
                              : ""
                          } ${saving ? "bg-blue-50" : ""}`}
                          value={shiftInputs[`${user.id}-${day}`] || ""}
                          on:input={(e) =>
                            handleShiftInput(
                              user.id,
                              day,
                              e.currentTarget.value
                            )}
                          on:blur={() => handleShiftBlur(user.id, day)}
                        />
                      </div>
                    {:else if getShiftsForUserAndDay(user.id, day).length > 0}
                      <span class="">
                        {getShiftsForUserAndDay(user.id, day)
                          .map(formatShift)
                          .join(", ")}
                      </span>
                    {:else}
                      <span class="text-muted-foreground">-</span>
                    {/if}
                    <span class="text-muted-foreground text-sm italic">
                      <br />
                      <Doc
                        ref={`dailyShifts/${user.id}_${dayjs(
                          getDayOfWeek($rotaStore.newWeekStart, day)
                        ).format("DD-MM-YYYY")}`}
                        let:data={shift}
                      >
                        {#each shift.checkIns as checkInId}
                          <Doc
                            ref={`dailyShifts/${user.id}_${dayjs(
                              getDayOfWeek($rotaStore.newWeekStart, day)
                            ).format("DD-MM-YYYY")}/checkIns/${checkInId}`}
                            let:data={checkIn}
                          >
                            {#if checkIn.end.timestamp}
                              {`${dayjs(checkIn.start.timestamp.toDate()).format("HH:mm")} - ${dayjs(checkIn.end.timestamp.toDate()).format("HH:mm")} `}
                            {:else}
                              {`Checked in at ${dayjs(checkIn.start.timestamp.toDate()).format("HH:mm")}`}
                            {/if}
                          </Doc>
                          <br />
                        {/each}
                      </Doc>
                    </span>
                  </Table.Cell>
                {/each}

                <Table.Cell class="font-medium">
                  {getUserTotalHours(user.id).toFixed(2).replace(".00", "")}h
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      {:else}
        <Table.Root class="w-full text-sm md:text-base">
          <Table.Header>
            <Table.Row>
              <Table.Head class="sticky left-0 z-10 bg-muted">
                <Skeleton class="h-6 w-20" />
              </Table.Head>
              {#each Array(dayCount) as _, i}
                <Table.Head class="min-w-[100px]">
                  <Skeleton class="h-6 w-12" />
                </Table.Head>
              {/each}
              <Table.Head class="min-w-[80px]">
                <Skeleton class="h-6 w-16" />
              </Table.Head>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {#each Array(userCount) as _, userIndex}
              <Table.Row>
                <Table.Cell class="sticky left-0 bg-background font-medium">
                  <Skeleton class="h-6 w-24" />
                </Table.Cell>

                {#each Array(dayCount) as _, dayIndex}
                  <Table.Cell>
                    <div class="space-y-2">
                      <Skeleton class="h-6 w-full" />
                      <Skeleton class="h-4 w-3/4" />
                    </div>
                  </Table.Cell>
                {/each}

                <Table.Cell class="font-medium">
                  <Skeleton class="h-6 w-16" />
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      {/if}
    </div>
  </ScrollArea>
</div>

<div class="mt-4 space-y-2">
  {#if !$rotaStore.isEditing}
    <Button
      class="w-full"
      on:click={() => {
        updateShiftInputs();
        rotaStore.setEditing(true);
      }}
    >
      <Pencil class="w-4 h-4 mr-2" />
      Edit Rota
    </Button>
  {:else}
    <div class="flex flex-col sm:flex-row gap-2">
      <Button
        class="w-full sm:flex-1 transition-all duration-200"
        on:click={handleSave}
        disabled={saving}
      >
        {#if saving}
          <LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
        {:else}
          <Check class="w-4 h-4 mr-2" />
        {/if}
        Save Changes
      </Button>
      <Button
        variant="destructive"
        class="w-full sm:flex-1"
        on:click={clearTable}
        disabled={saving}
      >
        <Delete class="w-4 h-4 mr-2" />
        Delete All
      </Button>
      <Button
        variant="secondary"
        class="w-full sm:flex-1"
        on:click={() => rotaStore.setEditing(false)}
        disabled={saving}
      >
        Cancel
      </Button>
    </div>
  {/if}
</div>
