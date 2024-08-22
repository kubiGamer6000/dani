<script lang="ts">
  import { rotaStore } from "$lib/stores/rotaStore";

  import {
    parseShiftTime,
    formatShiftTime,
    calculateTotalHours,
    dateToTimestamp,
  } from "$lib/utils/rotaUtils";

  import type { EditableShift, User } from "$lib/types/rotaTypes";

  import { createEventDispatcher, onMount } from "svelte";

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
  import { flip } from "svelte/animate";

  let saving = false;

  const dispatch = createEventDispatcher();

  const days = [
    "Monday",

    "Tuesday",

    "Wednesday",

    "Thursday",

    "Friday",

    "Saturday",

    "Sunday",
  ];

  let errorMessage = "";

  let successMessage = "";

  let shiftInputs: { [key: string]: string } = {};

  let invalidFields: { [key: string]: boolean } = {};

  // Initialize shift inputs on component mount

  onMount(() => {
    $rotaStore.users.forEach((user) => {
      days.forEach((day) => {
        const key = `${user.id}-${day}`;

        shiftInputs[key] = getShiftsForUserAndDay(user.id, day)
          .map(formatShift)

          .join(", ");
      });
    });
  });

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

  function formatShift(shift: EditableShift): string {
    const start =
      shift.start_time instanceof Date
        ? shift.start_time
        : new Date(shift.start_time.seconds * 1000);

    const end =
      shift.end_time instanceof Date
        ? shift.end_time
        : new Date(shift.end_time.seconds * 1000);

    return `${formatShiftTime(start)} - ${formatShiftTime(end)}`;
  }

  // Handle batch edit for all users on a specific day

  function handleBatchEdit(day: string, value: string) {
    if (!validateShift(value)) {
      errorMessage = `Invalid shift format for batch edit on ${day}: ${value}`;

      return;
    }

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

<!-- <div class="w-full overflow-x-auto">
  {#if errorMessage}
    <div transition:fly={{ y: -20, duration: 300 }}>
      <Alert.Root variant="destructive" class="mb-4">
        <CircleAlert class="w-4 h-4" />
        <Alert.Title>Invalid data</Alert.Title>
        <Alert.Description>{errorMessage}</Alert.Description>
      </Alert.Root>
    </div>
  {/if}

  {#if successMessage}
    <div transition:fly={{ y: -20, duration: 300 }}>
      <Alert.Root
        variant="default"
        class="mb-4 border-green-600 text-green-600"
      >
        <CircleCheck class="w-4 h-4" color="#16a34a" />
        <Alert.Title>Success!</Alert.Title>
        <Alert.Description>{successMessage}</Alert.Description>
      </Alert.Root>
    </div>
  {/if}

  <div class="inline-block min-w-full rounded-lg overflow-hidden">
    <Table.Root class="w-full text-sm md:text-base">
      <Table.Header>
        <Table.Row>
          <Table.Head
            class="px-2 py-2 md:px-4 md:py-3 text-left bg-muted text-xs leading-4 font-medium text-muted-foreground uppercase tracking-wider sticky left-0 z-10"
          >
            Employee
          </Table.Head>
          {#each days as day}
            <Table.Head
              class="px-2 py-2 md:px-4 md:py-3 bg-muted text-left text-xs leading-4 font-medium text-muted-foreground uppercase tracking-wider"
            >
              {day}
            </Table.Head>
          {/each}
          <Table.Head
            class="px-2 py-2 md:px-4 md:py-3 bg-muted text-left text-xs leading-4 font-medium text-muted-foreground uppercase tracking-wider"
          >
            Total Hours
          </Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {#if $rotaStore.isEditing}
          <Table.Row>
            <Table.Cell
              class="px-2 py-2 md:px-4 md:py-3 whitespace-no-wrap border-b"
            ></Table.Cell>
            {#each days as day}
              <Table.Cell
                class="px-2 py-2 md:px-4 md:py-3 whitespace-no-wrap border-b"
              >
                <div transition:fade={{ duration: 200 }}>
                  <Input
                    type="text"
                    class="w-full p-1  border rounded"
                    placeholder="Batch edit"
                    on:input={(e) =>
                      handleBatchEdit(day, e.currentTarget.value)}
                  />
                </div>
              </Table.Cell>
            {/each}
            <Table.Cell
              class="px-2 py-2 md:px-4 md:py-3 whitespace-no-wrap border-b"
            ></Table.Cell>
          </Table.Row>
        {/if}

        {#each $rotaStore.users as user (user.id)}
          <Table.Row>
            <Table.Cell
              class="px-2 py-2 md:px-4 md:py-3 whitespace-no-wrap border-b"
            >
              {user.name}
            </Table.Cell>

            {#each days as day}
              <Table.Cell
                class="px-2 py-2 md:px-4 md:py-3 whitespace-no-wrap border-b"
              >
                {#if $rotaStore.isEditing}
                  <div transition:fade={{ duration: 200 }}>
                    <Input
                      type="text"
                      class={`w-full p-1  border rounded transition-colors duration-200 ${
                        invalidFields[`${user.id}-${day}`]
                          ? "border-red-500"
                          : ""
                      } ${saving ? "bg-blue-50" : ""}`}
                      value={shiftInputs[`${user.id}-${day}`] || ""}
                      on:input={(e) =>
                        handleShiftInput(user.id, day, e.currentTarget.value)}
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
                  <span class="text-gray-400">-</span>
                {/if}
              </Table.Cell>
            {/each}

            <Table.Cell
              class="px-2 py-2 md:px-4 md:py-3 whitespace-no-wrap border-b "
            >
              {getUserTotalHours(user.id).toFixed(2)}
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</div>

<div
  class="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-4"
>
  {#if !$rotaStore.isEditing}
    <Button
      class="w-full sm:w-auto"
      on:click={() => rotaStore.setEditing(true)}
    >
      <Pencil class="w-4 h-4 mr-2" />
      Edit Rota
    </Button>
  {:else}
    <Button
      class="w-full sm:w-auto transition-all duration-200"
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
    <div class="flex">
      <Button
        variant="destructive"
        class="w-full sm:w-auto mr-2"
        on:click={clearTable}
        disabled={saving}
      >
        <Delete class="w-4 h-4 mr-2" />
        Delete All
      </Button>
      <Button
        variant="secondary"
        class="w-full sm:w-auto"
        on:click={() => rotaStore.setEditing(false)}
        disabled={saving}
      >
        Cancel
      </Button>
    </div>
  {/if}
</div> -->

<div class="w-full max-w-full flex justify-center">
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
      <Table.Root class="w-full text-sm md:text-base">
        <Table.Header>
          <Table.Row>
            <Table.Head class="sticky left-0 z-10 bg-muted">Employee</Table.Head
            >
            {#each days as day}
              <Table.Head class="min-w-[100px]">
                {day.slice(0, 3)}
              </Table.Head>
            {/each}
            <Table.Head class="min-w-[80px]">Total</Table.Head>
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
                          handleShiftInput(user.id, day, e.currentTarget.value)}
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
                </Table.Cell>
              {/each}

              <Table.Cell class="font-medium">
                {getUserTotalHours(user.id).toFixed(2)}
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>
  </ScrollArea>
</div>

<div class="mt-4 space-y-2">
  {#if !$rotaStore.isEditing}
    <Button class="w-full" on:click={() => rotaStore.setEditing(true)}>
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
