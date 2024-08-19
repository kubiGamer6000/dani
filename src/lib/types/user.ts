import type { Timestamp } from "firebase/firestore";

export interface UserData {
  name: string;
  email: string;
  role: string;
  isCheckedIn: boolean;
  lastCheckIn: string;
  lastCheckInTimestamp: Timestamp;
  userDevices: [
    {
      deviceId: string;
      subscription: string;
    }
  ];
}
