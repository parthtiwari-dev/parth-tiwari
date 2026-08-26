# z9CwM-DAe5Q

**Title** Claude Code Design just became UNSTOPPABLE
**Channel** Jack Roberts
**Duration** 21:53
**Grade** MEDIUM. Clickbait title over one genuinely useful section (the slop tells and the
`design.md` repo) and fifteen minutes of a generic five-step framework.

This is the video that names the AI-slop tells, despite not being the one titled after them.

---

## The slop tells, verbatim

> "the biggest criticism about AI-generated content is mainly the fact that it all looks
> exactly the same. Specifically, it's got the same hero section. If it's a website, you're
> going to see **purple gradients**, you're going to see **Inter font**, you're going to see the
> **classic three running boxes**. You can see it a mile away."

Three checkable tells: purple gradient, Inter, a row of three equal cards. That is the whole
list from this video. The sibling `NAumQObJEwM` adds the category list (typography, imagery,
hierarchy, colour, spacing).

He also cites a conversion statistic: "According to Intercom science, quality sites convert
pretty much 91% better than regular ones." **Treat as unsourced.** No study, no link, no
definition of "quality" or "regular". Do not repeat this number anywhere.

## The central claim, which is correct

> "code can effectively be turned into design ... AI is incredible at code. Design can actually
> be codified. **Typography scales, spacing systems, color tokens, layout grids.** If you can
> explain to Claude Code what great design looks like, you can produce it on demand."

> "design is not an art form reserved for specialists. It's a system that can actually be
> encoded."

Four encodable things named. This maps one to one onto a tokens file.

## Awesome Designer AI (the design.md repo)

- Spoken name: "Awesome Designer AI". Same repo as "Awesome Design" in `WR-kVYU-lBU`.
- **URL: not spoken.** On-screen only.
- Claimed traction: "almost 50,000 stars within 2 weeks" early in the video, "over 46,000 stars
  in 2 weeks" later. Two different numbers, four minutes apart.
- Contents: "over 55 brand systems". Named on screen: Coda, Expo, Lovable, ClickHouse,
  OpenCode, PostHog, Stripe, Spotify, SpaceX, Wise, BMW, Apple, Nike, Lamborghini, Ollama.
- Format, verbatim: "It's a markdown file. No Figma export, no JSON schema, no special tooling.
  You can just talk to Claude, and it will work for you."
- Install prompt:
  > Hey there, I'd like you to install this GitHub repo, please. [paste repo URL]
- Build prompt:
  > Hey there, my man. What I'd like to do is to create me two websites based on this skill. I
  > want you to go ahead and build for me. Firstly, go ahead, and why don't you do Lovable? And
  > then after Lovable, go ahead and do one on Ollama, so I can see the full power of this. And
  > then actually do a third one for me. Also, do SpaceX.
  >
  > Awesome, open these three up for me in a localhost.
- Demonstrated: yes, three sites one-shot. His assessment is unenthusiastic and therefore
  believable: Ollama is "looking a little bit more code-heavy. Very decent", SpaceX is "Very
  interplanetary".

## The five-step framework

1. **Pick your format.** Website, HTML slide deck, branded graphics, identity system, data
   visualisation, or report/proposal. Selection rule, verbatim: "I choose what is the thing that
   you spend most of your own personal time creating, and what would have the highest impact if
   you were to automate it?"
2. **Wire the integrations.** Firecrawl for brand extraction, KIE API for images, plus whatever
   the format needs (Gmail, calendar, meeting transcripts).
3. **Give it reference material** for what excellent looks like.
4. **Generate** to about 80%.
5. **Refine, then codify the whole thing into a skill.**
   > I would like to turn this entire thing into a skill, so then I'm going to give you some
   > information in the future, and you're going to produce this for me systematically.

## Firecrawl for brand extraction

The design-relevant use of Firecrawl, distinct from the scraping use in `WR-kVYU-lBU`:

> "it's basically like talking to a website [and] can extract things like brand identity,
> logos ... getting their logos, getting their accent, getting their typography that we can now
> pull in."

Demonstrated end to end: he asks Claude to pull glido.com's brand guidelines with Firecrawl and
the generated slide deck comes back with the correct logo placed bottom right and the correct
palette. That is a real, verifiable result and the most impressive moment in the video.

Setup, verbatim, including his workaround for not knowing the MCP URL:
> Hey there, what is the remote MCP server for Firecrawl?

## The skill-building interview prompt, verbatim

The most reusable prompt in the video:

> Hey dude, I would like to build a skill for building presentations. The presentation format is
> going to be 16 by 9. I would like to define what excellence looks like. I'm going to give you
> some beautiful materials, so we can agree and go back and forth on a desired style. Once we've
> done that, and we're happy with it, I'm going to make sure that you're using the right skills,
> the right connections, and then we're going to codify this to be a skill that I can use
> whenever I want to to create that thing. Do you have any questions for me initially? Then, I'm
> going to go ahead and I'm going to provide to you the basic assets I want you to use.

Follow-up specifying density and asking for a small sample before committing:
> I would like these to be more presentation-led, so not loads and loads of text. Just generate
> for me three slides to show you what I mean. I've also attached an illustration style. I want
> you to deconstruct what that looks like, and then maybe just show me one of the images with
> it, and one should have HTML in there as well. I'd also like the [brand] logo in the bottom
> right-hand corner. Extract that using your Firecrawl skill.

Refinement prompt, including a fact-checking pattern:
> before we do any presentation, I'm going to give you an idea. I want you to do comprehensive
> research. I want you to spin up sub-agents and fact-check that research, so the presentation is
> brimming with actual truth. And then I want from you a tech download on all of the sources.

## Reference sources named

| Source | URL | Use |
|---|---|---|
| Midjourney | https://midjourney.com | Illustration styles. "typically speaking, is more good for illustrations" |
| Godly | https://godly.website | Website inspiration |
| 21st.dev | https://21st.dev | Community components |
| Canva | https://canva.com | "You can just lift and shift anything you want there" |
| Google Images | | "beautiful website presentations" as a literal search |

## KIE API

- Spoken as "Kia API". https://kie.ai (inferred from the same tool named as "key.ai" in
  `QUI6Ug4cHnE`).
- What it is: the cheapest route he has found to Nano Banana 2.
- Price stated: "like 6 cents per image", claimed 50% below alternatives.

## Mobile and responsive

**Absent.** Zero mentions.

## Concrete design values

**None numeric.** Four encodable categories are named (typography scales, spacing systems,
colour tokens, layout grids) with no values attached. Three slop tells are named (purple
gradient, Inter, three cards). Image cost: 6 cents.

## Honest read

The title is farming. The claim that "Canva and Figma" are being displaced, the 91% statistic,
the "53% of people are already starting to get this" figure and the "AI design system
conferences are getting sold out" aside are all unsourced. Underneath that: three real slop
tells, one real repo, and one genuinely demonstrated Firecrawl brand-extraction result.
