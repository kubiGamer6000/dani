import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { F as FB_PROJECT_ID, b as FB_CLIENT_EMAIL, c as FB_PRIVATE_KEY } from "./private.js";
import pkg from "firebase-admin";
try {
  pkg.initializeApp({
    credential: pkg.credential.cert({
      projectId: FB_PROJECT_ID,
      clientEmail: FB_CLIENT_EMAIL,
      privateKey: FB_PRIVATE_KEY
    })
  });
} catch (err) {
  if (!/already exists/u.test(err.message)) {
    console.error("Firebase admin initialization error", err.stack);
  }
}
getFirestore();
const adminAuth = getAuth();
export {
  adminAuth as a
};
