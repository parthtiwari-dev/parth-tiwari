# Skill 2: Browser-Led Visual QA Loop

Use this workflow whenever the portfolio UI needs visual tuning, especially Phase 1 constellation work.

## Goal

Work like a frontend developer reviewing the real page, not like an agent guessing from code.

- Read the roadmap first.
- Run or reuse the local dev server only when the user allows it.
- Capture screenshots across scroll positions.
- Inspect the screenshots yourself.
- Patch the smallest set of files that improves the visual result.
- Repeat until the page is directionally right and checks pass.

## Rules

- Keep the roadmap structure unless the user explicitly approves a deviation.
- Do not commit screenshot folders such as `.phase1-qa-*`.
- Do not leave dev servers running after automated QA.
- Prefer temporary QA scripts that write artifacts under `.phase1-qa-*`.
- Keep only the latest useful QA folder; remove stale screenshot folders.
- If the user says not to start a server, inspect only an already-running port.

## Startup

1. Read the relevant roadmap section and current progress audit.
2. Check the worktree with `git status --short`.
3. Check whether the app is already listening:

```powershell
Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
```

4. If no server is running and the user has allowed it, start Vite only for QA and kill it at the end.

## Playwright Setup

Use bundled Codex dependencies when the browser plugin is unavailable.

```powershell
$env:NODE_PATH='C:\Users\workf\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules;C:\Users\workf\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\.pnpm\playwright-core@1.60.0\node_modules'
& 'C:\Users\workf\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\.codex-phase1-qa.cjs
```

Use installed Chrome:

```text
C:\Program Files\Google\Chrome\Application\chrome.exe
```

## QA Script Pattern

Create a temporary `.codex-phase1-qa.cjs` only for the active run.

The script should:

- Create a fresh `.phase1-qa-N` folder.
- Reuse `http://127.0.0.1:5173/` if already reachable.
- Otherwise spawn `npm.cmd run dev -- --host 127.0.0.1`.
- Open Chrome through Playwright.
- Capture viewport screenshots at scroll stops:
  - `0`
  - `0.08`
  - `0.16`
  - `0.25`
  - `0.33`
  - `0.40`
  - `0.50`
  - `0.62`
  - `0.75`
  - `0.88`
  - `1`
- Probe hover over likely node positions and confirm `[ENTER ->]`.
- Open `/?plain=1` and confirm `canvasCount === 0`.
- Save `summary.json` with screenshot paths, connector counts, console messages, and page errors.
- Kill the spawned Vite process with `taskkill /PID <pid> /T /F`.

## Inspection Loop

After every screenshot sweep, inspect at least:

- Start frame: first impression, darkness, constellation readability.
- Mid-scroll: whether project nodes come forward naturally.
- Hover screenshot: label position, hit target, visual artifacts.
- Transition frame: Phase 1 to Phase 0 bridge.
- Plain mode: no 3D canvas.

Judge visual issues in this order:

1. Roadmap-breaking structure.
2. Console/page errors.
3. Obvious visual artifacts.
4. Constellation readability.
5. Star realism and density.
6. Glass/transition polish.

Patch only what the screenshots prove is wrong.

## Gates

Run these before calling the checkpoint good:

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd audit --audit-level=moderate
git diff --check
```

Expected notes:

- Three.js chunk-size warnings are acceptable during Phase 1.
- Sandbox font/network errors can happen in headless QA.
- Dev-only TresJS lifecycle warnings should be documented if production build is clean.

## Commit Hygiene

Before committing:

```powershell
git status --short
git add -u
git add docs\skill-2.md
git diff --cached --name-status
```

Do not stage:

- `.phase1-qa-*`
- `.codex-phase1-qa.cjs`
- unrelated untracked files

Then commit the checkpoint with a clear message.
