import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { siteConfig } from '../site.config';

export async function GET(context) {
  const blog = await getCollection('blog');

  const items = blog
    .map((post) => ({
      description: post.data.description,
      link: `/blog/${post.id.replace(/\.[^/.]+$/, '')}`,
      pubDate: post.data.pubDate,
      title: post.data.title,
    }))
    .sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf());

  return rss({
    customData: `<language>en-us</language>`,
    description: siteConfig.description,
    items,
    site: context.site,
    title: siteConfig.name,
    trailingSlash: false,
  });
}
