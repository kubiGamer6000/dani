<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { DocumentData, Timestamp } from "firebase/firestore";
  import type { UserData } from "$lib/types/user";

  export let userData: UserData | DocumentData | null;

  let elapsedTime = "00:00:00";
  let intervalId: number | null = null;

  $: isCheckedIn = userData?.isCheckedIn ?? false;
  $: lastCheckInTimestamp = userData?.lastCheckInTimestamp as Timestamp | null;

  function updateElapsedTime() {
    if (lastCheckInTimestamp) {
      const now = new Date();
      const diff = now.getTime() - lastCheckInTimestamp.toDate().getTime();

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      elapsedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  function startTimer() {
    if (!intervalId) {
      updateElapsedTime(); // Update immediately
      intervalId = window.setInterval(updateElapsedTime, 1000);
    }
  }

  function stopTimer() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  $: {
    if (isCheckedIn && lastCheckInTimestamp) {
      startTimer();
    } else {
      stopTimer();
      elapsedTime = "00:00:00";
    }
  }

  onDestroy(() => {
    stopTimer();
  });
</script>

{#if isCheckedIn}
  <span>{elapsedTime}</span>
{/if}
