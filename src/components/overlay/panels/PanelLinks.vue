<script setup lang="ts">
import { computed } from 'vue'
import { resolveProjectLinks } from '@/data/projectLinks'
import type { Project } from '@/types/project'

const props = defineProps<{
  project: Project
}>()

const links = computed(() => resolveProjectLinks(props.project.links))
</script>

<template>
  <article class="panel-links">
    <div>
      <p class="panel-label">Links / Launch</p>
      <h3>Open the public evidence.</h3>
      <p>
        Source, demos, APIs, docs, and deployment evidence appear here only after the URL is safe to expose.
      </p>
    </div>

    <div v-if="links.length" class="link-grid">
      <a
        v-for="link in links"
        :key="link.key"
        :href="link.url"
        target="_blank"
        rel="noreferrer"
        class="link-card"
      >
        <span class="link-card__eyebrow">{{ link.eyebrow }}</span>
        <span class="link-card__body">
          <strong>{{ link.label }}</strong>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
        <p>{{ link.description }}</p>
      </a>
    </div>

    <section v-else class="empty-links">
      <span>Pending verification</span>
      <p>No public link has been added for this node yet.</p>
      <small>Private repos, company endpoints, account data, and unreviewed deployments stay out of the portfolio.</small>
    </section>
  </article>
</template>

<style scoped>
.panel-links {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
}

.panel-label {
  margin: 0 0 0.9rem;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h3 {
  max-width: 56rem;
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 5.2rem);
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 0.98;
}

.panel-links > div > p:not(.panel-label) {
  max-width: 44rem;
  margin: 1rem 0 0;
  color: var(--ice-muted);
  line-height: 1.55;
}

.link-grid {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.link-card,
.empty-links {
  position: relative;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  background:
    radial-gradient(circle at 0% 0%, rgb(232 200 106 / 0.085), transparent 9rem),
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 7%, transparent), transparent 44%),
    color-mix(in srgb, var(--bg) 50%, transparent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 1rem 2.4rem rgb(0 0 0 / 0.24);
}

.link-card::after,
.empty-links::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background: linear-gradient(90deg, transparent, rgb(216 234 240 / 0.08), transparent);
  opacity: 0;
  transform: translateX(-52%);
  transition:
    opacity 180ms var(--ease-in-out),
    transform 320ms var(--ease-out-expo);
}

.link-card {
  display: grid;
  min-height: 10.25rem;
  align-content: start;
  gap: 0.8rem;
  padding: 1rem;
  color: var(--ice-muted);
  text-decoration: none;
  transition:
    border-color 160ms var(--ease-in-out),
    color 160ms var(--ease-in-out),
    transform 160ms var(--ease-in-out);
}

.link-card:hover,
.link-card:focus-visible {
  border-color: color-mix(in srgb, var(--gold) 78%, transparent);
  color: var(--ice);
  outline: none;
  transform: translateY(-2px);
}

.link-card:hover::after,
.link-card:focus-visible::after {
  opacity: 1;
  transform: translateX(52%);
}

.link-card__eyebrow,
.empty-links span,
.empty-links small {
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.link-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.link-card strong {
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(1.8rem, 3vw, 3rem);
  font-weight: 300;
  line-height: 1;
}

.link-card svg {
  flex: 0 0 auto;
  width: 1.25rem;
  height: 1.25rem;
  color: color-mix(in srgb, var(--gold) 82%, var(--ice));
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
  transition: transform 160ms var(--ease-out-expo);
}

.link-card:hover svg,
.link-card:focus-visible svg {
  transform: translate3d(0.16rem, -0.16rem, 0);
}

.link-card p,
.empty-links p,
.empty-links small {
  margin: 0;
  line-height: 1.55;
}

.empty-links {
  display: grid;
  max-width: 42rem;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--ice-muted);
}

.empty-links p {
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(1.9rem, 3vw, 3rem);
  font-weight: 300;
  line-height: 1;
}

.empty-links small {
  color: var(--ice-faint);
}

@media (max-width: 620px) {
  .link-grid {
    grid-template-columns: 1fr;
  }
}
</style>
