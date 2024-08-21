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
} from "firebase/firestore";
import webpush, { type PushSubscription } from "web-push";

import type { UserDevice } from "$lib/types/userDevices";

import type { NotificationPayload } from "$lib/types/notifPayload";

initWebPush();

async function mapUserDevicesWithIds(
  userId: string
): Promise<UserDeviceWithId[]> {
  const userDevicesCollection = query(
    collection(db, "userDevices"),
    where("userId", "==", userId)
  );

  const userDevicesSnapshot = await getDocs(userDevicesCollection);
  console.log(
    "[mapUserDevicesWithIds()] successfully got user devices from query. "
  );

  const userDevicesWithId: UserDeviceWithId[] = userDevicesSnapshot.docs.map(
    (doc, i) => {
      const data = doc.data() as UserDevice;
      console.log("[mapUserDevicesWithIds()] Device (" + i + ") data: ", data);
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
  payload: string
) {
  try {
    console.log(
      "[sendNotification()] Sending notification with webpush. Subscription: ",
      subscription
    );
    const res = await webpush.sendNotification(subscription, payload);
    console.log("[sendNotification()] Notification sent. Response: ", res);
    return {
      ok: res.statusCode === 201,
      status: res.statusCode,
      body: res.body,
    };
  } catch (err) {
    const msg = `[sendNotification()] Could not send notification: ${err}`;
    console.error(msg);
    return {
      ok: false,
      status: undefined,
      body: msg,
    };
  }
}

async function deleteIfExpired(deviceId: string) {
  try {
    const deviceRef = doc(db, "userDevices", deviceId);
    await deleteDoc(deviceRef);
    console.log("[deleteIfExpired()] Deleted device: ", deviceId);
  } catch (err: any) {
    console.log(`[deleteIfExpired()] Could not delete device: ${err}`);
  }
}

async function sendNotificationToDevices(
  devices: UserDeviceWithId[],
  payload: string
) {
  for (const device of devices) {
    console.log(
      "[sendNotificationToDevices()] Sending notification to device ",
      device.deviceId
    );
    const subscription = device.subscription;
    const res = await sendNotification(subscription, payload);

    if (!res.ok) {
      console.error(
        `[sendNotificationToDevices()] Failed to send notification to device ${
          device.deviceId
        }: ${res.body} (${res.status}).
${JSON.stringify(res)}`
      );
    }

    // Log notification
    if (!res.status) {
      console.log(
        "[sendNotificationToDevices()] Response status is undefined. Aborting..."
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

    // Remove expired subscription
    if (res.status === 410) {
      console.log(
        "[sendNotificationToDevices()] Subscription expired for device [res 410]. Deleting...: ",
        device.deviceId
      );
      await deleteIfExpired(device.deviceId);
    } else if (!res.ok) {
      // Check last 3 notifications and delete if all failed
      const q = query(
        collection(db, "notif_log"),
        where("device_id", "==", device.deviceId),
        where("success", "==", false)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size >= 3) {
        console.log(
          "[sendNotificationToDevices()] Cleanup! Last 3 notifications failed so deleting device: ",
          device.deviceId
        );
        await deleteIfExpired(device.deviceId);
      }
    }
  }
}

export async function addUserDevice(
  userId: string,
  subscription: PushSubscription
) {
  console.log("[addUserDevice()] Adding device for user: ", userId);

  const devicesRef = collection(db, "userDevices");

  const q = query(devicesRef, where("endpoint", "==", subscription.endpoint));

  const sameDevice = await getDocs(q);

  if (sameDevice.docs.length != 0) {
    console.log(
      "[addUserDevice()] Device with same subscription already exists. Aborting.. "
    );
    return;
  }

  const deviceData: UserDevice = {
    endpoint: subscription.endpoint,
    subscription: subscription,
    userId,
  };

  await addDoc(devicesRef, deviceData);
}

export async function addUserToChannel(userId: string, channelId: string) {
  const channelRef = doc(db, "notif_channels", channelId);
  const channelDoc = await getDoc(channelRef);

  if (!channelDoc.exists()) {
    await setDoc(channelRef, { createdAt: Timestamp.now(), users: [] });
  }

  await updateDoc(channelRef, { users: arrayUnion(userId) });
}

export async function notifUser(userId: string, payload: string) {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userId = userDoc.id;

    const devices = await mapUserDevicesWithIds(userId);

    console.log(
      "[notifUser()] Succesfully got user devices. Calling sendNotificationToDevices()"
    );

    await sendNotificationToDevices(devices, payload);
  } else {
    console.log("[notifUser()] Called me with invalid user: ", userId);
  }
}

// export async function notifChannel(channelId: string, payload: string) {
//   const channelRef = doc(db, "notif_channels", channelId);
//   const channelDoc = await getDoc(channelRef);

//   if (channelDoc.exists()) {
//     const channelData = channelDoc.data();
//     const users = channelData.users || [];

//     const devices: SubDevice[] = [];
//     for (const username of users) {
//       const userRef = doc(db, "users", username);
//       const userDoc = await getDoc(userRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         devices.push(
//           ...userData.userDevices.map((device: any) => ({
//             ...device,
//             username,
//           }))
//         );
//       }
//     }

//     await sendNotificationToDevices(devices, payload);
//   }
// }

interface UserDeviceWithId extends UserDevice {
  deviceId: string;
}

function notifPayloadToString(input: { title: string; body: string }): string {
  const separator = "##";
  const defaultTitle = "Dani's Catering";

  if (input.title && input.title !== defaultTitle) {
    return `${input.title.trim()} ${separator} ${input.body.trim()}`;
  } else {
    return input.body.trim();
  }
}
