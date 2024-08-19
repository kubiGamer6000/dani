import { V as VAPID_PUBLIC_KEY, a as VAPID_PRIVATE_KEY } from "./private.js";
import { d as db } from "./firebase.js";
import { doc, getDoc, setDoc, Timestamp, updateDoc, arrayUnion, addDoc, collection, query, where, getDocs } from "firebase/firestore";
import webpush from "web-push";
initWebPush();
function initWebPush() {
  webpush.setVapidDetails(
    "mailto:webpush@hartenfeller.dev",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}
async function sendNotification(subscription, payload) {
  try {
    const res = await webpush.sendNotification(subscription, payload);
    return {
      ok: res.statusCode === 201,
      status: res.statusCode,
      body: res.body
    };
  } catch (err) {
    const msg = `Could not send notification: ${err}`;
    console.error(msg);
    return {
      ok: false,
      status: void 0,
      body: msg
    };
  }
}
async function deleteIfExpired(username, deviceId) {
  const userRef = doc(db, "users", username);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const userDevices = userData.userDevices || [];
    const updatedDevices = userDevices.filter(
      (device) => device.deviceId !== deviceId
    );
    await updateDoc(userRef, { userDevices: updatedDevices });
  }
}
async function sendNotificationToDevices(devices, payload) {
  for (const device of devices) {
    const subscription = JSON.parse(device.subscription);
    const res = await sendNotification(subscription, payload);
    if (!res.ok) {
      console.error(
        `Failed to send notification to device ${device.deviceId}: ${res.body} (${res.status}).
${JSON.stringify(res)}`
      );
    }
    await addDoc(collection(db, "notif_log"), {
      device_id: device.deviceId,
      payload,
      http_status_response: res.status,
      success: res.ok,
      error_message: res.body,
      created_at: Timestamp.now()
    });
    if (res.status === 410) {
      await deleteIfExpired(device.username, device.deviceId);
    } else if (!res.ok) {
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
async function addUserDevice(username, subscription) {
  const userRef = doc(db, "users", username);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      username,
      createdAt: Timestamp.now(),
      userDevices: []
    });
  }
  const deviceId = Math.random().toString(36).substring(2, 15);
  await updateDoc(userRef, {
    userDevices: arrayUnion({
      deviceId,
      subscription: JSON.stringify(subscription)
    })
  });
}
async function notifUser(username, payload) {
  const userRef = doc(db, "users", username);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const devices = userData.userDevices.map((device) => ({
      ...device,
      username
    }));
    await sendNotificationToDevices(devices, payload);
  }
}
export {
  addUserDevice as a,
  notifUser as n
};
