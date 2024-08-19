import { V as VAPID_PUBLIC_KEY } from "../../../../chunks/private.js";
import { j as json } from "../../../../chunks/index.js";
const GET = () => {
  return json({ data: VAPID_PUBLIC_KEY });
};
export {
  GET
};
