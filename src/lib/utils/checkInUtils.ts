import type { Timestamp } from "firebase/firestore";
import type { CheckIn, StaffMember } from "$lib/types/staffAdminFormat";

export function calculateHours(checkIns: CheckIn[]): number {
  let totalMinutes = 0;
  let lastInTime: Timestamp | null = null;

  for (const checkIn of checkIns) {
    if (checkIn.type === "in") {
      lastInTime = checkIn.timestamp;
    } else if (checkIn.type === "out" && lastInTime) {
      totalMinutes +=
        (checkIn.timestamp.toMillis() - lastInTime.toMillis()) / 60000;
      lastInTime = null;
    }
  }

  return Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place
}

export function sortStaffMembers(staffMembers: StaffMember[]): StaffMember[] {
  return staffMembers.sort((a, b) => {
    if (a.isCheckedIn && !b.isCheckedIn) return -1;
    if (!a.isCheckedIn && b.isCheckedIn) return 1;
    if (a.isCheckedIn && b.isCheckedIn) {
      return (
        (b.lastCheckInTimestamp?.toMillis() || 0) -
        (a.lastCheckInTimestamp?.toMillis() || 0)
      );
    }
    return 0;
  });
}
