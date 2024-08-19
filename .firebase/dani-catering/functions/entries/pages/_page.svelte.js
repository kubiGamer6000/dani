import { c as create_ssr_component, v as validate_component } from "../../chunks/ssr.js";
import "../../chunks/client.js";
import { B as Button } from "../../chunks/index4.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main><h1 data-svelte-h="svelte-1axyf4f">Home</h1> ${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Settings`;
    }
  })} ${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Admin`;
    }
  })} ${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Staff`;
    }
  })}</main>`;
});
export {
  Page as default
};
