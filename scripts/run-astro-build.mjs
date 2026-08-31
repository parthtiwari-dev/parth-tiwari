import { spawnSync } from 'node:child_process'

const result = spawnSync(
  process.execPath,
  ['node_modules/astro/bin/astro.mjs', 'build'],
  {
    cwd: process.cwd(),
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
    stdio: 'inherit',
  },
)

if (result.error) throw result.error
if ((result.status ?? 1) !== 0) process.exit(result.status ?? 1)

await import('./generate-sitemap.mjs')
