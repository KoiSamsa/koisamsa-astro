import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D3W_yNPw.mjs';
import { manifest } from './manifest_CAUyhcTx.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/editor.astro.mjs');
const _page2 = () => import('./pages/admin/entradas.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/api/keystatic/_---params_.astro.mjs');
const _page5 = () => import('./pages/keystatic/_---params_.astro.mjs');
const _page6 = () => import('./pages/lab.astro.mjs');
const _page7 = () => import('./pages/notes/_slug_.astro.mjs');
const _page8 = () => import('./pages/notes.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/editor.astro", _page1],
    ["src/pages/admin/entradas.astro", _page2],
    ["src/pages/admin/index.astro", _page3],
    ["node_modules/@keystatic/astro/internal/keystatic-api.js", _page4],
    ["node_modules/@keystatic/astro/internal/keystatic-astro-page.astro", _page5],
    ["src/pages/lab/index.astro", _page6],
    ["src/pages/notes/[slug].astro", _page7],
    ["src/pages/notes/index.astro", _page8],
    ["src/pages/index.astro", _page9]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "2ef7bbe6-26b2-46ab-a8f2-2f57c5cc0bed",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
