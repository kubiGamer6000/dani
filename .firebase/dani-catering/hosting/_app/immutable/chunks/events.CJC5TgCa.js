import{s as h,v as _,i as $,f as b,k,l as S,u as C,m as v,o as D,V as A}from"./scheduler.D6wPCbXW.js";import{S as E,i as O,t as a,g as y,a as u,e as N}from"./index.rrPC56Ks.js";import{e as T,f as B}from"./firebase.N-yeFzkF.js";import{g as q}from"./sdk.JU01OVlk.js";const F=o=>({user:o&1}),p=o=>({user:o[0],auth:o[1],signOut:o[5]});function m(o){let s;const n=o[4].default,t=S(n,o,o[3],p);return{c(){t&&t.c()},l(e){t&&t.l(e)},m(e,r){t&&t.m(e,r),s=!0},p(e,r){t&&t.p&&(!s||r&9)&&C(t,n,e,e[3],s?D(n,e[3],r,F):v(e[3]),p)},i(e){s||(a(t,e),s=!0)},o(e){u(t,e),s=!1},d(e){t&&t.d(e)}}}function I(o){let s,n,t=o[0]&&m(o);return{c(){t&&t.c(),s=_()},l(e){t&&t.l(e),s=_()},m(e,r){t&&t.m(e,r),$(e,s,r),n=!0},p(e,[r]){e[0]?t?(t.p(e,r),r&1&&a(t,1)):(t=m(e),t.c(),a(t,1),t.m(s.parentNode,s)):t&&(y(),u(t,1,1,()=>{t=null}),N())},i(e){n||(a(t),n=!0)},o(e){u(t),n=!1},d(e){e&&b(s),t&&t.d(e)}}}function V(o,s,n){let t,{$$slots:e={},$$scope:r}=s;const i=q().auth,f=T(i);k(o,f,c=>n(0,t=c));const l=()=>B(i);return o.$$set=c=>{"$$scope"in c&&n(3,r=c.$$scope)},[t,i,f,r,e,l]}class L extends E{constructor(s){super(),O(this,s,V,I,h,{})}}const j=o=>({}),d=o=>({auth:o[1]});function g(o){let s;const n=o[4].default,t=S(n,o,o[3],d);return{c(){t&&t.c()},l(e){t&&t.l(e)},m(e,r){t&&t.m(e,r),s=!0},p(e,r){t&&t.p&&(!s||r&8)&&C(t,n,e,e[3],s?D(n,e[3],r,j):v(e[3]),d)},i(e){s||(a(t,e),s=!0)},o(e){u(t,e),s=!1},d(e){t&&t.d(e)}}}function w(o){let s,n,t=!o[0]&&g(o);return{c(){t&&t.c(),s=_()},l(e){t&&t.l(e),s=_()},m(e,r){t&&t.m(e,r),$(e,s,r),n=!0},p(e,[r]){e[0]?t&&(y(),u(t,1,1,()=>{t=null}),N()):t?(t.p(e,r),r&1&&a(t,1)):(t=g(e),t.c(),a(t,1),t.m(s.parentNode,s))},i(e){n||(a(t),n=!0)},o(e){u(t),n=!1},d(e){e&&b(s),t&&t.d(e)}}}function z(o,s,n){let t,{$$slots:e={},$$scope:r}=s;const i=q().auth,f=T(i);return k(o,f,l=>n(0,t=l)),o.$$set=l=>{"$$scope"in l&&n(3,r=l.$$scope)},[t,i,f,r,e]}class M extends E{constructor(s){super(),O(this,s,z,w,h,{})}}function P(o,s){const n={};return s.forEach(t=>{n[t]={[`data-${o}-${t}`]:""}}),t=>n[t]}function Q(){const o=A();return s=>{const{originalEvent:n}=s.detail,{cancelable:t}=s,e=n.type;o(e,{originalEvent:n,currentTarget:n.currentTarget},{cancelable:t})||s.preventDefault()}}export{L as S,M as a,Q as b,P as c};
