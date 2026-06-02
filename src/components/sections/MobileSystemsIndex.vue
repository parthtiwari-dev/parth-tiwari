<script setup lang="ts">
import { computed } from 'vue'
import { projects } from '@/data/projects'
import { useOverlayStore } from '@/stores/overlayStore'
import type { Project, ProjectNodeKind, ProjectWeight } from '@/types/project'

interface ProjectGroup {
  key: string
  eyebrow: string
  title: string
  description: string
  kinds: ProjectNodeKind[]
}

const overlayStore = useOverlayStore()

const groups: ProjectGroup[] = [
  {
    key: 'personal',
    eyebrow: 'Personal Projects',
    title: 'Systems I built from first principles.',
    description: 'Finished and current builds where the evidence, gates, and tradeoffs are mine to explain.',
    kinds: ['personal-project', 'current-build'],
  },
  {
    key: 'work',
    eyebrow: 'Work Experience',
    title: 'Company work, represented as evidence.',
    description: 'Internship and product work grouped by company context instead of split into loose artifacts.',
    kinds: ['work-experience'],
  },
  {
    key: 'utility',
    eyebrow: 'Utility / Tooling',
    title: 'Small systems that solved real friction.',
    description: 'Practical automation and infrastructure work that supports the larger story.',
    kinds: ['utility'],
  },
]

const weightRank: Record<ProjectWeight, number> = {
  flagship: 0,
  major: 1,
  minor: 2,
}

const kindLabel: Record<ProjectNodeKind, string> = {
  'personal-project': 'Personal Project',
  'work-experience': 'Work Experience',
  'current-build': 'Currently Building',
  utility: 'Utility / Tooling',
}

const groupedProjects = computed(() => {
  return groups
    .map((group) => ({
      ...group,
      projects: projects
        .filter((project) => group.kinds.includes(project.nodeKind))
        .sort((a, b) => {
          const weightDelta = weightRank[a.weight] - weightRank[b.weight]

          if (weightDelta !== 0) {
            return weightDelta
          }

          return a.name.localeCompare(b.name)
        }),
    }))
    .filter((group) => group.projects.length > 0)
})

function proofLine(project: Project) {
  const metric = project.panels.proof.metrics?.[0]

  if (metric) {
    return `${metric.label}: ${metric.display}`
  }

  const activeMilestone = project.panels.proof.milestones?.find((milestone) => milestone.status === 'active')
  const firstMilestone = activeMilestone ?? project.panels.proof.milestones?.[0]

  if (firstMilestone) {
    return `${firstMilestone.label}${firstMilestone.detail ? ` / ${firstMilestone.detail}` : ''}`
  }

  return 'Evidence available in project panel'
}

function openProject(projectId: string) {
  overlayStore.open(projectId)
}
</script>

<template>
  <section class="mobile-systems-index" aria-label="Systems index">
    <div class="mobile-systems-index__intro">
      <p class="mobile-systems-index__eyebrow">
        Systems Index
      </p>
      <h2>Project nodes, translated for mobile.</h2>
      <p>
        Tap a system to open the same five evidence panels: problem, architecture, proof, boundary, and links.
      </p>
    </div>

    <div class="mobile-systems-index__groups">
      <section
        v-for="group in groupedProjects"
        :key="group.key"
        class="mobile-system-group"
      >
        <div class="mobile-system-group__header">
          <p>{{ group.eyebrow }}</p>
          <h3>{{ group.title }}</h3>
          <span>{{ group.description }}</span>
        </div>

        <div class="mobile-system-group__cards">
          <button
            v-for="project in group.projects"
            :key="project.id"
            type="button"
            class="mobile-system-card"
            :class="[
              `mobile-system-card--${project.nodeKind}`,
              `mobile-system-card--${project.weight}`,
            ]"
            @click="openProject(project.id)"
          >
            <span class="mobile-system-card__topline">
              <span class="mobile-system-card__kind">
                {{ kindLabel[project.nodeKind] }}
              </span>
              <span class="mobile-system-card__weight">
                {{ project.weight }}
              </span>
            </span>

            <span class="mobile-system-card__title">
              {{ project.name }}
            </span>

            <span class="mobile-system-card__tagline">
              {{ project.tagline }}
            </span>

            <span class="mobile-system-card__proof">
              {{ proofLine(project) }}
            </span>

            <span class="mobile-system-card__chips" aria-hidden="true">
              <span
                v-for="chip in project.stack.slice(0, 3)"
                :key="`${project.id}-${chip}`"
              >
                {{ chip }}
              </span>
            </span>

            <span class="mobile-system-card__cta">
              open evidence ->
            </span>
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.mobile-systems-index {
  position: relative;
  z-index: 35;
  display: none;
  min-height: 220vh;
  padding: 148vh 1rem 8rem;
  pointer-events: auto;
}

