<script setup lang="ts">
import { computed } from 'vue'
import { resolveProjectLinks } from '@/data/projectLinks'
import { useProjectStore } from '@/stores/projectStore'
import type { ProjectArtifact } from '@/types/project'

const projectStore = useProjectStore()

const workNode = computed(() => projectStore.getById('stick-and-dot') ?? null)
const artifacts = computed(() => workNode.value?.artifacts ?? [])
const links = computed(() => (workNode.value ? resolveProjectLinks(workNode.value.links) : []))

function artifactKind(artifact: ProjectArtifact) {
  if (artifact.id === 'vivid') {
    return 'Creative AI work'
  }

  if (artifact.id === 'stick-and-dot-app') {
    return 'Product platform work'
  }

  return artifact.label
}
</script>

<template>
  <article v-if="workNode" class="experience-log">
    <header class="experience-log__intro">
      <p class="panel-label">Work Experience</p>
      <h2>Stick and Dot</h2>
      <p>
        At Stick and Dot, I worked as an AI/ML Development Intern building creative AI workflows and product surfaces. The public-safe work splits into two artifacts: Vivid, a storyboard generation system, and the Stick and Dot App, a role-based editorial platform.
      </p>
    </header>

    <section class="experience-entry">
      <div class="experience-entry__rail" aria-hidden="true">
        <span></span>
      </div>

      <div class="experience-entry__main">
        <div class="experience-entry__heading">
          <div>
            <p class="panel-label">Current Role</p>
            <h3>AI/ML Development Intern</h3>
          </div>
          <div class="experience-entry__meta">
            <span>Remote</span>
            <span>Mar 2026 -></span>
            <span>Early-stage AI</span>
          </div>
        </div>

        <div class="experience-entry__body">
          <section>
            <h4>What I worked on</h4>
            <p>
              I helped turn ambiguous creative and editorial requirements into working systems: an identity-aware storyboard workflow, GPU deployment decisions, and a role-based product platform.
            </p>
          </section>
          <section>
            <h4>What stays private</h4>
            <p>
              Company data, private endpoints, keys, account details, and internal strategy are intentionally omitted. The portfolio shows only the safe shape of the work.
            </p>
          </section>
        </div>
      </div>
    </section>

    <div class="artifact-list">
      <section
        v-for="artifact in artifacts"
        :key="artifact.id"
        class="artifact-card"
      >
        <p>{{ artifactKind(artifact) }}</p>
        <h3>{{ artifact.name }}</h3>
        <span>{{ artifact.summary }}</span>

        <div v-if="artifact.stack?.length" class="artifact-card__chips">
          <small v-for="chip in artifact.stack" :key="chip">{{ chip }}</small>
        </div>

        <div class="artifact-card__proof">
          <strong>Public proof</strong>
          <ul>
            <li v-for="item in artifact.proof" :key="item">{{ item }}</li>
          </ul>
        </div>
      </section>
    </div>

    <footer class="experience-log__footer">
      <div>
        <p class="panel-label">Links</p>
        <a
          v-for="link in links"
          :key="link.key"
          :href="link.url"
          target="_blank"
          rel="noreferrer"
        >
          {{ link.label }}
        </a>
        <span v-if="!links.length">Public links can be added once they are confirmed safe.</span>
      </div>
      <p>
        This section is built as a scrollable experience timeline, so future internships or jobs can be added without changing the constellation itself.
      </p>
    </footer>
  </article>
</template>

<style scoped>
.experience-log {
  display: grid;
  gap: clamp(1.4rem, 3vw, 2.4rem);
}

.experience-log__intro {
  display: grid;
  max-width: 68rem;
  gap: 0.9rem;
}

.panel-label {
  margin: 0;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h2,
h3,
h4 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-weight: 300;
}

h2 {
  font-size: clamp(3rem, 7vw, 7rem);
  letter-spacing: 0.03em;
  line-height: 0.88;
}

