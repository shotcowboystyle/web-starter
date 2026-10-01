# Minimal Site

Markdown-document-style Astro site: one layout, an index that lists entries, and a detail page per entry. Styled with [Shift CSS](https://getshiftcss.com/) (zero-runtime, modern CSS).

## Quick start

```sh
pnpm install
pnpm dev
```

Add entries as markdown files in `src/content/experiments/`:

```md
---
title: My Experiment
description: One-liner shown on the index.
pubDate: 2026-01-01
---

Content here.
```

Edit `src/consts.ts` for the site title and description.

## Scripts

| Script                             | What                                                      |
| ---------------------------------- | --------------------------------------------------------- |
| `pnpm dev`                         | Dev server                                                |
| `pnpm build`                       | Production build (static `dist/`)                         |
| `pnpm test:unit` / `pnpm test:e2e` | Vitest / Playwright                                       |
| `pnpm lint:all`                    | ultracite + markdownlint + yamllint + actionlint + cspell |
| `pnpm deploy`                      | Build for Cloudflare and `wrangler deploy`                |

## Deploying

- **Vercel** — `vercel.json` is set up; import the repo.
- **Netlify** — `netlify.toml` is set up; import the repo.
- **Cloudflare** — `pnpm deploy` (wrangler).

## Toolchain

Managed by [mise](https://mise.jdx.dev) (`.config/mise.toml`): node, pnpm, actionlint, shellcheck, yamllint, betterleaks, betterhook. Run `mise install` once; it also installs the git hooks (betterhook).
