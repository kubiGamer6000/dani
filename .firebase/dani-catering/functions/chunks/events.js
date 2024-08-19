import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, k as createEventDispatcher } from "./ssr.js";
import { c as userStore } from "./firebase.js";
import { g as getFirebaseContext } from "./sdk.js";
import { signOut } from "firebase/auth";
const SignedIn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  const auth = getFirebaseContext().auth;
  const user = userStore(auth);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_user();
  return `${$user ? `${slots.default ? slots.default({
    user: $user,
    auth,
    signOut: () => signOut(auth)
  }) : ``}` : ``}`;
});
const SignedOut = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  const auth = getFirebaseContext().auth;
  const user = userStore(auth);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_user();
  return `${!$user ? `${slots.default ? slots.default({ auth }) : ``}` : ``}`;
});
function createBitAttrs(bit, parts) {
  const attrs = {};
  parts.forEach((part) => {
    attrs[part] = {
      [`data-${bit}-${part}`]: ""
    };
  });
  return (part) => attrs[part];
}
function createDispatcher() {
  const dispatch = createEventDispatcher();
  return (e) => {
    const { originalEvent } = e.detail;
    const { cancelable } = e;
    const type = originalEvent.type;
    const shouldContinue = dispatch(type, { originalEvent, currentTarget: originalEvent.currentTarget }, { cancelable });
    if (!shouldContinue) {
      e.preventDefault();
    }
  };
}
export {
  SignedIn as S,
  createBitAttrs as a,
  SignedOut as b,
  createDispatcher as c
};
