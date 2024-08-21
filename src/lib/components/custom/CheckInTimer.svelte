<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { db } from "$lib/firebase";
  import { doc, getDoc } from "firebase/firestore";
  import type { DocumentData, Timestamp } from "firebase/firestore";
  import type { UserData } from "$lib/types/user";

  export let userData: UserData | DocumentData | null;

  let elapsedTime = "00:00:00";
  let intervalId: number | null = null;
  let lastCheckInTime: Date | null = null;

  $: isCheckedIn = userData?.isCheckedIn ?? false;
  $: lastCheckIn = userData?.lastCheckIn ?? null;
  $: lastCheckInTimestamp = userData?.lastCheckInTimestamp ?? null;

  async function fetchLastCheckIn() {
    if (!lastCheckIn) return;

    try {
      const checkInRef = doc(db, "checkIns", lastCheckIn);
      const checkInSnap = await getDoc(checkInRef);

      if (checkInSnap.exists()) {
        const checkInData = checkInSnap.data();
        if (checkInData.timestamp) {
          lastCheckInTime = (checkInData.timestamp as Timestamp).toDate();
          updateElapsedTime();
        }
      }
    } catch (error) {
      console.error("Error fetching last check-in:", error);
    }
  }

  function updateElapsedTime() {
    if (lastCheckInTime) {
      const now = new Date();
      const diff = now.getTime() - lastCheckInTime.getTime();

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
    if (isCheckedIn && lastCheckIn) {
      if (!lastCheckInTime) {
        fetchLastCheckIn();
      }
      if (!intervalId) {
        startTimer();
      }
    } else {
      stopTimer();
      elapsedTime = "00:00:00";
      lastCheckInTime = null;
    }
  }

  onDestroy(() => {
    stopTimer();
  });
</script>

{#if isCheckedIn}
  <span>{elapsedTime}</span>
{/if}
