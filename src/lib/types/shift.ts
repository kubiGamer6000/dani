import type { Timestamp } from "firebase-admin/firestore";

export interface Shift {
  id?: string;
  checkIns: string[];
  rotaDuration: number | null; // in seconds
  isActive: boolean;
  checkInDuration: number | null; // in seconds
  date: Timestamp;
}
