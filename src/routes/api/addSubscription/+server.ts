import { addUserDevice } from "$lib/server/db/subscriptionDb";
import type { UserDevice } from "$lib/types/userDevices";

import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ locals, request }) => {
  const userId = locals.uid;

  console.log("UserID recieved in addSubscription: ", userId);

  if (!userId) {
    console.log(
      "[addSubscription/+server.ts] No userId in locals. Is user signed in?"
    );
    throw error(401, "Unauthorized");
  }

  const data = await request.json();

  if (!data.subscription) {
    console.log("[addSubscription/+server.ts] ", data);
    throw error(400, "Bad Request");
  }

  console.log(
    "[addSubscription/+server.ts] Calling addUserDevice with user's (",
    userId,
    ") device: ",
    data.subscription
  );
  await addUserDevice(userId, data.subscription);

  return json({ success: true });
}) satisfies RequestHandler;
