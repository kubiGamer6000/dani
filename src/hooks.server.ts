import { adminAuth } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
  const sessionCookie = event.cookies.get("__session");
  if (sessionCookie) {
    console.log("[handle() at hooks.server.ts] Found session cookie");
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);
    event.locals.uid = decodedClaims.uid;
    console.log(
      "[handle() at hooks.server.ts] Got userId from cookie: ",
      decodedClaims.uid
    );
  } catch (e) {
    console.log(
      "[handle() at hooks.server.ts] verifySessionCookie failed. User not signed in?"
    );
    event.locals.uid = null;
    return resolve(event);
  }

  return resolve(event);
}) satisfies Handle;
