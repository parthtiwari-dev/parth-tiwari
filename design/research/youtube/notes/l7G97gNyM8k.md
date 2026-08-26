# l7G97gNyM8k

**Title** Claude Code + Claude Design + Kling AI: Client-Ready Web Experiences
**Channel** UI Collective (playlist PL06)
**Duration** 15:07
**Grade** HIGH SIGNAL for method, LOW for design craft

The single most transferable technique in Group C is in this video, and it is not 3D. It is
**video-to-frames scroll scrubbing**: generate a short video, explode it into numbered PNG
frames with `ffmpeg`, and drive the frame index off scroll position.

---

## The build, step by step

1. **Steal a real reference frame.** Screenshot Apple's exploded-iPhone treatment from
   apple.com. "So, we're going to use this as a starting point, so we don't need to reinvent
   the wheel entirely."
2. **Generate image A and image B** in Higgsfield AI, model Nano Banana (Google), aspect
   16:9. Image A is the assembled product, image B is the exploded product.
3. **Generate the connecting video** in Higgsfield with Kling 3.0, image A as start frame and
   image B as end frame. Took several regenerations. He is explicit that the model ignored the
   frame pinning: "I didn't think it'd be able to do this ... it didn't follow that, but
   that's totally fine."
4. **Claude Design for the skeleton only.** Reason given: "it's really good at generating sort
   of a first design framework, better than something that Claude Code or Google Anti-Gravity
   can do first try."
5. **Hand off** via Claude Design's Share > Send to Claude Code, paste the copied command into
   a fresh Claude Code session, append "run locally".
6. **Explode the MP4 to frames** with ffmpeg. Result was 120 to 121 frames.
7. **Wire scroll to frame index**, then text reveals synced to frame ranges.
8. **Screenshot-driven correction.** He pastes two screenshots back into Claude Code with a
   list of fixes.
9. **Reverse the sequence at the end** so the product reassembles and recentres.
10. **Deploy to Vercel** via a Claude Code prompt that emits step by step commands.

## Prompts, verbatim

Image generation (Nano Banana, 16:9):
> with this frame of an iPhone in the center, add the battery of the camera above it, and the
> lenses of the camera above the battery

Video generation (Kling 3.0, start frame + end frame):
> The iPhone rotates and flips sideways in midair, separating into its screen, battery,
> camera, and outer frame. Each component floats apart briefly before snapping back together
> into the full phone view.

Claude Design skeleton:
> Create one polished Apple-style landing page section focused on the iPhone's internal parts
> with the provided iPhone centered as the visual. Use clean callouts for the screen, battery,
> camera, and frame.

Frame extraction:
> using [FFmpeg], break this video out into individual frames. Then add it to the center of the
> section with the text around it right here. Do not add any text effects or scroll effects
> just yet.

Layout fix:
> Move all phone spec content to the right-hand side of the section, but leave the header and
> subtext where it is.

The core interaction:
> As the user scrolls, the broken-out video frames should advance slowly, revealing each
> internal part of the phone in sequence. At the same time, spec callout should appear on the
> right-hand side in sync with the relevant part being highlighted.

Correction pass (with two screenshots attached):
> some changes. As you can see in the first screenshot, the iPhone should be much bigger.
> Remove the orange line to the left of the highlighted text element. There's also a shadow
> inside of the video frames. Is it possible to add a treatment that makes the stop between the
> shadow and the page background less harsh?

Load animation (paraphrased by him, not shown on screen):
> introduce an onload effect that Apple would implement

Deploy:
> check this project and prepare it for Vercel. Then it walked me through each step one-to-one
> to deploy onto a Vercel domain.

## AI imagery

- Model: **Nano Banana** (Google) via Higgsfield, 16:9, for stills.
- Model: **Kling 3.0** via Higgsfield for the video, driven by start and end frames.
- Post-treatment: none. There is no colour grade, no compositing, no masking step. The only
  "post" is asking Claude Code to soften a shadow edge in CSS, and it did not work: "It looks
  like there's still an issue with the shadow here, but we're going to pretend as if it's
  perfect."
- Honesty of the imagery: the subject is a fictional iPhone. There is no claim it is a real
  capture, but there is also no method here for making a generated image *not* read as
  generated. He simply regenerates until it looks acceptable and ships it.

## Mobile and responsive

**Absent.** Zero mentions. Every frame in the demo is a desktop browser. A 120-frame PNG
sequence over a mobile connection is not discussed.

## Concrete design values

**None.** No px, rem, ms, easing curve, hex, or type scale is stated anywhere in the video.
The only quantity is the frame count (120 to 121).

## Honest read

The clickbait is mild here (title is descriptive). The weakness is craft discipline. He says
"half the fun is to sort of seeing what AI comes back with" four separate times and ships
two known defects (the shadow seam, the wasted whitespace when the phone is closed) with
"we're going to pretend as if it's perfect" and "it is what it is". The method is sound; the
standard is not.
