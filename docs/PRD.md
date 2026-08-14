# Product Requirements

What the site is for, who it serves, and what "done" means.

---

## 1. The goal

**The site exists to generate qualified leads for paid project work.**

Target engagement: ₹50,000–₹1,00,000 per project. Traffic arrives largely from cold outreach — the site is the thing that has to convert a stranger's curiosity into a conversation.

A secondary goal is job offers. It is genuinely secondary, and the ordering matters: **a recruiter converts perfectly well from a client-focused site**, because working demos and clear outcomes are exactly what they want to see too. A client does **not** convert from a recruiter-focused site — CGPA, training records and architecture diagrams do not answer *"can I trust this person with ₹1 lakh."*

So the site is client-led throughout, with resume and experience always one tap away. The higher bar generalises downward.

---

## 2. Why the current site does not do this

It is well-built and it is optimised for the wrong buyer.

**There are no images anywhere.** Not one `<img>` tag in the entire codebase. Nine projects are described in prose — problem, architecture, proof, boundary. A recruiter will read that. **A client will not.** They want to see the thing working. This is the single largest gap and it is larger than anything in the technical audit.

**It sells engineering, not outcomes.** *"Self-correcting Text-to-SQL API with schema retrieval and critic gates"* tells a client nothing about what it did for anyone. No time saved, no cost removed, no users served.

**There is no offer.** No services, no availability, no indication that hiring is possible. Contact is buried inside an About overlay.

**There is no proof of trust.** No testimonials, no client names, no numbers from real usage.

**The strongest asset is unlinked.** Six of nine projects render "Pending verification" while three are deployed and publicly usable right now.

---

## 3. The buyer

**Primary — the decision-maker who can sign.** A founder, a small-business owner, or an agency lead. Arrives from a cold email or DM, on a phone, mildly skeptical, giving the link maybe sixty seconds. They are not evaluating code quality. They are answering three questions in order: *is this person real, can they actually build, and what would this cost me in risk?*

**Secondary — the recruiter or hiring engineer.** Wants role, stack, availability, resume. Served by the same page without the client path being compromised for them.

Geography is mixed — Indian SMBs and Western startups both. The design target is the **skeptical Western founder on mobile**, because that is the least forgiving case and everything else is easier.

---

## 4. Positioning

> **I build AI products people actually want to use.**

Three offers, deliberately ranked rather than presented as equals:

| Rank | Offer | Evidence behind it |
|---|---|---|
| **Lead** | Custom AI products, end to end | Eight of nine projects — RAG, agents, fraud ML, text-to-SQL, workflow supervision |
| Second | AI automation for businesses | Order Supervisor, Oracle Auto Provision, Fraud Risk Intel |
| Third | Creative interactive web + AI | OncoVerse, and this site itself |

**The differentiator is the combination, not any single offer.** Most AI freelancers ship an ugly Streamlit app. Real AI engineering *plus* genuine interaction craft is rare, and it is what justifies ₹1L over ₹30k.

This is why the universe is not decoration. **The portfolio being an extraordinary interactive artifact is the proof of the differentiator** — it does sales work no case study can, because it demonstrates the claim before a word is read.

---

## 5. The funnel

Three jobs, in sequence, with hard time budgets:

| Stage | Budget | Job |
|---|---|---|
| **Impress** | 3 seconds | The universe proves creative capability instantly |
| **Convince** | 60 seconds | Screenshots, outcomes and live demos prove they can build |
| **Convert** | 1 tap | Booking, from anywhere on the page |

**The conversion path must work independently of the 3D.** A visitor should be able to land, be impressed, and book a call without ever flying through space. If the universe is the only route to contact, the universe becomes a toll booth and the site stops converting.

---

## 6. Principles

**Every visual encodes something true.** Position, size, colour, motion and sound derive from project data. Decoration that pretends to be data is the failure mode this project exists to avoid. This is unchanged and remains the governing rule.

**Show before telling.** A screenshot outranks a paragraph. A working demo outranks a screenshot.

**Outcomes before architecture.** What it did for whom, then how it was built. The existing evidence panels are excellent and become the second layer, not the opening move.

**Never make a buyer hunt for how to hire you.**

**Legibility is the ceiling.** If the metaphor needs explaining, it has failed.

**Mobile is a different choreography, not a smaller one.** Most outreach links open on a phone.

**No dead ends for keyboard or screen readers.** Every project reachable by mouse is reachable by keyboard, on every breakpoint.

**Never autoplay sound.**

**Restraint over richness.** Apple's most-copied scroll moment is 148 JPEGs on a canvas, and their product pages are silent.

---

## 7. What we are building

### 7.1 The project model inverts

Today a project opens with a problem quote and an architecture diagram. New order:

| | Layer | Purpose |
|---|---|---|
| 1 | **Screenshot** | The thing, working. Non-negotiable. |
| 2 | **Outcome** | What it does, for whom, in plain language |
| 3 | **Try it live** | Where a real deployment exists |
| 4 | Problem / Architecture / Proof / Boundary | The existing panels — second layer, for technical buyers |

### 7.2 New surfaces

- **Services block** — three offers, one leading, written in outcome language
- **About with a photo** and a first-person intro. Clients hire people; there is currently no image of Parth anywhere on the site.
- **Persistent booking CTA**, never more than one tap away on any screen

### 7.3 Conversion hierarchy

