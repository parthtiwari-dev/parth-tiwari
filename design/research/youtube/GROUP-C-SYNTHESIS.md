# Group C synthesis

Twelve videos: PL06, PL07, PL08 (UI Collective, the client-ready build playlist), and nine
standalone videos, six of them from Jack Roberts. Roughly three hours. Read end to end
2026-08-26.

Group C was assigned the client-ready builds, the 3D and animation material, and the skill
roundups. The brief flagged that the titles are clickbait and that separating real technique
from engagement farming might be the most valuable output. That turned out to be true, but not
in the direction expected: **the most spectacular technique in the group is also the cheapest
to run and the least likely to repeat the v1 failure, and it does not involve WebGL at all.**

Read order if time is short:

1. `G0tOexS93IM` (6:40, the only portfolio build, the densest method per minute)
2. `bBlY5YOsKN8` (18:33, the most disciplined, and the only one that has looked at a phone)
3. `l7G97gNyM8k` and `8fva1VtacT8` (frame-sequence scrubbing, the actual deliverable)
4. `jq9LRwE0-GQ` (the gauntlet loop, and the only real cost figures in the group)

---

## 1. Headline answers

**PL08 contains no 3D technique.** It contains a prompt for a rotating sphere. No library is
named, nothing is measured, mobile is never opened. Section 2.

**The genuinely spectacular technique in Group C is frame-sequence scrubbing** (PL06, PL07):
generate a short video with an AI video model, explode it into numbered stills with `ffmpeg`,
drive the frame index from scroll position or hover. It reads like a high-end product launch
page. It needs no WebGL, no shader, no GPU tier detection, no `three` dependency, and it
degrades to a static image by doing nothing. It has one large cost nobody in either video
mentions, and that cost is bytes. Section 3.

**The AI-slop video contains no slop diagnosis.** The tells are in two other videos by the same
presenter. Section 4.

**Mobile is absent from eleven of twelve videos.** Section 5.

---

## 2. PL08 and 3D: the technique, and what it cost

`AGHqBAVyrQs`, "Claude Code + 3D Animations: Build Client Ready Websites in 20 Minutes", 15:14,
UI Collective.

### Which library

**None is named.** Grepped the full transcript for `three.js`, `threejs`, `three`, `webgl`,
`spline`, `r3f`, `react three`, `gsap`, `framer`, `lottie`, `shader`, `glb`, `gltf`, `canvas`.
One hit: `canvas`, once, meaning the browser window during a resize.

The video titled after 3D animation never establishes what renders the 3D. It could be
Three.js, a CSS 3D transform on a textured sprite, or a looping video element. The transcript
cannot tell you and neither can he, because he never opens the code.

**The only mention of a 3D library anywhere in Group C is in `G0tOexS93IM`**, on a portfolio,
where a "liquid scrolling 3JS effect" is applied to the work-section images. One effect, one
section. And the prompt that produced it is the one prompt in Group C that the presenter
deliberately withheld: "I won't bore you reading through all the details on this one because
it's pretty technical, but I'll drop it in the description."

### What the technique is

Two things, both prompted in plain English:

1. A **starfield background image**, generated through the Higgsfield MCP connected to the
   Claude app as a custom connector.
2. A **planet behind the hero text that rotates slowly**, prompted into existence by Claude
   Code after the first attempt returned a static PNG sliding across the screen.

His reaction to that first attempt is the only quality judgement in the video:

> "the clear issue here is that you saw that Mars is an image. And like this is just something
> that you could do in PowerPoint. Like I'm pretty sure I did something similar in like the
> fifth grade."

