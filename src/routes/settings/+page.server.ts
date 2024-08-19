import { notifUser } from "$lib/server/db/subscriptionDb";
import { error, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  testNotification: async ({ locals }) => {
    const username = locals.uid;

    if (!username) {
      throw error(400, "Unauthorized");
    }

    notifUser(username, "This is a test notification");

    return { status: "success" };
  },
};