.mobile-systems-index__intro {
  display: grid;
  gap: 0.8rem;
  margin-bottom: 2.25rem;
}

.mobile-systems-index__eyebrow,
.mobile-system-group__header p,
.mobile-system-card__kind,
.mobile-system-card__weight,
.mobile-system-card__chips,
.mobile-system-card__cta {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  text-transform: uppercase;
}

.mobile-systems-index__eyebrow,
.mobile-system-group__header p {
  margin: 0;
  color: var(--gold-glow);
  font-size: 0.625rem;
  letter-spacing: 0.18em;
}

.mobile-systems-index__intro h2 {
  max-width: 8.5em;
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(2.4rem, 14vw, 4.25rem);
  font-weight: 300;
  line-height: 0.96;
}

.mobile-systems-index__intro p:last-child,
.mobile-system-group__header span {
  margin: 0;
  color: color-mix(in srgb, var(--ice-muted) 88%, var(--ice));
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  line-height: 1.65;
}

.mobile-systems-index__groups {
  display: grid;
  gap: 2.25rem;
}

.mobile-system-group {
  display: grid;
  gap: 1rem;
}

.mobile-system-group__header {
  display: grid;
  gap: 0.45rem;
}

.mobile-system-group__header h3 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: 1.55rem;
  font-weight: 300;
  line-height: 1.05;
}

.mobile-system-group__cards {
  display: grid;
  gap: 0.85rem;
}

.mobile-system-card {
  --card-accent: var(--gold-glow);
  position: relative;
  display: grid;
  gap: 0.72rem;
  width: 100%;
  padding: 1rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--card-accent) 34%, var(--ice-faint));
  border-radius: 0.5rem;
  background:
    radial-gradient(circle at 16% 0%, color-mix(in srgb, var(--card-accent) 14%, transparent), transparent 9rem),
    linear-gradient(135deg, rgb(216 234 240 / 0.055), transparent 60%),
    rgb(1 4 9 / 0.34);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.08),
    0 1rem 2.5rem rgb(0 0 0 / 0.18);
  color: var(--ice);
  text-align: left;
  backdrop-filter: blur(12px) saturate(1.18);
}

.mobile-system-card::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--card-accent) 42%, transparent), transparent 36%),
    linear-gradient(180deg, rgb(255 255 255 / 0.08), transparent 22%);
  opacity: 0.34;
}

.mobile-system-card--work-experience {
  --card-accent: var(--bg-cyan);
}

.mobile-system-card--current-build {
  --card-accent: var(--amber-glow);
}

.mobile-system-card--utility {
  --card-accent: var(--utility-glow);
}

.mobile-system-card--flagship {
  min-height: 15.25rem;
  border-color: color-mix(in srgb, var(--card-accent) 56%, var(--ice-faint));
}

.mobile-system-card--major {
  min-height: 13rem;
}

.mobile-system-card--minor {
  min-height: 11.5rem;
}

.mobile-system-card__topline {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.mobile-system-card__kind,
.mobile-system-card__weight {
  color: color-mix(in srgb, var(--card-accent) 86%, var(--ice));
  font-size: 0.58rem;
  letter-spacing: 0.16em;
}

.mobile-system-card__weight {
  color: color-mix(in srgb, var(--ice-muted) 76%, transparent);
}

.mobile-system-card__title {
  position: relative;
  z-index: 1;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(1.75rem, 9vw, 2.65rem);
  font-weight: 300;
  line-height: 1;
}

.mobile-system-card__tagline {
  position: relative;
  z-index: 1;
  color: color-mix(in srgb, var(--ice-muted) 90%, var(--ice));
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.92rem;
  line-height: 1.45;
}

.mobile-system-card__proof {
  position: relative;
  z-index: 1;
  color: color-mix(in srgb, var(--card-accent) 88%, white);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.82rem;
  line-height: 1.4;
}

.mobile-system-card__chips {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.mobile-system-card__chips span {
  padding: 0.25rem 0.38rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  color: color-mix(in srgb, var(--ice-muted) 88%, var(--ice));
  font-size: 0.55rem;
  letter-spacing: 0.12em;
}

.mobile-system-card__cta {
  position: relative;
  z-index: 1;
  color: var(--ice);
  font-size: 0.62rem;
  letter-spacing: 0.16em;
}

.mobile-system-card:focus-visible {
  outline: 1px solid var(--card-accent);
  outline-offset: 4px;
}

@media (max-width: 767px) {
  .mobile-systems-index {
    display: block;
  }
}
</style>
