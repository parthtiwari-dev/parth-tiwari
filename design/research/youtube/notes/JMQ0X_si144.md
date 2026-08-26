# PL20 - Design with Claude Code: The Designer's Guide

| | |
|---|---|
| Video id | `JMQ0X_si144` |
| Channel | UI Collective (host Kirk) |
| Duration | Not listed in the playlist metadata. About 24 minutes, inferred from 3,566 words of transcript |
| Grade | **Thin signal** for method. It is an install guide |

**Why thin.** Roughly two thirds of the runtime is installing Claude Code and connecting the Figma MCP, narrated click by click, on macOS, with an explicit "I'm not too sure how to open it on a PC cuz I haven't used a PC in like a decade". The remaining third is three throwaway prompts (`build me a black and purple dashboard for a modern SaaS company`) whose only purpose is to prove the connection works. Nothing is designed, no direction is set, no output is critiqued beyond "looks pretty good".

It is not dishonest. It is the earliest video in the series, aimed at designers who have never opened a terminal, and it says so. But there is no method here to copy. **Recording it as thin so no one spends 24 minutes on it.**

---

## 1. The workflow

There isn't one. The sequence shown is: install Claude Code → connect Figma MCP → prompt for a dashboard into an empty Figma file → delete some emoji by hand in Figma → prompt Claude to pull those edits back → repeat the same thing in the desktop app → repeat it again in Pencil.

The one workflow-shaped observation is the round trip, and it is stated as an aspiration rather than demonstrated at scale:

> "Build a design in Claude, push it to Figma, iterate with your team on the widgets, the components, everything inside Figma, even if the auto layout and stuff isn't perfect right away, and then when you're ready, tell Claude here's the updated widgets."

He also shows that you can **send a single selected element to Figma rather than the whole page**, which is a real and useful granularity ("say if there's only one element that I like here, one group, I just want to send this one group to Figma for me to riff on").

---

## 2. Prompts

Only three, all deliberately trivial and all admitted as such ("I know, prompting's not great, but whatever").

> "build me a black and purple dashboard for a modern SaaS company" + Figma file URL

> "update the dashboard cards based on the changes I made here" + link to the edited Figma selection

> "build me a purple dashboard for a SaaS platform" (in Pencil)

Nothing prompt-shaped worth carrying forward.

---

## 3. File and doc structure

None discussed.

---

## 4. Design rules with numbers

None. Zero numeric values appear in the entire transcript.

---

## 5. Tools named

| Tool | For | Real result? |
|---|---|---|
| Claude Code (terminal) | the install walkthrough | Yes, install completes |
| Claude Code desktop app | same thing, easier | Yes. "Whether you do it in terminal or in the Claude desktop app, you get a great result" |
| Figma MCP + remote MCP plugin | two-way sync | Yes, round trip demonstrated on one small edit |
| **Pencil (pencil.dev)** | a designer-friendly desktop front end for Claude Code | Yes, one dashboard built. Notable because it is the only tool in Group A that is not Anthropic, Figma, Google or Mobbin. He rates the output "honestly a little bit better than what you generally see a lot of AI design tools do" |
| Pencil's prebuilt UI kits | pick a look before generating | Mentioned, not exercised |

**Pencil's disqualifying limitation, stated:** "There's currently no way to take the designs that are done here and then put them into Figma. There's no option to do that just yet."

---

## 6. What makes AI output look generated

Nothing specific. Two general cautions:

> "Just because you see people online being like 'oh, look what I spun up with Claude Code', doesn't mean it's perfect in Figma... everyone thinks they can just one shot a five-star design that looks like it came out of Google or Apple. Can't do that."

> "What you'll see on X is a lot of people posting what they produced, but they don't tell you the effort that was involved in order to get to that design."

---

## 7. How he iterates

One operational tip, and it is oddly specific and probably real:

> "Don't condense [the browser] down as I did here just to try to fit things on one screen. Use two monitors, or else Claude will get confused around maybe you want a tighter look, you want to adjust the padding."

Inferred restatement: if the model is reading a rendered page, the width you render at is an instruction it will act on. That has a direct consequence for responsive work, which he does not draw.

---

## 8. Mobile and touch

One line, and it is the clearest statement of the limitation in Group A:

> "There's still issues with perfect responsiveness. Like all the other AI tools that are out there, they don't really get it responsive perfectly first try. If you're expecting to get a design [where] you don't need to do anything with it, perfectly responsive in a way where it's development handoff ready out of the box, not there yet."

Repeated later on the Pencil output: "this element isn't fully responsive."

No breakpoints, no touch targets, no mobile testing shown.
