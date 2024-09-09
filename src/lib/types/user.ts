import type { Timestamp } from "firebase-admin/firestore";

export interface UserData {
  id?: string;
  name: string;
  email: string;
  role: string;
  isCheckedIn: boolean;
  lastShift: string | null;
  lastCheckInTimestamp: Timestamp | null;
}
