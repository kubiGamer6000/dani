// src/lib/types.ts
import type { Timestamp } from "firebase/firestore";
import type { UserData } from "$lib/types/user";

export interface User extends UserData {
  id: string;
}

export interface Rota {
  id: string;
  week_start_date: Timestamp;
  week_end_date: Timestamp;
  total_hours: Record<string, number>;
}

export interface RotaShift {
  id: string;
  rota_id: string;
  user_id: string;
  day: string;
  start_time: Timestamp | Date;
  end_time: Timestamp | Date;
}

export type EditableShift = Omit<RotaShift, "id" | "rota_id"> & {
  id?: string;
  rota_id?: string;
  start_time: Date | Timestamp;
  end_time: Date | Timestamp;
};
