# G0tOexS93IM

**Title** Claude Design 2.0 = Web Design On STEROIDS (Full Workflow)
**Channel** Tae Online HD
**Duration** 6:40
**Grade** HIGH SIGNAL for its length. The shortest video in Group C and the densest, and the
**only one that builds a portfolio** and the **only one that names Three.js**.

Read this one first. It is six minutes and it contains the reference-gathering discipline, the
best single prompt line in the group, and a clean deploy path.

---

## What is built

A designer's portfolio with two creative pieces:
1. An **image-trail cursor effect** in the hero (project thumbnails spawn behind the pointer and
   fade out).
2. A **liquid swirl effect on the work images** on scroll, which he describes as a "liquid
   scrolling 3JS effect".

**This is the only mention of Three.js in Group C.** It is used for one effect on one section of
a portfolio, not as the site's structure or navigation.

## Step 1: reference gathering, with notes

> "Don't just start prompting and hope it looks good. Spoiler, it won't. **Pull a few references
> first so you're directing Claude. Without them, your site ends up looking like a PowerPoint.**"

Sources named:
| Source | URL | Why |
|---|---|---|
| Mobbin | https://mobbin.com | "full of shipped screens from actual apps so you're using battle-tested designs" |
| Awwwards | https://awwwards.com | inspiration |
| Savee | https://savee.it | inspiration |

The method, verbatim, and the annotation step is the part people skip:

> "Grab a couple screenshots of your strongest references and **drop them straight into Figma and
> be sure to add notes so Claude knows exactly what you like about each reference. Once you have
> about three to five visual references with notes, just screenshot it and paste it back into
> Claude Design.** Now, Claude isn't guessing in the dark."

**Three to five references, each annotated with what specifically you like about it, flattened to
one image.** That is a concrete, cheap, reproducible input spec.

## Step 2: the opening prompt

He does not read it out in full, but he states its two load-bearing parts:

Role assignment:
> "I start by giving it a role, telling Claude it's a **principal product designer and
> award-winning creative developer** so it knows the bar we're aiming for."

The closing line, verbatim, which he calls the part most people skip:
> "the part most people skip is this very last line at the bottom where I tell Claude to **ask me
> any clarifying questions until it has 99.9% confidence in the design assignment and not to
> assume anything**."

Claude Design then interviews him before generating. This is the same interview-first pattern as
`QUI6Ug4cHnE` and `bBlY5YOsKN8`, reached by a different route. **Three independent presenters
converge on it. It is the most corroborated single technique in Group C.**

## Step 3: direct manipulation instead of reprompting

The Claude Design 2.0 update he is covering adds canvas editing, and his usage is the point:

- Click Edit (top right), select an element, drag it, send it behind, or press Delete. "the
  result is instant. **No more prompting just to make small changes like that.**"
- Layout controls in the left panel: justify centre on a div, align centre on the text inside it.
- Reserve prompts and comments for things direct editing cannot do.

The rule this implies: **structural intent goes in a prompt, positional nudges go in the editor.**
Every reprompt is tokens and latency.

## Step 4: the prompts he does read out

Comment on a specific element:
> update this text to be full width and ensure it doesn't break to two lines

The cursor trail, verbatim, and note how physical it is:
> As the pointer moves over the hero, spawn a trail of the project image assets that follows the
> cursor and fades out behind it.

Layout change driven by a mock-up he drew himself, pasted as a PNG:
> Update the projects in the work section to match the updated mock-up using an asymmetric grid
> instead of the current layout.

His verdict on that one: "It's not exactly how I mocked it up, but it's actually pretty close."

**The liquid swirl prompt is withheld.** "I won't bore you reading through all the details on
this one because it's pretty technical, but I'll drop it in the description if you want to use
it." The one prompt in Group C that would tell us how a Three.js effect gets specified is the one
not shown. Worth retrieving from the video description if this effect is ever wanted.

## Step 5: deploy, the correct way

Unlike PL06/PL07/PL08, this path keeps a repo:

1. Claude Design, Share (top right), **More formats and apps**, **Send to Claude Code**, then
   **Send to Claude Code web**, **Open in Claude Code web**. Claude Code rebuilds the design as
   real code.
2. GitHub, New repo, set owner, name it, **private**, Create.
3. In Claude Code: "Commit this project to the following GitHub address" plus the repo URL.
4. Vercel, Add New Project, Import the GitHub repo, Deploy.

## His closing point, which is the honest one

> "Claude Design and Claude Code stopped being two separate tools and turned into one workflow.
> You can go from idea to live site without ever leaving that loop. But **notice what actually
> changed here. Everything I just showed you is the workflow getting better. The tools around
> the design. The design itself, that depends on how good the model is.**"

## Mobile and responsive

**Absent.** Zero mentions, on a portfolio build.

## Concrete design values

- **Three to five annotated references** as the input.
- **99.9% confidence** as the clarifying-questions threshold.
- Role: principal product designer and award-winning creative developer.
- No numeric type, spacing, radius, colour or timing values.

## Honest read

Title has "STEROIDS" in it and a mid-roll ad for his own portfolio template ("Lo-Fi"), but the
six minutes are almost all method. The annotated-reference board, the 99.9% line, the direct-edit
rule and the repo-backed deploy are all directly usable.
