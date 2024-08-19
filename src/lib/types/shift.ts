import type { Timestamp } from "firebase/firestore";

export interface Shift {
  userId: string;
  date: string; // YYYY-MM-DD format
  checkIns: {
    in: {
      id: string;
      time: Timestamp;
    };
    out: {
      id: string | null;
      time: Timestamp | null;
    };
  }[];
  isActive: boolean;
  totalDuration: number; // in minutes, updated when shift ends or on each check-out
}
