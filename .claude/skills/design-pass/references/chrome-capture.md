# Chrome capture

Claude-in-Chrome (`mcp__claude-in-chrome__*`) drives the user's real browser. Load the
tools in **one** ToolSearch call, never several:

```
ToolSearch "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,
mcp__claude-in-chrome__computer,mcp__claude-in-chrome__resize_window,
mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp"
```

Call `tabs_context_mcp` first. Create a new tab rather than reusing the user's.

## What Chrome is for here

### 1. Auditing and verifying the user's own sites — the main use

This is unrestricted and it is the whole verify loop.

```
resize_window 390x844   -> computer screenshot   # mobile
resize_window 834x1112  -> computer screenshot   # tablet
resize_window 1440x900  -> computer screenshot   # desktop
```

Three per pass, hard cap. Screenshots are images and images are the dominant token cost in
this skill.

Advantages over Playwright for the audit specifically: real Chrome, the user's own
extensions and fonts, and hover/focus states reachable via `hover` and `key`. Use Playwright
instead when the pass needs to be scripted, repeatable, or run in CI.

For before/after, save to `.design-pass/before-<w>.png` and `.design-pass/after-<w>.png` and
report the findings delta alongside.

### 2. Checking a competitor or reference the user names directly

Fine when the site permits it. **Check `robots.txt` before the first fetch of any host** —
one `curl -s <host>/robots.txt` — and look for `anthropic-ai`, `ClaudeBot`, `Claude-Web`,
`GPTBot`, or a blanket `User-agent: *  Disallow: /`.

If disallowed, say so, and route to the capture-intake path below. Do not proceed because
the user asks again; it is the site owner's boundary, not the user's to waive.

### 3. Live debugging of a design fix

`read_console_messages` and `read_page` for the accessibility tree — useful for checking
contrast, focus order and landmark structure that a screenshot cannot show.

## What Chrome is not for

**Traversing a design-gallery site to harvest its catalog.** Navigating page after page and
extracting designs is crawling regardless of which tool performs it. `styles.refero.design`
disallows `anthropic-ai`, `ClaudeBot`, `Claude-Web`, `GPTBot`, `CCBot`, `PerplexityBot` and
others across the whole site.

## Capture intake — the path that always works

The user browses the gallery themselves, saves what they like, and drops the files in
`inbox/refero/`.

Naming: `<source>--<what-caught-your-eye>.png`

```
inbox/refero/
  linear--command-palette-density.png
  raycast--how-the-panel-floats.png
  runway--timeline-scrubber-contrast.png
```

The suffix is the valuable half. It records *why* it was saved, which is the exact signal a
crawler cannot capture and the one this skill actually needs.

Read at most 6 per `init`. Extract to the five written abstractions
(`references/divergence.md` Step 1), write those into `DESIGN_LOCK.md`, then **drop the
images from working context.** Do not re-read them on later passes — the lock is the
artifact, and holding the pictures biases the build toward copying.

## Never

Do not click, submit, log in, accept cookie banners, or change any state on a site that is
not the user's own. This skill reads and screenshots; it does not interact.
