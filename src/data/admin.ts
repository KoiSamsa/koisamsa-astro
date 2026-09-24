import { getCollection } from 'astro:content';

// Datos del clon del admin. Marca neutra: se sustituye por la del cliente.
// Rutas del panel real (Keystatic). El clon /admin/ es la portada; la edición ocurre aquí.
export const keystatic = {
  create: '/keystatic/collection/notes/create',
  edit: (slug: string) => `/keystatic/collection/notes/item/${slug}`,
};

export const brand = { name: 'Cliente', initial: 'C', site: 'Cliente', version: '1.0' };

type SubItem = { label: string; href: string };
type MenuItem = { id: string; label: string; href: string; badge?: string; gapBefore?: boolean; sub?: SubItem[] };

export const menu: MenuItem[] = [
  { id: 'dashboard', label: 'Escritorio', href: '/admin/', sub: [
    { label: 'Inicio', href: '/admin/' }, { label: 'Actualizaciones', href: '/admin/' } ] },
  { id: 'posts', label: 'Entradas', href: '/admin/entradas/', gapBefore: true, sub: [
    { label: 'Todas las entradas', href: '/admin/entradas/' }, { label: 'Añadir nueva entrada', href: keystatic.create },
    { label: 'Categorías', href: '/admin/entradas/' }, { label: 'Etiquetas', href: '/admin/entradas/' } ] },
  { id: 'media', label: 'Medios', href: '/admin/' },
  { id: 'pages', label: 'Páginas', href: '/admin/' },
  { id: 'comments', label: 'Comentarios', href: '/admin/', badge: '1' },
  { id: 'appearance', label: 'Apariencia', href: '/admin/', gapBefore: true },
  { id: 'plugins', label: 'Extensiones', href: '/admin/' },
  { id: 'users', label: 'Usuarios', href: '/admin/' },
  { id: 'tools', label: 'Herramientas', href: '/admin/' },
  { id: 'settings', label: 'Ajustes', href: '/admin/' },
];

export type Post = { slug: string; title: string; draft: boolean; cats: string; date: string; day: string; editHref: string };

const fmt = (d?: Date) => d ? d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

// Lee las entradas reales de src/content/notes (las que escribe Keystatic).
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('notes');
  return entries
    .sort((a, b) => (b.data.fecha?.getTime() ?? 0) - (a.data.fecha?.getTime() ?? 0))
    .map((e) => ({
      slug: e.id,
      title: e.data.title,
      draft: e.data.borrador,
      cats: e.data.categorias.join(', ') || 'Sin categoría',
      date: fmt(e.data.fecha),
      day: fmt(e.data.fecha),
      editHref: keystatic.edit(e.id),
    }));
}
