# What we actually have to design with

Written 2026-08-26, before any direction was chosen, because several well-regarded design
recipes turn out to be unavailable once you check what material exists. A direction that
needs commissioned photography is not a direction, it is a shopping list.

## Real captures, verified on disk

From `public/media/`, produced by `scripts/capture-demos.mjs`, which re-verifies every URL
returns 200 without auth before it captures.

| Project | Desktop | Mobile | Video | Live and linkable |
|---|---|---|---|---|
| BeatMind | yes, 318 KB | yes, 185 KB | yes, 1.4 MB | yes, `www.beatmind.tech` |
| Vivid (Stick and Dot) | yes, 174 KB | yes, 123 KB | yes, 486 KB | yes, `vivid-alpha.vercel.app` |
| Tathya | yes, 430 KB | yes, 227 KB | yes, 2.1 MB | yes |
| QueryPilot | yes, 162 KB | yes, 142 KB | no | yes |
| Spur Chat | yes, 115 KB | yes, 141 KB | no | yes |
| Portrait | 900x1125, 4:5 | 220px variant | no | n/a |

**Five products with real screenshots at two widths. Three with silent screen recordings.
One portrait.** That is a genuinely usable visual inventory and it is the single biggest
constraint on which direction is buildable.

## Real numbers, with denominators

From `parth-os/docs/AUDIT.md` and `case-studies/beatmind.md`. Each of these survives someone
asking "out of what?", which is the standard in `parth-os/docs/DESIGN.md` §1.

| Number | What it is |
|---|---|
| ₹50,000 | One product, one contract |
| ₹72,000 | Total paid across five months |
| 24 days | BeatMind, solo, start to live |
| 307 commits, ~30,500 lines | BeatMind |
| 70s → 23.4s | Stem separation, after root-causing a missing `libcublasLt.so.13` that made onnxruntime fall back to CPU while the GPU sat idle. Re-verified on T4 and L4 |
| 299 tests, 4 tiers | BeatMind, including a throwaway Neon branch per CI run |
| 2,250 training steps | The Vivid LoRA, trained by him |
| 0 users | BeatMind. Stays on the page |

**Conflict, unresolved:** `parth-os/RESUME.md` says 19 days / 194 commits / 27,000 lines. The
case study says 24 / 307 / ~30,500 and is the later, more precise source. Settle before any
of these ship.

## The corrections record

`parth-os/docs/RULES.md` §6 identifies this as the differentiator: almost nobody publishes
the measurement that killed their own hypothesis. Four exist and are real.

- Predicted 40% from a Demucs swap, measured 8%, reverted
- Built a self-attestation checkbox for copyright, then deleted it, because a checkbox is not
  a rights check
- Conditioning each shot on the previous shot's pixels was supposed to preserve continuity;
  at guidance 3.5 the reference's hand pose overrode the text prompt and later shots ran ~4x
  slower. Dropped to a single character anchor
- Hit invisible reCAPTCHA on automated job applications, declined to bypass it, shipped
  assisted review instead

## What we do not have, and will not have by ship

Naming these kills four otherwise-attractive design recipes outright.

| Missing | Kills |
|---|---|
| Commissioned editorial photography, place and people | `monocle-magazine`: "without photography this recipe is hollow" |
| Physical objects worth photographing | `stripe-press`: the hero is a real book photographed on cream paper |
| Long-form published writing | `stripe-press` again: "don't use when the deliverable has no editorial or publication content" |
| Any testimonial, client name or usage figure | Every social-proof pattern. `parth-os` forbids inventing one and that holds |
| A recognised affiliation | Every hero that reads "X at <famous company>". See `docs/DECISIONS.md` §1.1 |

Two more recipes are ruled out by the goal rather than by materials:

- **`are-na`** explicitly rejects premium signalling. Someone charging ₹1L cannot open with a
  page that reads as deliberately unfinished.
- **`tufte-dataink`** says outright: "don't use when the medium is mobile", because 12-14px
  body plus margin notes does not fit a phone. Mobile is mandatory here. Tufte stays as a
  source to borrow from, not a direction to adopt.

## What this leaves

The material points at screenshots and numbers, because that is what exists. Any direction
that leads with product captures and measured figures is buildable this week. Any direction
that leads with photography, longform or social proof is not buildable at all.
