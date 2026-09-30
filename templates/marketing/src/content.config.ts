import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      audioUrl: z.string().optional(),
      author: z.string().optional(),
      description: z.string(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      isVideo: z.boolean().optional().default(false),
      nofollow: z.boolean().optional().default(false),
      noindex: z.boolean().optional().default(false),
      pubDate: z.coerce.date(),
      tags: z.array(z.string()).optional(),
      title: z.string(),
      updatedDate: z.coerce.date().optional(),
      youtubeId: z.string().optional(),
    }),
});

const authorsCollection = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      avatar: image(),
      description: z.string(),
      name: z.string(),
      social: z
        .object({
          github: z.string().optional(),
          linkedin: z.string().optional(),
          twitter: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = {
  authors: authorsCollection,
  blog: blogCollection,
};