All four channels ship, ranked rather than presented as four equal buttons, which dilutes:

| Priority | Channel | For |
|---|---|---|
| Primary | Booking link (Cal.com / Calendly) | High intent, no back-and-forth |
| Secondary | Contact form | Not ready to talk yet |
| Always visible | Email | Universal |
| Always visible | WhatsApp | Especially effective for Indian SMB buyers |

**No prices anywhere.** Every path leads to a conversation, which preserves the ability to price by client and geography.

### 7.4 One universe, all screens

A single WebGL world replaces the desktop-scene / mobile-canvas split, with camera choreography, density and input model adapting per device and quality tier. See `DESIGN.md`.

### 7.5 Domain readiness

The site stays on `parth-tiwari-1.vercel.app` for now, with `parthtiwari.com` planned.

**Note the `-1`.** `parth-tiwari.vercel.app` is **not** this account's — it is absent from the Vercel project's `domains` array and serves a different site. Every canonical, `og:url`, `og:image` and JSON-LD `@id` in `index.html` previously pointed there, meaning the site was telling crawlers its canonical home belonged to a stranger. This is the same trap as `vivid.vercel.app`, and it is why the verification rule exists.

**The site URL becomes a single exported constant** consumed by canonical, OG, Twitter, JSON-LD and the sitemap. Buying the domain then becomes a one-line change rather than a hunt across eight files. A `vercel.app` subdomain is a real trust penalty on a ₹1L pitch, and this makes removing it trivial whenever it happens.

---

## 8. Out of scope

- A CMS. Data stays in typed TypeScript files.
- A router with real per-project pages. Deep links are query-param driven.
- Multiplayer, presence, or any realtime backend.
- Blog or long-form writing surfaces.
- Three.js or TresJS upgrades. Both stay pinned.
- Published pricing.

---

## 9. Success criteria

### Commercial — the actual goal

| # | Criterion |
|---|---|
| C1 | A stranger can reach a booking action within one tap from any screen |
| C2 | A visitor can see a working product image within 5 seconds of first paint |
| C3 | Every project with a live deployment links to it |
| C4 | The site states what Parth builds, for whom, in plain language, above the fold |
| C5 | A photo and first-person intro are present |
| C6 | Outreach links open correctly on a phone with no interstitial |

### Must hold — non-negotiable

| # | Criterion |
|---|---|
| M1 | Every project reachable by keyboard alone, on every breakpoint |
| M2 | Every modal traps focus and restores it to the trigger on close |
| M3 | `?plain=1` does not download the 3D stack |
| M4 | Mobile ships no WebGL engine it does not use |
| M5 | No blocking interstitial on any device |
| M6 | Reduced motion produces a genuinely static experience |
| M7 | `npm run typecheck` and `npm run build` clean |
| M8 | Plain mode contains every piece of content in the full experience |

### Performance

| # | Target |
|---|---|
| P1 | 60fps sustained on desktop Chrome at default tier |
| P2 | ≥30fps on a mid-tier Android phone, no thermal runaway over 2 minutes |
| P3 | Initial JS below the current 313 kB gzip despite added features |
| P4 | Zero forced layout reads in any per-frame loop |
| P5 | Render loop stops when off-screen or the tab is hidden |
| P6 | Exactly one animation clock, no orphaned rAF chains |

---

## 10. Resolved decisions

**Renamed to EPHEMERIS.** A table of computed positions of celestial bodies — it names the design rule (positions derived from data, never placed by hand) without restating the thesis. `EVIDENCEBOUND` is retired everywhere it appears.

**Chronology uses real dates.** Deriving angle from `status` + `weight` was rejected: it would make chronology the one axis in the universe that isn't actually true.

**Cost of Intelligence revived** inside the Proof panel rather than deleted. `sliderStore` is therefore excluded from the dead-code sweep.

**Links verified, never assumed.** Checking the obvious alias would have shipped a stranger's site — `vivid.vercel.app` does **not** belong to this account.

| Project | Production URL | Ships |
|---|---|---|
| vivid | `vivid-alpha.vercel.app` | yes |
| tathya | `tathya-1.vercel.app` | yes |
| support-core | `support-core-nine.vercel.app` | yes |
| stick-and-dot-app | `stick-and-dot-app.vercel.app` | no — owner exclusion |
| beatmind | `beatmind-theta.vercel.app` | no — 404, deploy `BLOCKED` |
| oncoverse | none resolving | no — production deploy in `ERROR` |

**OncoVerse has never successfully deployed to production.** Its empty links panel is accurate.

---

## 11. Owner homework

Four things the build cannot supply, in order of impact:

1. **One testimonial.** From the Stick and Dot manager. A single quote will out-convert every feature in this plan — there is currently no third-party validation anywhere on the site.
2. **A photo.** Clear, well-lit, looking at the camera. Does not need to be professional.
3. **Outcome lines per project.** Who it was for, what changed. Rough is fine.
4. **Dates.** Month and year per project, for orbital chronology.

---

## 12. Open questions

1. **`tathya`, `beatmind`, `support-core`** are live with no portfolio entry. Owner sorting per-project. Anything past nine nodes requires fixing `uClusterBrightness[9]` first.
2. **Whether Vivid ships.** It is Stick and Dot company work, same as the excluded app. Linked per instruction — revisit if that exclusion was categorical.
3. **Which booking tool.** Cal.com is free and self-hostable; Calendly is more familiar to Western buyers.
