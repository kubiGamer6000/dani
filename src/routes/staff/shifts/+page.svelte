<script lang="ts">
  import StaffCheckIn from "$lib/components/custom/staff/StaffCheckIn.svelte";
  import MyCheckIns from "$lib/components/custom/staff/MyCheckIns.svelte";

  /// STAFF CHECK IN LOGIC

  import { enhance } from "$app/forms";

  import type { SubmitFunction } from "./$types";

  import Check from "lucide-svelte/icons/check";
  import Loader from "lucide-svelte/icons/loader"; // Import loading icon
  import TriangleAlert from "lucide-svelte/icons/triangle-alert";

  import { userData } from "$lib/firebase";

  import * as Card from "$lib/components/ui/card/index";
  import { Button } from "$lib/components/ui/button/index";
  import * as Alert from "$lib/components/ui/alert";

  import CheckInTimer from "$lib/components/custom/CheckInTimer.svelte";

  import { getCurrentPosition } from "$lib/utils/getUserGeolocation";
  import { page } from "$app/stores";
  // Add a loading state
  let isLoading = false;

  let errorMsg = "";

  const handleEnhance: SubmitFunction = async ({
    formElement,
    formData,
    action,
    cancel,
  }) => {
    isLoading = true;

    const getLocationAndSubmit = async () => {
      try {
        const { coords } = await getCurrentPosition();
        formData.append("latitude", coords.latitude.toString());
        formData.append("longitude", coords.longitude.toString());
      } catch (error) {
        console.error("Error getting location:", error);

        errorMsg = "Error getting location. Have you allowed location access?";
        // Handle error (e.g., show error message to user)
        cancel();

        isLoading = false;
      }
    };

    await getLocationAndSubmit();

    return async ({ result, update }) => {
      isLoading = false;
      if (result.type === "success") {
        // Handle successful submission (e.g., show a success message)
      } else {
        // Handle error (e.g., show error message to user)
        errorMsg = "Server error! Please try again later.";
      }
      await update();
    };
  };
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
    <CheckInTimer userData={$userData} />
  </Card.Content>
  <Card.Footer class="flex flex-col items-start">
    <form method="post" use:enhance={handleEnhance} class="w-full">
      <Button type="submit" class="w-full md:w-48" disabled={isLoading}>
        {#if isLoading}
          <Loader class="mr-2 h-4 w-4 animate-spin" />
          {$userData?.isCheckedIn ? "Checking out..." : "Checking in..."}
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

<MyCheckIns />
