# Detectors

Deterministic anti-pattern scanning from `vendor/impeccable`. **No API call, no cost.**
Always run before spending model reasoning on a page.

Verified working 2026-08-14 on Node v24.16.0.

## Invocation

```bash
KIT="C:/great learning self paced/z Final Projects/design-kit"
node "$KIT/vendor/impeccable/scripts/detect.mjs" [options] <file|dir|url>
```

## Options that matter here

| Flag | Use |
|---|---|
| `--json` | machine-readable; use when feeding findings into a review file |
| `--scope type,layout` | narrow to one design domain |
| `--viewport 390x844` | mobile-width pass on a URL |
| `--no-config` | ignore project config; use for a clean baseline |
| `--no-advisory` | hide advisory-only findings (e.g. em-dash overuse) |
| `--quiet` | just the count, for before/after deltas |

## Modes

- **HTML files** — static HTML/CSS analysis, follows linked CSS
- **Non-HTML** (CSS, JSX, TSX, Vue) — regex pattern matching
- **URLs** — full Puppeteer render, auto-detected on `http(s)://` and `file://`

The URL mode downloads a browser on first use. For a fast local pass, point it at source
directories instead.

## Suppressing a finding you have decided to keep

Inline comments travel with the file and are preferred over global config:

```
<!-- impeccable-disable overused-font -- exported brand doc -->
.brand { font-family: Inter } /* impeccable-disable-line overused-font */
// impeccable-disable-next-line bounce-easing: intentional bounce
```

Always give the reason after `--`. A suppression without a reason is a finding you lost an
argument with.

## Reading the output

Advisory findings never change the exit code and never count as failures. Treat the
failure count as the number to drive down; treat advisories as taste input.

Do not blanket-suppress. If a rule fires ten times, fix it at the token level once.
