# PL19 - How I Actually Use Claude Code in My Design Workflow

| | |
|---|---|
| Video id | `TKScxZtESzs` |
| Channel | UI Collective (host Kirk) |
| Duration | 13:24 |
| Grade | **Medium-thin.** Short, honest, two real uses, one genuinely valuable idea. No prompt library, no numbers |

**Why medium-thin rather than thin.** It is a sequel to the setup video (PL20) and roughly a third of the runtime is a repeat of that setup. But the remaining eight minutes contain two things he demonstrably uses, an unusually blunt list of what the Figma sync gets wrong, and one reframe that is worth more than the rest of the video: **use the model to see an interaction, not to produce a design.**

He is explicit that this is not a showcase: "keeping things honest with you guys, I'm not going to say I do things and show it to you if I don't use it myself." And: "Last week I was using this for like every single day working on client projects."

---

## 1. The workflow, step by step

Two workflows.

**A. Documentation by imitation.** Teach the model an existing document's format from one example, then have it produce the same document for a different component and write it back to Figma.
1. Point Claude at one finished documentation frame. Tell it explicitly not to change anything, only to study.
2. Confirm it understood the structure (it reported back: component badge, H1 title, description, meta pills, sections).
3. Point it at an undocumented component and say "apply the same pattern", plus "when completed, push it to Figma".

**B. Seeing a complex interaction before designing it.** Describe a hard interaction problem, let Claude Code build a working local prototype, click around it in the browser, decide what the experience should be, and only then rebuild it properly in Figma with real components. Optionally push individual elements to Figma as a starting point rather than the whole thing.

**Where design sits relative to code:** code comes first as a thinking aid, then design. The code output is disposable. This is the inverse of PL05, where the code output is the deliverable.

---

## 2. Prompts, verbatim

### 2.1 Learn the format first, in a separate turn

> "Study this design system documentation page sample for button components. Look at the contents, contents length, and frame formatting. Goal here is just to get familiar. We will not make any edits or changes. Once you are familiar, we will build documentation for other component sets."

The separation matters and is the reusable pattern: **one turn to study with edits forbidden, a second turn to apply.** Naming "content length" as a thing to match is a small, good detail; it is how you stop the second document being three times longer than the first.

### 2.2 Then apply

> "Apply the same pattern to the following link component sets [link]. When completed, push it to Figma."

He flags that "when completed, push it to Figma" is "really important", and that if it does not push it will open a local file in the browser with a `send to Figma` control instead.

### 2.3 The complex-interaction prompt

> "I am working on a complex data visualization table component with potentially 50,000 rows of data. Build me a clean table component with advanced filtering and column management."

What he got and actually exercised in the browser: record search, a filter panel (statuses, departments, regions), applying and clearing filters, a badge appearance per state, column reordering, column show/hide with a live count, and CSV export.

> "It helps me give a really good visual as to what it is the experience that I might actually want to build. **I'm not asking for the perfect design itself**, but it gives me a really great example to go off of that I could then work on within Figma."

Then, per element: `send to Figma` on just the one control he wanted, "so now I'm able to riff on this specific table component itself... where I can match spacing and do other things that I would need to do without having to entirely start from scratch."

---

## 3. File and doc structure

Nothing new. He notes the two ways to establish a documentation template: your company already has one, or you have Claude build one and tweak it "until it has all the sections that you like, the format that you like, and then use that as the master template".

---

## 4. Numbers

None. The only figure in the video is `50,000 rows` inside a prompt, as a scale constraint on the interaction problem rather than a design rule. That is itself a useful prompt technique: state the load the design has to survive, because it changes what the model builds.

---

## 5. Tools named

| Tool | For | Real result? |
|---|---|---|
| Claude Code desktop app | both workflows; his stated preference over the terminal | Yes |
| Figma MCP + remote MCP plugin | two-way sync | Yes, with a frank defect list; see §6 |
| Cursor | what he used before | Named as superseded, because it had no two-way sync: "you no longer need to do things in Cursor, copy things from Cursor, paste it into Figma" |

---

## 6. What the tooling gets wrong

The most useful paragraph in the video, and the most specific defect list in Group A. On the Claude-Figma two-way sync:

> "If you're here for perfect designs, it can't happen.
> There's always issues with **auto layout**. I find myself rebuilding a lot of widgets, despite the fact the widgets are pretty good.
> **Components are not applied.** Even if you prep it with your design system components inside of Figma, even when you upload the design system, the designs it produces don't have the components or the instances of those components applied. All the designs are basically unattached components, more or less, which doesn't help.
> And the **variable application is hit or miss**. Sometimes it works, sometimes it doesn't, where I find myself reapplying a lot of the variables."

Plus, on the generated table: "I already know that this isn't going to be perfect. It's not going to be a one-to-one of my design system. The Figma import, there's going to be things wrong with it. **It might not be perfectly responsive.**"

His fix is not a prompt. It is a scope decision: accept the output as a reference for an experience, and rebuild it by hand in the design system.

---

## 7. How he iterates

- **Study, then act, in two turns**, with edits forbidden in the first.
- **Dialogue over the prototype rather than the spec.** "I'll have Claude generate the UX. I'll dialogue with Claude over it. We'll go back and forth. I'll review it run locally so I can actually preview that experience."
- **Take the element, not the page.** Push one control to Figma rather than the whole screen, so you keep your own structure.
- **Separate what the output is for.** He is unusually clear that the same tool serves two different purposes and that only one of them demands quality: documentation output ships, prototype output is thrown away after it has been understood.

---

## 8. Mobile and touch

One line: **"It might not be perfectly responsive."** Nothing else. No breakpoints, no touch, no viewport testing.
