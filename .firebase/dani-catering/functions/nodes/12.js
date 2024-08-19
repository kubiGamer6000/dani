import * as server from '../entries/pages/settings/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/settings/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/settings/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.BWMmYjGd.js","_app/immutable/chunks/scheduler.D6wPCbXW.js","_app/immutable/chunks/index.rrPC56Ks.js","_app/immutable/chunks/firebase.N-yeFzkF.js","_app/immutable/chunks/index.By9gUltu.js","_app/immutable/chunks/index.BFF8PE4x.js","_app/immutable/chunks/utils.ll2uvkr7.js","_app/immutable/chunks/card-title.BD-7R_cA.js","_app/immutable/chunks/card-footer.Cnlpc3kq.js","_app/immutable/chunks/entry.BHaU7kt2.js"];
export const stylesheets = [];
export const fonts = [];
