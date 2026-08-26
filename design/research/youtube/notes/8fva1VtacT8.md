# 8fva1VtacT8

**Title** Claude Code + Google AI Image Gen: Build Apple-Style Websites
**Channel** UI Collective (playlist PL07)
**Duration** 17:00
**Grade** HIGH SIGNAL, near-duplicate of PL06 with two additions

Same pipeline as PL06 (Higgsfield stills, Kling video, ffmpeg frames, Claude Design skeleton,
Claude Code assembly, Vercel deploy). Two things it adds that PL06 does not have:

1. **Hover-driven frame scrubbing**, not just scroll-driven.
2. **An explicit aspect-ratio rule for the source images** that determines the whole layout.

---

## The one hard technical rule in this video

> "the size of the starting image is the size that the image comes out that the video ends up
> being. So if this is like a really thin image to start and this was the 16 by 9 the whole
> video would be really thin like 9 by 16. So if you want it to naturally more in a website,
> you might want to have both of those images generated be 16 by 9."

Generate both keyframes at the same aspect ratio, and generate them at the ratio the section
will occupy. Otherwise the video, and therefore every extracted frame, is the wrong shape.

## The build, step by step

1. **Reference gathering from Mobbin** (a repository of shipped app screens). He screenshots
   several Apple layouts. What he wants from them is stated precisely: "it's more of the
   formatting that I care about most."
2. **Claude Design for the skeleton**, references attached. Reason: "Claude Design is not
   building out our entire design because it's a very token heavy tool. We do a first draft and
   move elsewhere with it."
3. Second prompt needed to fix section two. He flags this honestly: "it didn't get it exactly
   like this first try."
4. **Send to Claude Code**, "run locally".
5. **Generate the ensemble still** (five watches), then **isolate one item from it** as the
   start frame using the same model with the ensemble as reference.
6. **Kling 3.0 video** from single-item start frame to ensemble end frame.
7. **ffmpeg to frames** (roughly 100 frames).
8. **Bind frames to hover** in the hero and **to scroll** in section two.
9. Second creative pass on the same reusable loop for section two, including a texture
   instruction ("purple liquid gradient").
10. **Vercel deploy** via the same prompt as PL06.

## Prompts, verbatim

Claude Design skeleton:
> build me a landing page like Apple using the references attached. Only focus on the hero
> section, image one, and ... image three. And the section beneath it, which is image two.
> Nothing else. All light mode, no dark backgrounds.

Ensemble still (Nano Banana, 16:9):
> five different colored Apple Watches side by side, white background

Isolate a single subject from the ensemble (same model, ensemble image as reference):
> isolate the middle Apple Watch same size. white background.

Video (Kling 3.0):
> Apple Watches slide out from either side. The Apple Watch in the middle does not shift or
> change size.

Frame extraction:
> break this out into individual frames using FFmpeg, please install FFmpeg first

Hero hover interaction (the most detailed prompt in Group C):
> In place of the current iPhones in the hero and using the frames we extracted, add the first
> frame of the Apple Watch below the hero text. When a user hovers over that Apple Watch, all
> the other Apple Watches should appear to show the user the different Apple Watch product
> offerings. As a user scrolls down the page, the Apple Watch should hide again and we resort
> back to the first frame. Use all the frames we extracted as part of this interaction and not
> just the first and last frames.

He explains the last sentence: "One thing I want to avoid is it just skipping all the frames
in between and just jumping right to the first frame the last frame. It's just going to look a
little bit awkward."

Second creative loop, image prompt:
> Apple Watch purple liquid gradient on the screen, white background

Section two interaction:
> In place of the placeholder image in the second section, break this MP4 into individual
> frames as we did earlier and use those frames in the placeholder area. As the user scrolls
> down the page, the metrics on the right-hand side should scroll upward and correspond to the
> active frame. Each metric should align with the relevant Apple specification being shown in
> that frame.

Load animation (paraphrased):
> add Apple like load effects

Deploy:
> check this project to prepare it for Vercel, then walk me through each step one-to-one to
> deploy onto a Vercel domain

## AI imagery

- **Nano Banana / Nano Banana Pro** (Google) via Higgsfield for stills, always 16:9.
- **Kling 3.0** via Higgsfield for video.
- Iteration count is the whole technique: "I ran it a bunch of different times just to see what
  different results we get."
- Texture and finish are specified as short adjective strings appended to the subject:
  "purple liquid gradient", "white background". He notes the result reads as real: "Ultra
  realistic ... you also see that shine across the Apple Watch screen. Looks very realistic,
  very real life."
- **Known artefact he shipped anyway:** "those first couple frames have like this very thin
  like light gray background, where you can kind of see it at the edge here, but it's okay for
  now. If we had more time, we could play with the AI in order to remove those." A generated
  still that does not match the page background at the edges is the classic tell, and he has no
  fix for it beyond regenerating.

## Mobile and responsive

**Absent.** Zero mentions. A hover-only interaction is the primary hero mechanic, and hover
does not exist on touch. This is not raised.

## Concrete design values

**None.** No numeric values of any kind. The only quantities are aspect ratio (16:9) and
frame count (roughly 100).

## Honest read

The reusable loop is real and it is the deliverable: still A, still B, video between them,
frames, bind index to a pointer or scroll signal. The design judgement is thin and he says so:
"I know this prompt isn't great, but like that's half the fun of working with AI." He also
ships a hero whose only affordance is hover.
