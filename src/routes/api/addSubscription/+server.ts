import { addUserDevice } from "$lib/server/db/subscriptionDb";
import type { UserDevice } from "$lib/types/userDevices";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ locals, request }) => {
  const userId = locals?.uid;

  // Check if the user is authenticated
  if (!userId) {
    throw error(401, "Unauthorized");
  }

  let data;
  try {
    // Parse the request body
    data = await request.json();
  } catch (e) {
    throw error(400, "Invalid JSON in request body");
  }

  // Validate the presence of subscription data
  if (!data.subscription) {
    throw error(400, "Bad Request: Missing subscription data");
  }

  try {
    // Add the user's device to the database
    await addUserDevice(userId, data.subscription);
  } catch (e) {
    throw error(500, "Internal Server Error: Failed to add user device");
  }

  // Return a success response
  return json({ success: true });
}) satisfies RequestHandler;
