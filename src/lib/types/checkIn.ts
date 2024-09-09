import type { Timestamp as AdminTimestamp } from "firebase-admin/firestore";
import type { Timestamp } from "firebase/firestore";

import type { UserData } from "$lib/types/user";
import type { GeoPoint } from "firebase/firestore";
import type { GeoPoint as AdminGeoPoint } from "firebase-admin/firestore";

export interface CheckIn {
  start: {
    location: GeoPoint | AdminGeoPoint;
    timestamp: Timestamp | AdminTimestamp;
  };
  end: {
    location: GeoPoint | AdminGeoPoint | null;
    timestamp: Timestamp | AdminTimestamp | null;
  };
  duration: number | null;
}

export interface CheckInTimerData {
  isCheckedIn: boolean;
  lastShift: string;
}

export type CheckInTimerProps = UserData | CheckInTimerData | null;
