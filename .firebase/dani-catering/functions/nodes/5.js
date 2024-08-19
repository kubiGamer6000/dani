

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/signup/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.CfKn9UnM.js","_app/immutable/chunks/scheduler.D6wPCbXW.js","_app/immutable/chunks/index.rrPC56Ks.js"];
export const stylesheets = [];
export const fonts = [];
