<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import PanelArchitecture from '@/components/overlay/panels/PanelArchitecture.vue'
import PanelBoundary from '@/components/overlay/panels/PanelBoundary.vue'
import PanelLinks from '@/components/overlay/panels/PanelLinks.vue'
import PanelProblem from '@/components/overlay/panels/PanelProblem.vue'
import PanelProof from '@/components/overlay/panels/PanelProof.vue'
import PanelShowcase from '@/components/overlay/panels/PanelShowcase.vue'
import { hasShowcase } from '@/data/showcase'
import type { Project } from '@/types/project'

const props = defineProps<{
  project: Project
  activePanelIndex: number
}>()

const emit = defineEmits<{
  setPanel: [index: number]
}>()

const stripRef = ref<HTMLElement | null>(null)


const EVIDENCE_PANELS = [
  { label: 'Problem', shortLabel: 'Prob', component: PanelProblem },
  { label: 'Architecture', shortLabel: 'Arch', component: PanelArchitecture },
  { label: 'Proof', shortLabel: 'Proof', component: PanelProof },
  { label: 'Boundary', shortLabel: 'Bound', component: PanelBoundary },
  { label: 'Links', shortLabel: 'Links', component: PanelLinks },
]

/**
 * Showcase first where there is one to show (CLAUDE.md, "show before telling").
 * Projects without a capture keep the original five and open on Problem, so
 * nothing renders an empty frame. Count comes from `panelCountFor` in
 * `data/showcase.ts`, which the store and the header read too.
 */
const panels = computed(() => (
  hasShowcase(props.project)
    ? [{ label: 'Demo', shortLabel: 'Demo', component: PanelShowcase }, ...EVIDENCE_PANELS]
    : EVIDENCE_PANELS
))

const activePanel = computed(() => panels.value[props.activePanelIndex] ?? panels.value[0])

/**
 * Switching panel returns you to the top of the new one.
 *
 * The scroller is `.project-overlay`, not `.film-strip__frame`. The frame is
 * `overflow: visible` and has never scrolled, so resetting *its* `scrollTop`
 * was a no-op that read as correct — switch panels while scrolled down and you
 * landed in the middle of the next panel, halfway through a sentence. It
 * survived because the assignment succeeds silently on a non-scrolling box.
 *
 * Walking up to the nearest scrolling ancestor rather than naming the class
 * keeps this honest if the scroller moves again.
 */
watch(
  () => props.activePanelIndex,
  async () => {
    await nextTick()

    const scroller = stripRef.value?.closest<HTMLElement>('.project-overlay')
    if (!scroller) return

    scroller.scrollTop = 0
    scroller.scrollLeft = 0
  },
)
</script>

<template>
  <div ref="stripRef" class="film-strip">
    <nav class="film-strip__nav" aria-label="Project evidence panels">
      <button
        v-for="(panel, index) in panels"
        :key="panel.label"
        type="button"
        :class="{ 'is-active': index === activePanelIndex }"
        @click="emit('setPanel', index)"
      >
        <span class="film-strip__panel-number">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="film-strip__label-full">{{ panel.label }}</span>
        <span class="film-strip__label-short">{{ panel.shortLabel }}</span>
      </button>
    </nav>

    <div class="film-strip__frame">
      <Transition name="film-panel" mode="out-in">
        <component
          :is="activePanel.component"
          :key="activePanel.label"
          :project="project"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.film-strip {
  display: grid;
  gap: 1rem;
}

.film-strip__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.film-strip__nav button {
  position: relative;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 48%, transparent);
  background:
    linear-gradient(180deg, rgb(216 234 240 / 0.035), transparent),
    color-mix(in srgb, var(--bg) 48%, transparent);
  color: var(--ice-muted);
  cursor: pointer;
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  min-height: 2.75rem;
  padding: 0.58rem 0.78rem;
  text-transform: uppercase;
  transition:
    border-color 160ms var(--ease-in-out),
    background 160ms var(--ease-in-out),
    color 160ms var(--ease-in-out),
    transform 160ms var(--ease-in-out);
}

