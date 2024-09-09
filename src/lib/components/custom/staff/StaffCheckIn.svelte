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
  import * as Alert from "$lib/components/ui/alert";
  import { Button } from "$lib/components/ui/button/index.js";

  import dayjs from "dayjs";

  import Check from "lucide-svelte/icons/check";
  import Loader from "lucide-svelte/icons/loader"; // Import loading icon
  import TriangleAlert from "lucide-svelte/icons/triangle-alert";

  import CheckInTimer from "$lib/components/custom/CheckInTimer.svelte";

  import { getCurrentPosition } from "$lib/utils/getUserGeolocation";

  import { enhance } from "$app/forms";

  import type { Shift } from "$lib/types/shift";
  import type { CheckIn } from "$lib/types/checkIn";
  import type { UserData } from "$lib/types/user";
  import type { SubmitFunction } from "@sveltejs/kit";

  // Add a loading state

  let isLoading = false;
  let loadingMsg = "";

  let errorMsg = "";

  const handleEnhance: SubmitFunction = async ({
    formElement,
    formData,
    action,
    cancel,
  }) => {
    isLoading = true;

    try {
      await checkInOut();
    } catch (error: any) {
      errorMsg = error?.message || "Check in/out error at handleEnhance()";
      console.error("Failed to check-in/out:", error);
    }

    return async ({ result, update }) => {
      loadingMsg = "";
      isLoading = false;
      if (result.type !== "success") {
        // Handle error (e.g., show error message to user)
        errorMsg = "notification error! tell Veli";
      }
      await update();
    };
  };

  async function checkInOut() {
    // Exit if user data is not available
    if (!$userData || !$user) {
      alert("User data not available. Please try logging in again.");
      return;
    }

    try {
      const batch = writeBatch(db);

      // Get the user's current location coordinates
      loadingMsg = "Getting location...";
      const position = await getCurrentPosition();

      // Reference to the user document and new check-in document
      loadingMsg = "Accessing database...";
      const userRef = doc(db, "users", $user.uid);

      // Create timestamps and date string
      const now = new Date();
      const clientTimestamp = Timestamp.fromDate(now);
      const today = dayjs(now).format("DD-MM-YYYY");

      const shiftRef = doc(db, "dailyShifts", `${$user.uid}_${today}`);
      const checkInsSubcollectionRef = collection(shiftRef, "checkIns");
      const shiftSnap = await getDoc(shiftRef);
      let shiftData: Shift;

      if (shiftSnap.exists()) {
        // Update existing shift
        shiftData = shiftSnap.data() as Shift;

        // Get the last check-in document ID
        const lastCheckInId = shiftData.checkIns[shiftData.checkIns.length - 1];

        const lastCheckInRef = doc(checkInsSubcollectionRef, lastCheckInId);

        // Reference to the last check-in document
        const lastCheckInDoc = await getDoc(lastCheckInRef);

        if ($userData.isCheckedIn) {
          // Checking out, update the last check-in
          loadingMsg = "Checking out...";
          if (lastCheckInId && lastCheckInDoc.exists()) {
            const lastCheckInData = lastCheckInDoc.data() as CheckIn;

            const checkInDuration =
              clientTimestamp.seconds - lastCheckInData.start.timestamp.seconds;

            // Update only the end value of the last check-in document
            batch.update(lastCheckInRef, {
              "end.location": new GeoPoint(
                position.coords.latitude,
                position.coords.longitude
              ),
              "end.timestamp": clientTimestamp,
              duration: checkInDuration,
            });

            // Update the shift document

            shiftData.isActive = false;

            const newShiftDuration =
              (shiftData.checkInDuration || 0) + checkInDuration;

            shiftData.checkInDuration = newShiftDuration;

            batch.update(shiftRef, {
              isActive: false,
              checkInDuration: newShiftDuration,
            });
          } else {
            errorMsg = "No previous check-in found";
            throw new Error("No previous check-in found");
          }
        } else {
          // Checking in: Create a new check-in document
          loadingMsg = "Checking in...";
          const newCheckInRef = doc(checkInsSubcollectionRef);

          batch.set(newCheckInRef, {
            start: {
              location: new GeoPoint(
                position.coords.latitude,
                position.coords.longitude
              ),
              timestamp: clientTimestamp,
            },
            end: {
              location: null,
              timestamp: null,
            },
            duration: null,
          });

          // Update the checkIns array
          shiftData.checkIns = [...shiftData.checkIns, newCheckInRef.id];

          batch.update(shiftRef, {
            checkIns: shiftData.checkIns,
          });
        }
      } else {
        // No shift document for the day - create a new one
        loadingMsg = "Checking in...";
        // Create a subcollection 'checkIns' within the shiftRef document

        const newCheckInRef = doc(checkInsSubcollectionRef);

        // Prepare data for the new check-in document
        const checkInData: CheckIn = {
          start: {
            location: new GeoPoint(
              position.coords.latitude,
              position.coords.longitude
            ),
            timestamp: clientTimestamp,
          },
          end: {
            location: null,
            timestamp: null,
          },
          duration: 0,
        };

        // Add the new check-in document to the batch
        batch.set(newCheckInRef, checkInData);

        shiftData = {
          date: clientTimestamp,
          checkIns: [newCheckInRef.id],
          isActive: true,
          checkInDuration: null,
          rotaDuration: null,
        };

        batch.set(shiftRef, shiftData);
      }

      // Update user document

      const newUserData: Pick<
        UserData,
        "isCheckedIn" | "lastShift" | "lastCheckInTimestamp"
      > = {
        isCheckedIn: !$userData.isCheckedIn,
        lastShift: shiftRef.id,
        lastCheckInTimestamp: clientTimestamp,
      };

      batch.update(userRef, newUserData);

      // Commit all the batch operations
      await batch.commit();

      console.log(
        `Check-${$userData.isCheckedIn ? "in" : "out"} recorded for ${
          $userData.name
        }`
      );

      loadingMsg = "Sending notification...";
    } catch (error: any) {
      // Log the error and show a user-friendly message
      errorMsg = error?.message || "Check in/out error";
      console.error("Failed to check-in/out:", error);
    }
  }
