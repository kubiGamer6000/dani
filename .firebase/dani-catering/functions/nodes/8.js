

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.kmew904x.js","_app/immutable/chunks/scheduler.D6wPCbXW.js","_app/immutable/chunks/index.rrPC56Ks.js"];
export const stylesheets = [];
export const fonts = [];
