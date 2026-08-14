# Picking the target

The corpus lives at `refs/design-md-all/<brand>/DESIGN.md` — 73 analysed design languages,
each with exact hex values, a type scale with letter-spacing, spacing, and guardrails.

**Pick one primary and at most one secondary.** Two is a blend; three is mud.

## Shortlists by project type

| Project type | Try |
|---|---|
| Developer tool / technical product | `linear.app`, `vercel`, `warp`, `raycast`, `sentry`, `supabase` |
| AI product | `claude`, `elevenlabs`, `runwayml`, `mistral.ai`, `replicate`, `together.ai`, `cohere` |
| Audio / music | `spotify`, `elevenlabs`, `runwayml` |
| Creative / media / film | `runwayml`, `framer`, `theverge`, `wired` |
| Premium consumer, restraint | `apple`, `nike`, `starbucks` |
| Fintech / trust | `stripe`, `wise`, `revolut`, `coinbase`, `mastercard` |
| Productivity / SaaS | `notion`, `linear.app`, `intercom`, `zapier`, `airtable` |
| High-drama / showpiece | `tesla`, `spacex`, `ferrari`, `lamborghini`, `bugatti`, `playstation` |
| Deliberately retro | `dell-1996`, `nintendo-2001` |

Full list: `ls refs/design-md-all/`.

## How to use the file

Read the target's `DESIGN.md` and extract only:
1. the palette structure — *how many* roles, not the literal hexes
2. the type scale ratio and letter-spacing behaviour at display sizes
3. the spacing unit and how generous the rhythm is
4. the single signature move

**Then translate, do not copy.** Lifting Apple's `#0066cc` makes a site that looks like a
cheap Apple. Taking Apple's *structure* — one interactive colour, near-black ink, chrome
that recedes so content speaks, exactly one signature shadow — and expressing it in the
project's own palette makes a site that feels considered.

The lock records the target brand and what was borrowed structurally, so later passes do
not drift back toward literal imitation.
