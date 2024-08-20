import type { Timestamp } from "firebase-admin/firestore";

import type { UserData } from "$lib/types/user";

export interface CheckIn {
  id: string;
  userId: string;
  timestamp: Timestamp;
  type: "in" | "out";
  location: {
    latitude: number;
    longitude: number;
  };
  shiftId: string;
}

export interface CheckInTimerData {
  isCheckedIn: boolean;
  lastCheckIn: string | null;
  lastCheckInTimestamp: Timestamp | null;
}

export type CheckInTimerProps = UserData | CheckInTimerData | null;
