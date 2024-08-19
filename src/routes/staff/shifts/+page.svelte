<script lang="ts">
  import StaffCheckIn from "$lib/components/custom/staff/StaffCheckIn.svelte";
  import MyCheckIns from "$lib/components/custom/staff/MyCheckIns.svelte";
</script>

<main
  class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen items-center justify-center"
>
  <StaffCheckIn />
  <MyCheckIns />
</main>
