# QUI6Ug4cHnE

**Title** I Built The Ultimate Claude Website Design Skill (steal this)
**Channel** Nate Herk (AI Automation Society)
**Duration** 16:44
**Grade** HIGH SIGNAL. He rebuilds **his own real business site** on camera and critiques the
result honestly. Closest analogue in Group C to what this portfolio needs.

The skill is called **ScrollCraft**. It is free but distributed through his School community
(classroom, "all YouTube resources"), **not GitHub**, and **no URL is spoken**. What is
extractable is the shape of the skill, which is reproducible without the file.

---

## What ScrollCraft is

> "build a premium scroll-driven interface landing page for any business"

The organising idea, verbatim:

> "the whole idea is that you're actually hooking in the viewer by making the scroll correlate
> to something that's going on on the actual page."

> "what's important to me is that everything on the site, basically, the user is in control with
> their mouse because they're basically controlling what's happening and they can go backwards,
> they can go forwards. And whether that be controlling like scrolling images or actually just
> having numbers fade in or appear or this image kind of fades out as well. **It's really just
> about that idea of the scroll syncing to something.**"

He is explicit that it is not a template: "it's not just one specific template ... every single
one of these websites that I've shown you guys so far comes out a little bit different, and
that's why the interview section of this skill is so important."

## The interview questions, verbatim

These are the reusable part. They are better than any prompt in Group C because they ask about
sequence, belief and evidence rather than aesthetics.

1. **"What's the scroll journey? What does the visitor hit first and in what order after that?"**
2. **"What must the visitor believe by the end, one sentence not a feature list."**
3. **"What real assets do you have? This decides how much gets generated versus [curated] from
   what you own."**
4. **"One thing this site should do that no site you've seen does. This becomes the signature
   move."**
5. **"Where should this page feel calm and where should it feel intense?"**

Question 3 is the asset-honesty gate and it is worth copying verbatim. Question 4 is the
one-ornament rule again, arrived at independently.

His answer to question 4 is the most on-point line in Group C for an evidence-led portfolio:

> "Every claim has a receipt. Nothing on the page is asserted without a source."

And the site built it: a running "sourced 0 of 9" counter in the left margin that increments as
you scroll past each sourced claim, and a closing section that runs through all nine sources.
His own reaction to that section: "I don't know if I love that, but I don't know, kind of cool."

## His answer to question 3, verbatim, and why it matters here

> "Just use the pictures that are already in there. So there's one image of me speaking. There
> is also an image of all of us at one of our events ... those are the only two images I gave
> you besides the one at the bottom that says meet our founder and the merch image. So those are
> the images you should work with. **But actually it'd be cool if you generated a few images
> that weren't necessarily photorealistic** ... minimalistic geometric low poly human figures ...
> Just keep it minimal and make it match the color scheme and the brand guidelines."

**This is the resolution to the generated-image problem, and it comes from the only presenter
who had real photos to protect.** Real photographs stay real. Where he needs filler, he asks
for something **deliberately non-photorealistic** (low-poly geometric figures) so it cannot be
mistaken for a photograph of an event that did not happen. Generated imagery that announces
itself as illustration is not a false claim; generated imagery that imitates a photograph is.

## What the skill does that the others do not: a self-verification pass

> "after it started generating these images with key.ai, it started to build a website and now
> that it's building it, **it does verification**. So it says now the part the harness can't
> judge, zooming into keyframes. **So it's literally taking screenshots of the site and it's
> going to investigate and inspect them to make sure that nothing is off and nothing is wrong.**
> And so that's how hopefully it's able to give us something on the first shot that's a lot
> better than if it didn't do this verification pass."

A screenshot-and-inspect gate inside the build loop. Runtime for the whole run: **about 30
minutes**.

## Image and video generation

- **kie.ai** (spoken "key.ai"). https://kie.ai. He describes it as "kind of like OpenRouter but
  for image and video models."
- Setup: grab an API key, put it in the Claude Code project's environment variables, and the
  skill calls it directly.
- The skill chains the media itself: "it'll automatically create images and then turn those
  images into videos, and it will stitch the videos together. It'll do whatever it needs to do
  because the skill tells it how."

## The review pass, verbatim, and what it teaches

His feedback to the first build is worth reading in full as a model of design critique language
that a model can act on. Extracted, the specific defects and fixes:

| Defect he named | Fix he asked for |
|---|---|
| "the hero section, it's a little bland when someone first loads up the page ... it doesn't feel very premium" | "add a little bit of depth here" (result: it rebuilt the hero as a magazine cover) |
| The globe fill animation "scrolls too fast ... on a typical scroll, that's too fast" | "slow this down significantly, so the users can actually scroll and realize what's going on" |
| Static sections between animated ones "just feels a little bit bland" | "we should have the text come through as if it was being typed" |
| Certification animation "doesn't quite last long enough" | "slow it down or make that a little more exaggerated" |
| Wrong link target on a CTA | Point it at the real waitlist URL from the live site |
| A whole section he disliked | "I don't love the register. Let's just get rid of that section." |
| A wrong caption on a real photo | Flagged, not yet fixed |

**Note the pattern: every animation note is "too fast, slow it down".** Twice, on separate
elements, unprompted. Scroll-synced motion generated by these models runs faster than a person
scrolls.

## His prompting observation, verbatim

> "Lately I've been finding that you can really instruct AI models a little bit more emotionally
> than you used to in the past. Like I'm telling this thing what I want it to feel like and what
> I want the motivation to be and it I really have it thinking about if it was the user and
> clicking through and scrolling through, what would it feel."

## Honest assessment of the output

He is not uncritical of it. "First glance though it looks pretty boring." The word "bland"
appears four times in his review. He also caught the model **inventing provenance**: it found
leaderboard screenshots that were not on the original site and were not supplied ("I don't know
where I kept these, but it went and found these") and it mislabelled a real photo ("we'll have
to fix this caption though cuz that was not AIS Live. That was Africa AI"). **On a site whose
signature move was "every claim has a receipt", the model fabricated a caption.** That is the
warning for an evidence-led portfolio: the same run that builds a source counter will mislabel
a photograph.

## Mobile and responsive

**Absent.** Zero mentions. Every frame is a desktop browser. A scroll-scrubbed, cursor-driven
site is demonstrated entirely with a mouse.

## Concrete design values

**None numeric.** Build time about 30 minutes. Everything else is qualitative.

## Honest read

Title is mild clickbait ("Ultimate", "steal this" for something behind a community signup) over
a genuinely useful video. The interview questions are the deliverable and they are reproducible
without his file. The two things to take forward: question 3 as an asset-honesty gate, and the
non-photorealistic rule for anything generated.
