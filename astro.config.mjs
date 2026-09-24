import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://koisamsa.com',
  // Hosting: Cloudflare Pages (decisión firmada 2026-07-13). El sitio sigue siendo
  // estático; solo /keystatic y /api/keystatic se sirven bajo demanda (Worker).
  adapter: cloudflare(),
  integrations: [react(), markdoc(), keystatic()],
});
