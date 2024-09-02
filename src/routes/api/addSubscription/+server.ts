import { addUserDevice } from "$lib/server/db/subscriptionDb";
import type { UserDevice } from "$lib/types/userDevices";
import { error, json, type RequestHandler } from "@sveltejs/kit";

// Custom logging function
function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [addSubscription] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
}

export const POST = (async ({ locals, request }) => {
  const userId = locals?.uid;

  log(`Request received for user: ${userId || "Unknown"}`);

  if (!userId) {
    log("No userId in locals. User might not be signed in.");
    throw error(401, "Unauthorized");
  }

  let data;
  try {
    data = await request.json();
    log("Request data received", data);
  } catch (e) {
    log("Error parsing request JSON", e);
    throw error(400, "Invalid JSON in request body");
  }

  if (!data.subscription) {
    log("Missing subscription in request data", data);
    throw error(400, "Bad Request: Missing subscription data");
  }

  log(`Adding device for user: ${userId}`, data.subscription);

  try {
    await addUserDevice(userId, data.subscription);
    log(`Successfully added device for user: ${userId}`);
  } catch (e) {
    log(`Error adding device for user: ${userId}`, e);
    throw error(500, "Internal Server Error: Failed to add user device");
  }

  log(`Request completed successfully for user: ${userId}`);
  return json({ success: true });
}) satisfies RequestHandler;