h3 {
  font-size: clamp(2rem, 4vw, 4.4rem);
  line-height: 0.96;
}

h4 {
  font-size: clamp(1.45rem, 2.2vw, 2.2rem);
}

.experience-log__intro > p:not(.panel-label),
.experience-entry__body p,
.artifact-card > span,
.experience-log__footer p,
.experience-log__footer span {
  margin: 0;
  color: var(--ice-muted);
  line-height: 1.58;
}

.experience-entry {
  display: grid;
  gap: 1rem;
  grid-template-columns: 2rem minmax(0, 1fr);
}

.experience-entry__rail {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 0.4rem;
}

.experience-entry__rail::before {
  width: 1px;
  min-height: 100%;
  background: linear-gradient(180deg, var(--gold), color-mix(in srgb, var(--ice-faint) 55%, transparent));
  content: '';
}

.experience-entry__rail span {
  position: absolute;
  width: 0.6rem;
  aspect-ratio: 1;
  border-radius: 999px;
  background: var(--gold-glow);
  box-shadow: 0 0 1.2rem color-mix(in srgb, var(--gold) 64%, transparent);
}

.experience-entry__main,
.artifact-card,
.experience-log__footer {
  border: 1px solid color-mix(in srgb, var(--ice-faint) 54%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 6%, transparent), transparent 44%),
    color-mix(in srgb, var(--bg) 54%, transparent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 1rem 2.5rem rgb(0 0 0 / 0.22);
}

.experience-entry__main {
  display: grid;
  gap: 1.4rem;
  padding: clamp(1rem, 2vw, 1.5rem);
}

.experience-entry__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.experience-entry__meta,
.artifact-card__chips,
.experience-log__footer > div {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.experience-entry__meta span,
.artifact-card small,
.artifact-card > p,
.artifact-card__proof strong,
.experience-log__footer a,
.experience-log__footer span {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.experience-entry__meta span,
.artifact-card small {
  border: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  color: var(--ice-muted);
  padding: 0.25rem 0.42rem;
}

.experience-entry__body,
.artifact-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.experience-entry__body section {
  border-top: 1px solid color-mix(in srgb, var(--ice-faint) 50%, transparent);
  padding-top: 1rem;
}

.artifact-card {
  display: grid;
  align-content: start;
  gap: 1rem;
  padding: clamp(1rem, 2vw, 1.4rem);
}

.artifact-card > p {
  color: var(--teal-active);
}

.artifact-card__proof strong {
  color: var(--gold);
}

ul {
  display: grid;
  gap: 0.62rem;
  margin: 0.65rem 0 0;
  padding-left: 1rem;
  color: var(--ice-muted);
  line-height: 1.5;
}

.experience-log__footer {
  display: grid;
  gap: 0.8rem;
  padding: 1rem;
}

.experience-log__footer a {
  color: var(--gold-glow);
  text-decoration: none;
}

.experience-log__footer a:hover,
.experience-log__footer a:focus-visible {
  color: var(--ice);
  outline: none;
}

.experience-log__footer span {
  color: var(--ice-faint);
}

@media (max-width: 900px) {
  .experience-entry__heading {
    display: grid;
  }

  .experience-entry__body,
  .artifact-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .experience-log {
    gap: 1.2rem;
  }

  h2 {
    font-size: clamp(3.2rem, 17vw, 5.4rem);
  }

  h3 {
    font-size: clamp(2.1rem, 11vw, 3.4rem);
  }

  .experience-entry {
    grid-template-columns: 1fr;
  }

  .experience-entry__rail {
    display: none;
  }

  .experience-entry__main,
  .artifact-card,
  .experience-log__footer {
    padding: 0.9rem;
  }

  .experience-entry__body {
    gap: 0.8rem;
  }

  .artifact-card__chips,
  .experience-log__footer > div {
    gap: 0.35rem;
  }
}
</style>