</script>

<Card.Root
  class={`mx-auto w-full mb-8 ${$userData?.isCheckedIn ? "" : "bg-muted"}`}
>
  <Card.Header>
    <Card.Title class="text-3xl">
      You are checked {$userData?.isCheckedIn ? "in" : "out"}</Card.Title
    >
    <Card.Description class="text-md">Check in/out from here</Card.Description>
  </Card.Header>
  <Card.Content>
    {#if $userData?.isCheckedIn}
      <CheckInTimer userData={$userData} />
    {/if}
  </Card.Content>
  <Card.Footer>
    <form method="post" use:enhance={handleEnhance} class="w-full">
      <input
        type="hidden"
        name="isCheckedIn"
        value={$userData?.isCheckedIn ?? null}
      />
      <Button type="submit" class="w-full md:w-48" disabled={isLoading}>
        {#if isLoading}
          <Loader class="mr-2 h-4 w-4 animate-spin" />
          {loadingMsg || "Loading..."}
        {:else}
          <Check class="mr-2 h-4 w-4" />
          Check {$userData?.isCheckedIn ? "out" : "in"}
        {/if}
      </Button>
    </form>
    {#if errorMsg}
      <Alert.Root variant="destructive" class="mt-4">
        <TriangleAlert class="h-4 w-4" />
        <Alert.Title
          >Error checking {$userData?.isCheckedIn ? "out" : "in"}</Alert.Title
        >
        <Alert.Description>
          {errorMsg}
        </Alert.Description>
      </Alert.Root>
    {/if}
  </Card.Footer>
</Card.Root>
