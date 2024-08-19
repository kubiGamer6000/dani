export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["apple-touch-icon-180x180.png","favicon.ico","favicon.png","logo.webp","manifest.json","maskable-icon-512x512.png","pwa-192x192.png","pwa-512x512.png","pwa-64x64.png","service-worker.js"]),
	mimeTypes: {".png":"image/png",".webp":"image/webp",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.D0h1HWdj.js","app":"_app/immutable/entry/app.iAt2QFGh.js","imports":["_app/immutable/entry/start.D0h1HWdj.js","_app/immutable/chunks/entry.BHaU7kt2.js","_app/immutable/chunks/scheduler.D6wPCbXW.js","_app/immutable/chunks/index.By9gUltu.js","_app/immutable/entry/app.iAt2QFGh.js","_app/immutable/chunks/scheduler.D6wPCbXW.js","_app/immutable/chunks/index.rrPC56Ks.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/admin/events",
				pattern: /^\/admin\/events\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/admin/staff",
				pattern: /^\/admin\/staff\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/api/addSubscription",
				pattern: /^\/api\/addSubscription\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/addSubscription/_server.ts.js'))
			},
			{
				id: "/api/signin",
				pattern: /^\/api\/signin\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/signin/_server.ts.js'))
			},
			{
				id: "/api/vapidPubKey",
				pattern: /^\/api\/vapidPubKey\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/vapidPubKey/_server.ts.js'))
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/signup",
				pattern: /^\/signup\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/staff",
				pattern: /^\/staff\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/staff/shifts",
				pattern: /^\/staff\/shifts\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 15 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
