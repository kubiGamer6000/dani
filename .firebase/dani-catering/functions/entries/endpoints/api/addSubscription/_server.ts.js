import { a as addUserDevice } from "../../../../chunks/subscriptionDb.js";
import { e as error, j as json } from "../../../../chunks/index.js";
const POST = async ({ locals, request }) => {
  const username = locals.uid;
  console.log("UserID recieved in addSubscription: ", username);
  if (!username) {
    console.log("No username passed to addSubscription");
    throw error(401, "Unauthorized");
  }
  const data = await request.json();
  if (!data.subscription) {
    console.log("No subscription passed to addSubscription", data);
    throw error(400, "Bad Request");
  }
  addUserDevice(username, data.subscription);
  return json({ success: true });
};
export {
  POST
};
