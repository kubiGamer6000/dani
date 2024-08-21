import { notifUser } from "$lib/server/db/subscriptionDb";
import { error, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  testNotification: async ({ locals }) => {
    const userId = locals.uid;

    if (!userId) {
      throw error(400, "Unauthorized");
    }

    console.log("Calling notifUser(", userId, ")");

    await notifUser(userId, "Test notification");

    return { status: "success" };
  },
};
