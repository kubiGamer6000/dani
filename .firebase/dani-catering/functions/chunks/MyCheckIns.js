import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, v as validate_component, e as escape, j as each } from "./ssr.js";
import { u as user, e as userData, d as db } from "./firebase.js";
import { query, collection, where, orderBy } from "firebase/firestore";
import { C as Card, a as Card_header, b as Card_title, c as Card_description, d as Card_content } from "./card-title.js";
import { C as Card_footer } from "./card-footer.js";
import { B as Button } from "./index4.js";
import dayjs from "dayjs";
import { I as Icon } from "./Icon.js";
import { a as CheckInTimer, C as Collection, T as Table, b as Table_header, c as Table_row, d as Table_head, e as Table_cell } from "./CheckInTimer.js";
import calendar from "dayjs/plugin/calendar.js";
import "firebase/auth";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";
import "clsx";
const Check = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "check" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const StaffCheckIn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_user;
  let $userData, $$unsubscribe_userData;
  $$unsubscribe_user = subscribe(user, (value) => value);
  $$unsubscribe_userData = subscribe(userData, (value) => $userData = value);
  let isLoading = false;
  console.log($userData);
  $$unsubscribe_user();
  $$unsubscribe_userData();
  return `${validate_component(Card, "Card.Root").$$render(
    $$result,
    {
      class: `mx-auto w-full ${$userData?.isCheckedIn ? "" : "bg-muted"}`
    },
    {},
    {
      default: () => {
        return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Card_title, "Card.Title").$$render($$result, { class: "text-3xl" }, {}, {
              default: () => {
                return `You are checked ${escape($userData?.isCheckedIn ? "in" : "out")}`;
              }
            })} ${validate_component(Card_description, "Card.Description").$$render($$result, { class: "text-md" }, {}, {
              default: () => {
                return `Check in/out from here`;
              }
            })}`;
          }
        })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(CheckInTimer, "CheckInTimer").$$render($$result, { userData: $userData }, {}, {})}`;
          }
        })} ${validate_component(Card_footer, "Card.Footer").$$render($$result, {}, {}, {
          default: () => {
            return ` ${validate_component(Button, "Button").$$render($$result, { class: "w-full", disabled: isLoading }, {}, {
              default: () => {
                return `${`${validate_component(Check, "Check").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
        Check ${escape($userData?.isCheckedIn ? "out" : "in")}`}`;
              }
            })}`;
          }
        })}`;
      }
    }
  )}`;
});
const MyCheckIns = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  dayjs.extend(calendar);
  $$unsubscribe_user();
  return `${validate_component(Card, "Card.Root").$$render($$result, { class: "mx-auto w-full" }, {}, {
    default: () => {
      return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "Card.Title").$$render($$result, { class: "text-3xl" }, {}, {
            default: () => {
              return `My Check-ins`;
            }
          })} ${validate_component(Card_description, "Card.Description").$$render($$result, { class: "text-md" }, {}, {
            default: () => {
              return `Monitor your check-ins from here.`;
            }
          })}`;
        }
      })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {
        default: () => {
          return `${$user?.uid ? `${validate_component(Collection, "Collection").$$render(
            $$result,
            {
              ref: query(collection(db, "shifts"), where("userId", "==", $user?.uid), orderBy("date", "desc"))
            },
            {},
            {
              default: ({ data: shifts }) => {
                return `${each(shifts, (shift) => {
                  return `<div class="py-2"><h2 class="text-lg font-semibold">${escape(dayjs(shift.date).calendar(null, {
                    sameDay: "[Today]",
                    // The same day ( Today at 2:30 AM )
                    lastDay: "[Yesterday]",
                    // The day before ( Yesterday at 2:30 AM )
                    lastWeek: "[Last] dddd",
                    // Last week ( Last Monday at 2:30 AM )
                    sameElse: "DD/MM/YYYY"
                    // Everything else ( 7/10/2011 )
                  }))}</h2> ${validate_component(Table, "Table.Root").$$render($$result, { class: "my-4" }, {}, {
                    default: () => {
                      return `${validate_component(Table_header, "Table.Header").$$render($$result, {}, {}, {
                        default: () => {
                          return `${validate_component(Table_row, "Table.Row").$$render($$result, {}, {}, {
                            default: () => {
                              return `${validate_component(Table_head, "Table.Head").$$render($$result, { class: "w-[100px]" }, {}, {
                                default: () => {
                                  return `Activity`;
                                }
                              })} ${validate_component(Table_head, "Table.Head").$$render($$result, { class: "text-right" }, {}, {
                                default: () => {
                                  return `When`;
                                }
                              })} `;
                            }
                          })} `;
                        }
                      })} ${each(shift?.checkIns, (checkIn) => {
                        return `${validate_component(Table_row, "Table.Row").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(Table_cell, "Table.Cell").$$render(
                              $$result,
                              {
                                class: "font-medium flex items-center w-48"
                              },
                              {},
                              {
                                default: () => {
                                  return `Checked in
                  `;
                                }
                              }
                            )} ${validate_component(Table_cell, "Table.Cell").$$render($$result, { class: "text-right" }, {}, {
                              default: () => {
                                return `${escape(dayjs(checkIn.in.time.toDate()).format("H:mm"))} `;
                              }
                            })} `;
                          }
                        })} ${validate_component(Table_row, "Table.Row").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(Table_cell, "Table.Cell").$$render(
                              $$result,
                              {
                                class: "font-medium text-md flex items-center w-48"
                              },
                              {},
                              {
                                default: () => {
                                  return `Checked out
                  `;
                                }
                              }
                            )} ${validate_component(Table_cell, "Table.Cell").$$render($$result, { class: "text-right" }, {}, {
                              default: () => {
                                return `${escape(checkIn.out.time != null ? dayjs(checkIn.out.time.toDate()).format("H:mm") : "Ongoing")} `;
                              }
                            })} `;
                          }
                        })}`;
                      })} `;
                    }
                  })} </div>`;
                })}`;
              }
            }
          )}` : `<p class="text-center" data-svelte-h="svelte-k9twba">Loading...</p>`}`;
        }
      })} `;
    }
  })}`;
});
export {
  MyCheckIns as M,
  StaffCheckIn as S
};
