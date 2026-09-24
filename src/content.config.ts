import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Mismo esquema que keystatic.config.ts: markdown puro + frontmatter.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(''),
    fecha: z.coerce.date().optional(),
    nodo: z.string().optional().default(''),
    imagen: z.string().nullable().optional(),
    categorias: z.array(z.string()).optional().default([]),
    borrador: z.boolean().optional().default(false),
  }),
});

export const collections = { notes };
