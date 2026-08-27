# BUILD PLAN — Paper and Worlds

Rewritten 2026-08-27. **This supersedes the whole previous file**, which planned a
denoise signature on a Vue SPA. Both are dead.

Read in this order:

1. [`DESIGN_LOCK.md`](DESIGN_LOCK.md) — the design, locked
2. [`WORLDS.md`](WORLDS.md) — what is behind each tear, all twelve specified
3. This file — the stack, what gets deleted, and the phases

**The design is locked. The prototype is not finished.** `design/directions/paper.html`
is a working artifact with real bugs (`WORLDS.md` §5). It exists to prove the direction,
not to be ported line by line. The rebuild reimplements it properly.

---

## 1. The stack

### Decided: Astro

| | |
|---|---|
| **Framework** | **Astro 5.** Static output. Islands only where a world canvas or the tear needs one |
| **Content** | Astro content collections. Case studies and notes in Markdown, frontmatter typed with Zod |
| **Styling** | Vanilla CSS with tokens in one file. No Tailwind |
| **Motion** | Native CSS and the Web Animations API. **No GSAP, no Lenis, no smooth-scroll engine** |
| **Canvas** | Hand-written 2D canvas. One shared clock |
| **Deploy** | Vercel, static. Same project |
| **Runtime deps** | Target **1**: `astro`. Every addition argued in `DECISIONS.md` |

### Why, argued

**`REBUILD_BRIEF.md` §3 rule 3 requires every page to read as static HTML with
JavaScript off.** v1 claimed this and did not have it. Astro gives it by construction:
HTML on disk, zero JS by default, and you cannot accidentally lose it. That single
property is worth more here than framework familiarity, because the audience for
`/resume` is a crawler and an ATS parser.

**Twelve case studies plus a growing notes page is a content problem.** Content
collections put every word in Markdown with a typed schema — which is also what
"content before form" has been asking for since the brief was written.

**The islands model matches the design exactly.** The sheet is static HTML. The tear,
the backlight and each world canvas are the only interactive parts, and each is a
separate island that fails independently.

### Rejected

| | Why not |
|---|---|
| **Next.js** | Known to the owner, and the wrong shape: a React runtime on every route to serve twelve static documents. Also makes accidental client-side rendering easy, which is the exact v1 failure |
| **Vue + Vite SPA** | What v1 is. The crawler gap is structural, not incidental |
| **Plain HTML + Vite** | Fewest deps and real appeal, but twelve case studies and a notes feed hand-maintained in HTML will rot. Content collections are the reason to pay one dependency |
| **Any smooth-scroll engine** | v1 ran Lenis. The landing scrolls natively and the tear does not need it. `CLAUDE.md`'s two-clock rule exists because of this |

**The honest cost:** the owner knows Next.js and does not know Astro. The curve is
small, the payoff is that the crawler and ATS gap closes permanently.

---

## 2. What gets deleted, and what survives

The v1 `src/` is 18,572 lines and 49 components. Nearly all of it goes.

### Delete outright

- `src/components/**` — every scene component, overlay, panel and control
- `src/shaders/**`, `src/composables/**`, `src/stores/**`, `src/utils/**`
- `src/data/{layout,cameraPath,nodeMotion,nodeMeshes,sceneRig,labelLod,screenRegions}.ts`
- `three`, `@tresjs/core`, `postprocessing`, `gsap`, `lenis`, `pinia`, `vue`
- `tailwind.config.ts`, the Tailwind escape-hatch idiom, the whole `--bg` token set
- Root `DESIGN_LOCK.md`, `DESIGN_REVIEW.md` — v1 artefacts, superseded

### Keep, and port

| What | Why |
|---|---|
| `src/data/projects.ts` | The only real content inventory. Becomes twelve Markdown case studies |
| `src/data/{about,services,training,capabilities,socialLinks}.ts` | Real, audited copy. Becomes content and page frontmatter |
| `public/media/**` | Captures, the portrait, the paper stock |
| `scripts/browser.mjs` | Solves a proxy and binary problem that will recur. Do not rewrite it |
| `scripts/{shots,a11y-check,perf-check,craft-check}.mjs` | Work today. Re-point at the new routes |
| `design/**` | The research, the direction artifacts, the stock builder, the contrast checker |
| `docs/**` | The only memory that survives a session |

### Rewrite from scratch

`CLAUDE.md`. It currently describes the constellation, the shader cap, the label
projector, `npm run nav`, `npm run labels`, `npm run frames`. **Almost every rule in it
becomes false the moment the scene layer is deleted.** A CLAUDE.md that lies is worse
than none, because the next session trusts it.

---

## 3. The phases

Each phase has an exit gate. **Do not start the next phase until the gate passes.**
The point of the ordering is that Phase 3 ships a complete site before a single canvas
exists, which is what makes Phases 4 and 5 safe to attempt.

---

### Phase 0 — Clear the ground

**Do**

1. Branch `rebuild/astro` off `redesign/v2`.
2. `git rm -r` the delete list in §2. One commit, so it is one revert.
3. Scaffold Astro 5, TypeScript strict, static output, Vercel adapter not needed.
4. Port `scripts/browser.mjs` and the four check scripts. Re-point their URLs.
5. Rewrite `CLAUDE.md` for the new stack. Delete every rule about the scene.

