<script lang="ts">
  import { userData, user } from "$lib/firebase";
  import { db } from "$lib/firebase";
  import {
    collection,
    writeBatch,
    doc,
    Timestamp,
    GeoPoint,
    getDoc,
  } from "firebase/firestore";

  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button/index.js";

  import dayjs from "dayjs";

  import Check from "lucide-svelte/icons/check";
  import Loader from "lucide-svelte/icons/loader"; // Import loading icon

  import CheckInTimer from "$lib/components/custom/CheckInTimer.svelte";

  import { getCurrentPosition } from "$lib/utils/getUserGeolocation";

  import type { Shift } from "$lib/types/shift";
  import { enhance } from "$app/forms";

  // Add a loading state
  let isLoading = false;

  /**
   * Handles the check-in/out process for a user.
   * This function updates the user's check-in status, creates or updates a shift,
   * and records the check-in/out event.
   */

  console.log($userData);
  async function checkInOut() {
    // Exit if user data is not available
    if (!$userData || !$user) {
      alert("User data not available. Please try logging in again.");
      return;
    }

    // Set loading state to true when starting the process
    isLoading = true;

    try {
      const batch = writeBatch(db);
      const newIsCheckedIn = !$userData.isCheckedIn;

      // Get the user's current location coordinates
      const position = await getCurrentPosition();

      // Reference to the user document and new check-in document
      const userRef = doc(db, "users", $user.uid);
      const checkInRef = doc(collection(db, "checkIns"));

      // Create timestamps and date string
      const now = new Date();
      const clientTimestamp = Timestamp.fromDate(now);
      const today = dayjs(now).format("YYYY-MM-DD");
      console.log(`Today is ${today}`); // YYYY-MM-DD

      // Prepare check-in data
      const checkInData = {
        id: checkInRef.id,
        userId: $user.uid,
        timestamp: clientTimestamp,
        type: newIsCheckedIn ? "in" : "out",
        location: new GeoPoint(
          position.coords.latitude,
          position.coords.longitude
        ),
        shiftId: "", // Will be set after creating/updating the shift
      };

      // Get or create today's shift
      const shiftRef = doc(db, "shifts", `${$user.uid}_${today}`);
      const shiftSnap = await getDoc(shiftRef);

      let shiftData: Shift;
      if (shiftSnap.exists()) {
        // Update existing shift
        shiftData = shiftSnap.data() as Shift;
        checkInData.shiftId = shiftRef.id;

        let updatedCheckIns = [...shiftData.checkIns];

        if (newIsCheckedIn) {
          // Checking in: Add a new entry
          updatedCheckIns.push({
            in: {
              id: checkInRef.id,
              time: clientTimestamp,
            },
            out: {
              id: null,
              time: null,
            },
          });
        } else {
          // Checking out: Update the last entry
          const lastIndex = updatedCheckIns.length - 1;
          if (lastIndex >= 0 && updatedCheckIns[lastIndex].out.time === null) {
            updatedCheckIns[lastIndex].out = {
              id: checkInRef.id,
              time: clientTimestamp,
            };
          } else {
            throw new Error(
              "Unexpected state: Checking out without an open check-in"
            );
          }
        }

        // Calculate total duration of the shift
        const totalDuration = calculateTotalDuration(updatedCheckIns);

        // Update the shift document
        batch.update(shiftRef, {
          checkIns: updatedCheckIns,
          isActive: newIsCheckedIn,
          totalDuration: totalDuration,
        });
      } else {
        // Create new shift
        shiftData = {
          userId: $user.uid,
          date: today,
          checkIns: [
            {
              in: {
                id: checkInRef.id,
                time: clientTimestamp,
              },
              out: {
                id: null,
                time: null,
              },
            },
          ],
          isActive: true,
          totalDuration: 0,
        };
        checkInData.shiftId = shiftRef.id;
        batch.set(shiftRef, shiftData);
      }

      // Add the new check-in document
      batch.set(checkInRef, checkInData);

      // Update user document
      batch.update(userRef, {
        isCheckedIn: newIsCheckedIn,
        lastCheckIn: checkInRef.id,
        lastCheckInTimestamp: clientTimestamp,
      });

      // Commit all the batch operations
      await batch.commit();

      console.log("Check-in/out recorded:", checkInRef.id);
    } catch (error) {
      // Log the error and show a user-friendly message
      console.error("Failed to check-in/out:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      // Set loading state back to false when the process is complete
      isLoading = false;
    }
  }

  /**
   * Calculates the total duration of a shift in minutes.
   * @param checkIns - Array of check-in/out pairs for a shift
   * @returns Total duration in minutes
   */
  function calculateTotalDuration(checkIns: Shift["checkIns"]): number {
    return checkIns.reduce((total: number, checkIn) => {
      if (checkIn.out.time) {
        // Calculate duration only for completed check-in/out pairs
        return (
          total +
          (checkIn.out.time.toMillis() - checkIn.in.time.toMillis()) / 60000
        );
      }
      return total;
    }, 0);
  }
</script>

<Card.Root class={`mx-auto w-full ${$userData?.isCheckedIn ? "" : "bg-muted"}`}>
  <Card.Header>
    <Card.Title class="text-3xl">
      You are checked {$userData?.isCheckedIn ? "in" : "out"}</Card.Title
    >
    <Card.Description class="text-md">Check in/out from here</Card.Description>
  </Card.Header>
  <Card.Content>
    <CheckInTimer userData={$userData} />
  </Card.Content>
  <Card.Footer>
    <!-- Update the Button to show loading state -->
    <Button on:click={checkInOut} class="w-full" disabled={isLoading}>
      {#if isLoading}
        <Loader class="mr-2 h-4 w-4 animate-spin" />
        {$userData?.isCheckedIn ? "Checking out..." : "Checking in..."}
      {:else}
        <Check class="mr-2 h-4 w-4" />
        Check {$userData?.isCheckedIn ? "out" : "in"}
      {/if}
    </Button>
    <form method="POST" action="/staff/shifts" use:enhance>
      <input type="hidden" name="msg" value={"Hey nigga 🍆"} />

      <button>Send</button>
      <Button class="w-full" variant="secondary">Send Notification</Button>
    </form>
  </Card.Footer>
</Card.Root>
