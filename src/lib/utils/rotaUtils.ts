// src/lib/utils.ts
import { Timestamp } from "firebase/firestore";
import type { EditableShift } from "$lib/types/rotaTypes";

export function getStartOfWeek(date: Date, startDay: number = 1): Date {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const day = d.getUTCDay();
  const diff =
    d.getUTCDate() - day + (day < startDay ? startDay - 7 : startDay);

  d.setUTCDate(diff);
  return d;
}

console.log(getStartOfWeek(new Date()));

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function parseShiftTime(timeStr: string): Date | null {
  const now = new Date();
  let hours: number;
  let minutes = 0;

  if (timeStr.includes(":")) {
    const [hoursStr, minutesStr] = timeStr.split(":");
    hours = parseInt(hoursStr, 10);
    minutes = parseInt(minutesStr, 10);
  } else {
    hours = parseInt(timeStr, 10);
  }

  if (
    isNaN(hours) ||
    hours < 0 ||
    hours > 23 ||
    isNaN(minutes) ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  now.setHours(hours, minutes, 0, 0);
  return now;
}

export function dateToTimestamp(date: Date | Timestamp): Timestamp {
  return date instanceof Date ? Timestamp.fromDate(date) : date;
}

export function timestampToDate(timestamp: Timestamp | Date): Date {
  return timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
}

export function formatShiftTime(date: Date | Timestamp): string {
  const d = date instanceof Date ? date : new Date(date.seconds * 1000);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export function calculateTotalHours(shifts: EditableShift[]): number {
  return shifts.reduce((total, shift) => {
    const start =
      shift.start_time instanceof Date
        ? shift.start_time
        : new Date(shift.start_time.seconds * 1000);
    const end =
      shift.end_time instanceof Date
        ? shift.end_time
        : new Date(shift.end_time.seconds * 1000);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return total + duration;
  }, 0);
}
