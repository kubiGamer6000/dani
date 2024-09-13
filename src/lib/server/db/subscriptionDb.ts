import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } from "$env/static/private";
import { adminDB } from "../admin";
import webpush, { type PushSubscription } from "web-push";
import type { UserDevice } from "$lib/types/userDevices";
import type { NotificationPayload } from "$lib/types/notifPayload";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

// Initialize web push with VAPID keys
initWebPush();

// Fetch user devices with their IDs
async function mapUserDevicesWithIds(
  userId: string
): Promise<UserDeviceWithId[]> {
  const userDevicesCollection = adminDB
    .collection("users")
    .doc(userId)
    .collection("devices");
  const userDevicesSnapshot = await userDevicesCollection.get();

  return userDevicesSnapshot.docs.map((doc) => ({
    ...(doc.data() as UserDevice),
    deviceId: doc.id,
  }));
}

// Initialize web push with VAPID keys
function initWebPush() {
  webpush.setVapidDetails(
    "mailto:info@contentcurrency.ai",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

// Add a new error logging function
function logError(message: string, error: any) {
  console.error(`[ERROR] ${message}:`, error);
}

// Send a notification to a specific subscription
async function sendNotification(
  subscription: PushSubscription,
  payload: string
) {
  try {
    const res = await webpush.sendNotification(subscription, payload);
    return {
      ok: res.statusCode === 201,
      status: res.statusCode,
      body: res.body,
    };
  } catch (err) {
    logError("Failed to send notification", err);
    return {
      ok: false,
      status: undefined,
      body: `Could not send notification: ${err}`,
    };
  }
}

// Delete a device if it has failed to receive notifications multiple times
async function deleteIfExpired(deviceId: string) {
  try {
    const q = adminDB
      .collection("notif_log")
      .where("device_id", "==", deviceId)
      .where("success", "==", false)
      .orderBy("created_at", "desc")
      .limit(3);
    const last3success = await q.get();

    if (last3success.size >= 3) {
      const deviceRef = adminDB.collection("userDevices").doc(deviceId);
      await deviceRef.delete();
    }
  } catch (err) {
    logError(`Failed to delete expired device ${deviceId}`, err);
  }
}

// Send notifications to multiple devices
async function sendNotificationToDevices(
  devices: UserDeviceWithId[],
  payload: string
) {
  const notificationPromises = devices.map(async (device) => {
    try {
      const res = await sendNotification(device.subscription, payload);

      // Log the notification attempt
      await adminDB.collection("notif_log").add({
        device_id: device.deviceId,
        payload,
        http_status_response: res?.status,
        success: res.ok,
        error_message: res.body,
        created_at: Timestamp.now(),
      });

      // Check if the device needs to be deleted
      if (res.status === 410 || !res.ok) {
        await deleteIfExpired(device.deviceId);
      }
    } catch (err) {
      logError(
        `Failed to process notification for device ${device.deviceId}`,
        err
      );
    }
  });

  try {
    await Promise.all(notificationPromises);
  } catch (err) {
    logError("Failed to send notifications to devices", err);
  }
}

// Add or update a user's device
export async function addUserDevice(
  userId: string,
  subscription: PushSubscription
) {
  try {
    const userDevicesRef = adminDB
      .collection("users")
      .doc(userId)
      .collection("devices");
    const q = userDevicesRef.where("endpoint", "==", subscription.endpoint);
    const sameDevice = await q.get();

    if (!sameDevice.empty) {
      await sameDevice.docs[0].ref.update({ subscription });
      return;
    }

    const deviceData: UserDevice = {
      userId: userId,
      endpoint: subscription.endpoint,
      subscription: subscription,
    };

    await userDevicesRef.add(deviceData);
  } catch (err) {
    logError(`Failed to add user device for user ${userId}`, err);
  }
}

// TODO: Implement addUserToChannel function
// export async function addUserToChannel(userId: string, channelId: string) {
//   // Implementation here
// }

// Send a notification to a specific user
export async function notifUser(userId: string, payload: string) {
  try {
    const userRef = adminDB.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const devices = await mapUserDevicesWithIds(userId);
      await sendNotificationToDevices(devices, payload);
    } else {
      console.warn(`User ${userId} not found for notification`);
    }
  } catch (err) {
    logError(`Failed to notify user ${userId}`, err);
  }
}

// Interface for a user device with its ID
interface UserDeviceWithId extends UserDevice {
  deviceId: string;
}

// Send a notification to all users
export async function notifyAllUsers(payload: string) {
  try {
    const usersRef = adminDB.collection("users");
    const userDocs = await usersRef.get();

    for (const userDoc of userDocs.docs) {
      const userId = userDoc.id;
      try {
        const devices = await mapUserDevicesWithIds(userId);
        await sendNotificationToDevices(devices, payload);
      } catch (err) {
        logError(`Failed to notify user ${userId}`, err);
      }
    }
  } catch (err) {
    logError("Failed to notify all users", err);
  }
}

// TODO: Implement a function to handle notification preferences
// TODO: Add error handling and retries for failed notifications
// TODO: Implement a rate limiting mechanism to prevent spam
// TODO: Add a function to clean up old notification logs
