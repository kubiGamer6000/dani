import { notifUser, notifyAllUsers } from "$lib/server/db/subscriptionDb";
import { error, redirect, fail } from "@sveltejs/kit";
import { adminDB, adminAuth } from "$lib/server/admin";
import type { PageServerLoad, Actions } from "./$types";

import type { NotificationPayload } from "$lib/types/notifPayload";

export const load: PageServerLoad = async ({ locals, params }) => {
  const uid = locals.uid;

  if (!uid) {
    throw redirect(301, "/login?redirectTo=/staff/shifts");
  }
};

export const actions = {
  default: async ({ locals, request }) => {
    const formData = await request.formData();

    if (!locals.uid) {
      throw redirect(301, "/login?redirectTo=/staff/shifts");
    }

    const userDoc = await adminDB.collection("users").doc(locals.uid).get();

    const userData = userDoc.data();

    const isCheckedIn = formData.get("isCheckedIn") === "true";

    const statusString = !isCheckedIn ? "in" : "out";

    const notification: NotificationPayload = {
      title: `New check-${statusString}`,
      body: `${userData?.name} checked ${statusString}`,
    };

    try {
      await notifyAllUsers(notification.body);

      return { status: "success" };
    } catch (error) {
      console.error(error);
      return { status: "error", message: "notifyAllUsers failed" };
    }
  },
} satisfies Actions;
