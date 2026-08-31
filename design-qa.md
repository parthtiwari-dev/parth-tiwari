# Vivid Story Loom design QA

- Source visual truth: `design/references/vivid-story-loom/vivid-story-loom-concept.png`
- Source dimensions: 941 × 1669 px, vertical art-direction board
- Implemented artifact: `design/directions/vivid-world.html`
- Implementation evidence: `.shots/vivid-story-loom/1440-frames.png` and
  `.shots/vivid-story-loom/390-frames.png`
- Implementation viewports: 1440 × 1000 CSS px and 390 × 844 CSS px
- Device scale factor: browser default 1
- State: `Frames arrive`, with real Vivid evaluation shots visible over the decorative loom

The source is a vertical visual-development board, not a pixel-specific viewport mock. The
comparison therefore tests the shared visual object, material, hierarchy, crops and evidence
separation rather than claiming one-to-one geometry across unequal aspect ratios. The source
and both implementation screenshots were opened together for the final comparison.

**Findings**

- No open P0, P1 or P2 mismatch.
- Fonts and typography: the implementation uses self-hosted Bricolage Grotesque for the same
  compressed editorial force as the concept and Archivo/DM Mono for readable narration and
  instrumentation. Headline wrapping remains deliberate at desktop, tablet and phone.
- Spacing and layout rhythm: the central loom remains the persistent object; real shots sit
  in a strict equal-size sequence and the narrative card moves to the lower reading zone on
  phone. No tested viewport has horizontal overflow.
- Colors and tokens: warm black, textile off-white, indigo, pottery amber and a single
  oxblood failure state match the source direction without adding a generic UI palette.
- Image quality and asset fidelity: the full selected concept plate is used rather than
  redrawn with CSS or SVG. Foreground evidence uses unchanged real Vivid evaluation images.
  No placeholder product image, fake screenshot or code-drawn illustration remains.
- Copy and content: every chapter distinguishes current evidence, intended end state and
  future style research. The illustrated failure is not presented as a measured artifact.
- Icons: neither the source nor implementation requires interface icons; no text-glyph or
  substitute icon was introduced.
- Interaction and accessibility: native scrolling advances all eight chapters; the skip link
  reaches the ending; the CTA has a real work-register destination; image alternatives and a
  stable static reading path exist; browser logs are clean.

**Comparison history**

1. Initial 390 px capture: P2 source-note collision at the bottom of the narrative card.
2. Fix: removed the redundant persistent source note below 820 px while preserving the real-
   evidence statement in chapter copy.
3. Post-fix 390 px capture: card, frame grid and footer progress no longer collide. No new
   P0, P1 or P2 issue appeared.

**Follow-up polish**

- P3: derive responsive AVIF/WebP decorative plates after owner approval; the current 2.7 MB
  PNG is acceptable for a local review artifact, not for production.
- Test gap: the rendered static state was forced with `?motion=reduce`; native OS media
  emulation and a fully JavaScript-disabled browser capture were not available in the chosen
  in-app browser.

**Implementation checklist**

- [x] Selected concept plate placed as the persistent visual object.
- [x] Real Vivid anchor and four real evaluation frames placed as evidence.
- [x] Desktop, tablet and phone compositions checked.
- [x] Failure and future-style boundaries stated in visible copy.
- [x] Reduced-motion-equivalent static state rendered.
- [x] Console and image-load checks completed.
- [x] P2 mobile collision fixed and recaptured.

final result: passed
