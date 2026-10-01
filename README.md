# web-starter

Personal starter kit for static sites. Two flavors, one scaffolding CLI, full DX suite pre-wired.

## Quick start

```sh
pnpm dlx github:shotcowboystyle/web-starter my-site
```

Prompts for flavor, React (minimal only), and deploy adapter (marketing only). Non-interactive:

```sh
pnpm dlx github:shotcowboystyle/web-starter my-site --flavor minimal --react
pnpm dlx github:shotcowboystyle/web-starter my-site --flavor marketing --adapter vercel
```

Then:

```sh
cd my-site
mise install
pnpm install
pnpm dev
```

## Flavors

| | minimal | marketing |
| --- | --- | --- |
| Purpose | Markdown-document pages (e.g. list of web experiments) | Full marketing site |
| UI | One layout: title + content + back link | Component library (ui, sections, layout, blog) |
| Styling | [Shift CSS](https://getshiftcss.com/) — zero-runtime, OKLCH, `light-dark()` | Tailwind 4 |
| React | Optional (`--react`) | Always (islands) |
| Content | `experiments` collection | `blog` + `authors` collections (MDX) |
| Rendering | Fully static, no adapter | Static + adapter switch (`ADAPTER=vercel\|netlify\|cloudflare\|node`) |

## DX suite (both flavors)

- **Format/lint**: ultracite (oxlint + oxfmt)
- **Hooks**: betterhook (worktree-aware) — ultracite fix, markdownlint, yamllint, actionlint, cspell, betterleaks (staged secret scan), commitlint
- **Tests**: Vitest (unit) + Playwright (e2e)
- **CI**: lint + test + build + Lighthouse CI + betterleaks + lychee link check
- **Toolchain**: mise pins node, pnpm, actionlint, shellcheck, yamllint, betterleaks
- **Deploy**: `vercel.json`, `netlify.toml`, `wrangler.jsonc` ready in both

Spell check is cspell for hooks/CI. [Codebook](https://github.com/blopker/codebook) (Rust Spellbook engine) is worth adding as an editor LSP, but its CLI is pre-1.0 — revisit later.

## Repo layout

```text
create/           the CLI (published as create-web-starter)
templates/
  minimal/        self-contained project, fetched by giget
  marketing/      self-contained project, fetched by giget
```

Templates are deliberately standalone (own configs, lockfiles, workflows) so a giget fetch delivers a working project. Cost: DX config changes must be synced across `templates/*` and root by hand.

## Working on this repo

```sh
mise install   # also installs git hooks (betterhook) via mise postinstall
pnpm install
```

## Local CLI development

```sh
WS_TEMPLATE_DIR=$(pwd) node create/index.mjs test-site --flavor minimal
```

`WS_TEMPLATE_DIR` copies from the local checkout instead of downloading from GitHub.
