# Panel de contenidos — Keystatic + clon /admin

## Rutas
- `/admin/` — portada con estética de CMS clásico (Escritorio, Entradas). Lee `src/content/notes/`.
- `/keystatic` — editor real. Crear, editar y guardar entradas.
- `/notes/` y `/notes/<slug>/` — lo publicado (`borrador: false`).

## Contenido
Markdown puro + frontmatter en `src/content/notes/*.md`:
`title, description, fecha, nodo, imagen, categorias, borrador`. Imágenes en `public/images/notes/`.

## Trabajar en local
1. Clonar o abrir el repo **fuera de Drive** (el mount de Drive da EPERM al compilar).
2. `npm install`
3. `npm run dev` → http://127.0.0.1:4321/keystatic — guarda directamente en los `.md`.

## Producción (Cloudflare Pages) — decisión 2026-07-13
En producción el disco es de solo lectura: Keystatic escribe en GitHub.
1. Repo: `github.com/KoiSamsa/koisamsa-astro`.
2. Cloudflare → Workers & Pages → proyecto `koisamsa` → Settings → Builds → conectar al repo
   (build: `npm run build` · output: `dist` · Node 20+).
3. Variables (Settings → Environment variables):
   (ver "Estado a 2026-09-24" abajo: van como secretos)
4. Abrir `/keystatic` desplegado → crear la GitHub App que propone Keystatic.
   Genera `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`:
   añadirlas en Cloudflare y redeploy.
5. Cada "Save" es un commit → Pages reconstruye solo.

## Versiones fijadas
Astro 5 + `@keystatic/astro` 5.2 (la 6 rompe con Astro 5 en dev: `astro:env/server`)
+ `@astrojs/cloudflare` 12 + `nodejs_compat` en `wrangler.jsonc`.

## Estado a 2026-09-24 (hecho en sesión)
- GitHub App creada: **Keystatic koisamsa** (`keystatic-koisamsa`), instalada solo en `KoiSamsa/koisamsa-astro`.
- El slug va en `.env.production` (público, se commitea). El repo va fijado en `keystatic.config.ts`.
- Cloudflare usa `wrangler.jsonc`: las *variables* del panel se pisan en cada deploy; los **secretos** no.
  Por eso `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET` y `KEYSTATIC_SECRET` se guardan como **Secret** en Cloudflare → koisamsa → Settings → Variables and secrets.
- Para regenerar el client secret: GitHub → Settings → Developer settings → GitHub Apps → Keystatic koisamsa → *Generate a new client secret*.
