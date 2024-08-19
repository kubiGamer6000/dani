import { n as notifUser } from "../../../chunks/subscriptionDb.js";
import { e as error } from "../../../chunks/index.js";
const actions = {
  testNotification: async ({ locals }) => {
    const username = locals.uid;
    if (!username) {
      throw error(400, "Unauthorized");
    }
    notifUser(username, "This is a test notification");
    return { status: "success" };
  }
};
export {
  actions
};
