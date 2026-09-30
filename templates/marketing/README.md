# Marketing Site

Marketing site starter: Astro 7, React 19 islands, Tailwind 4, MDX blog. Trimmed from [Cooper](https://github.com/GladTek/cooper) — single locale, blog only.

## Quick start

```sh
mise install
pnpm install
cp .env.example .env
pnpm dev
```

## Structure

- `src/pages/` — index, about, features, pricing, contact, blog (paginated, tags, authors), RSS
- `src/components/` — `ui/` primitives, `sections/` (hero variants, pricing, FAQ, testimonials, …), `layout/`, `blog/`, `islands/` (React)
- `src/content/` — `blog` + `authors` collections
- `src/site.config.ts` — site name, nav/footer links, contact, analytics toggles
- `src/i18n/locales/en.properties` — all UI copy in one strings file

## Scripts

| Script                             | What                                                                          |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| `pnpm dev`                         | Dev server                                                                    |
| `pnpm build`                       | Build (`build:vercel` / `build:netlify` / `build:cloudflare` set the adapter) |
| `pnpm test:unit` / `pnpm test:e2e` | Vitest / Playwright                                                           |
| `pnpm lint:all`                    | ultracite + markdownlint + yamllint + actionlint + cspell                     |
| `pnpm deploy`                      | Cloudflare build + `wrangler deploy`                                          |

## Deploying

The adapter is picked at build time by the `ADAPTER` env var (default `node`). `vercel.json`, `netlify.toml`, and `wrangler.jsonc` are pre-configured to call the right build script.

## Toolchain

mise pins node, pnpm, actionlint, shellcheck, yamllint, betterleaks (`.config/mise.toml`). Git hooks (lefthook) install on `pnpm install`: ultracite fix, markdownlint, yamllint, actionlint, cspell, betterleaks staged scan, commitlint.
