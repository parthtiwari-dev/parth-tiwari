# WR-kVYU-lBU

**Title** Top 5 Claude Code Skills... 100,000+ github stars
**Channel** Jack Roberts
**Duration** 22:06
**Grade** MEDIUM. Five real tools, real demos for four of them, and **not one GitHub URL is
spoken aloud**.

The task brief expected this to be the richest source for named repos with URLs. It names five
tools and demonstrates all five, but every URL is on-screen only. Every repo below is recorded
with what he actually said; where I have supplied a URL it is marked inferred and must be
verified before installing anything.

Only one of the five is a design tool. Three are about token cost, one is about scraping.

---

## 1. Graphify (Andrej Karpathy inspired codebase knowledge graph)

- Spoken name: "Karpathy Graph A Phi" / "graphify". Invoked as `/graphify`.
- **URL: not stated.** Inferred candidate not verified.
- What it does: turns a repo into a queryable knowledge graph so Claude Code does not re-read
  the codebase from scratch each session. He claims "over 70 times cheaper when you're asking
  questions to code base in Claude code."
- Claimed range: 25+ languages, multimodal (reads PDFs, transcribes audio with Whisper).
- **The stated threshold matters:** "this works best for larger repos. So, if you have
  something 30 files or less, the overhead can't eat the win. This really crushes it when
  you're looking at 500 files plus."
- Demonstrated: yes, on his own dashboard repo. Produced a graph and an answer.
- Relevance to this portfolio: **none.** A v2 portfolio is well under 500 files.

## 2. Firecrawl

- Spoken: "Firecrawl", added as a Claude custom connector via a remote MCP server URL found on
  docs.firecrawl (URL shown, not spoken). https://firecrawl.dev (inferred from the spoken
  "docs.firecrawl").
- What it does: turns a messy page into structured data an agent can use. Claim: "Firecrawl can
  save you sometimes 80% on that sort of stuff."
- Setup path he shows: Claude, bottom left, Manage connectors, plus, Add custom connector, paste
  the remote MCP server URL, replace the curly-brace placeholder with your API key, set the
  tool permission to "always allow".
- Pricing stated: free tier around 500 credits, hobby plan $16 a month.
- Demonstrated: yes. Lead-generation query ("find for me 20 leads in the pool cleaning business
  in Austin ... name, email address, website, and one to two interesting facts") returning an
  HTML table.
- Relevance here: **moderate, and it is the outreach use, not the design use.** He is running
  exactly the cold-outreach motion this portfolio is a landing page for. In the sibling video
  z9CwM-DAe5Q he uses the same tool to extract a brand's logo, accent colours and typography
  from its live site, which is the design use.

## 3. NotebookLM skill (his own)

- **URL: not stated.** Distributed from his own site/community.
- What it does: drives NotebookLM programmatically from Claude. Authenticates by browser cookie.
- Stated caveats, verbatim: "this is an unofficial API because we're using the cookies in the
  browser", "it's a one-time browser or per machine ... it can feel a little clunky sometimes if
  you're in team development".
- Demonstrated: yes. Built a 20-source notebook on Instagram growth and queried it.
- Relevance here: **none for the rebuild.**

## 4. Awesome Design (the design.md library)

This is the one that matters for the portfolio, and it is the same repo he covers in more depth
in z9CwM-DAe5Q under the name "Awesome Designer AI".

- Spoken: "Awesome Design". "it's a design.md library".
- **URL: not stated.** Inferred: https://github.com/tanujsiripurapu/awesome-design-ai or a
  similarly named repo. **Do not install on the strength of this note.** Search GitHub for
  "awesome design ai design.md" and verify stars and contents before use.
- What it is: plain-text `design.md` files that codify the design systems of well-known
  products. Nine categories. He says "a wardrobe of 60 68 brand identities" here and "over 55
  brand systems" in the sibling video. Named examples across both: Claude, Cohere, Apple,
  Lamborghini, BMW, Stripe, Spotify, SpaceX, Nike, Wise, PostHog, Coda, Expo, Lovable,
  ClickHouse, OpenCode.
- Usage, verbatim: "Hey there, I'd like you to install this GitHub repo. And once you've done
  that, I want you to build a website for a [thing] in the style of this" plus the repo URL and
  the chosen `design.md`.
- Demonstrated: yes. Built a Claude-styled site. His verdict: "It does look very Claude-y to me
  ... they got the typography nailed down."
- **His own caveats, which are the honest part of the video:** "it's a library, not a skill. So,
  these are predefined templates ... it's a curated list. So, think of them as design
  inspirations, like prepackaged ideas that you can build on. The quality can vary with
  mileage." And on his own real site: "when I built aiwithjack.com for my community ... I
  actually built probably four simultaneously in four separate environments. And even then, it
  took one or two prompts in each of them to get the right first initial kind of like starter,
  and then I go deeper."

## 5. Claude Code Router

- Spoken: "Claude code router". **URL: not stated.** Inferred:
  https://github.com/musistudio/claude-code-router (widely known repo of that name, unverified
  against the video).
- What it does: local proxy. Claude Code thinks it is talking to Anthropic; requests route to a
  cheaper model through OpenRouter. Named backends: Kimi K2.6, DeepSeek, local Llama.
- Cost claim: Kimi K2.6 API credits "88% cheaper".
- Demonstrated: yes, installed in Antigravity and wrote a file with a routed model.
- **Stated failure modes, verbatim and worth keeping:** "skills [and] MCPs rely on Anthropic
  specific tool call formatting. So, they can misbehave if they're not Claude backends"; "you
  also get more latency"; "tool calling quality cliffs below Kimi K2.6 and DeepSeek for
  multi-file refactors, don't route to a random cheap model".
- Relevance here: **low priority, real option.** Design iteration is where the tokens go, and
  design taste is the one thing he says to keep on the big model.

## A prompting habit worth stealing

Twice he pastes his own draft prompt back into Claude before sending it:

> Hey there, Claude. Would you improve this prompt in any way that would basically give it
> better instructions?

His comment after: "I'm glad I did that because the questions are way better this way."

## Mobile and responsive

**Absent.** Zero mentions across the whole video.

## Concrete design values

**None.**

## Honest read

Title says "100,000+ github stars", which is a sum across five unrelated repos, not one. Four
of the five are cost or research plumbing rather than design. The section that matters for a
portfolio rebuild is section 4, and his own honest caveat there ("the quality can vary with
mileage", four parallel attempts before a usable start) is more useful than the demo.
