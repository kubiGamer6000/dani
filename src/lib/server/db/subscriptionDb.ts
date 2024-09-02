import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } from "$env/static/private";
import { db } from "$lib/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
  limit,
  orderBy,
} from "firebase/firestore";
import webpush, { type PushSubscription } from "web-push";
import type { UserDevice } from "$lib/types/userDevices";
import type { NotificationPayload } from "$lib/types/notifPayload";

// Custom logging function
function log(functionName: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${functionName}] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
}

initWebPush();

async function mapUserDevicesWithIds(
  userId: string
): Promise<UserDeviceWithId[]> {
  const userDevicesCollection = query(
    collection(db, "userDevices"),
    where("userId", "==", userId)
  );

  const userDevicesSnapshot = await getDocs(userDevicesCollection);

  const userDevicesWithId: UserDeviceWithId[] = userDevicesSnapshot.docs.map(
    (doc, i) => {
      const data = doc.data() as UserDevice;

      return {
        ...data,
        deviceId: doc.id,
      };
    }
  );

  return userDevicesWithId;
}

function initWebPush() {
  webpush.setVapidDetails(
    "mailto:info@contentcurrency.ai",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

async function sendNotification(
  subscription: PushSubscription,
  payload: string,
  username: string
) {
  log("sendNotification", `Sending notification to ${username}: `, {
    subscription,
    payload,
  });

  try {
    const res = await webpush.sendNotification(subscription, payload);
    log("sendNotification", "Notification sent", {
      statusCode: res.statusCode,
      body: res.body,
    });
    return {
      ok: res.statusCode === 201,
      status: res.statusCode,
      body: res.body,
    };
  } catch (err) {
    log("sendNotification", "Error sending notification", err);
    return {
      ok: false,
      status: undefined,
      body: `Could not send notification: ${err}`,
    };
  }
}

async function deleteIfExpired(deviceId: string) {
  log("deleteIfExpired", `Checking device: ${deviceId}`);

  try {
    const q = query(
      collection(db, "notif_log"),
      where("device_id", "==", deviceId),
      where("success", "==", false),
      orderBy("created_at", "desc"),
      limit(3)
    );
    const last3success = await getDocs(q);

    if (last3success.size >= 3) {
      const deviceRef = doc(db, "userDevices", deviceId);
      await deleteDoc(deviceRef);
      log("deleteIfExpired", `Deleted device: ${deviceId}`);
    } else {
      log(
        "deleteIfExpired",
        `Device ${deviceId} not deleted. Failed notifications: ${last3success.size}`
      );
    }
  } catch (err) {
    log("deleteIfExpired", `Error deleting device: ${deviceId}`, err);
  }
}

async function sendNotificationToDevices(
  devices: UserDeviceWithId[],
  payload: string,
  username: string
) {
  log(
    "sendNotificationToDevices",
    `Starting to send notifications to ${username}'s devices (${devices.length})`
  );

  const notificationPromises = devices.map(async (device) => {
    try {
      log(
        "sendNotificationToDevices",
        `Calling sendNotification on ${username}'s device: ${device.deviceId}`
      );
      const subscription = device.subscription;
      const res = await sendNotification(subscription, payload, username);

      if (!res.ok) {
        log(
          "sendNotificationToDevices",
          `Failed to send notification to ${username}'s device: ${device.deviceId}`,
          res
        );
      }

      if (!res.status) {
        log(
          "sendNotificationToDevices",
          `Response status is undefined for ${username}'s device ${device.deviceId}. Aborting...`
        );
        return;
      }

      await addDoc(collection(db, "notif_log"), {
        device_id: device.deviceId,
        payload,
        http_status_response: res?.status,
        success: res.ok,
        error_message: res.body,
        created_at: Timestamp.now(),
      });
      log(
        "sendNotificationToDevices",
        `Logged notification for device ${device.deviceId}`
      );

      if (res.status === 410) {
        log(
          "sendNotificationToDevices",
          `Subscription expired for device ${device.deviceId}. Deleting...`
        );
        await deleteIfExpired(device.deviceId);
      } else if (!res.ok) {
        log(
          "sendNotificationToDevices",
          `Notification failed for device ${device.deviceId}. Checking for expiration...`
        );
        await deleteIfExpired(device.deviceId);
      }
    } catch (error) {
      log(
        "sendNotificationToDevices",
        `Error processing device ${device.deviceId}`,
        error
      );
    }
  });

  await Promise.all(notificationPromises);
  log(
    "sendNotificationToDevices",
    "Finished sending notifications to all devices"
  );
}

export async function addUserDevice(
  userId: string,
  subscription: PushSubscription
) {
  log("addUserDevice", `Adding device for user: ${userId}`);

  const devicesRef = collection(db, "userDevices");
  const q = query(devicesRef, where("endpoint", "==", subscription.endpoint));
  const sameDevice = await getDocs(q);

  if (sameDevice.docs.length != 0) {
    log(
      "addUserDevice",
      "Device with same subscription already exists. Aborting."
    );
    return;
  }

  const deviceData: UserDevice = {
    endpoint: subscription.endpoint,
    subscription: subscription,
    userId,
  };

  await addDoc(devicesRef, deviceData);
  log("addUserDevice", "Device added successfully");
}

export async function addUserToChannel(userId: string, channelId: string) {
  log("addUserToChannel", `Adding user ${userId} to channel ${channelId}`);

  const channelRef = doc(db, "notif_channels", channelId);
  const channelDoc = await getDoc(channelRef);

  if (!channelDoc.exists()) {
    await setDoc(channelRef, { createdAt: Timestamp.now(), users: [] });
    log("addUserToChannel", `Created new channel: ${channelId}`);
  }

  await updateDoc(channelRef, { users: arrayUnion(userId) });
  log("addUserToChannel", `User ${userId} added to channel ${channelId}`);
}

export async function notifUser(
  userId: string,
  payload: string,
  username: string
) {
  log("notifUser", `Notifying user: ${username}`);

  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const devices = await mapUserDevicesWithIds(userId);
    log("notifUser", `${username} has ${devices.length} devices `);

    if (devices.length === 0) {
      log("notifUser", `No devices found for ${devices.length}. Aborting...`);
      return;
    }

    await sendNotificationToDevices(devices, payload, username);
  } else {
    log("notifUser", `Invalid user: ${userId}`);
  }
}

interface UserDeviceWithId extends UserDevice {
  deviceId: string;
}

function notifPayloadToString(input: { title: string; body: string }): string {
  log(
    "notifPayloadToString",
    "Converting notification payload to string",
    input
  );

  const separator = "##";
  const defaultTitle = "Dani's Catering";

  if (input.title && input.title !== defaultTitle) {
    return `${input.title.trim()} ${separator} ${input.body.trim()}`;
  } else {
    return input.body.trim();
  }
}
