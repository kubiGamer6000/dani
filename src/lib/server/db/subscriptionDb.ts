import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } from "$env/static/private";
import { db } from "$lib/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import webpush, { type PushSubscription } from "web-push";

initWebPush();

function initWebPush() {
  webpush.setVapidDetails(
    "mailto:webpush@hartenfeller.dev",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

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
    const msg = `Could not send notification: ${err}`;
    console.error(msg);
    return {
      ok: false,
      status: undefined,
      body: msg,
    };
  }
}

async function deleteIfExpired(username: string, deviceId: string) {
  const userRef = doc(db, "users", username);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    const userDevices = userData.userDevices || [];
    const updatedDevices = userDevices.filter(
      (device: any) => device.deviceId !== deviceId
    );

    await updateDoc(userRef, { userDevices: updatedDevices });
  }
}

async function sendNotificationToDevices(
  devices: SubDevice[],
  payload: string
) {
  for (const device of devices) {
    const subscription = JSON.parse(device.subscription);
    const res = await sendNotification(subscription, payload);

    if (!res.ok) {
      console.error(
        `Failed to send notification to device ${device.deviceId}: ${
          res.body
        } (${res.status}).
${JSON.stringify(res)}`
      );
    }

    // Log notification
    await addDoc(collection(db, "notif_log"), {
      device_id: device.deviceId,
      payload,
      http_status_response: res.status,
      success: res.ok,
      error_message: res.body,
      created_at: Timestamp.now(),
    });

    // Remove expired subscription
    if (res.status === 410) {
      await deleteIfExpired(device.username, device.deviceId);
    } else if (!res.ok) {
      // Check last 3 notifications and delete if all failed
      const q = query(
        collection(db, "notif_log"),
        where("device_id", "==", device.deviceId),
        where("success", "==", false)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size >= 3) {
        await deleteIfExpired(device.username, device.deviceId);
      }
    }
  }
}

export async function addUserDevice(
  username: string,
  subscription: PushSubscription
) {
  const userRef = doc(db, "users", username);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      username,
      createdAt: Timestamp.now(),
      userDevices: [],
    });
  }

  const deviceId = Math.random().toString(36).substring(2, 15);
  await updateDoc(userRef, {
    userDevices: arrayUnion({
      deviceId,
      subscription: JSON.stringify(subscription),
    }),
  });
}

export async function addUserToChannel(username: string, channelId: string) {
  const channelRef = doc(db, "notif_channels", channelId);
  const channelDoc = await getDoc(channelRef);

  if (!channelDoc.exists()) {
    await setDoc(channelRef, { createdAt: Timestamp.now(), users: [] });
  }

  await updateDoc(channelRef, { users: arrayUnion(username) });
}

export async function notifUser(username: string, payload: string) {
  const userRef = doc(db, "users", username);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    const devices = userData.userDevices.map((device: any) => ({
      ...device,
      username,
    }));
    await sendNotificationToDevices(devices, payload);
  }
}

export async function notifChannel(channelId: string, payload: string) {
  const channelRef = doc(db, "notif_channels", channelId);
  const channelDoc = await getDoc(channelRef);

  if (channelDoc.exists()) {
    const channelData = channelDoc.data();
    const users = channelData.users || [];

    const devices: SubDevice[] = [];
    for (const username of users) {
      const userRef = doc(db, "users", username);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        devices.push(
          ...userData.userDevices.map((device: any) => ({
            ...device,
            username,
          }))
        );
      }
    }

    await sendNotificationToDevices(devices, payload);
  }
}

type SubDevice = {
  deviceId: string;
  subscription: string;
  username: string;
};
