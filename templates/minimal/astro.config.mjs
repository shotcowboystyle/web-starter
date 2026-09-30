import process from 'node:process';

import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
// @web-starter:imports

export default defineConfig({
  compressHTML: true,
  integrations: [
    sitemap(),
    // @web-starter:integrations
  ],
  output: 'static',
  site: process.env.SITE_URL || 'https://example.com',
});
