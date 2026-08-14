# Refero intake — human-curated

`styles.refero.design/robots.txt` disallows `anthropic-ai`, `ClaudeBot`, `Claude-Web`,
`GPTBot`, `CCBot`, `PerplexityBot` and others from the entire site.

**This skill never fetches refero.** Not by WebFetch, not by Firecrawl, not by Playwright,
not by browser automation. That is the site owner's stated boundary and it is not the
user's to waive.

## What happens instead

The user browses refero themselves — which is exactly what the site is for — and saves the
screenshots they like into `inbox/refero/`.

Naming: `<style-or-brand>--<what-caught-your-eye>.png`, e.g.
`vercel-dashboard--card-elevation.png`. The suffix matters more than the prefix; it records
*why* it was saved, which is the part that is otherwise lost.

## Reading captures

When `inbox/refero/` has files, they take precedence over brand files from the corpus —
they were deliberately chosen, and a chosen reference beats a suggested one.

Read up to **6** captures per pass. For each, extract:

- dominant surface and ink colours, sampled not guessed
- type: how many faces, the display face's weight and tracking at large sizes
- spacing rhythm and whether it is tight or generous
- the one thing that made it worth saving

Then synthesise across all of them: what do these six share? That shared quality is the
real target, and it is usually not what the user would have said if asked directly.

Record the synthesis in `DESIGN_LOCK.md` under `## Target`, citing the capture filenames so
a later pass can re-derive it.

## Cost

Six images is a real token cost. Read them once at `init`, write the synthesis into the
lock, and do not re-read them on subsequent passes.
