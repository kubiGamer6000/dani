import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import { S as StaffCheckIn, M as MyCheckIns } from "../../../../chunks/MyCheckIns.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen items-center justify-center">${validate_component(StaffCheckIn, "StaffCheckIn").$$render($$result, {}, {}, {})} ${validate_component(MyCheckIns, "MyCheckIns").$$render($$result, {}, {}, {})}</main>`;
});
export {
  Page as default
};
