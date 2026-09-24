import { config, fields, collection } from '@keystatic/core';

// Almacenamiento:
// - En desarrollo (npm run dev) guarda los .md directamente en src/content/notes/.
// - En producción (Cloudflare Pages) escribe en GitHub. Las claves de la GitHub App
//   (KEYSTATIC_GITHUB_CLIENT_ID / _SECRET / KEYSTATIC_SECRET) van como secretos en Cloudflare.
const repo = { owner: 'KoiSamsa', name: 'koisamsa-astro' };

export default config({
  storage: import.meta.env.PROD ? { kind: 'github', repo } : { kind: 'local' },
  ui: {
    brand: { name: 'Cliente' },
  },
  collections: {
    notes: collection({
      label: 'Entradas',
      slugField: 'title',
      path: 'src/content/notes/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'fecha'],
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descripción', multiline: true }),
        fecha: fields.date({ label: 'Fecha', defaultValue: { kind: 'today' } }),
        nodo: fields.text({ label: 'Nodo' }),
        imagen: fields.image({ label: 'Imagen destacada', directory: 'public/images/notes', publicPath: '/images/notes/' }),
        categorias: fields.array(fields.text({ label: 'Categoría' }), { label: 'Categorías', itemLabel: (p) => p.value }),
        borrador: fields.checkbox({ label: 'Borrador', defaultValue: true }),
        content: fields.markdoc({ label: 'Contenido', extension: 'md' }),
      },
    }),
  },
});
