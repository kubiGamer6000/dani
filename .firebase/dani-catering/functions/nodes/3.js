

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/events/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.CfKn9UnM.js","_app/immutable/chunks/scheduler.D6wPCbXW.js","_app/immutable/chunks/index.rrPC56Ks.js"];
export const stylesheets = [];
export const fonts = [];
