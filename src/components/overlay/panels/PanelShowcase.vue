<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Project } from '@/types/project'

/**
 * The opening move: what the thing looks like, and what it did for whom.
 *
 * Layer 1 and 2 of the project model (DESIGN.md 2b). The four evidence panels
 * are the second layer — a buyer arriving from cold outreach should see the
 * product working before being asked to read an argument about it.
 *
 * Everything here is conditional on real files existing. There is no
 * placeholder state, no skeleton, no "screenshot coming soon": a project
 * without a capture simply does not render this panel (`data/showcase.ts`).
 */
const props = defineProps<{
  project: Project
}>()

/**
 * One ordered list, video first.
 *
 * These were two independent branches — a `v-if` for the video and a `v-else`
 * for the stills — with a thumbnail strip underneath driven by the image index.
 * On a project with both, the video branch always won, so the thumbnails
 * rendered, highlighted, and changed nothing. A control that does nothing is
 * worse than no control.
 */
type Slide =
  | { kind: 'video'; src: string; poster: string; caption: string; alt: string }
  | { kind: 'image'; src: string; caption?: string; alt: string }

const slides = computed<Slide[]>(() => {
  const video = props.project.video
  const images = props.project.images ?? []
  return [
    ...(video
      ? [{
          kind: 'video' as const,
          src: video.src,
          poster: video.poster,
          caption: video.description,
          alt: video.description,
        }]
      : []),
    ...images.map((image) => ({
      kind: 'image' as const,
      src: image.src,
      caption: image.caption,
      alt: image.alt,
    })),
  ]
})

const activeIndex = ref(0)
const active = computed(() => slides.value[activeIndex.value] ?? slides.value[0])

/** Reset when the overlay switches project, or index 2 survives into a one-slide project. */
watch(() => props.project.id, () => { activeIndex.value = 0 })

const prefersReducedMotion = typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
</script>

<template>
  <article class="panel-showcase">
    <div class="panel-showcase__intro">
      <p class="panel-label">What it is</p>
      <p v-if="project.outcome" class="panel-showcase__outcome">
        {{ project.outcome }}
      </p>
      <p v-else class="panel-showcase__tagline">
        {{ project.tagline }}
      </p>
    </div>

    <figure v-if="active" class="panel-showcase__media">
      <!-- Muted and playsinline are not optional: this sits inside an overlay a
           visitor opened to read. `controls` stays on so it can be stopped, and
           reduced motion gets a poster that does not start itself. -->
      <video
        v-if="active.kind === 'video'"
        :key="active.src"
        class="panel-showcase__video"
        :src="active.src"
        :poster="active.poster"
        :autoplay="!prefersReducedMotion"
        :loop="!prefersReducedMotion"
        muted
        playsinline
        controls
        preload="metadata"
      />
      <img
        v-else
        class="panel-showcase__image"
        :src="active.src"
        :alt="active.alt"
        loading="lazy"
        decoding="async"
      >
      <figcaption v-if="active.caption">
        {{ active.caption }}
      </figcaption>
    </figure>

    <div v-if="slides.length > 1" class="panel-showcase__thumbs">
      <button
        v-for="(slide, index) in slides"
        :key="slide.src"
        type="button"
        :class="{ 'is-active': index === activeIndex }"
        :aria-pressed="index === activeIndex"
        :aria-label="slide.kind === 'video' ? 'Play the screen recording' : slide.alt"
        @click="activeIndex = index"
      >
        <img
          :src="slide.kind === 'video' ? slide.poster : slide.src"
          alt=""
          loading="lazy"
          decoding="async"
        >
        <span v-if="slide.kind === 'video'" class="panel-showcase__thumb-badge" aria-hidden="true">▶</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.panel-showcase {
  display: grid;
  align-content: start;
  gap: clamp(1rem, 2.5vw, 1.75rem);
  min-height: min(35rem, 58vh);
  /* BookingCta is fixed bottom-right and stays there over the overlay by design
     (CLAUDE.md: booking is never gated behind the experience). Without this the
     dock lands squarely on the video's transport controls. Reserving the height
     lets them scroll clear instead of hiding the button. */
  padding-bottom: 4.5rem;
}

.panel-label {
  margin: 0 0 0.75rem;
  color: var(--gold);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.panel-showcase__outcome,
.panel-showcase__tagline {
  margin: 0;
  max-width: 62ch;
  color: var(--ice);
  font-family: var(--font-body);
  font-size: clamp(1.05rem, 1.6vw, 1.4rem);
  line-height: 1.5;
}

.panel-showcase__tagline {
  color: var(--ice-muted);
}

.panel-showcase__media {
  margin: 0;
  display: grid;
  gap: 0.7rem;
}

.panel-showcase__image,
.panel-showcase__video {
  display: block;
  width: 100%;
  max-height: min(30rem, 52vh);
  object-fit: contain;
  object-position: top center;
  border: 1px solid var(--ice-faint);
  border-radius: 0.5rem;
  background: var(--bg-lift);
}

figcaption {
  margin: 0;
  color: var(--ice-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.04em;
  line-height: 1.5;
}

.panel-showcase__thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.panel-showcase__thumbs button {
  position: relative;
  padding: 0;
  width: 5.5rem;
  border: 1px solid var(--ice-faint);
  border-radius: 0.3rem;
  background: none;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 180ms ease, opacity 180ms ease;
  opacity: 0.6;
}

.panel-showcase__thumbs button.is-active,
.panel-showcase__thumbs button:hover {
  border-color: var(--gold);
  opacity: 1;
}

.panel-showcase__thumbs button:focus-visible {
  outline: 2px solid var(--gold-glow);
  outline-offset: 2px;
}

.panel-showcase__thumb-badge {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--ice);
  font-size: 1.1rem;
  text-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.8);
}

.panel-showcase__thumbs img {
  display: block;
  width: 100%;
  height: auto;
}

@media (prefers-reduced-motion: reduce) {
  .panel-showcase__thumbs button {
    transition: none;
  }
}

@media (max-width: 620px) {
  .panel-showcase__image,
  .panel-showcase__video {
    max-height: 42vh;
  }
}
</style>
