import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import "../../../chunks/firebase.js";
import { B as Button } from "../../../chunks/index4.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_description, d as Card_content } from "../../../chunks/card-title.js";
import { C as Card_footer } from "../../../chunks/card-footer.js";
import "../../../chunks/client.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main class="p-4"><div class="flex flex-col items-center h-screen"><h1 class="text-4xl w-full font-semibold p-4 mb-4" data-svelte-h="svelte-pibx0j">Settings</h1> ${validate_component(Card, "Card.Root").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "Card.Title").$$render($$result, { class: "text-3xl" }, {}, {
            default: () => {
              return `Push Notifications`;
            }
          })} ${validate_component(Card_description, "Card.Description").$$render($$result, { class: "text-md" }, {}, {
            default: () => {
              return `Enable/disable push notifications from here...`;
            }
          })}`;
        }
      })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {
        default: () => {
          return `${`<p data-svelte-h="svelte-1e7bb7a">Checking permissions...</p>`}`;
        }
      })} ${validate_component(Card_footer, "Card.Footer").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, { class: "w-full" }, {}, {
            default: () => {
              return `Go To Home`;
            }
          })}`;
        }
      })}`;
    }
  })}</div></main>`;
});
export {
  Page as default
};