.film-strip__nav button::before,
.film-strip__nav button::after {
  position: absolute;
  left: 0.55rem;
  right: 0.55rem;
  height: 1px;
  pointer-events: none;
  content: '';
  background: var(--gold);
  opacity: 0;
  transform: scaleX(0.42);
  transition:
    opacity 160ms var(--ease-in-out),
    transform 180ms var(--ease-out-expo);
}

.film-strip__nav button::before {
  top: -1px;
}

.film-strip__nav button::after {
  bottom: -1px;
}

.film-strip__panel-number {
  color: var(--ice-quiet);
  margin-right: 0.45rem;
}

.film-strip__label-short {
  display: none;
}

.film-strip__nav button:hover,
.film-strip__nav button:focus-visible,
.film-strip__nav button.is-active {
  border-color: color-mix(in srgb, var(--gold) 72%, transparent);
  background:
    linear-gradient(180deg, rgb(232 200 106 / 0.06), transparent),
    color-mix(in srgb, var(--bg) 52%, transparent);
  color: var(--ice);
}

.film-strip__nav button:hover {
  transform: translateY(-1px);
}

.film-strip__nav button.is-active::before,
.film-strip__nav button.is-active::after {
  opacity: 0.78;
  transform: scaleX(1);
}

.film-strip__nav button.is-active .film-strip__panel-number {
  color: var(--gold);
}

.film-strip__frame {
  position: relative;
  overflow: visible;
  padding: clamp(1.25rem, 3vw, 2.25rem);
  border: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  background:
    linear-gradient(115deg, rgba(216, 234, 240, 0.055), transparent 38%),
    color-mix(in srgb, var(--bg) 62%, transparent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 1.4rem 4rem rgb(0 0 0 / 0.26);
  backdrop-filter: blur(18px) saturate(1.26);
}

.film-panel-enter-active,
.film-panel-leave-active {
  transition:
    opacity 150ms var(--ease-in-out),
    transform 170ms var(--ease-out-expo);
}

.film-panel-enter-from,
.film-panel-leave-to {
  opacity: 0;
  transform: translate3d(0.55rem, 0, 0);
}

.film-panel-enter-to,
.film-panel-leave-from {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

@media (prefers-reduced-motion: reduce) {
  .film-panel-enter-active,
  .film-panel-leave-active {
    transition: none;
  }

  .film-panel-enter-from,
  .film-panel-leave-to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 720px) {
  /* Three columns, not five.
   *
   * Five was the panel count before `PanelShowcase` existed. A project with a
   * capture has six, so the sixth tile wrapped onto a row of its own and sat
   * alone at 1/5 width — a ragged shelf under the header. Three columns divide
   * both counts (5 leaves one gap on the last row, 6 fills exactly two rows),
   * and the tiles get wide enough for the full word instead of `Bound`.
   *
   * It also buys back vertical space, which is the scarce axis here: the header
   * plus this nav was eating 870 of 1150px before a phone saw any content. */
  .film-strip__nav {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.32rem;
    margin-inline: 0;
    overflow: visible;
    padding: 0;
  }

  .film-strip__nav::-webkit-scrollbar {
    display: none;
  }

  .film-strip__nav button {
    display: flex;
    min-width: 0;
    /* 2.75rem is the documented touch minimum; the tiles no longer need to be
       stacked two lines tall now that three columns give them the width. */
    min-height: 2.75rem;
    align-items: center;
    justify-content: center;
    gap: 0.34rem;
    padding: 0.5rem 0.35rem;
    letter-spacing: 0.09em;
    scroll-snap-align: none;
  }

  .film-strip__panel-number {
    margin-right: 0;
    font-size: 0.68rem;
  }

  /* Three columns fit the real word. `Bound` and `Prob` were abbreviations
     forced by a 1/5-width tile, and an abbreviation in a nav is a small tax on
     every visitor to save space that is no longer scarce. */
  .film-strip__label-full {
    display: inline;
    max-width: 100%;
    overflow: hidden;
    font-size: 0.62rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .film-strip__label-short {
    display: none;
  }

  .film-strip__nav button::before,
  .film-strip__nav button::after {
    left: 0.32rem;
    right: 0.32rem;
  }

  .film-strip__frame {
    min-height: auto;
    padding: 1rem;
  }
}
</style>
