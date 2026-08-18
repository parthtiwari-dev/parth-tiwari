<script setup lang="ts">
/**
 * The offer and the ways to reach him, in the full experience.
 *
 * `ServicesBlock` and `ContactPanel` were built in 1.5.4 and 1.5.6 and then
 * mounted only inside `PlainExperience`. So the version of the site a lead
 * actually lands on — the universe, at `/` — had no services block and no
 * contact panel at all, only the floating booking button. Every visitor who did
 * not think to append `?plain=1` saw the least commercial version of a site
 * whose stated purpose is generating paid client work (PRD.md §1).
 *
 * This mounts them at the end of the scroll, after the constellation runway:
 * the visitor has been through the universe, and the next thing on the page is
 * what he does and how to start. It does not replace `BookingCta`, which stays
 * fixed and one tap away throughout — this is the considered read, that is the
 * shortcut.
 *
 * Both children are already token-driven, so they inherit the dark palette here
 * and the print palette under `?plain=1` with no per-mode styling.
 */
import ContactPanel from '@/components/conversion/ContactPanel.vue'
import ServicesBlock from '@/components/conversion/ServicesBlock.vue'
</script>

<template>
  <section class="conversion-close" aria-labelledby="conversion-close-title">
    <h2 id="conversion-close-title" class="sr-only">Work with Parth</h2>

    <div class="conversion-close__inner">
      <ServicesBlock />
      <ContactPanel />
    </div>
  </section>
</template>

<style scoped>
.conversion-close {
  position: relative;
  z-index: 1;
  background: var(--bg);
  border-top: 1px solid var(--ice-faint);
  padding: clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 4rem) clamp(7rem, 12vw, 9rem);
}

/* Bottom padding clears the fixed BookingCta, which docks bottom-right and
   would otherwise sit on top of the contact panel's last rows. */

.conversion-close__inner {
  display: grid;
  gap: clamp(2.5rem, 6vw, 4.5rem);
  margin: 0 auto;
  max-width: 68rem;
}

@media (min-width: 900px) {
  .conversion-close__inner {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    align-items: start;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
