import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import "../../../chunks/client.js";
import { A as AuthCheck, S as Sun, M as Moon } from "../../../chunks/index3.js";
import "clsx";
import "../../../chunks/stores.js";
import { B as Button } from "../../../chunks/index4.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(AuthCheck, "AuthCheck").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="flex min-h-screen w-full flex-col"><header class="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6"><nav class="gap-6 text-lg font-medium flex flex-row w-full justify-between items-center"><a href="/" class="text-foreground font-semibold text-2xl w-56 hover:text-foreground transition-colors" data-svelte-h="svelte-olgstb">🍆 Dani&#39;s Catering</a>  ${validate_component(Button, "Button").$$render($$result, { variant: "outline", size: "icon" }, {}, {
        default: () => {
          return `${validate_component(Sun, "Sun").$$render(
            $$result,
            {
              class: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            },
            {},
            {}
          )} ${validate_component(Moon, "Moon").$$render(
            $$result,
            {
              class: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            },
            {},
            {}
          )} <span class="sr-only" data-svelte-h="svelte-ntgole">Toggle theme</span>`;
        }
      })}</nav></header> ${slots.default ? slots.default({}) : ``}</div>`;
    }
  })}`;
});
export {
  Layout as default
};
