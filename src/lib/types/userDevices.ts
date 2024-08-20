import type { PushSubscription } from "web-push";

export interface UserDevice {
  endpoint: string;
  subscription: PushSubscription;
  userId: string;
}
