import process from 'node:process';

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

function getAdapter() {
  const adapter = process.env.ADAPTER || 'node';
  switch (adapter) {
    case 'vercel': {
      return vercel({ webAnalytics: { enabled: true } });
    }
    case 'netlify': {
      return netlify();
    }
    case 'cloudflare': {
      return cloudflare({
        platformProxy: { enabled: true },
        runtime: { mode: 'advanced', nodejsCompat: true, type: 'worker' },
      });
    }
    default: {
      return node({ mode: 'standalone' });
    }
  }
}

export default defineConfig({
  adapter: getAdapter(),
  compressHTML: true,
  fonts: [
    { cssVariable: '--font-inter', name: 'Inter', provider: fontProviders.fontsource() },
    { cssVariable: '--font-outfit', name: 'Outfit', provider: fontProviders.fontsource() },
  ],
  image: {
    quality: 80,
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  integrations: [sitemap(), react(), mdx()],
  output: 'static',
  site: process.env.SITE_URL || 'https://example.com',
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['lucide-react', 'motion', 'motion/react'],
    },
  },
});
