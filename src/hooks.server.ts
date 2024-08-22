import { adminAuth } from "$lib/server/admin";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
  const sessionCookie = event.cookies.get("__session");

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);
    event.locals.uid = decodedClaims.uid;
  } catch (e) {
    event.locals.uid = null;
  }

  console.log("Hook function running...");

  if (
    event.url.pathname.startsWith("/staff") ||
    event.url.pathname.startsWith("/admin")
  ) {
    console.log("Protected route! Checking auth...");
    if (event.locals.uid === null) {
      const fromUrl = event.url.pathname + event.url.search;
      console.log("User is not logged in. Redirecting to login...");
      throw redirect(302, `/login?redirectTo=${fromUrl}`);
    }

    // if (
    //   event.url.pathname.startsWith("/admin") &&
    //   event.locals.role !== "admin"
    // ) {
    //   console.log("user role: ", event.locals.role);
    //   console.log("User is not an admin. Redirecting to home...");
    //   throw redirect(302, "/");
    // }
  }

  return resolve(event);
}) satisfies Handle;
