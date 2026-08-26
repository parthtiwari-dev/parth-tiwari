# AGHqBAVyrQs

**Title** Claude Code + 3D Animations: Build Client Ready Websites in 20 Minutes
**Channel** UI Collective (playlist PL08)
**Duration** 15:14
**Grade** MEDIUM for the ordering principle, THIN for 3D. The title is the misleading part.

**Headline finding: this video never names a 3D library.** Not Three.js, not React Three
Fiber, not Spline, not WebGL, not a shader, not a GLB or GLTF file, not a draw call, not a
frame budget. Grepped the full transcript for all of them: zero hits. The word "canvas"
appears once and means the browser window during a resize test.

What actually gets built is a **rotating sphere with a planet texture behind the hero text**,
produced by Claude Code from a plain-English prompt, plus a **starfield background image**
generated through the Higgsfield MCP. Whether the sphere is Three.js, a CSS transform on a
sprite, or a looping video is never established on camera. He calls it 3D because it sits
between the background and the text: "It has that 3D effect to it because it's falling behind
the text but still in front of the background."

---

## The one genuinely good idea in this video

**Type layout first, 3D second.** Stated at the top, and it is the reason to keep this note:

> "instead of starting out with any 3D interactive elements, it's easy to almost start out with
> the text layouts of the header itself. What a lot of designers do is they like to start with
> the animations. They like to start with the imagery. And then what happens is they have this
> imagery, they have these elements, then they try to fit it into a website ... and then they
> realize that they can't find a text treatment that actually goes with that image. So, when
> you have the text layout, it's easier to work backwards and build 3D elements around the look
> and feel that you're going for."

That is the diagnosis of v1 of this portfolio, delivered by someone selling 3D.

## Second good idea: one hero object, carried through the scroll

> "whenever I have sort of this big 3D element anywhere on the page, one strategy that you can
> take is incorporate that into the scroll of the next section ... this Mars to almost come
> towards me and then zoom in on part of the actual planet where it sort of connects the two
> sections via this big 3D element."

One object, reused as the transition between two sections. That is a discipline, not a
proliferation. It is the opposite of nine independently navigable stars.

## The build, step by step

1. **Reference hunt on Dribbble** for the hero type treatment specifically (Dribbble for
   futuristic, Mobbin for shipped and enterprise). Screenshot the type, not the graphics.
2. **Claude Design: hero only, text only.**
3. **Send to Claude Code**, "run locally".
4. **Connect Higgsfield as a custom connector in the Claude app** (Settings, Connectors, Add
   custom connector, paste the remote MCP URL, authenticate).
5. Prompt for the background and the hero object through that MCP.
6. **Correct the result** when the first pass returns a static image.
7. Add a nav treatment from a Mobbin screenshot, and load animations on the text.
8. Add the scroll transition into section two.
9. **Vercel deploy.**

## Prompts, verbatim

Claude Design hero:
> please build me a hero section based on the attached design. Ignore all of the graphic
> elements and icons and only focus on the text for now. The hero should have white text on a
> black background. Do not build me an entire site yet, just a hero.

First pass at the scene (his own typing, cleaned up on the second attempt):
> using the Higgs field MCP we're going to want two things. For the hero we're going to want a
> very faint and realistic star background to mimic space. Additionally, we're going to want an
> ultra realistic 3D image/video of Mars to float in from the top right / right hand side very
> slowly and dramatically.

**The correction prompt, which is the actual technique.** The first pass returned a static PNG
sliding across the screen. His reaction: "this is just something that you could do in
PowerPoint. Like I'm pretty sure I did something similar in like the fifth grade." He then owns
the failure ("this is on me because I didn't give it a really detailed prompt to start") and
rewrites it:

> So the starry background looks great but Mars should be 3D and not a static image. Mars
> should be rotating like an actual planet and much larger where it falls behind the text while
> still spinning very slowly. It's important to note that Mars is the most important part of
> the website. Mars should also have a natural glow. Currently it feels as if an image of Mars
> is moving on to the background where it should feel like Mars is a part of the background.

Note the shape: state the failure, state the desired physical behaviour, **rank the element**
("the most important part of the website"), and describe the depth relationship in words
("falls behind the text", "part of the background", not "moving on to the background").

Navigation and load:
> please make some further changes. Starting with the navigation, we need to introduce a type
> of treatment similar to the recent example attached. I also like a loading effect on the
> text. The loading effect does not need to be the same for the hero and the text beneath it.
> Use your best judgment for the hero text.

Scroll transition:
> Let's now focus on the next website section. As the user scrolls to the next section where we
> talk about the colonization of Mars, bring Mars to center and zoom it in where text then
> appears in a similar treatment to the hero, but not a one-to-one formatting match.

Deploy:
> Check this project to prepare it for Vercel, then walk me through each step one to one to
> deploy onto a Vercel domain.

## A prompting technique he describes but does not use

> "I might want to find an example on a place like Dribbble of the animation or the interaction
> and then I would download that MP4, convert it to a GIF, provide that GIF to AI, ask AI to
> come up with a prompt for it."

Reference motion in, prompt out. He skips it deliberately to simulate time pressure.

## Performance cost, mobile, and the point where this becomes v1

- **Performance is never mentioned.** No frame rate, no bundle size, no device tier, no
  fallback, no reduced-motion path.
- **Mobile is never mentioned.** The only responsiveness check is dragging the desktop browser
  window narrower: "as we adjust like the canvas size, like we don't lose those interactions.
  We can see it does appear in pretty responsive, too." That is a resize, not a device, and a
  narrow desktop window takes a different code path from a touch device.
- **Where this becomes the thing that killed v1:** it does not, as filmed. The scene is one
  object with one behaviour (rotate) plus one background. There is no navigation inside it,
  nothing is clickable, nothing encodes data, and the visitor never has to understand it. It is
  a backdrop. v1 failed because the 3D was the *interface*: nine objects the visitor had to
  orbit, decode and navigate in order to reach the content. This video does the safe version by
  accident. **The failure mode starts the moment the object stops being a backdrop and becomes
  the way to get somewhere.**
- The deployment advice also cuts against a portfolio: he frames the site as disposable. "It's
  not something that you're going to be maintaining over months and months and months." He
  recommends the shortcut path (Vercel CLI, no repo) for that reason, while noting "it might be
  best practice ... to push to GitHub and then bring that GitHub repo into Vercel."

## Concrete design values

**None.** White text on a black background is the only colour statement. No numbers.

## Honest read

The title promises 3D animation technique and delivers a prompt for a spinning sphere. But the
opening principle (type layout before imagery) and the single-hero-object discipline are worth
keeping, and the correction prompt is the best worked example of "describe the physics and rank
the element" in the whole group.
