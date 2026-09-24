import 'piccolore';
import { j as decodeKey } from './chunks/astro/server_ClSOxIxi.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_aYiu2BUb.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/claude/ka/","cacheDir":"file:///home/claude/ka/node_modules/.astro/","outDir":"file:///home/claude/ka/dist/","srcDir":"file:///home/claude/ka/src/","publicDir":"file:///home/claude/ka/public/","buildClientDir":"file:///home/claude/ka/dist/client/","buildServerDir":"file:///home/claude/ka/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"admin/editor/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/editor.D_0xXx06.css"}],"routeData":{"route":"/admin/editor","isIndex":false,"type":"page","pattern":"^\\/admin\\/editor\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"editor","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/editor.astro","pathname":"/admin/editor","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"admin/entradas/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/editor.D_0xXx06.css"}],"routeData":{"route":"/admin/entradas","isIndex":false,"type":"page","pattern":"^\\/admin\\/entradas\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"entradas","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/entradas.astro","pathname":"/admin/entradas","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"admin/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/editor.D_0xXx06.css"}],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"lab/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/lab","isIndex":true,"type":"page","pattern":"^\\/lab\\/?$","segments":[[{"content":"lab","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/lab/index.astro","pathname":"/lab","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"notes/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/notes","isIndex":true,"type":"page","pattern":"^\\/notes\\/?$","segments":[[{"content":"notes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/notes/index.astro","pathname":"/notes","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/api/keystatic/[...params]","pattern":"^\\/api\\/keystatic(?:\\/(.*?))?\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"keystatic","dynamic":false,"spread":false}],[{"content":"...params","dynamic":true,"spread":true}]],"params":["...params"],"component":"node_modules/@keystatic/astro/internal/keystatic-api.js","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","isIndex":false,"route":"/keystatic/[...params]","pattern":"^\\/keystatic(?:\\/(.*?))?\\/?$","segments":[[{"content":"keystatic","dynamic":false,"spread":false}],[{"content":"...params","dynamic":true,"spread":true}]],"params":["...params"],"component":"node_modules/@keystatic/astro/internal/keystatic-astro-page.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}}],"site":"https://koisamsa.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/claude/ka/src/pages/admin/editor.astro",{"propagation":"in-tree","containsHead":true}],["/home/claude/ka/src/pages/admin/entradas.astro",{"propagation":"in-tree","containsHead":true}],["/home/claude/ka/src/pages/admin/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/home/claude/ka/src/data/admin.ts",{"propagation":"in-tree","containsHead":false}],["/home/claude/ka/src/components/admin/AdminBar.astro",{"propagation":"in-tree","containsHead":false}],["/home/claude/ka/src/layouts/AdminLayout.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/admin/editor@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/admin/entradas@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/admin/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/home/claude/ka/src/components/admin/Sidebar.astro",{"propagation":"in-tree","containsHead":false}],["/home/claude/ka/src/pages/notes/[slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/notes/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/home/claude/ka/src/pages/notes/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/notes/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/home/claude/ka/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/home/claude/ka/src/pages/lab/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/@keystatic/astro/internal/keystatic-api@_@js":"pages/api/keystatic/_---params_.astro.mjs","\u0000@astro-page:node_modules/@keystatic/astro/internal/keystatic-astro-page@_@astro":"pages/keystatic/_---params_.astro.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/admin/editor@_@astro":"pages/admin/editor.astro.mjs","\u0000@astro-page:src/pages/admin/entradas@_@astro":"pages/admin/entradas.astro.mjs","\u0000@astro-page:src/pages/admin/index@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/lab/index@_@astro":"pages/lab.astro.mjs","\u0000@astro-page:src/pages/notes/[slug]@_@astro":"pages/notes/_slug_.astro.mjs","\u0000@astro-page:src/pages/notes/index@_@astro":"pages/notes.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CAUyhcTx.mjs","/home/claude/ka/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DpYclnHX.mjs","/home/claude/ka/.astro/content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","/home/claude/ka/.astro/content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_Bb8zf_2y.mjs","/home/claude/ka/node_modules/@keystatic/astro/internal/keystatic-page.js":"_astro/keystatic-page.35hOI42-.js","@astrojs/react/client.js":"_astro/client.ZjqwiamM.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/editor.D_0xXx06.css","/_astro/client.ZjqwiamM.js","/_astro/index.Doymq99K.js","/_astro/keystatic-page.35hOI42-.js","/admin/editor/index.html","/admin/entradas/index.html","/admin/index.html","/lab/index.html","/notes/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"gBGE5PtarOEDRXbo52aHMF8vFoM5ymRp0S5bulqU6w8="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
