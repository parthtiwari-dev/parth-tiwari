# jq9LRwE0-GQ

**Title** Claude Design just got 10X Better... I'm Done
**Channel** Jack Roberts
**Duration** 12:05
**Grade** MEDIUM-HIGH. One technique, explained properly, with **real token costs** attached.
The only Group C video that reports what a run actually consumed.

The technique is the **gauntlet loop** (he also calls it the design loop). It is the only method
in Group C that addresses the core problem of AI design work.

---

## The problem it solves, verbatim

> "the biggest problem that we have here is simply the fact that **Claude judges its own
> homework.** It says, 'I think I've done it.' In reality, it hasn't."

> "if you give anything to Claude and say, 'Hey, what's wrong with this?' **If you ask it five
> times, you will get five different answers.** So it's like each of these critiques are looking
> at it 10 times before you get the result, which is why it looked so high quality."

> "You can't be the judge, the jury, and the executioner."

## What the loop is

**Fresh-context independent critics.** Not one critic re-reading its own work in the same
context, but sub-agents spun up clean, each with one axis to judge, looping until the work
clears the bar.

The three critics, verbatim:

1. **The brief.** "did you do what I asked? ... one critique is just saying, 'Hey, did you
   actually do the brief, bro?' And he might say, 'Hey, bro, no, I didn't.' And go back and
   change it."
2. **The system.** "is it really in line with the system?"
3. **The craft.** "this could be rendered frames and then the code, and it judges the bar all
   based dynamically on your prompt."

Stage sequence he reads off the run output: **interview, pre-flight, teardown, [set] the bar,
build, critics, loop**.

The line that makes the technique portable: **"taste becomes a checklist."**

## Attribution

> "this was popularized by ... Matt Shumer, so huge shoutout to Matt. This happened on X, and
> Rubber Nuggets covered it recently."

He credits Andrej Karpathy and Elon Musk as having commented on the original thread. He also
distributes his own version as "the three critique skill", copied as a page of text and turned
into a skill with "Hey, turn this into a skill", invoked as `/design loop`. **No URL spoken**;
it comes from his free School community.

## Cost, which is the reason to keep this note

The only hard numbers in Group C:

| Run | Rounds | Tokens |
|---|---|---|
| Carousel (level 1) | not stated | **3 million** |
| Design system animation (level 2) | **10 rounds** | **730,000 Haiku + 1.19 million Sonnet** |
| Website (level 3) | **6 rounds**, 3 judges | **about 2 million** |

His own conclusion, verbatim: **"the loop can eat your credits ... I would reserve this for your
bigger things, like the things that you really want to crush down and get ready. Like templates,
for example, that you are then going to go and reuse."**

Mitigation he built in: "in the skill I've given you, I delegate it out to sort of smaller
models." And on model selection: "you could actually bring in other models like a DeepSeek V4.
**But you do want the big model to be Claude cuz he's got great design taste.**"

He also notes the loop terminates on its own: "I found when it went through rounds, it kind of
ended naturally at a great point."

## What the critic log looks like

The most useful artefact in the video is the round-by-round log he reads out, because it shows
what a critic actually catches:

> "Round one, three fails, **no logos, color breaking monochrome, loud words underscaled.**
> Round two, **[the] mark was too small.** Round three, **lime shape with a second accent.**
> Round four ... and you can see there were **10 rounds** to get to this point."

These are exactly the class of defect a single-pass build ships: a missing brand mark, a colour
that breaks the palette rule, a size relationship that inverts the intended hierarchy.

## Prompts, verbatim

Setting up a design system from an existing artefact:
> Hey, I love this presentation, turn it into a design system.

Level 1, from nothing but a URL:
> I would like you to go ahead and I want you to look at this URL and build me a version of this
> for AI tools. So go through the [channel] and find out all the tools that I mentioned and in
> the same design aesthetic, inspired by that design aesthetic, just do me something covering all
> the top tools.

Level 2, against his own exported design system:
> use the below design system and I want to make a beautiful HTML graphic that lasts 10 to 15
> seconds that I can overlay with the below sentence.

**10 to 15 seconds** for an overlay graphic. Compare the 25 seconds he recommends for a hero
piece in `wJWO91mi5o0`.

## Export path (repeated across his videos)

Claude Design, select the design system, Share (top right), Project HTML, export. Then use it in
Claude Code, Claude, ChatGPT, or anything else. His reason for running the loop outside Claude
Design: "purely because of the strength of this technique, and it's the fact that what we need to
do is spin up what are called fresh context critics."

That constraint is real and worth noting: **the loop needs sub-agents, so it belongs in Claude
Code, not in the Claude Design canvas.**

## Mobile and responsive

**Absent.** Zero mentions.

## Concrete design values

- Overlay graphic length: **10 to 15 seconds**.
- Token costs as tabled above.
- No type, spacing, radius, colour or easing values.

## Honest read

Title is farming ("I'm Done" means nothing). The content is the most defensible technique in
Group C because it is the only one with an adversarial check in it, and he publishes what it
costs rather than only what it produced. The cost is the catch: two to three million tokens per
artefact means this is for the one piece you intend to keep.
