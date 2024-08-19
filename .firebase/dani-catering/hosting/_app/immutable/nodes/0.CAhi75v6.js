import{s as K,v as d,R as X,f as g,h as W,n as C,k as v,r as L,e as Y,c as Z,q as N,i as k,S as F,T as H,l as V,u as G,m as R,o as z,a as x,g as $}from"../chunks/scheduler.D6wPCbXW.js";import{S as M,i as O,t as y,a as S,c as E,b as p,m as J,d as I}from"../chunks/index.rrPC56Ks.js";import{a as q,m as U,d as ee,b as te,s as j,c as se,e as ae,f as ie,g as ne,h as re,l as oe,i as ce,j as le,k as T}from"../chunks/mode.BEAFm7B-.js";import{a as ue,d as fe,u as de}from"../chunks/firebase.N-yeFzkF.js";import{s as me}from"../chunks/sdk.JU01OVlk.js";function A(n){let e,a;return{c(){e=Y("meta"),this.h()},l(t){e=Z(t,"META",{name:!0,content:!0}),this.h()},h(){N(e,"name","theme-color"),N(e,"content",a=n[0].dark)},m(t,s){k(t,e,s)},p(t,s){s&1&&a!==(a=t[0].dark)&&N(e,"content",a)},d(t){t&&g(e)}}}function ge(n){let e,a="<script>("+T.toString()+")("+JSON.stringify(n[2])+");<\/script>",t;return{c(){e=new F(!1),t=d(),this.h()},l(s){e=H(s,!1),t=d(),this.h()},h(){e.a=t},m(s,i){e.m(a,s,i),k(s,t,i)},p:C,d(s){s&&(g(t),e.d())}}}function he(n){let e,a=`<script nonce=${n[1]}>(`+T.toString()+")("+JSON.stringify(n[2])+");<\/script>",t;return{c(){e=new F(!1),t=d(),this.h()},l(s){e=H(s,!1),t=d(),this.h()},h(){e.a=t},m(s,i){e.m(a,s,i),k(s,t,i)},p(s,i){i&2&&a!==(a=`<script nonce=${s[1]}>(`+T.toString()+")("+JSON.stringify(s[2])+");<\/script>")&&e.p(a)},d(s){s&&(g(t),e.d())}}}function be(n){let e,a,t=n[0]&&A(n);function s(c,u){return c[1]?he:ge}let i=s(n),o=i(n);return{c(){t&&t.c(),e=d(),o.c(),a=d()},l(c){const u=X("svelte-1nen96w",document.head);t&&t.l(u),e=d(),o.l(u),a=d(),u.forEach(g)},m(c,u){t&&t.m(document.head,null),W(document.head,e),o.m(document.head,null),W(document.head,a)},p(c,[u]){c[0]?t?t.p(c,u):(t=A(c),t.c(),t.m(e.parentNode,e)):t&&(t.d(1),t=null),i===(i=s(c))&&o?o.p(c,u):(o.d(1),o=i(c),o&&(o.c(),o.m(a.parentNode,a)))},i:C,o:C,d(c){t&&t.d(c),g(e),o.d(c),g(a)}}}function _e(n,e,a){let t,s,i;v(n,q,l=>a(12,s=l)),v(n,U,l=>a(13,i=l));let{track:o=!0}=e,{defaultMode:c="system"}=e,{themeColors:u=void 0}=e,{disableTransitions:f=!0}=e,{darkClassNames:r=["dark"]}=e,{lightClassNames:h=[]}=e,{defaultTheme:m=""}=e,{nonce:w=""}=e,{themeStorageKey:b="mode-watcher-theme"}=e,{modeStorageKey:_="mode-watcher-mode"}=e;L(()=>{const l=ee.subscribe(()=>{}),D=te.subscribe(()=>{});j.tracking(o),j.query();const P=localStorage.getItem(i);se(ce(P)?P:c);const Q=localStorage.getItem(s);return ae(Q||m),()=>{l(),D()}});const B=le({defaultMode:c,themeColors:u,darkClassNames:r,lightClassNames:h,defaultTheme:m,modeStorageKey:_,themeStorageKey:b});return n.$$set=l=>{"track"in l&&a(3,o=l.track),"defaultMode"in l&&a(4,c=l.defaultMode),"themeColors"in l&&a(0,u=l.themeColors),"disableTransitions"in l&&a(5,f=l.disableTransitions),"darkClassNames"in l&&a(6,r=l.darkClassNames),"lightClassNames"in l&&a(7,h=l.lightClassNames),"defaultTheme"in l&&a(8,m=l.defaultTheme),"nonce"in l&&a(9,w=l.nonce),"themeStorageKey"in l&&a(10,b=l.themeStorageKey),"modeStorageKey"in l&&a(11,_=l.modeStorageKey)},n.$$.update=()=>{n.$$.dirty&32&&ie.set(f),n.$$.dirty&1&&ne.set(u),n.$$.dirty&64&&re.set(r),n.$$.dirty&128&&oe.set(h),n.$$.dirty&2048&&U.set(_),n.$$.dirty&1024&&q.set(b),n.$$.dirty&512&&a(1,t=typeof window>"u"?w:"")},[u,t,B,o,c,f,r,h,m,w,b,_]}class ye extends M{constructor(e){super(),O(this,e,_e,be,K,{track:3,defaultMode:4,themeColors:0,disableTransitions:5,darkClassNames:6,lightClassNames:7,defaultTheme:8,nonce:9,themeStorageKey:10,modeStorageKey:11})}}function Se(n){let e;const a=n[6].default,t=V(a,n,n[5],null);return{c(){t&&t.c()},l(s){t&&t.l(s)},m(s,i){t&&t.m(s,i),e=!0},p(s,[i]){t&&t.p&&(!e||i&32)&&G(t,a,s,s[5],e?z(a,s[5],i,null):R(s[5]),null)},i(s){e||(y(t,s),e=!0)},o(s){S(t,s),e=!1},d(s){t&&t.d(s)}}}function ke(n,e,a){let{$$slots:t={},$$scope:s}=e,{firestore:i=void 0}=e,{rtdb:o=void 0}=e,{auth:c=void 0}=e,{storage:u=void 0}=e,{analytics:f=void 0}=e;return me({firestore:i,rtdb:o,auth:c,storage:u,analytics:f}),n.$$set=r=>{"firestore"in r&&a(0,i=r.firestore),"rtdb"in r&&a(1,o=r.rtdb),"auth"in r&&a(2,c=r.auth),"storage"in r&&a(3,u=r.storage),"analytics"in r&&a(4,f=r.analytics),"$$scope"in r&&a(5,s=r.$$scope)},[i,o,c,u,f,s,t]}class we extends M{constructor(e){super(),O(this,e,ke,Se,K,{firestore:0,rtdb:1,auth:2,storage:3,analytics:4})}}function Ne(n){let e;const a=n[0].default,t=V(a,n,n[1],null);return{c(){t&&t.c()},l(s){t&&t.l(s)},m(s,i){t&&t.m(s,i),e=!0},p(s,i){t&&t.p&&(!e||i&2)&&G(t,a,s,s[1],e?z(a,s[1],i,null):R(s[1]),null)},i(s){e||(y(t,s),e=!0)},o(s){S(t,s),e=!1},d(s){t&&t.d(s)}}}function Ce(n){let e,a,t,s;return e=new ye({}),t=new we({props:{auth:ue,firestore:fe,$$slots:{default:[Ne]},$$scope:{ctx:n}}}),{c(){E(e.$$.fragment),a=x(),E(t.$$.fragment)},l(i){p(e.$$.fragment,i),a=$(i),p(t.$$.fragment,i)},m(i,o){J(e,i,o),k(i,a,o),J(t,i,o),s=!0},p(i,[o]){const c={};o&2&&(c.$$scope={dirty:o,ctx:i}),t.$set(c)},i(i){s||(y(e.$$.fragment,i),y(t.$$.fragment,i),s=!0)},o(i){S(e.$$.fragment,i),S(t.$$.fragment,i),s=!1},d(i){i&&g(a),I(e,i),I(t,i)}}}async function ve(){const n=await navigator.serviceWorker.ready;n.addEventListener("updatefound",()=>{const e=n.installing;e==null||e.addEventListener("statechange",()=>{e.state==="installed"&&navigator.serviceWorker.controller&&confirm("New update available! Please refresh.")&&(e.postMessage({type:"SKIP_WAITING"}),window.location.reload())})})}async function Te(){if("serviceWorker"in navigator){const e=await(await navigator.serviceWorker.ready).pushManager.getSubscription();e&&(await e.unsubscribe(),console.log("Push subscription unsubscribed:",JSON.stringify(e)))}}function Ke(n,e,a){let t;v(n,de,f=>a(2,t=f));let{$$slots:s={},$$scope:i}=e;async function o(f){try{const r=await fetch("/api/addSubscription",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uid:t==null?void 0:t.uid,subscription:f})});if(!r.ok)throw new Error(`Error saving subscription on server: ${r.statusText} (${r.status})`)}catch(r){console.error("Error sending subscription to server:",r),Te()}}async function c(){if("serviceWorker"in navigator){const r=await(await navigator.serviceWorker.ready).pushManager.getSubscription();console.log("Push subscription checked:",JSON.stringify(r)),r!==null&&o(r)}return!1}async function u(){if("serviceWorker"in navigator)try{console.log("trying to subscribe");const f=await fetch("/api/vapidPubKey"),{data:r}=await f.json();console.log(r);const m=await(await navigator.serviceWorker.ready).pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:r});console.log("Push subscription:",JSON.stringify(m)),o(m)}catch(f){console.error("Error subscribing user to push notifications:",f)}}return L(async()=>{ve(),t&&(Notification.permission!=="granted"?(Notification.requestPermission(),await c()==!1&&u()):console.log("user is subscribed"))}),n.$$set=f=>{"$$scope"in f&&a(1,i=f.$$scope)},[s,i]}class pe extends M{constructor(e){super(),O(this,e,Ke,Ce,K,{})}}export{pe as component};
