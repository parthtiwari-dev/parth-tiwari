# eXlSgQmz02E

**Title** Claude Design: The Complete Guide
**Channel** UI Collective (playlist PL13)
**Duration** 31:58
**Grade** MEDIUM. Mostly a feature walkthrough, but it contains one result that contradicts the
premise of half of Group B and is worth the whole video on its own.

---

## The finding that matters: a design system made the output worse

He generates twice. First with no constraints, then with his design system uploaded and audited.

> "if you use your design system designs just aren't as good versus what we got here."

Stated again as a general principle:

> "If you give AI total freedom and total control, it produces really good results. But when you
> start adding guardrails like a design system, the results are not usually as good."

This sits directly against PL03, PL14 and PL15, which all say the opposite. The reconciliation, and
this is inference, is that **the two are doing different things**. PL03 and PL14 hand-author a
curated documentation frame and a prose skill, then generate. PL13 uploads a raw Figma file to an
automated ingest and lets the tool derive the system. **The variable is curation, not the presence
of a design system.** Evidence for that reading is in what the ingest got wrong, below.

### What the automated design system ingest got wrong

He uploaded a design system he built himself, so he can check every claim:

- **Fonts not recognised at all.** Banner: "Missing brand fonts. Claude is rendering typography
  with substitute web fonts." He had uploaded the font files. Re-uploading did not fix it
- **Type styles invented.** "in the design system I uploaded, I don't have displays. I have H
  tags. I have one hero, but I left out displays." It produced a full display scale that did not
  exist
- **Type values wrong.** "the attributes of the font are actually wrong when compared against
  what's in the design system. Line heights aren't right. Font sizes aren't right. The naming is
  wrong"
- **A size invented into the scale.** "keep the 18 24 28 point optical treatment, we didn't have
  an 18 in the design system that I had uploaded. We had a 16, we had a 20, we didn't have an 18"
- **Extra radii added.** "it does look like it added a couple extra radiuses for whatever reason"
- **Components partially captured.** "it sort of pulled a small subset of the components. It
  didn't pull all of them"
- Colours were the one category it got right

### What the generated design then got wrong

Even after correction, semantic colour roles were ignored:

> "in the design system file that I had uploaded, green is not a primary button color. It's only
> used in success elements. And that's one thing that I don't like in playing around with Claude
> design, is it still drifts from those design system rules. If it really had a good understanding
> of the design system, it would realize that the buttons in the file I uploaded are like a really,
> really dark gray, almost black."

Also: the focus ring rendered blue when the system's focus colour is not blue.

**A colour ramp without stated roles is not an encoding.** The values were present and correct in
the file. What was missing was the sentence "green means success, never primary." That is precisely
the `description` column PL03 and PL14 insist on.

## 1. Encoding a design language, negative findings

The design-system setup form has three fields: company name, a blurb about the company, and a
"notes" field, plus the file upload. His verdict on the prose fields:

> "entering the company name and a blurb about the company doesn't really impact the design too
> much cuz as I start prompting it asks questions that I would put here anyway."

> "same with this any other note section is, I playing around with it, I haven't really seen a
> difference if I was to populate this or not."

**Free-text brand description in the setup form did nothing.** The interrogation on each prompt
overrides it.

Practical advice on what to upload: strip the file first.

> "if you have a really, really complex design system you might want to consider removing some
> elements like some of the larger page templates cuz that's where it can really burn through a
> lot of tokens and the time drastically increases."

And on dragging a Figma file into a normal prototype: "Unless there's like one page in your Figma
file, it's going to go through so many tokens in my honest opinion, just not worth it."

## 2. The exact prompts

All three are short, because the tool interrogates:

> "Please build me an onboarding flow for a futuristic EdTech mobile platform."

> "build me a dashboard for a financial management application."

> "Please build me a mobile financial app welcome page along with both a sign up and login page.
> Ensure it is prototyped."

The interrogation is the real interface. Questions asked include product core concept, primary
audience, visual direction, which steps, device frame, how to present options (single flow versus
variants), tone, and a **novelty slider 1 to 10** ("How novel/experimental?", he set 8). "decide
for me" is an accepted answer to any of them and he uses it constantly.

> "these questions really help unlock what it is that we're looking for to make better use of the
> AI first time around."

**Correction prompt shape**, which triggered a useful behaviour:

> "this does not match what was in the design system I had provided"

The model replied with a list of clarifying questions rather than a blind retry: "when I give it a
prompt where I tell it something's wrong, I usually get a list of questions back."

## 7. Critique loops

The **canvas comment loop** is the mechanism here and it is worth stealing conceptually.

1. Leave positional comments directly on elements ("this section far too tall, reduce number of
   transactions")
2. They collect in a comments list
3. Select which comments to send, batch them, send to the model in one turn

He got one wrong because he was imprecise, and diagnoses it correctly: "instead of these insights
to change it actually changed these ones too. That's my fault. I wasn't very explicit."

**Batching several located critiques into one turn** is the transferable idea. He also reports the
comment feature being buggy.

## 4. The Figma question

Export path: no direct Figma export from Claude Design. The route is export zip, or hand off to
Claude Code (copy a command), then from Claude Code push to Figma with Figma MCP. **That push took
about 7 minutes** and the result was partly responsive and needed cleanup.

He predicts Figma's answer to the encoding problem is documentation hosting:

> "I feel Figma might work to fix with their launch at their conference later on this year by
> hosting documentation inside of Figma."

## 3. Numbers

- Type scale fragment he confirms as real in his own system: **16 and 20, no 18**
- The invented one: **18, 24, 28**
- Nothing else

## Cost

He hit his usage limit mid-recording, upgraded, and the upgrade took hours to register. Six
onboarding screens "burned through a ton of Claude tokens." His prediction:

> "designers will have an AI budget at work. So, you have a monthly number of credits."

Relevant judgement for anyone deciding where to iterate:

> "It's almost quicker for these smaller screens to build them using my design system in Figma and
> then bring into Claude code, cuz then we're not burning through a million and two tokens every
> time."

## 5, 6, 8

- **Reference-driven design**: not covered
- **What makes output look generated**: not addressed. He praises the unconstrained output
- **Mobile and responsive**: mobile is a device-frame option in the interrogation (iOS). One
  observation that a Figma push was "not perfectly responsive". Nothing authored
- **Wireframe mode**: exists, and he dismisses it. "I don't know any designers who wireframe
  anymore, if I'm honest... we tend just to jump right into high fidelity, cuz that's what most
  stakeholders want"
- **Start from sketch**: he cannot find a use for it. "I just don't get it"