He owns the prompt failure ("this is on me because I didn't give it a really detailed prompt to
start. But if you spent more time than I did and actually described what you want you get a
better first time output") and rewrites it. The rewrite is the transferable artefact, quoted in
full in section 7. Its shape is a reusable pattern:

- state the failure in the model's own terms ("Mars should be 3D and not a static image")
- state the desired **physical behaviour** ("rotating like an actual planet", "spinning very
  slowly")
- **rank the element** ("It's important to note that Mars is the most important part of the
  website")
- describe the **depth relationship in words**, not z-index ("falls behind the text", "should
  feel like Mars is a part of the background", not "moving on to the background")

### What the performance cost was

**Never mentioned. Not once, in any form.** No frame rate. No bundle size. No draw calls. No
texture resolution. No device tier. No fallback. No reduced-motion path. No profiler, no
devtools panel, no Lighthouse run. The word "performance" does not appear in the transcript.

### What happened on mobile

**Mobile is never mentioned in PL08.** Neither is any device. The single responsiveness check in
the video is dragging the desktop browser window narrower and looking at it:

> "as we adjust like the canvas size, like we don't lose those interactions. We can see it does
> appear in pretty responsive, too. Which is really good."

A narrow desktop window is not a phone. This repo already knows that in writing: `qualityTier.ts`
branches on `(pointer: coarse)`, and `CLAUDE.md` records that "a merely-narrow window takes the
wrong branch and proves nothing". The same file records that a `touch-action` default meant "a
phone could not scroll the page at all" and that no screenshot gate caught it. **PL08's
responsiveness evidence is strictly weaker than evidence this repo has already rejected as
insufficient.**

### Did he measure anything, or assert it looked good

**Assert.** Every quality claim is an unaided visual impression, several hedged against the
recording quality:

- "I don't know if you can see it on the resolution but the starry background looks great.
  Looks phenomenal I think."
- "It's rotating. It looks clean. It has that 3D effect to it ... That is exactly what I want to
  see."
- "I think it's looking really good. It's come a long way in a very short amount of time."

The one negative judgement he makes, he declines to act on: "now that I see it here, I don't
know if I'm the biggest fan. It just doesn't stand out enough. But that's okay, it's not the end
of the world."

There is no measurement of any kind in PL08. That is the video, not a gap in the extraction.

### Is this what killed v1, and where exactly is the line

**As filmed, no. But it is one prompt away from it, and the video gives no reason not to take
that step.**

v1 was: nine projects as objects in 3D space, positions derived from data, a camera rig, a
guided scroll tour plus free orbit, projected DOM labels with decluttering and occlusion, orbit
paths, a particle field, a sky shader, matcaps, post-processing, a quality tier system, a
plain-mode backstop. **The 3D was the interface.** Reaching a project meant orbiting to it and
decoding it.

PL08 builds: one object, one behaviour (rotate), one background image, and a scroll-linked zoom
into the next section. Nothing in the scene is clickable. Nothing is navigable. Nothing encodes
data. The visitor never has to understand it to reach anything. **It is wallpaper with a slow
rotation, and wallpaper is safe.**

**The line, as a test to apply to any proposed v2 creative layer:**

| Test | v1 | PL08 |
|---|---|---|
| Can a visitor reach every piece of content with the creative layer deleted? | No | Yes |
| Must the visitor interpret the visual to proceed? | Yes | No |
| Is the visual the only route to any information? | Yes | No |
| Does the layer own its own navigation model (orbit, pan, select)? | Yes | No |
| Does the layer claim to encode data the visitor must decode? | Yes | No |

v1 fails all five. PL08 passes all five. **The failure mode begins the moment the spectacular
object becomes the way to get somewhere, or the moment the visitor must decode it to understand
what is being sold. Not at the moment it becomes spectacular.**

That distinction matters for the "nothing feels out of the world creativity" note. Spectacle and
clarity were in tension in v1 because **one object was doing both jobs**. Separate the jobs and
the tension goes away: the creative layer can be as loud as you like as long as content does not
live inside it. Every one of the four techniques in section 6 sits on the safe side of that
table.

PL08 also states the correct ordering principle, which is the diagnosis of v1 delivered by
someone selling 3D:

> "instead of starting out with any 3D interactive elements, it's easy to almost start out with
> the text layouts of the header itself. What a lot of designers do is they like to start with
> the animations. They like to start with the imagery ... and then they realize that they can't
> find a text treatment that actually goes with that image. So, when you have the text layout,
> it's easier to work backwards and build 3D elements around the look and feel that you're going
> for."

And one discipline worth keeping: **one hero object, reused as the transition between sections.**

> "whenever I have sort of this big 3D element anywhere on the page, one strategy that you can
> take is incorporate that into the scroll of the next section ... bring Mars to center and zoom
> in on it ... it sort of connects the two sections via this big 3D element."

One object carried through the scroll is the opposite of nine independently navigable stars.

---

## 3. PL06 and PL07: frame-sequence scrubbing, and the generated-imagery conflict

`l7G97gNyM8k` (15:07) and `8fva1VtacT8` (17:00), UI Collective. Same pipeline, different bindings
(scroll in PL06, hover plus scroll in PL07).

### The technique, step by step

1. **Generate still A**: the subject in its resting state.
2. **Generate still B**: the subject in its end state.
3. **Generate the video between them**: an image-to-video model with A pinned as the start frame
   and B as the end frame.
4. **Explode the MP4** into numbered PNGs with `ffmpeg`. PL06 got 120 to 121 frames. PL07 got
   about 100.
5. **Bind the frame index to a pointer signal**: scroll offset in PL06 and in PL07's second
   section, hover state in PL07's hero.
6. **Sync text reveals to frame ranges**, so a callout appears as its part separates.
7. **Reverse at the end** so the object reassembles and recentres (PL06 only, and it is the best
   moment in either video).

The stated reason for the frame explosion, which is the whole argument for the technique:

> "with this is like an MP4, we lose control over the individual frames. So if we want certain
> interactions to happen as a user takes an action, it's very difficult to jump to that
> particular section or second or millisecond of a video. It's much easier to break it out and
> jump to different sections."

### The exact models

| Stage | Model | Access route |
|---|---|---|
| Stills | **Nano Banana** and **Nano Banana Pro** (Google) | Higgsfield AI, image generation section |
| Video | **Kling 3.0** | Higgsfield AI, video section, start frame plus end frame |
| Cheaper still route (other videos) | **Nano Banana 2** | kie.ai, about 6 cents per 2K image |

Why Nano Banana, in his words: "it's really good at image generation, generating these real-life
images."

### Prompt structure for stills

`[subject] + [count and arrangement] + [background] + [aspect ratio set in the UI, always 16:9]`

- "five different colored Apple Watches side by side, white background"
- "with this frame of an iPhone in the center, add the battery of the camera above it, and the
  lenses of the camera above the battery"

Then a **second pass that isolates one subject from the first image**, using the first image as a
reference input:

- "isolate the middle Apple Watch same size. white background."

Finish and texture are appended as a short adjective phrase, nothing more:

- "Apple Watch purple liquid gradient on the screen, white background"

His comment on the result: "Ultra realistic. Looks really cool ... you also see that shine across
the Apple Watch screen. Looks very realistic, very real life."

### Prompt structure for the video

Describe the motion physically, then **name what must not change**. That second clause is the
technique:

- "Apple Watches slide out from either side. **The Apple Watch in the middle does not shift or
  change size.**"
- "The iPhone rotates and flips sideways in midair, separating into its screen, battery, camera,
  and outer frame. Each component floats apart briefly before snapping back together into the
  full phone view."

### The one hard technical rule in either video

> "the size of the starting image is the size that the image comes out that the video ends up
> being. So if this is like a really thin image to start and this was the 16 by 9 the whole video
> would be really thin like 9 by 16. So if you want it to naturally [fit] more in a website, you
> might want to have both of those images generated be 16 by 9."

**Generate both keyframes at the aspect ratio the section will occupy.** Otherwise the video, and
therefore every extracted frame, is the wrong shape.

### Post-treatment

**There is none.** No grading, no masking, no compositing, no background removal, no edge
matting. Iteration is the entire post-treatment: "I ran it a bunch of different times just to see
what different results we get."

Both videos ship visible artefacts and say so:

- PL06, a hard seam where the generated shadow meets the page background. He asks Claude to
  soften it, it does not work, and he ships it: "It looks like there's still an issue with the
  shadow here, but we're going to pretend as if it's perfect."
- PL07, a light grey band at the frame edges where the generated white background does not match
  the page: "those first couple frames have like this very thin light gray background, where you
  can kind of see it at the edge here, but it's okay for now. If we had more time, we could play
  with the AI in order to remove those."

**Both defects are the same defect**: a generated image whose background does not match the
surface it is placed on. That is the single most common tell of generated site imagery, neither
presenter has a fix for it, and the fix is not a prompt. It is a transparent PNG or a matched
background colour, and neither video does either.

### The unstated cost: bytes

Neither PL06 nor PL07 states a file size, a total payload, a format, or a loading strategy for
the frame sequence. This is the largest gap in Group C.

**Inferred, not stated:** 120 frames at 1600x900 as PNG is plausibly 300 KB to 1 MB each, so
roughly 36 MB to 120 MB. As WebP at quality 80 it might be 40 to 80 KB each, so 5 to 10 MB. Even
the optimistic figure is several times the entire eager budget this repo enforces with
`npm run budget`. On a phone on mobile data in India or on a US recruiter's flaky hotel wifi,
the optimistic figure is still a multi-second stall before the hero does anything.

Mitigations that neither video mentions and that would have to be designed in:

- fewer frames (24 to 40 rather than 120, with the scrub interpolating)
- WebP or AVIF rather than PNG
- a single sprite sheet rather than N requests
- decode the first frame eagerly, the rest behind an idle callback, and hold frame 1 until ready
- a static frame-1 image as the no-JS and reduced-motion state, which costs nothing extra

**The honest verdict on this technique for this project: it is the strongest creative option in
Group C, and it is only viable with a measured byte budget attached before a single frame is
generated.** It is spectacular, it is trivially revertible (delete the section, keep the still),
it has no `three` dependency, and it has a real fallback. It also has a payload that will fail
this repo's own budget gate unless it is designed against a number from the start. That is a
solvable engineering problem, unlike "does the visitor understand the constellation", which was
not.

### The conflict with this repo's hard rule on imagery

Stated plainly, because it is a direct collision.

`CLAUDE.md` says:

> **`images` and `video` are evidence, not decoration.** Both are captured from deployments
> confirmed public and auth-free by `scripts/capture-demos.mjs`, never mocked up, never taken
> from a prototype, and every `alt` and `caption` must describe what is actually in the frame.

And:

> **do not add a visual that does not encode something true.** Decoration that pretends to be
> data is the specific failure mode this project exists to avoid.

And the sharpest edge of it:

> Note that `images` counts toward `evidenceOf()` in `layout.ts`, so adding a capture
> legitimately grows that project's star.

**PL06 and PL07 advocate exactly the prohibited thing.** Their entire method is generating
photorealistic product imagery of a product that does not exist and presenting it as the hero of
the page. PL07 explicitly frames the output as portfolio material for "a hiring manager
recruiter". A generated photorealistic hero on this site would break the rule, and if it were
ever added to a project's `images` array it would also silently inflate that project's evidence
score. That second consequence is worse than the first, because it is invisible.

**The resolution, which comes from a different Group C video.** `QUI6Ug4cHnE` is the only
presenter who had real photographs to protect, and his answer is the right one:

> "Just use the pictures that are already in there. So there's one image of me speaking. There
> is also an image of all of us at one of our events ... those are the only two images I gave
> you ... **But actually it'd be cool if you generated a few images that weren't necessarily
> photorealistic** ... minimalistic geometric low poly human figures ... Just keep it minimal and
> make it match the color scheme and the brand guidelines."

Real photographs stay real. Where filler is needed, ask for something **deliberately
non-photorealistic** so it cannot be mistaken for a capture of something that did not happen.

**The test to apply: does the image assert a fact about the world?**

| Image | Asserts a fact | Allowed here |
|---|---|---|
| Screenshot of a shipped deployment | Yes: "this exists and looks like this" | Yes, via `capture-demos.mjs` |
| Generated photorealistic product shot | Yes, falsely | **No** |
| Generated screenshot-like UI mockup | Yes, falsely | **No**, and worse, it would feed `evidenceOf()` |
| Generated starfield, gradient field, abstract texture | No | Yes, as ornament, outside `images` |
| Generated low-poly or geometric illustration | No, announces itself as illustration | Yes, as ornament, outside `images` |

The dividing line is not "generated versus captured". It is **depictive versus ornamental**. An
abstract generated background claims nothing and breaks no rule. A generated photograph of a
dashboard claims something false. Anything generated must stay out of `images` and `video`
regardless, because those fields are wired to the evidence score.

And the warning, from the same video, in one sentence: on a site whose stated signature move was
"every claim has a receipt", the model **fabricated a photo caption**, labelling a real
photograph as an event it was not from. The presenter caught it by eye. On an evidence-led
portfolio, every generated or model-written caption needs a human check against the actual
frame.

---

## 4. The AI-slop material

`SA-wJWO91mi5o0`, "Claude Design 3.0 Just Destroyed AI slop Forever", 17:55, Jack Roberts.

### What this video specifically identifies as slop

The brief asked for every specific tell and every concrete fix value from this video. The honest
answer: **it identifies nothing specific and gives no design values.** The entire diagnosis is
two sentences:

> "the issue is that essentially every page that Claude is designing is from the same system,
> the same prompts. How do we actually stop that?"

> "everyone's getting the same kind of look and design and how do we differentiate from that?"

The prescribed fix is "build a design system". No tell is named. No before-and-after is
measured. No px, rem, hex, ms, easing curve, type ratio or spacing scale appears anywhere in the
transcript.

### Every concrete value that is in that video

Three, and none of them are design values:

| Value | What it applies to |
|---|---|
| **About 25 seconds** | Recommended clip length for a hero motion piece. Attributed to trial and error |
| **About 5 minutes** | Design system generation time in Claude Design |
| **50 MB** | File attachment ceiling |

Plus one structural rule for a looping piece: "the first frame and the end frame are like
identical."

And one principle, arrived at thirteen minutes in, about a video graphic rather than a website,
which is the actual anti-slop content of the video:

> "I only want to see nice HTML components. I don't need loads of text. And I think little
> explanatory text would really add the value, but it shouldn't be something that the user has to
> squint at. **Don't make the user think. Don't make them exert too much cognitive energy in
> understanding what this looks like.** Cut out the other bits and let's just simplify this down
> a little bit."

That is, incidentally, the v1 post-mortem.

The one durable framing in the video is the **"one moving piece"**, and it is the v2 brief
restated by accident:

> "one shot is not enough. It's all about iteration and adding the right elements. And we want to
> have a showstopping feature to this website ... And we call this one moving piece. Think of it
> like the ornament. Think of it as something show-stopping that just makes the website or the
> asset stand out."

### The real slop tells, assembled from the rest of Group C

The tells the titled video does not have are in three other videos.

| Tell | Source | Verbatim |
|---|---|---|
| Purple gradients | `z9CwM-DAe5Q` | "you're going to see purple gradients" |
| Inter as the default typeface | `z9CwM-DAe5Q` | "you're going to see Inter font" |
| A row of three equal cards | `z9CwM-DAe5Q` | "the classic three running boxes" |
| The same hero section every time | `z9CwM-DAe5Q` | "it's got the same hero section ... You can see it a mile away" |
| Five tell categories | `NAumQObJEwM` | "typography, imagery, hierarchy, color, spacing" |
| Letter spacing too loose | `NAumQObJEwM` | "The letter spacing is too loose" |
| No elevation ladder | `NAumQObJEwM` | "There's no elevation ladder" |
| Hero art competing with the product | `NAumQObJEwM` | "the hero art competes with the product" |
| Model defaults win when unspecified | `bBlY5YOsKN8` | "If you let Claude Design build the design system on its own, it just falls back to the generic colors and styles that the Opus models use everywhere" |
| Buttons come out without hierarchy | `bBlY5YOsKN8` | "it tends to not pick button colors properly. Some buttons need to grab attention and should be in a bold color to stand out" |
| Wireframe-derived pages come out under-filled | `bBlY5YOsKN8` | "the site comes out a little blank on its own ... you can ask it to add textures and elements for a fuller look" |
| Springy easing reads wrong | `bBlY5YOsKN8` | "keep them subtle and not make anything too springy since that can feel off" |
| Scroll-synced motion runs too fast | `QUI6Ug4cHnE` | "on a typical scroll, that's too fast", said twice about two different elements |

The properties `NAumQObJEwM` says a teardown should compare, which is the closest thing Group C
has to a tokens checklist: **shadows, accents, frequency, border radius, vocabulary, display
weight, line height, letter spacing, corner radius, amount of white space.** The values were
on-screen only and are never spoken, so not one number survives.

### The honest tally on concrete design values

Across all twelve videos, roughly three hours: **zero px, zero rem, zero ms, zero hex codes,
zero easing curves, zero type scale ratios, zero spacing scales.** Every numeric value in Group C
is a cost, a duration, a count, or a token figure. The complete list is in section 9.

Do not go to Group C for design values. Go to it for method, and to Group B for the design
system material.

### An unsourced statistic to not repeat

`z9CwM-DAe5Q`: "According to Intercom science, quality sites convert pretty much 91% better than
regular ones." No study, no link, no definition of "quality" or "regular". Same video also
asserts "53% of people are already starting to get this" with no source. **Do not put either
number on the site.** This repo's rule against inventing social proof covers borrowed statistics
too.

---

## 5. Mobile and responsive

**Absent from eleven of twelve videos.** Grepped every transcript for mobile, responsive, tablet,
breakpoint, viewport, screen size. Results:

- **Nine videos: zero occurrences of any of those words.**
- `wJWO91mi5o0`: one occurrence, "mobile app design", in a list of Claude Design output types.
- `AGHqBAVyrQs`: one occurrence, "pretty responsive", describing a desktop window resize.
- `bBlY5YOsKN8`: **the only substantive treatment**, and it is a bug report.

Every build in Group C is demonstrated on a desktop with a mouse. `8fva1VtacT8` makes **hover the
sole affordance of its hero** and never notes that hover does not exist on touch. `QUI6Ug4cHnE`
builds an entire cursor-driven scroll site and never opens a phone.

The one real finding, from `bBlY5YOsKN8`:

> "we asked it for a deep review and it started checking the design.md against what it actually
> built to see if the two matched up. And **this review caught multiple issues like
> responsiveness problems, which just means the app wasn't looking right on different screen
> sizes such as mobiles or tablets. What Claude Design builds tends to have this problem because
> it's still an early version. So whatever it designs comes out best for the exact thing it was
> made for. A design made for a website will look great there but not always on other screen
> sizes.**"

Two things follow, and both are directly usable:

1. **A Claude Design export is not responsive by default.** The person who has shipped the most
   with it says so plainly. Budget a responsive pass after every handoff.
2. **The gate that caught it was a deep review diffing the built output against the `design.md`**,
   not a screenshot pass. That is cheap to reproduce and it is a different class of check from
   this repo's existing `shots`, `frames` and `nav` gates: it compares intent to implementation
   rather than implementation to a picture.

Given the brief ("needs it flawless on mobile"), **treat every technique in this document as
unvalidated on touch until this repo's own gates say otherwise.** In particular the hover binding
in PL07 and the scroll-scrub bindings in PL06 and PL07 need `npm run nav`-style real CDP touch
drags, because this repo has already been burned by exactly that: `window.scrollTo` and
`mouse.wheel` both go around the code path that broke.

---

## 6. The client-site workflow, step by step

The consensus pipeline across PL06, PL07, PL08, `G0tOexS93IM` and `bBlY5YOsKN8`. Steps marked
**[only bBlY]** appear in one video and are the ones that separate a demo from a deliverable.

### Phase 1: decide before you generate

**0. Write `design.md` first. [only bBlY]**
Before opening any design tool. The argument: "If you let Claude Design build the design system
on its own, it just falls back to the generic colors and styles that the Opus models use
everywhere." Palette from Coolors (Export, Code, paste into Claude Code). Visualise the file at
designmd.space **before** generating anything from it, because every round trip through Claude
Design costs tokens.

**1. Gather three to five references and annotate them.** From `G0tOexS93IM`:

> "Grab a couple screenshots of your strongest references and drop them straight into Figma and
> be sure to add notes so Claude knows exactly what you like about each reference. Once you have
> about three to five visual references with notes, just screenshot it and paste it back into
> Claude Design."

Flatten the annotated board to one image. Sources by character: **Mobbin** for shipped and
enterprise screens, **Dribbble** for futuristic and out of the ordinary, **Awwwards** and
**Savee** and **godly.website** for craft, **21st.dev** / **Aceternity** / **React Bits** for
components.

**2. Type layout before imagery.** PL08's opening principle. Settle the hero type treatment
first, then build the creative layer around it, not the reverse.

### Phase 2: skeleton in Claude Design, briefly

**3. One section only, text only.** All three UI Collective videos scope the first prompt hard:
"only focus on the hero section", "Ignore all of the graphic elements and icons and only focus on
the text for now", "do not build me an entire site yet, just a hero."

Why Claude Design at all: "it's really good at generating sort of a first design framework,
better than something that Claude Code or Google Anti-Gravity can do first try." Why briefly:
"Claude Design is not building out our entire design because it's a very token heavy tool. We do
a first draft and move elsewhere with it."

**4. Role plus a confidence threshold in the opening prompt.** From `G0tOexS93IM`: assign the
role ("principal product designer and award-winning creative developer"), and close with the line
he says most people skip, telling Claude to "ask me any clarifying questions until it has 99.9%
confidence in the design assignment and not to assume anything."

**5. Let it interview you.** Three presenters converge on this independently (`G0tOexS93IM`,
`bBlY5YOsKN8`, `QUI6Ug4cHnE`). **It is the most corroborated technique in Group C.** The best
question set, from ScrollCraft, is in section 7.

**6. Wireframe with variants before visual design. [only bBlY]** Multiple variants per screen,
pick by code number, iterate with the **comment tool** rather than reprompting (a comment carries
the element identity, so Claude does not have to guess which thing you mean). **Batch comments and
send them together** rather than one at a time.

**7. Direct-manipulate positional nudges; prompt only structural intent.** From `G0tOexS93IM`:
select, drag, delete, justify and align on the canvas. "No more prompting just to make small
changes like that." Every avoided reprompt is tokens and latency.

### Phase 3: hand off and build the one creative piece

**8. Share, Send to Claude Code, then "run locally".** Or, for the loop-heavy work, export the
project archive (Share, Project HTML, Project archive, Export) and open the zip in Claude Code.
The Claude Design MCP is bidirectional.

**9. Build exactly one creative piece.** Four options, all on the safe side of the section 2
table:

| Technique | Source | Cost | Revert |
|---|---|---|---|
| Frame-sequence scrub (scroll or hover drives a still index) | PL06, PL07 | Bytes. Needs a measured budget | Delete the section, keep frame 1 |
| One hero object carried through the scroll | PL08 | Unmeasured, unknown renderer | Delete the object |
| Scroll-synced counters, reveals and source unlocks | `QUI6Ug4cHnE` | Near zero | Delete the bindings |
| One WebGL effect on one section | `G0tOexS93IM` | Unstated, prompt withheld | Delete the section |

**10. Correct with screenshots and batched change lists.** Paste screenshots back into Claude
Code with a numbered list of fixes. PL06 does this in one message and notes it is bad practice:
"In an ideal world, we wouldn't pile in all these changes like this."

### Phase 4: verify, then ship

**11. Deep review diffing the build against `design.md`. [only bBlY]** This is where
responsiveness defects surface. See section 5.

**12. Run the gauntlet loop on the one piece you intend to keep.** Section 8. Two to three
million tokens per artefact, so reserve it.

**13. Deploy with a repo behind it.** `G0tOexS93IM` has the correct path: Claude Code web rebuild,
then a **private GitHub repo**, then Vercel importing that repo.

PL06, PL07 and PL08 all use the CLI shortcut instead, and PL08 says why and why not to: "it might
be best practice, especially if you're iterating on it over time, to push to GitHub and then
bring that GitHub repo into Vercel. We're doing it a little bit of a shorter way ... It's not
something that you're going to be maintaining over months and months and months." **A portfolio
is exactly the thing you maintain over months. Take the repo path.**

---

## 7. Every prompt in Group C, verbatim

Grouped by job. Bracketed text is my substitution for a proper noun.

### Opening a design assignment

`G0tOexS93IM`, reported not read out, both load-bearing parts:
> [role] a principal product designer and award-winning creative developer
> [closing line] ask me any clarifying questions until it has 99.9% confidence in the design
> assignment and not to assume anything

`z9CwM-DAe5Q`, the skill-building interview:
> Hey dude, I would like to build a skill for building presentations. The presentation format is
> going to be 16 by 9. I would like to define what excellence looks like. I'm going to give you
> some beautiful materials, so we can agree and go back and forth on a desired style. Once we've
> done that, and we're happy with it, I'm going to make sure that you're using the right skills,
> the right connections, and then we're going to codify this to be a skill that I can use
> whenever I want to to create that thing. Do you have any questions for me initially? Then, I'm
> going to go ahead and I'm going to provide to you the basic assets I want you to use.

`z9CwM-DAe5Q`, density and a small sample before committing:
> I would like these to be more presentation-led, so not loads and loads of text. Just generate
> for me three slides to show you what I mean. I've also attached an illustration style. I want
> you to deconstruct what that looks like, and then maybe just show me one of the images with it,
> and one should have HTML in there as well. I'd also like the [brand] logo in the bottom
> right-hand corner. Extract that using your Firecrawl skill.

### The ScrollCraft interview questions (`QUI6Ug4cHnE`), verbatim

The best question set in Group C. Reproducible without the skill file.

1. > What's the scroll journey? What does the visitor hit first and in what order after that?
2. > What must the visitor believe by the end, one sentence not a feature list.
3. > What real assets do you have? This decides how much gets generated versus [curated] from
   > what you own.
4. > One thing this site should do that no site you've seen does. This becomes the signature move.
5. > Where should this page feel calm and where should it feel intense?

Question 3 is the asset-honesty gate. Question 4 is the one-ornament rule. His answer to
question 4, which is the closest thing in Group C to this repo's thesis:
> Every claim has a receipt. Nothing on the page is asserted without a source.

### Claude Design skeleton prompts

PL06:
> Create one polished Apple-style landing page section focused on the iPhone's internal parts
> with the provided iPhone centered as the visual. Use clean callouts for the screen, battery,
> camera, and frame.

PL07:
> build me a landing page like Apple using the references attached. Only focus on the hero
> section, image one, and ... image three. And the section beneath it, which is image two.
> Nothing else. All light mode, no dark backgrounds.

PL08:
> please build me a hero section based on the attached design. Ignore all of the graphic elements
> and icons and only focus on the text for now. The hero should have white text on a black
> background. Do not build me an entire site yet, just a hero.

### Image generation

PL06:
> with this frame of an iPhone in the center, add the battery of the camera above it, and the
> lenses of the camera above the battery

PL07, ensemble:
> five different colored Apple Watches side by side, white background

PL07, isolating one subject from the ensemble, first image passed as reference:
> isolate the middle Apple Watch same size. white background.

PL07, texture:
> Apple Watch purple liquid gradient on the screen, white background

`NAumQObJEwM`, style transfer using a named style recipe:
> replace the thing in the image with a giant protein shake

### Video generation (Kling 3.0, start frame plus end frame)

PL06:
> The iPhone rotates and flips sideways in midair, separating into its screen, battery, camera,
> and outer frame. Each component floats apart briefly before snapping back together into the
> full phone view.

PL07:
> Apple Watches slide out from either side. The Apple Watch in the middle does not shift or
> change size.

### Frame extraction

PL06:
> using [ffmpeg], break this video out into individual frames. Then add it to the center of the
> section with the text around it right here. Do not add any text effects or scroll effects just
> yet.

PL07:
> break this out into individual frames using FFmpeg, please install FFmpeg first

### Binding frames to a pointer signal

PL06, scroll:
> As the user scrolls, the broken-out video frames should advance slowly, revealing each internal
> part of the phone in sequence. At the same time, spec callout should appear on the right-hand
> side in sync with the relevant part being highlighted.

PL07, hover, and the most detailed prompt in Group C:
> In place of the current iPhones in the hero and using the frames we extracted, add the first
> frame of the Apple Watch below the hero text. When a user hovers over that Apple Watch, all the
> other Apple Watches should appear to show the user the different Apple Watch product offerings.
> As a user scrolls down the page, the Apple Watch should hide again and we resort back to the
> first frame. Use all the frames we extracted as part of this interaction and not just the first
> and last frames.

PL07, scroll with synced metrics:
> In place of the placeholder image in the second section, break this MP4 into individual frames
> as we did earlier and use those frames in the placeholder area. As the user scrolls down the
> page, the metrics on the right-hand side should scroll upward and correspond to the active
> frame. Each metric should align with the relevant Apple specification being shown in that
> frame.

### The 3D correction prompt (PL08), the best worked example in Group C

> So the starry background looks great but Mars should be 3D and not a static image. Mars should
> be rotating like an actual planet and much larger where it falls behind the text while still
> spinning very slowly. It's important to note that Mars is the most important part of the
> website. Mars should also have a natural glow. Currently it feels as if an image of Mars is
> moving on to the background where it should feel like Mars is a part of the background.

Its first version, for contrast, which produced the PowerPoint result:
> using the Higgs field MCP we're going to want two things. For the hero we're going to want a
> very faint and realistic star background to mimic space. Additionally, we're going to want an
> ultra realistic 3D image/video of Mars to float in from the top right / right hand side very
> slowly and dramatically.

### Motion and interaction

`G0tOexS93IM`, cursor trail:
> As the pointer moves over the hero, spawn a trail of the project image assets that follows the
> cursor and fades out behind it.

PL08, scroll transition between sections:
> Let's now focus on the next website section. As the user scrolls to the next section where we
> talk about the colonization of Mars, bring Mars to center and zoom it in where text then
> appears in a similar treatment to the hero, but not a one-to-one formatting match.

PL08, nav and load:
> please make some further changes. Starting with the navigation, we need to introduce a type of
> treatment similar to the recent example attached. I also like a loading effect on the text. The
> loading effect does not need to be the same for the hero and the text beneath it. Use your best
> judgment for the hero text.

`bBlY5YOsKN8`, animation brief with restraint built in (paraphrased by the narrator):
> add animations across all the screens like things scrolling into view or any other small
> touches that make the site feel more alive ... keep them subtle and not make anything too
> springy since that can feel off

PL06 and PL07, load effect, both paraphrased:
> introduce an onload effect that Apple would implement
> add Apple like load effects

### Correction and critique

PL06, screenshots attached:
> some changes. As you can see in the first screenshot, the iPhone should be much bigger. Remove
> the orange line to the left of the highlighted text element. There's also a shadow inside of
> the video frames. Is it possible to add a treatment that makes the stop between the shadow and
> the page background less harsh?

PL06, layout:
> Move all phone spec content to the right-hand side of the section, but leave the header and
> subtext where it is.

`G0tOexS93IM`, targeted comment:
> update this text to be full width and ensure it doesn't break to two lines

`G0tOexS93IM`, layout from a hand-drawn mockup pasted as PNG:
> Update the projects in the work section to match the updated mock-up using an asymmetric grid
> instead of the current layout.

`NAumQObJEwM`, **the comparison teardown, the highest-value prompt in Group C**:
> I would like you to use the below website to look at this page and compare it with mine. I want
> you to be ruthless in understanding the design differences and how I can improve mine based on
> the aesthetics and everything. [your URL] [reference URL] Hey, this is a design system. You can
> also go to [the reference]'s website directly, utilize screenshots. I would like the output as a
> beautiful HTML breakdown. Keep it concise and simplistic.

Three things make it work: both URLs plus permission to screenshot the live reference; "be
ruthless"; and an **artefact** as the output rather than chat prose. It returned named properties
with paired values and an interactive slider between them. Its framing line:

> "knowing what's happening is one thing, but being able to articulate it is something else.
> Sometimes we just know it looks good, but we can't explain it. And that doesn't help Claude."

`wJWO91mi5o0`, steering toward less:
> I only want to see nice HTML components. I don't need loads of text. And I think little
> explanatory text would really add the value, but it shouldn't be something that the user has to
> squint at. Don't make the user think. Don't make them exert too much cognitive energy in
> understanding what this looks like. Cut out the other bits and let's just simplify this down a
> little bit.

`QUI6Ug4cHnE`, the two animation notes he gave twice, unprompted:
> slow this down significantly, so the users can actually scroll and realize what's going on
> it feels like it doesn't quite last long enough. Maybe you could slow it down or make that a
> little more exaggerated

### Meta-prompting

`WR-kVYU-lBU`, used twice, with a stated result:
> Hey there, Claude. Would you improve this prompt in any way that would basically give it better
> instructions?

> "I'm glad I did that because the questions are way better this way."

### Component sniping

`wJWO91mi5o0`:
> Hey, go and install this, but replace the images with burgers.

Fallback when the code is not copyable:
> screenshot and just say, "Hey, I love this design. Can you go and grab it?" And even grab the
> website and say, "I love this kind of design and vibe. Could we create something a bit
> similar?"

### Deploy

PL06, PL07, PL08, near-identical:
> Check this project to prepare it for Vercel, then walk me through each step one to one to
> deploy onto a Vercel domain.

`G0tOexS93IM`, the repo-backed version:
> Commit this project to the following GitHub address [repo URL]

### Codifying the result

`z9CwM-DAe5Q`:
> I would like to turn this entire thing into a skill, so then I'm going to give you some
> information in the future, and you're going to produce this for me systematically.

`jq9LRwE0-GQ`:
> Hey, I love this presentation, turn it into a design system.
> [and, to install the critic loop] Hey, turn this into a skill.

---

## 8. Named skills, repos and tools

**A warning that applies to the whole table.** The brief expected `WR-kVYU-lBU` to be the richest
source of GitHub URLs. It names five repos and demonstrates all five, and **not one URL is spoken
aloud.** Every URL in these videos is on-screen only. Where a URL below is marked *inferred*, it
is my reconstruction and **must be verified before installing anything**. This repo already has a
written rule about assuming a short alias belongs to who you think it does; the same caution
applies to repo names.

### Worth installing or reproducing for this project

| Tool | URL | What it does | Demonstrated | Verdict here |
|---|---|---|---|---|
| **`design.md` convention** | format, not a repo. Described as "a format that Google started" | One markdown file the agent reads before writing anything, holding palette, type, spacing, tokens | Yes, `bBlY5YOsKN8` | **Adopt the idea.** This repo already has `tokens.css` doing the job. A `design.md` that mirrors it gives the agent the intent, not just the values |
| **designmd.space** | https://designmd.space (spoken) | Renders a `design.md` visually so you can judge it before generating from it | Yes | Useful once, cheaply. Judge the system before spending tokens on screens |
| **getdesign.md** | https://getdesign.md (spoken) | Library of brand design systems as `design.md` files | Named, not opened | Second source for the same thing as Awesome Design |
| **Awesome Design / Awesome Designer AI** | **not spoken.** Search GitHub for "awesome design ai design.md" and verify before use | 55 to 68 brand design systems as plain markdown, nine categories. Named: Apple, Stripe, Linear, Spotify, SpaceX, Nike, BMW, Lamborghini, Wise, PostHog, Coda, Expo, Lovable, ClickHouse, Ollama, OpenCode | Yes, three one-shot sites, `z9CwM-DAe5Q` | **Highest-value install in Group C** if the repo checks out. Read a `design.md` for a brand whose feel you want and steal the structure, not the palette |
| **Coolors** | https://coolors.co | Palette generation. Export, Code, paste into Claude Code | Yes | Fine, minor |
| **Mobbin** | https://mobbin.com | Shipped app screens | Yes, three videos | The reference source all presenters agree on |
| **Awwwards** | https://awwwards.com | Craft reference | Named | For the creative layer |
| **Savee** | https://savee.it | Visual reference | Named | |
| **godly.website** | https://godly.website | Website inspiration | Named | |
| **Dribbble** | https://dribbble.com | "futuristic ... a little bit different" reference, unlike Mobbin's enterprise bias | Yes, PL08 | Where PL08 got its hero type treatment |
| **21st.dev** | https://21st.dev | Community components. Sort by most downloaded | Yes | Copy the code, substitute the content |
| **Aceternity UI** | https://ui.aceternity.com | Shader and motion components. "you've probably seen this distortion shader everywhere ... that's just code" | Named | A route to a creative layer with no bespoke WebGL |
| **React Bits** | https://reactbits.dev | "more edgy, more sleek, more premium" components | Named | |
| **ffmpeg** | https://ffmpeg.org | Explodes an MP4 into numbered stills | Yes, PL06 and PL07 | The whole frame-scrub technique depends on it |
| **Gauntlet loop / design loop** | Skill **not on GitHub**, distributed via Jack Roberts' free School community. **No URL spoken** | Three fresh-context critic sub-agents (brief, system, craft) looping until the work clears a bar | Yes, three runs with token counts | **Reproduce, do not chase the file.** Section 8 below has enough to rebuild it |
| **ScrollCraft** | Skill **not on GitHub**, Nate Herk's free School community, classroom, "all YouTube resources". **No URL spoken** | Interview, generate assets, build a scroll-synced page, then screenshot-verify itself | Yes, on his own live business site | **Reproduce the interview**, which is the whole value and is quoted in section 7 |
| **AI LABS design.md skill** | On GitHub, **link in description, URL not spoken** | Interviews you, writes `design.md`, validates it by script, carries "anti-slop references" | Yes | Worth finding. The anti-slop reference list is the part not shown on camera |

### Named but not relevant here

| Tool | URL | Why not |
|---|---|---|
| **Higgsfield AI** | https://higgsfield.ai | Aggregator for Nano Banana and Kling. Used in five of twelve videos. Only needed if generated media is in scope, and section 3 says it mostly is not |
| **kie.ai** | https://kie.ai (spoken as "key.ai" and "Kia API") | Cheaper route to Nano Banana 2, about 6 cents per 2K image. Same caveat |
| **Kling 3.0** | via Higgsfield | Image-to-video with start and end frame pinning |
| **Nano Banana / Pro / 2** | Google, via Higgsfield or kie.ai | Still generation |
| **Firecrawl** | https://firecrawl.dev (inferred from spoken "docs.firecrawl") | Page to structured data. Free tier about 500 credits, hobby $16/month. Two uses shown: lead scraping, and **extracting a brand's logo, accent colours and typography from its live site**, which is the design-relevant one and is genuinely demonstrated |
| **Graphify** | **not spoken** | Codebase knowledge graph. His own stated threshold rules it out: "if you have something 30 files or less, the overhead can't eat the win ... This really crushes it when you're looking at 500 files plus" |
| **Claude Code Router** | **not spoken.** Inferred: https://github.com/musistudio/claude-code-router, unverified | Routes Claude Code to cheaper models via OpenRouter. Kimi K2.6 claimed 88% cheaper. His caveats: skills and MCPs "rely on Anthropic specific tool call formatting ... can misbehave", more latency, "tool calling quality cliffs ... for multi-file refactors". And he says to keep design taste on the big model |
| **NotebookLM skill** | **not spoken** | Unofficial, cookie-authenticated, one browser per machine. Not for this |
| **Supabase agent skill** | https://supabase.com | Two skills, one for database and auth work, one triggered by the words "optimize performance". A static portfolio needs no backend |
| **Blotato** | https://blotato.com (inferred) | Social publishing. Out of scope |
| **Zapier** | https://zapier.com | Used as a single auth hub so connectors do not have to be re-added per client. Reasonable idea, out of scope |
| **Midjourney** | https://midjourney.com | "more good for illustrations" |
| **The 2,000-design reference site** | **name never spoken, on-screen only** | Publishes per-site design hierarchy, palette, typography, Tailwind config, CSS variables and tokens. Named sites: Linear, Phantom, Whisperflow, Slosh, Apple. **Worth identifying**, because it is the input to the best prompt in Group C |

### The gauntlet loop, reproducible without the file

`jq9LRwE0-GQ`. The problem it solves:

> "the biggest problem that we have here is simply the fact that **Claude judges its own
> homework.** It says, 'I think I've done it.' In reality, it hasn't."

> "if you give anything to Claude and say, 'Hey, what's wrong with this?' **If you ask it five
> times, you will get five different answers.**"

The three critics, each a fresh-context sub-agent with one axis:

1. **Brief.** "did you do what I asked?"
2. **System.** "is it really in line with the system?"
3. **Craft.** "rendered frames and then the code, and it judges the bar all based dynamically on
   your prompt."

Stage sequence: interview, pre-flight, teardown, set the bar, build, critics, loop. The line that
makes it portable: **"taste becomes a checklist."**

What the critics actually caught, from his round log, which is the useful part:

> "Round one, three fails, **no logos, color breaking monochrome, loud words underscaled.**
> Round two, **[the] mark was too small.** Round three, **lime shape with a second accent.** ...
> there were **10 rounds** to get to this point."

Cost, and it is the only real cost data in Group C:

| Run | Rounds | Tokens |
|---|---|---|
| Carousel | not stated | 3 million |
| Animation against a design system | 10 | 730,000 Haiku + 1.19 million Sonnet |
| Website | 6 | about 2 million |

His conclusion: "the loop can eat your credits ... I would reserve this for your bigger things ...
Like templates, for example, that you are then going to go and reuse." And on model choice:
"you do want the big model to be Claude cuz he's got great design taste." It terminates on its
own: "when it went through rounds, it kind of ended naturally at a great point."

Attribution: popularised by **Matt Shumer** on X, covered by **Rubber Nuggets**.

**For this project:** the three critics map cleanly onto gates this repo already has. Brief maps
to the PRD and the two commercial rules. System maps to `tokens.css` and `DESIGN.md`. Craft maps
to `frames`, `a11y`, `labels` and `budget`. The loop is worth running once, on the one creative
layer, before it is merged.

---

## 9. Every number in Group C

The complete numeric inventory, because the absence is itself the finding.

**Design values: none.** Zero px, rem, ms, hex codes, easing curves, type scale ratios, spacing
scales, or breakpoints across three hours.

| Number | What | Source |
|---|---|---|
| 16:9 | Aspect ratio for every generated still and video, and for slide decks | PL06, PL07, `z9CwM` |
| 120 to 121 | Frames extracted from one short video | PL06 |
| about 100 | Frames extracted | PL07 |
| about 25 seconds | Recommended hero motion clip length | `wJWO91mi5o0` |
| 10 to 15 seconds | Overlay graphic length | `jq9LRwE0-GQ` |
| 3 to 5 | Annotated references before prompting | `G0tOexS93IM` |
| 99.9% | Confidence threshold for clarifying questions | `G0tOexS93IM` |
| 5 hours | Claude usage window, shared across all Claude activity | `bBlY5YOsKN8` |
| Opus 5, medium effort | Their standing model setting for design work | `bBlY5YOsKN8` |
| about 5 minutes | Design system generation time | `wJWO91mi5o0` |
| 50 MB | Attachment ceiling | `wJWO91mi5o0` |
| about 30 minutes | Full ScrollCraft build run | `QUI6Ug4cHnE` |
| 3M / 730k + 1.19M / 2M | Gauntlet loop token costs | `jq9LRwE0-GQ` |
| 6 cents, 12 cents | Per 2K 16:9 image, and for two | `NAumQObJEwM`, `z9CwM` |
| 500 credits, $16/month | Firecrawl free tier and hobby plan | `WR-kVYU-lBU` |
| 70x, 500+ files, 30 files | Graphify savings claim and its useful range | `WR-kVYU-lBU` |
| 88% | Kimi K2.6 cost saving claim | `WR-kVYU-lBU` |
| 46k to 50k stars, 55 to 68 systems | Awesome Design, two inconsistent figures four minutes apart | `z9CwM`, `WR` |
| **91%, 53%, 260M, $42B** | **Unsourced. Do not repeat** | `z9CwM-DAe5Q` |

---

## 10. Clickbait versus real technique

| Video | Title claim | What is actually there | Verdict |
|---|---|---|---|
| `G0tOexS93IM` | "Web Design On STEROIDS" | Annotated three-to-five reference boards, a role plus 99.9% confidence prompt, direct canvas editing instead of reprompting, a repo-backed deploy. Six minutes, almost all method. **The only portfolio build and the only named 3D library** | **Real. Best in group.** Mild title inflation and one ad for his own template |
| `bBlY5YOsKN8` | Descriptive, no inflation | Five-stage pipeline, `design.md` first, visualise before generating, wireframe with variants, batched comments, and **the only honest treatment of responsiveness in Group C**. States costs and limits throughout | **Real. No clickbait.** Second best |
| `jq9LRwE0-GQ` | "10X Better... I'm Done" | The gauntlet loop, three fresh-context critics, a round-by-round defect log, and **published token costs** | **Real technique, farmed title.** "I'm Done" means nothing |
| `l7G97gNyM8k` | Descriptive | Frame-sequence scrubbing end to end, with the reverse-on-completion flourish. Ships two known defects with "we're going to pretend as if it's perfect" | **Real technique, weak craft standard** |
| `8fva1VtacT8` | Descriptive | Same pipeline plus hover binding and the aspect-ratio rule. Hero affordance is hover-only and this is never questioned | **Real technique, weak craft standard** |
| `QUI6Ug4cHnE` | "Ultimate", "steal this" | A genuinely good interview question set, a screenshot self-verification pass, and an honest self-critique of the output. The skill is behind a community signup, not on GitHub | **Real, mild clickbait.** Interview reproducible without the file |
| `NAumQObJEwM` | "Design Genius... Just Watch" | **One outstanding prompt** (the ruthless comparison teardown producing named properties with paired values), then eight minutes advertising his paid Design OS | **One real technique in a product pitch** |
| `z9CwM-DAe5Q` | "just became UNSTOPPABLE" | Three real slop tells, the `design.md` repo, one genuinely demonstrated Firecrawl brand extraction. Also four unsourced statistics and a "Figma has fallen off a cliff" narrative | **Half real, half farming** |
| `WR-kVYU-lBU` | "100,000+ github stars" | Five tools, all demonstrated, **zero URLs spoken**. The star count is a sum across five unrelated repos. Four of five are cost or research plumbing, not design | **Real tools, farmed framing.** Only section 4 matters here |
| `AGHqBAVyrQs` | "3D Animations" | **No 3D library, no measurement, no mobile.** A prompt for a rotating sphere. But: the type-before-imagery principle, the one-object-through-the-scroll discipline, and the best correction prompt in the group | **Title is the misleading part.** Keep three ideas, discard the framing |
| `wJWO91mi5o0` | "Just Destroyed AI slop Forever" | **No slop diagnosis at all.** The fix offered is "use a design system". Three usable items in total: the one-moving-piece framing, the 25-second clip length, and three component libraries | **Farming.** The video named after AI slop is the one that does not identify any |
| `iyRYc9sVRsw` | "Changes Everything (Insane)" | A demo of software you cannot obtain without joining his paid community. One reusable sentence: export your design system so you own it independently of the tool | **Pure farming.** Skip |

**The pattern:** the two least sensational titles (`bBlY5YOsKN8`, `G0tOexS93IM`) carry the most
method, and the most sensational (`iyRYc9sVRsw`, `wJWO91mi5o0`) carry the least. Six of the twelve
are from one channel and four of those six end in a pitch for the same paid course. Jack Roberts'
useful material is real but concentrated: the gauntlet loop, the comparison teardown, and three
slop tells. The rest is funnel.

---

## 11. What to actually do, for this project

Ranked, with the reasoning compressed.

1. **Write the `design.md`** before touching a design tool, mirroring `tokens.css` but carrying
   intent as well as values. Otherwise the model's defaults win and you get Inter on a purple
   gradient over three equal cards.
2. **Build an annotated reference board**, three to five references, each labelled with what
   specifically you want from it. Flatten to one image. Cheapest quality gain in Group C.
3. **Open every design assignment with a role and the 99.9% clarifying-questions line**, and let
   it interview you. Three independent presenters converge here.
4. **Pick exactly one creative layer, and check it against the five-question table in section 2
   before building it.** All five answers must be on the safe side. That is what makes it
   revertible in practice and not just in git.
5. **If the creative layer is frame-sequence scrubbing, set the byte budget first.** Frame count,
   format and total payload as numbers, extending `npm run budget`, before generating anything.
   That is the whole difference between the best technique in Group C and a second failure.
6. **Keep generated imagery ornamental and out of `images` and `video`.** Abstract or
   deliberately non-photorealistic only. Nothing generated may depict a thing that could be
   mistaken for a capture, and nothing generated may feed `evidenceOf()`.
7. **Run the ruthless comparison teardown once** against a reference site you admire, and turn
   its output into a tokens diff.
8. **Run the gauntlet loop once**, on the one creative layer, before merging. Budget two to three
   million tokens for it.
9. **Add a deep review that diffs the built output against `design.md`.** It is the only gate in
   Group C that caught a responsiveness defect, and it is a different class of check from the
   screenshot gates this repo already has.
10. **Validate everything on a real touch device.** Group C validated nothing on mobile. This
    repo's `nav` gate exists because `window.scrollTo` and `mouse.wheel` both go around the code
    path that broke a phone once already.
