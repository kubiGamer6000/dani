import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, e as escape } from "../../../chunks/ssr.js";
import { u as user } from "../../../chunks/firebase.js";
import "firebase/auth";
import "firebase/firestore";
import { S as SignedIn, b as SignedOut } from "../../../chunks/events.js";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";
import "../../../chunks/client.js";
import { B as Button } from "../../../chunks/index4.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_description, d as Card_content } from "../../../chunks/card-title.js";
import "clsx";
import { L as Label, I as Input } from "../../../chunks/label.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_user;
  $$unsubscribe_user = subscribe(user, (value) => value);
  let firstName = "";
  let lastName = "";
  let email = "";
  let password = "";
  let loading = false;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen items-center justify-center"><h1 class="p-4 text-3xl font-semibold" data-svelte-h="svelte-91va7p">Dani&#39;s Catering 🍆</h1> ${validate_component(Card, "Card.Root").$$render($$result, { class: "mx-auto max-w-sm" }, {}, {
      default: () => {
        return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(SignedIn, "SignedIn").$$render($$result, {}, {}, {
              default: ({ user: user2 }) => {
                return `${validate_component(Card_title, "Card.Title").$$render($$result, { class: "text-2xl" }, {}, {
                  default: () => {
                    return `Hey, ${escape(user2.displayName)}`;
                  }
                })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
                  default: () => {
                    return `You are already logged in. Choose an option below.`;
                  }
                })}`;
              }
            })} ${validate_component(SignedOut, "SignedOut").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Card_title, "Card.Title").$$render($$result, { class: "text-xl" }, {}, {
                  default: () => {
                    return `Sign Up`;
                  }
                })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
                  default: () => {
                    return `Enter your information to create an account`;
                  }
                })}`;
              }
            })}`;
          }
        })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(SignedIn, "SignedIn").$$render($$result, {}, {}, {
              default: ({ signOut }) => {
                return `<div class="grid gap-4">${validate_component(Button, "Button").$$render($$result, { class: "w-full" }, {}, {
                  default: () => {
                    return `Go to app`;
                  }
                })} ${validate_component(Button, "Button").$$render($$result, { variant: "outline", class: "w-full" }, {}, {
                  default: () => {
                    return `Log out`;
                  }
                })}</div>`;
              }
            })} ${validate_component(SignedOut, "SignedOut").$$render($$result, {}, {}, {
              default: () => {
                return `<form class="grid gap-4"><div class="grid grid-cols-2 gap-4"><div class="grid gap-2">${validate_component(Label, "Label").$$render($$result, { for: "first-name" }, {}, {
                  default: () => {
                    return `First name`;
                  }
                })} ${validate_component(Input, "Input").$$render(
                  $$result,
                  {
                    id: "first-name",
                    placeholder: "First name",
                    required: true,
                    value: firstName
                  },
                  {
                    value: ($$value) => {
                      firstName = $$value;
                      $$settled = false;
                    }
                  },
                  {}
                )}</div> <div class="grid gap-2">${validate_component(Label, "Label").$$render($$result, { for: "last-name" }, {}, {
                  default: () => {
                    return `Last name`;
                  }
                })} ${validate_component(Input, "Input").$$render(
                  $$result,
                  {
                    id: "last-name",
                    placeholder: "Last name",
                    required: true,
                    value: lastName
                  },
                  {
                    value: ($$value) => {
                      lastName = $$value;
                      $$settled = false;
                    }
                  },
                  {}
                )}</div></div> <div class="grid gap-2">${validate_component(Label, "Label").$$render($$result, { for: "email" }, {}, {
                  default: () => {
                    return `Email`;
                  }
                })} ${validate_component(Input, "Input").$$render(
                  $$result,
                  {
                    id: "email",
                    type: "email",
                    placeholder: "m@example.com",
                    required: true,
                    value: email
                  },
                  {
                    value: ($$value) => {
                      email = $$value;
                      $$settled = false;
                    }
                  },
                  {}
                )}</div> <div class="grid gap-2">${validate_component(Label, "Label").$$render($$result, { for: "password" }, {}, {
                  default: () => {
                    return `Password`;
                  }
                })} ${validate_component(Input, "Input").$$render(
                  $$result,
                  {
                    id: "password",
                    type: "password",
                    required: true,
                    value: password
                  },
                  {
                    value: ($$value) => {
                      password = $$value;
                      $$settled = false;
                    }
                  },
                  {}
                )}</div> ${``} ${validate_component(Button, "Button").$$render(
                  $$result,
                  {
                    type: "submit",
                    class: "w-full",
                    disabled: loading
                  },
                  {},
                  {
                    default: () => {
                      return `${`Create an account`}`;
                    }
                  }
                )} ${validate_component(Button, "Button").$$render(
                  $$result,
                  {
                    variant: "outline",
                    class: "w-full",
                    disabled: loading
                  },
                  {},
                  {
                    default: () => {
                      return `${`Sign up with Google`}`;
                    }
                  }
                )}</form> <div class="mt-4 text-center text-sm" data-svelte-h="svelte-e361z0">Already have an account?
          <a href="/login" class="underline">Log in</a></div>`;
              }
            })}`;
          }
        })}`;
      }
    })}</main>`;
  } while (!$$settled);
  $$unsubscribe_user();
  return $$rendered;
});
export {
  Page as default
};
