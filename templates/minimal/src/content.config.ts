import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const experiments = defineCollection({
  loader: glob({ base: './src/content/experiments', pattern: '**/*.md' }),
  schema: z.object({
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    title: z.string(),
  }),
});

export const collections = { experiments };
