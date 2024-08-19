import { c as create_ssr_component, b as spread, f as escape_attribute_value, d as escape_object, v as validate_component, j as each, e as escape } from "../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_description, d as Card_content } from "../../../../chunks/card-title.js";
import { C as Card_footer } from "../../../../chunks/card-footer.js";
import { s as subscribe, c as compute_rest_props } from "../../../../chunks/utils.js";
import { c as cn } from "../../../../chunks/utils2.js";
import { C as Collection, a as CheckInTimer, T as Table, b as Table_header, c as Table_row, d as Table_head, e as Table_cell } from "../../../../chunks/CheckInTimer.js";
import "clsx";
import { B as Button } from "../../../../chunks/index4.js";
import { query, collection, where, orderBy, limit } from "firebase/firestore";
import { b as docStore, d as db } from "../../../../chunks/firebase.js";
import "firebase/auth";
import { g as getFirebaseContext } from "../../../../chunks/sdk.js";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar.js";
import { I as Icon } from "../../../../chunks/Icon.js";
const Doc = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $store, $$unsubscribe_store;
  let { ref } = $$props;
  let { startWith = void 0 } = $$props;
  const { firestore } = getFirebaseContext();
  let store = docStore(firestore, ref, startWith);
  $$unsubscribe_store = subscribe(store, (value) => $store = value);
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0) $$bindings.ref(ref);
  if ($$props.startWith === void 0 && $$bindings.startWith && startWith !== void 0) $$bindings.startWith(startWith);
  $$unsubscribe_store();
  return `${$store !== void 0 && $store !== null ? `${slots.default ? slots.default({ data: $store, ref: store.ref, firestore }) : ``}` : `${slots.loading ? slots.loading({}) : ``}`}`;
});
const Skeleton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("bg-muted animate-pulse rounded-md", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}></div>`;
});
const Map = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"
      }
    ],
    ["path", { "d": "M15 5.764v15" }],
    ["path", { "d": "M9 3.236v15" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "map" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const StaffCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  dayjs.extend(calendar);
  const staffQuery = query(collection(db, "users"), where("role", "==", "staff"));
  const minToString = (minutes) => `${Math.floor(minutes / 60)} hours ${Math.round(minutes % 60)} min`;
  const getToday = () => {
    return dayjs().format("YYYY-MM-DD");
  };
  return `<div class="flex flex-col items-center p-2"> ${validate_component(Collection, "Collection").$$render($$result, { ref: staffQuery }, {}, {
    loading: () => {
      return `${validate_component(Card, "Card.Root").$$render($$result, { slot: "loading", class: "w-full mb-4" }, {}, {
        default: () => {
          return `${validate_component(Card_header, "Card.Header").$$render($$result, { class: "space-y-4" }, {}, {
            default: () => {
              return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-10 w-[250px] rounded-xl" }, {}, {})}`;
                }
              })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
                default: () => {
                  return `<div class="space-y-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px] rounded-full" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px] rounded-full" }, {}, {})}</div>`;
                }
              })}`;
            }
          })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {})} ${validate_component(Card_footer, "Card.Footer").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Button, "Button").$$render($$result, { class: "disabled", href: "##" }, {}, {
                default: () => {
                  return `View Details`;
                }
              })}`;
            }
          })}`;
        }
      })}`;
    },
    default: ({ data: users }) => {
      return `${each(users, (user) => {
        return `${validate_component(Card, "Card.Root").$$render(
          $$result,
          {
            class: `w-full mb-4 ${user?.isCheckedIn ? "" : "bg-muted"}`
          },
          {},
          {
            default: () => {
              return `${validate_component(Card_header, "Card.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Card_title, "Card.Title").$$render($$result, { class: "text-3xl" }, {}, {
                    default: () => {
                      return `${escape(user?.name)}`;
                    }
                  })} ${validate_component(Card_description, "Card.Description").$$render($$result, { class: "text-md" }, {}, {
                    default: () => {
                      return `<p>Today:
              ${validate_component(Doc, "Doc").$$render($$result, { ref: `shifts/${user?.id}_${getToday()}` }, {}, {
                        default: ({ data: shift }) => {
                          return `${escape(minToString(shift.totalDuration))} `;
                        }
                      })}</p> <p class="mt-2">Currently checked ${escape(user?.isCheckedIn ? "in for" : `out`)} ${user?.isCheckedIn ? `<span class="font-semibold">${validate_component(CheckInTimer, "CheckInTimer").$$render($$result, { userData: user }, {}, {})} </span>` : ``}</p> `;
                    }
                  })} `;
                }
              })} ${validate_component(Card_content, "Card.Content").$$render($$result, {}, {}, {
                default: () => {
                  return `<h3 class="font-semibold mt-4 mb-2" data-svelte-h="svelte-6u0y4f">Shifts</h3> ${validate_component(Collection, "Collection").$$render(
                    $$result,
                    {
                      ref: query(collection(db, "shifts"), where("userId", "==", user?.id), orderBy("date", "desc"), limit(2))
                    },
                    {},
                    {
                      default: ({ data: shifts }) => {
                        return `${each(shifts, (shift) => {
                          return `<div class="py-2"><h2 class="font-semibold text-lg">${escape(dayjs(shift.date).calendar(null, {
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
                                      })} ${validate_component(Table_head, "Table.Head").$$render($$result, {}, {}, {
                                        default: () => {
                                          return `When`;
                                        }
                                      })} ${validate_component(Table_head, "Table.Head").$$render($$result, { class: "text-right" }, {}, {
                                        default: () => {
                                          return `Where`;
                                        }
                                      })} `;
                                    }
                                  })} `;
                                }
                              })} ${each(shift?.checkIns, (checkIn) => {
                                return `${validate_component(Table_row, "Table.Row").$$render($$result, {}, {}, {
                                  default: () => {
                                    return `${validate_component(Table_cell, "Table.Cell").$$render($$result, { class: "font-medium flex items-center" }, {}, {
                                      default: () => {
                                        return `Checked in
                      `;
                                      }
                                    })} ${validate_component(Table_cell, "Table.Cell").$$render($$result, {}, {}, {
                                      default: () => {
                                        return `${escape(dayjs(checkIn.in.time.toDate()).format("H:mm"))} `;
                                      }
                                    })} ${validate_component(Table_cell, "Table.Cell").$$render($$result, { class: "text-right" }, {}, {
                                      default: () => {
                                        return `${validate_component(Doc, "Doc").$$render($$result, { ref: `checkIns/${checkIn.in.id}` }, {}, {
                                          default: ({ data: checkInData }) => {
                                            return `${validate_component(Button, "Button").$$render($$result, { variant: "outline" }, {}, {
                                              default: () => {
                                                return `${validate_component(Map, "Map").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
                            Open
                          `;
                                              }
                                            })} `;
                                          }
                                        })} `;
                                      }
                                    })} `;
                                  }
                                })} ${validate_component(Table_row, "Table.Row").$$render($$result, {}, {}, {
                                  default: () => {
                                    return `${validate_component(Table_cell, "Table.Cell").$$render(
                                      $$result,
                                      {
                                        class: "font-medium text-md flex items-center"
                                      },
                                      {},
                                      {
                                        default: () => {
                                          return `Checked out
                      `;
                                        }
                                      }
                                    )} ${validate_component(Table_cell, "Table.Cell").$$render($$result, {}, {}, {
                                      default: () => {
                                        return `${escape(checkIn.out.time != null ? dayjs(checkIn.out.time.toDate()).format("H:mm") : "Ongoing")} `;
                                      }
                                    })} ${validate_component(Table_cell, "Table.Cell").$$render($$result, { class: "text-right" }, {}, {
                                      default: () => {
                                        return `${validate_component(Doc, "Doc").$$render($$result, { ref: `checkIns/${checkIn.out.id}` }, {}, {
                                          default: ({ data: checkInData }) => {
                                            return `${validate_component(Button, "Button").$$render($$result, { variant: "outline" }, {}, {
                                              default: () => {
                                                return `${validate_component(Map, "Map").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
                            Open
                          `;
                                              }
                                            })} `;
                                          }
                                        })} `;
                                      }
                                    })} `;
                                  }
                                })}`;
                              })} `;
                            }
                          })} </div>`;
                        })} `;
                      }
                    }
                  )} `;
                }
              })} ${validate_component(Card_footer, "Card.Footer").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Button, "Button").$$render($$result, { href: "##" }, {}, {
                    default: () => {
                      return `View Details`;
                    }
                  })} `;
                }
              })} `;
            }
          }
        )}`;
      })}`;
    }
  })}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main class="p-4 flex flex-col"><h1 class="text-4xl font-semibold px-4 py-2" data-svelte-h="svelte-1md7wio">Staff Shifts</h1> ${validate_component(StaffCard, "StaffCard").$$render($$result, {}, {}, {})}</main>`;
});
export {
  Page as default
};
