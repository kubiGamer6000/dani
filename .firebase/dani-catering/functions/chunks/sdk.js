import { s as setContext, i as getContext } from "./ssr.js";
const contextKey = "firebase";
function setFirebaseContext(sdks) {
  setContext(contextKey, sdks);
}
function getFirebaseContext() {
  return getContext(contextKey);
}
export {
  getFirebaseContext as g,
  setFirebaseContext as s
};
