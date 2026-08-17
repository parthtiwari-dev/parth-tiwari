<script setup lang="ts">
/**
 * The conversion register, in the full experience (`PLAN.md` 1.5.11).
 *
 * `ServicesBlock` and `ContactPanel` were built during Phase 1.5 but mounted
 * only inside `PlainExperience`, so the offer and the contact form existed at
 * `?plain=1` and nowhere else. A visitor to the default experience got the
 * universe, the project index and a corner booking button — no statement of
 * what is being sold, and no way to say anything back short of a calendar
 * booking. This section is where that content lives for everyone else.
 *
 * Placement: after `SceneRoot`'s 400vh runway, in normal document flow. That
 * is the honest end of the narrative — a visitor scrolls through the universe
 * and arrives at the offer — and it costs the 3-second impression nothing,
 * because nothing above it moves.
 *
 * It deliberately does **not** gate on the scene. Reduced-motion desktop
 * visitors mount no scene at all (`App.vue`), and on mobile the canvas is a
 * fixed 100vh backdrop with no runway; in both cases this section is the only
 * scrollable content on the page, which is exactly when an offer matters most.
 *
 * `PRD.md` 5 keeps the conversion path independent of the 3D: the universe
 * impresses, and must never be the toll booth in front of hiring him.
 */
import ContactPanel from '@/components/conversion/ContactPanel.vue'
import ServicesBlock from '@/components/conversion/ServicesBlock.vue'
</script>

<template>
  <section id="conversion" class="conversion-section" aria-label="Services and contact">
    <div class="conversion-section__inner">
      <ServicesBlock />
      <ContactPanel />
    </div>
  </section>
</template>

<style scoped>
/**
 * Opaque, and deliberately so: the WebGL canvas above it is `sticky`, and the
 * mobile canvas is `position: fixed`. A translucent surface here would let a
 * star field run underneath body copy and a form, which is unreadable and is
 * the opposite of the register shift this section exists to make.
 *
 * `DESIGN_LOCK.md` uses a single background-polarity shift as the primary depth
 * cue between registers — this is that one shift, marketing against proof. It
 * is a flat surface change plus one hairline, never a gradient.
 */
.conversion-section {
  position: relative;
  /* Above the scene, below the overlays (80-82) and the booking CTA (90). */
  z-index: 20;
  border-top: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  background: var(--bg);
}

.conversion-section__inner {
  display: grid;
  gap: clamp(3rem, 8vw, 6rem);
  width: min(72rem, 100%);
  margin: 0 auto;
  /* Bottom padding clears the fixed BookingCta so it never covers the form's
     own submit control on a phone. */
  padding:
    clamp(3.5rem, 10vh, 7rem)
    clamp(1.25rem, 6vw, 4rem)
    clamp(7rem, 16vh, 9rem);
}

@media (min-width: 1024px) {
  .conversion-section__inner {
    align-items: start;
    gap: clamp(3rem, 6vw, 5rem);
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  }
}
</style>
