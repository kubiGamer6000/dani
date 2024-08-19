import { c as compute_rest_props, s as subscribe } from "../../../../chunks/utils.js";
import { c as create_ssr_component, b as spread, f as escape_attribute_value, d as escape_object, a as add_attribute, v as validate_component, j as each, e as escape } from "../../../../chunks/ssr.js";
import "clsx";
import { c as cn } from "../../../../chunks/utils2.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { p as page } from "../../../../chunks/stores2.js";
const Breadcrumb = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<nav${spread(
    [
      { class: escape_attribute_value(className) },
      { "aria-label": "breadcrumb" },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}</nav>`;
});
const Breadcrumb_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<li${add_attribute("class", cn("inline-flex items-center gap-1.5", className), 0)}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}</li>`;
});
const Chevron_right = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m9 18 6-6-6-6" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "chevron-right" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Breadcrumb_separator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<li${spread(
    [
      { role: "presentation" },
      { "aria-hidden": "true" },
      {
        class: escape_attribute_value(cn("[&>svg]:size-3.5", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ` ${validate_component(Chevron_right, "ChevronRight").$$render($$result, {}, {}, {})} `}</li>`;
});
const Breadcrumb_link = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["href", "el", "asChild", "class"]);
  let { href = void 0 } = $$props;
  let { el = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { class: className = void 0 } = $$props;
  let attrs;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0) $$bindings.href(href);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  attrs = {
    class: cn("hover:text-foreground transition-colors", className),
    href,
    ...$$restProps
  };
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<a${spread([escape_object(attrs), { href: escape_attribute_value(href) }], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</a>`}`;
});
const Breadcrumb_list = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<ol${spread(
    [
      {
        class: escape_attribute_value(cn("text-muted-foreground flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}</ol>`;
});
const Breadcrumb_page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<span${spread(
    [
      { role: "link" },
      { "aria-disabled": "true" },
      { "aria-current": "page" },
      {
        class: escape_attribute_value(cn("text-foreground font-normal", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}</span>`;
});
const Breadcrumbs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { path } = $$props;
  let crumbs = [];
  if ($$props.path === void 0 && $$bindings.path && path !== void 0) $$bindings.path(path);
  {
    {
      const tokens = path.split("/").filter((t) => t !== "");
      let tokenPath = "";
      crumbs = tokens.map((t) => {
        tokenPath += "/" + t;
        t = t.charAt(0).toUpperCase() + t.slice(1);
        return { label: t, href: tokenPath };
      });
    }
  }
  return `<div class="breadcrumb">${validate_component(Breadcrumb, "Breadcrumb.Root").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Breadcrumb_list, "Breadcrumb.List").$$render($$result, {}, {}, {
        default: () => {
          return `${each(crumbs, (c, i) => {
            return `${i == crumbs.length - 1 ? `${validate_component(Breadcrumb_item, "Breadcrumb.Item").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Breadcrumb_page, "Breadcrumb.Page").$$render($$result, {}, {}, {
                  default: () => {
                    return `${escape(c.label)}`;
                  }
                })} `;
              }
            })}` : `${validate_component(Breadcrumb_item, "Breadcrumb.Item").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Breadcrumb_link, "Breadcrumb.Link").$$render($$result, { href: c.href }, {}, {
                  default: () => {
                    return `${escape(c.label)}`;
                  }
                })} `;
              }
            })} ${validate_component(Breadcrumb_separator, "Breadcrumb.Separator").$$render($$result, {}, {}, {})}`}`;
          })}`;
        }
      })}`;
    }
  })}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">${validate_component(Breadcrumbs, "Breadcrumbs").$$render($$result, { path: $page.url.pathname }, {}, {})} <h1 data-svelte-h="svelte-xtcg81">Events</h1></main>`;
});
export {
  Page as default
};
