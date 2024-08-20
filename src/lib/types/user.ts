import type { Timestamp } from "firebase-admin/firestore";

export interface UserData {
  name: string;
  email: string;
  role: string;
  isCheckedIn: boolean;
  lastCheckIn: string | null;
  lastCheckInTimestamp: Timestamp | null;
}
