import { notifUser } from "$lib/server/db/subscriptionDb";
import { error, redirect, fail } from "@sveltejs/kit";
import { adminDB, adminAuth } from "$lib/server/admin";
import type { PageServerLoad, Actions } from "./$types";

import dayjs from "dayjs";
import type { CheckIn } from "$lib/types/checkIn";
import type { Shift } from "$lib/types/shift";
import { GeoPoint, Timestamp } from "firebase-admin/firestore";
import { get } from "svelte/store";
import type { NotificationPayload } from "$lib/types/notifPayload";

export const load: PageServerLoad = async ({ locals, params }) => {
  const uid = locals.uid;

  if (!uid) {
    throw redirect(301, "/login");
  }
};

export const actions = {
  default: async ({ locals, request }) => {
    const formData = await request.formData();

    // checkIns data //

    if (!locals?.uid) {
      throw error(400, "Unauthorized request");
    }
    const batch = adminDB.batch();

    const userRef = adminDB.collection("users").doc(locals?.uid);
    console.log("Getting user doc for:", locals.uid);
    const userDoc = await userRef.get();
    console.log("Got user doc:", userDoc.id);

    if (userDoc.data() === undefined) {
      throw error(404, "User not found");
    }
    let newCheckInStatus = !userDoc.data()?.isCheckedIn;

    // Record the time
    const now = new Date();
    const timestamp = Timestamp.fromDate(now);
    const today = dayjs(now).format("YYYY-MM-DD");

    // Parse coordinates

    const checkInRef = adminDB.collection("checkIns").doc();

    const checkInData: CheckIn = {
      id: checkInRef.id,
      userId: locals.uid,
      timestamp,
      type: newCheckInStatus ? "in" : "out",
      location: getGeoPointFromFormData(formData),
      shiftId: "",
    };

    // shifts data //

    // Get or create today's shift
    const shiftRef = adminDB.collection("shifts").doc(`${locals.uid}_${today}`);

    const shiftDoc = await shiftRef.get();

    let shiftData: Shift;
    if (shiftDoc.exists) {
      shiftData = shiftDoc.data() as Shift;
      checkInData.shiftId = shiftRef.id;

      let updatedCheckIns = [...shiftData.checkIns];

      if (newCheckInStatus) {
        // Checking in... Add a new entry
        updatedCheckIns.push({
          in: {
            id: checkInData.id,
            time: checkInData.timestamp,
          },
          out: {
            id: null,
            time: null,
          },
        });
      } else {
        // Checking out... Update the last entry
        const lastIndex = updatedCheckIns.length - 1;
        if (lastIndex >= 0 && updatedCheckIns[lastIndex].out.time === null) {
          updatedCheckIns[lastIndex].out = {
            id: checkInData.id,
            time: timestamp,
          };
        } else {
          throw error(400, "Tried to check out without an open check-in");
        }
      }

      const totalDuration = calculateTotalDuration(updatedCheckIns);

      // Update the shift doc
      batch.update(shiftRef, {
        checkIns: updatedCheckIns,
        isActive: newCheckInStatus,
        totalDuration,
      });
    } else {
      // Create a new shift
      shiftData = {
        userId: locals.uid,
        date: today,
        checkIns: [
          {
            in: {
              id: checkInRef.id,
              time: timestamp,
            },
            out: {
              id: null,
              time: null,
            },
          },
        ],
        isActive: true,
        totalDuration: 0,
      };
      checkInData.shiftId = shiftRef.id;

      batch.set(shiftRef, shiftData);
    }

    // Add the check-in doc
    batch.set(checkInRef, checkInData);

    // Update the user doc
    batch.update(userRef, {
      isCheckedIn: newCheckInStatus,
      lastCheckIn: checkInData.id,
      lastCheckInTimestamp: timestamp,
    });

    // Commit all the batch operations
    await batch.commit();
    console.log("Check-in/out recorded:", checkInRef.id);

    const statusString = newCheckInStatus ? "in" : "out";

    const notification: NotificationPayload = {
      title: `New check-${statusString}`,
      body: `${userDoc.data()?.name} checked ${statusString}`,
    };

    const usersRef = adminDB.collection("users");
    const usersSnapshot = await usersRef.get();

    await notifUser("x4lJxRqLfbXltETxpv5vHmGK0vZ2", notification.body, "nigga");

    return { status: "success" };

    //
  },
} satisfies Actions;

// UTILS

/**
 * Calculates the total duration of a shift in minutes.
 * @param checkIns - Array of check-in/out pairs for a shift
 * @returns Total duration in minutes
 */
function calculateTotalDuration(checkIns: Shift["checkIns"]): number {
  return checkIns.reduce((total: number, checkIn) => {
    if (checkIn.out.time) {
      // Calculate duration only for completed check-in/out pairs
      return (
        total +
        (checkIn.out.time.toMillis() - checkIn.in.time.toMillis()) / 60000
      );
    }
    return total;
  }, 0);
}

function getGeoPointFromFormData(formData: FormData): GeoPoint {
  const latitude = formData.get("latitude");
  const longitude = formData.get("longitude");

  if (latitude === null || longitude === null) {
    throw error(400, "Missing latitude or longitude");
  }
  const lat = parseFloat(latitude.toString());
  const long = parseFloat(longitude.toString());

  if (isNaN(lat) || isNaN(long)) {
    throw new Error("Invalid latitude or longitude format");
  }

  return new GeoPoint(lat, long);
}
