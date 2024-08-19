import { a as adminAuth } from "./admin.js";
const handle = async ({ event, resolve }) => {
  const sessionCookie = event.cookies.get("__session");
  console.log("session cookie: ", sessionCookie);
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    event.locals.uid = decodedClaims.uid;
    console.log("found user id: ", decodedClaims.uid);
  } catch (e) {
    console.log(e);
    event.locals.uid = null;
    return resolve(event);
  }
  return resolve(event);
};
export {
  handle
};
