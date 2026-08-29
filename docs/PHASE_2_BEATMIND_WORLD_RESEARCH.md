# Phase 2 BeatMind world reference research

Research completed 2026-08-30 after the owner judged the first BeatMind world study useful
and attractive, but below the intended best-in-class interactive-editorial standard. The
owner approved the resulting Sound Foundry premise, nine-scene order and five-stem product
language on 2026-08-30. It remains a Phase 2 storyboard decision, not authorization for
Phase 5 production implementation.

## Brief

Design one vertically scrolled BeatMind world for clients and employers. Scrolling is the
only required input. The world should be immediately understandable, visually memorable on
desktop, deliberately recomposed for phone, and inseparable from what BeatMind actually
does. It must lead into the complete paper case study rather than replace it.

The central risk is decorative spectacle: a robot, 3D object or effect that could be placed
on any AI portfolio. `design/directions/lock.html` rejects that explicitly. It says every
case study must render a real artifact from its own domain, that nothing may be a metaphor a
visitor has to learn, and that BeatMind's distinctive proof is the failed-and-retried run
trace in addition to the stem envelopes.

## Research performed

### Pudding visual essays

The following primary examples were opened and walked in the browser:

- [How sound is passed down over generations](https://pudding.cool/2025/04/music-dna):
  one persistent music-family graphic changes focus, scale and branch as the prose advances.
  The graphic is the argument, not a background.
- [Quantifying the Diva-ness of 138 National Anthem Performances](https://pudding.cool/2024/02/anthems):
  the same pitch trace advances phrase by phrase while the words and comparison change.
- [Dicing an Onion, the Mathematically Optimal Way](https://pudding.cool/2025/08/onions):
  one diagram holds still while a small number of variables change and the measured result
  remains attached.
- [How musicals use motifs to tell stories](https://pudding.cool/2025/12/motifs):
  the theatrical opening creates atmosphere, but its click-to-begin audio gate is not
  appropriate for BeatMind's required scroll-only entry.
- [How Sonic DNA Connects Generations of Music](https://pudding.cool/2025/04/music-dna)
  and the Anthem story both provide explicit visual descriptions in the DOM; enhancement
  does not erase the readable story.

The reusable pattern is progressive disclosure through one persistent graphic. BeatMind
should not use eight similarly framed title cards over changing wallpaper.

### Awwwards portfolio scan

The [Awwwards portfolio index](https://www.awwwards.com/websites/portfolio/) was expanded to
124 entries. All 124 detail pages were attempted; 119 loaded successfully after retry and
five remained unavailable. The loaded detail records were reviewed for their stated
interaction highlights, technology and narrative approach. A smaller relevant set was then
opened as live sites for direct scroll inspection. The attempted mass live-site sweep later
timed out, so this memo does not claim that 100 external portfolio domains were fully walked.

Across the 119 successfully loaded Awwwards detail pages, the most common relevant tags were
Interaction Design (45), GSAP (43), Animation (35), WebGL (32), 3D (29), Storytelling (26),
Transitions (21), Microinteractions (20) and Responsive Design (19). These counts describe
the sample, not a recommendation to adopt those libraries or effects.

Useful narrow references included:

- Pragadheesh's Showcase for keeping one reactive visual field connected to the work list;
- Viskhan Khasiyev for a continuous system whose words and graphics share one tool language;
- Raphael Segerman for spatial continuity between project states;
- ellusion Creative's recorded Awwwards description of a scroll-driven paper film shot
  separately for landscape and portrait;
- music portfolios such as Michael Gatt and Paul Kalkbrenner for cinematic rhythm, while
  rejecting their sound-gated entry as a requirement.

Repeated failure modes were more useful than the effects themselves: loaders before
meaning, mandatory sound gates, cursor-only reveals, arbitrary WebGL objects, desktop scenes
shrunk into phone, and one unrelated effect per section.

## Chosen direction: The Sound Foundry

BeatMind becomes one vertically travelled precision machine. The machine is not a mascot or
a science-fiction setting laid over the product. Every visible part manipulates BeatMind's
actual waveform, stem, analysis or run-trace material.

The camera descends through the same machine from beginning to end:

1. **Specimen chamber.** One real waveform coils inside a black-glass record capsule.
2. **Separation gantry.** A robotic mechanism draws the source into the five current
   BeatMind stem lanes.
3. **Worker loss.** One gantry stops and the relevant run-trace stage breaks red. The durable
   job core remains visibly alive.
4. **Retry.** A second worker resumes the same unfinished material; the trace continues in
   green rather than restarting as a different story.
5. **Analysis scanner.** Real tempo, key, bars, chords and section boundaries attach to the
   five ribbons on one shared clock.
6. **Arrangement deck.** Section blocks move on synchronized rails. The visitor sees that
   the material changes while time remains aligned.
7. **Mix chamber.** The five lanes change visual weight from real gain values. This is a
   narrative demonstration, not a fake mixer.
8. **Render press.** The five coloured ribbons braid into one white mixdown waveform.
9. **Deep-dive handoff.** The finished waveform seals inside the dark world and offers one
   explicit route to the paper case study, where the architecture, measurement, boundary
   and erratum become readable.

The document scroll remains vertical at every width. Individual scenes may pan sideways
inside the sticky stage, but the visitor never has to perform horizontal scrolling. Phone
uses closer crops and fewer simultaneous machine parts rather than shrinking the desktop
composition.

## Reference lock

**Primary direction:** Pudding-style information-first scrollytelling, using one persistent
graphic that changes only when the explanation changes.

**Preserve:** real BeatMind data, one continuous spatial machine, progressive disclosure,
native vertical scroll, optional sound, complete readable DOM and an explicit case-study handoff.

**Borrow only:** cinematic material and lighting from the strongest Awwwards portfolios;
landscape/portrait scene recomposition from the ellusion Creative description; precise
industrial mechanisms from the generated Sound Foundry concept board.

**Media strategy:** generated or hand-built machinery is decorative environment only.
Waveforms, analysis marks, stem levels and the run trace remain code-drawn from exported
BeatMind data. The approved concept board is at
`design/references/beatmind-sound-foundry-concept.png`.

**Reject:** humanoid robot mascot, fantasy city, holographic dashboard, fake product UI,
random particles, unrelated animation per section, sound gate, drag requirement, scroll
snapping, trapped scrolling, invented trace, fake duration and runtime fetch.

**Technical ceiling:** Astro remains the only production dependency. The production study
must first prove the look with layered raster assets, Canvas 2D, CSS and the Web Animations
API at the existing 30 fps ceiling. A new 3D runtime is not assumed by the visual direction.

## What is real, and what is still blocked

The current BeatMind browser-synth score supplies a real owner-authored 124 BPM, C-sharp
minor, eight-bar, five-stem structure for the early animatic. Current source supplies the
five stem colors. Production still requires:

- real exported envelope arrays for a separated track;
- real analysis markers and section boundaries for that track;
- one complete publishable failure-and-retry preparation trace;
- owner approval and licence for any audio excerpt.

Until those exist, failure and retry may be represented only as a labelled storyboard
state, never as a published measured trace.

## Implemented review slice

`design/directions/beatmind-world.html` is now the low-cost Sound Foundry animatic. It uses
six stable crops from the approved concept board as dark decorative machine plates and draws
the browser-synth waveforms, stems, score marks and labelled storyboard trace separately in
Canvas 2D. Nine native-scroll scenes test camera continuity, data legibility and the final
deep-dive action. Phone uses close crops and lower-third copy instead of shrinking the desktop machine.

Final evidence under `.shots/phase2-beatmind-world-study/` covers 390, 800 and 1440 pixels,
no JavaScript and reduced motion. The animatic adds no package and does not enter the Astro
build. High-detail assets and production data contracts wait for Phase 5.
