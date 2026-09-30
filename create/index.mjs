#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { cancel, confirm, intro, isCancel, outro, select, text } from '@clack/prompts';
import { downloadTemplate } from 'giget';

const REPO = 'gh:shotcowboystyle/web-starter';

const bail = (value) => {
  if (isCancel(value)) {
    cancel('Cancelled.');
    process.exit(0);
  }
  return value;
};

// Flags allow non-interactive use: create-web-starter my-site --flavor minimal [--react] [--adapter vercel]
const args = process.argv.slice(2);
const argDir = args.find((a) => !a.startsWith('-'));
const flagValue = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const hasFlag = (name) => args.includes(`--${name}`);

intro('create-web-starter');

const dir = (
  argDir ??
  bail(
    await text({
      message: 'Where should the project go?',
      placeholder: 'my-site',
      validate: (value) => (value?.trim() ? undefined : 'Directory name required'),
    }),
  )
).trim();

const flavor =
  flagValue('flavor') ??
  bail(
    await select({
      message: 'Which flavor?',
      options: [
        { hint: 'Astro + Shift CSS, markdown pages, one layout', label: 'minimal', value: 'minimal' },
        { hint: 'Astro + React islands + Tailwind 4, blog, sections', label: 'marketing', value: 'marketing' },
      ],
    }),
  );

if (!['minimal', 'marketing'].includes(flavor)) {
  cancel(`Unknown flavor: ${flavor}`);
  process.exit(1);
}

let withReact = false;
if (flavor === 'minimal') {
  withReact =
    hasFlag('react') ||
    (argDir
      ? false
      : bail(
          await confirm({
            initialValue: false,
            message: 'Add React (islands) support?',
          }),
        ));
}

let adapter = 'node';
if (flavor === 'marketing') {
  adapter =
    flagValue('adapter') ??
    (argDir
      ? 'node'
      : bail(
          await select({
            message: 'Default deploy adapter?',
            options: [
              { label: 'node (standalone)', value: 'node' },
              { label: 'vercel', value: 'vercel' },
              { label: 'netlify', value: 'netlify' },
              { label: 'cloudflare', value: 'cloudflare' },
            ],
          }),
        ));
}

const target = path.resolve(process.cwd(), dir);

// WS_TEMPLATE_DIR points at a local checkout for pre-publish testing.
if (process.env.WS_TEMPLATE_DIR) {
  const skip = new Set(['node_modules', 'dist', '.astro', 'test-results', 'playwright-report']);
  await cp(path.join(process.env.WS_TEMPLATE_DIR, 'templates', flavor), target, {
    errorOnExist: true,
    filter: (src) => !skip.has(path.basename(src)),
    force: false,
    recursive: true,
  });
} else {
  await downloadTemplate(`${REPO}/templates/${flavor}#main`, { dir: target });
}

const pkgPath = path.join(target, 'package.json');
const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
pkg.name = path.basename(target);

if (withReact) {
  pkg.dependencies['@astrojs/react'] = '^6.0.1';
  pkg.dependencies.react = '^19.2.5';
  pkg.dependencies['react-dom'] = '^19.2.5';
  pkg.devDependencies['@types/react'] = '^19.2.8';
  pkg.devDependencies['@types/react-dom'] = '^19.2.3';

  const configPath = path.join(target, 'astro.config.mjs');
  let config = await readFile(configPath, 'utf8');
  config = config
    .replace('// @web-starter:imports', "import react from '@astrojs/react';")
    .replace('// @web-starter:integrations', 'react(),');
  await writeFile(configPath, config);

  const tsconfigPath = path.join(target, 'tsconfig.json');
  const tsconfig = JSON.parse(await readFile(tsconfigPath, 'utf8'));
  tsconfig.compilerOptions.jsx = 'react-jsx';
  tsconfig.compilerOptions.jsxImportSource = 'react';
  await writeFile(tsconfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`);

  const counter = fileURLToPath(new URL('./react-extras/Counter.tsx', import.meta.url));
  await cp(counter, path.join(target, 'src/components/Counter.tsx'));
}

if (adapter !== 'node') {
  const configPath = path.join(target, 'astro.config.mjs');
  const config = await readFile(configPath, 'utf8');
  await writeFile(configPath, config.replace("process.env.ADAPTER || 'node'", `process.env.ADAPTER || '${adapter}'`));
}

await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

// git init so lefthook's prepare hook has a repo to install into.
try {
  execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: target, stdio: 'ignore' });
} catch {
  // Not inside a repo: initialize one.
  execFileSync('git', ['init', '-b', 'main'], { cwd: target, stdio: 'ignore' });
}

outro(`Done. Next:\n  cd ${dir}\n  mise install\n  pnpm install\n  pnpm dev`);