**Gate.** `npm run build` produces HTML on disk. `curl` a built page and read the copy
in the response body. Repo has one runtime dependency.

---

### Phase 1 — Content, and not one line of design

The phase that has been skipped twice. `REBUILD_BRIEF.md` §6 and `SESSION_HANDOFF.md`
§2 both name this as the thing that cost the last two sessions.

**Do**

1. `src/content/work/*.md` — twelve case studies, every beat in `WORLDS.md` §1 written
   out in full. Ported from `projects.ts`, not invented.
2. `src/content/notes/*.md` — the four errata, dated, first person.
3. Page copy for `/`, `/about`, `/resume`, `/hire` in frontmatter or Markdown.
4. Zod schemas so a missing beat is a build error rather than an empty section.
5. Settle the open facts: the BeatMind figures conflict, the QueryPilot benchmark
   number, and every claim in `WORLDS.md` marked 🔴.

**Gate.** 🔴 **The ten-second test, on the text alone, five people, verbatim answers
into `TEN_SECOND_TEST.md`.** It has never been run. It gates everything after this.
Four of five, unprompted.

---

### Phase 2 — The design system

**Do**

1. `src/styles/tokens.css` — the full palette from `DESIGN_LOCK.md` §7, both grounds.
2. Type scale, five sizes in regular use. Bricolage Grotesque, Archivo, DM Mono,
   self-hosted and subset rather than three Google Fonts requests.
3. The sheet as components: `Sheet`, `Deckle`, `Curl`, `Letterhead`, `Entry`.
4. Port `design/contrast-check.mjs` and run it as a gate.

**Gate.** Tokens exist before any page component. Contrast passes on a stub page.
Total font weight under budget and recorded.

---

### Phase 3 — The seven routes, static

No canvas. No tear. No backlight. **A complete, readable, crawlable site.**

**Do**

1. `/`, `/work`, `/work/[slug]` × 12, `/notes`, `/about`, `/resume`, `/hire`.
2. The landing flow from `DESIGN_LOCK.md`: letterhead → sentence and two doors → who
   he is with the portrait → the work index → the numbers → three kinds of work →
   errata → contact.
3. `/resume` as real HTML with `Parth_Tiwari_Resume_B.pdf` as the download beside it.
   **Kill the Drive embed.**
4. Each world's page shows its **still first frame** as a static image or nothing.
5. Metadata: canonical, OG, JSON-LD, sitemap. The site URL in exactly one constant.
6. Regenerate `og.png`.

**Gate.** `npm run a11y` passes at 390/800/1440. `npm run shots` clean at every
viewport. Every route readable with JS disabled, verified by `curl`, not by belief.
Ten-second test passes on the built site. **Ship it live.**

---

### Phase 4 — The signature, one revertable commit

**Do**

1. The tear: entry → seam → world.
2. The backlight on hover.
3. 🔴 **The touch path.** Coarse pointers have no hover, so the landing's central
   invitation currently does not exist on a phone. On coarse pointers the entry nearest
   the viewport centre backlights as you scroll. This is a `CLAUDE.md` requirement, not
   a nicety.
4. Reduced-motion path: no tear, straight to the world.

**Gate.** `git revert` this commit and the site still works completely, with ordinary
page navigation. Verified by actually running the revert, not by reasoning about it.
Touch tested with a real synthesised touch drag, because `mouse.wheel` goes around the
code path that broke in v1.

---

### Phase 5 — The worlds, one commit each

Order from `WORLDS.md` §2: flagships first.

**Per world, every time**

1. Export the real data to JSON at build time. Never `Math.random()` where a real
   number exists.
2. Write the generator against that JSON.
3. Compose the still frame that reduced motion and no-JS will show.
4. Verify the graphic against the spec in `WORLDS.md` §3.
5. Commit alone.

**Gate, per world.** Reverts alone. Still frame stands on its own. 30fps ceiling holds.
Paused off-screen. `npm run perf` clean.

---

### Phase 6 — Cutover

**Do.** Buy `parthtiwari.com` if still wanted, point it, redirect v1, confirm the
production alias from Vercel's `domains` array rather than assuming
`<project>.vercel.app`. Turn on Web Analytics for real.

**Gate.** Ten-second test at 4 of 5 on the live domain. Every link 200 and auth-free.

---

## 4. Budget

| | v1 measured | v2 ceiling |
|---|---:|---:|
| `src/` lines | 18,572 | **≤ 4,000** |
| Components | 49 | **≤ 20** |
| Runtime dependencies | 8 | **1** |
| Eager JS, gzipped, per route | 796 kB worst case | **≤ 30 kB** |
| Fonts, total | not measured | **≤ 180 kB** |

Twenty components rather than fifteen, because seven routes and twelve worlds is more
surface than the brief assumed. **Argued here rather than quietly exceeded**, which is
the rule.

---

## 5. Owner homework, still gating

1. 🔴 **The ten-second test.** Never run. Gates Phase 1 and Phase 3.
2. 🔴 **The BeatMind figures.** 19 days / 194 commits / 27,000 lines in
   `parth-os/RESUME.md` against 24 / 307 / ~30,500 in the case study. One number.
3. The QueryPilot benchmark figure, and every number flagged 🔴 in `WORLDS.md`.
4. Re-shoot Vivid (currently an empty state) and QueryPilot (currently Swagger docs).
5. The domain: buy it or drop it.
