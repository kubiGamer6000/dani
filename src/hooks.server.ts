import { adminAuth } from "$lib/server/admin";
import { redirect, type Handle } from "@sveltejs/kit";

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
      "[handle() at hooks.server.ts] no cookie found. Setting userId to null"
    );
    event.locals.uid = null;
  }

  if (
    event.url.pathname.startsWith("/admin") ||
    event.url.pathname.startsWith("/staff")
  ) {
    if (event.locals.uid === null) {
      console.log(
        "[handle() at hooks.server.ts] User not found. Redirecting to /login"
      );
      throw redirect(303, "/login");
    }
  }
  return resolve(event);
}) satisfies Handle;
