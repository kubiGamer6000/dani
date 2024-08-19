import { s as subscribe, c as compute_rest_props } from "./utils.js";
import { c as create_ssr_component, b as spread, f as escape_attribute_value, d as escape_object, o as onDestroy, e as escape } from "./ssr.js";
import { f as collectionStore, d as db } from "./firebase.js";
import { g as getFirebaseContext } from "./sdk.js";
import { c as cn } from "./utils2.js";
import { doc, getDoc } from "firebase/firestore";
const Collection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $store, $$unsubscribe_store;
  let { ref } = $$props;
  let { startWith = void 0 } = $$props;
  const { firestore } = getFirebaseContext();
  let store = collectionStore(firestore, ref, startWith);
  $$unsubscribe_store = subscribe(store, (value) => $store = value);
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0) $$bindings.ref(ref);
  if ($$props.startWith === void 0 && $$bindings.startWith && startWith !== void 0) $$bindings.startWith(startWith);
  $$unsubscribe_store();
  return `${$store !== void 0 ? `${slots.default ? slots.default({
    data: $store,
    ref: store.ref,
    count: $store?.length ?? 0,
    firestore
  }) : ``}` : `${slots.loading ? slots.loading({}) : ``}`}`;
});
const Table = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<div class="relative w-full overflow-auto"><table${spread(
    [
      {
        class: escape_attribute_value(cn("w-full caption-bottom text-sm", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</table></div>`;
});
const Table_cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<td${spread(
    [
      {
        class: escape_attribute_value(cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</td>`;
});
const Table_head = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<th${spread(
    [
      {
        class: escape_attribute_value(cn("text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</th>`;
});
const Table_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return ` <thead${spread(
    [
      {
        class: escape_attribute_value(cn("[&_tr]:border-b", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</thead>`;
});
const Table_row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<tr${spread(
    [
      {
        class: escape_attribute_value(cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</tr>`;
});
const CheckInTimer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isCheckedIn;
  let lastCheckIn;
  let { userData } = $$props;
  let elapsedTime = "00:00:00";
  let intervalId = null;
  let lastCheckInTime = null;
  async function fetchLastCheckIn() {
    if (!lastCheckIn) return;
    try {
      const checkInRef = doc(db, "checkIns", lastCheckIn);
      const checkInSnap = await getDoc(checkInRef);
      if (checkInSnap.exists()) {
        const checkInData = checkInSnap.data();
        if (checkInData.timestamp) {
          lastCheckInTime = checkInData.timestamp.toDate();
          updateElapsedTime();
        }
      }
    } catch (error) {
      console.error("Error fetching last check-in:", error);
    }
  }
  function updateElapsedTime() {
    if (lastCheckInTime) {
      const now = /* @__PURE__ */ new Date();
      const diff = now.getTime() - lastCheckInTime.getTime();
      const hours = Math.floor(diff / 36e5);
      const minutes = Math.floor(diff % 36e5 / 6e4);
      const seconds = Math.floor(diff % 6e4 / 1e3);
      elapsedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }
  function startTimer() {
    if (!intervalId) {
      intervalId = window.setInterval(updateElapsedTime, 1e3);
    }
  }
  function stopTimer() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }
  onDestroy(() => {
    stopTimer();
  });
  if ($$props.userData === void 0 && $$bindings.userData && userData !== void 0) $$bindings.userData(userData);
  isCheckedIn = userData?.isCheckedIn ?? false;
  lastCheckIn = userData?.lastCheckIn ?? null;
  userData?.lastCheckInTimestamp ?? null;
  {
    {
      if (isCheckedIn && lastCheckIn) {
        if (!lastCheckInTime) {
          fetchLastCheckIn();
        }
        if (!intervalId) {
          startTimer();
        }
      } else {
        stopTimer();
        elapsedTime = "00:00:00";
        lastCheckInTime = null;
      }
    }
  }
  return `${isCheckedIn ? `<span>${escape(elapsedTime)}</span>` : ``}`;
});
export {
  Collection as C,
  Table as T,
  CheckInTimer as a,
  Table_header as b,
  Table_row as c,
  Table_head as d,
  Table_cell as e
};
