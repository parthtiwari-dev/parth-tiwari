<script setup lang="ts">
import { computed } from 'vue'
import { aboutSignal } from '@/data/about'
import { capabilityGroups } from '@/data/capabilities'
import { projects } from '@/data/projects'
import { resolveProjectLinks } from '@/data/projectLinks'
import { resumeOpenUrl, isResumeConfigured } from '@/data/resume'
import { socialLinks } from '@/data/socialLinks'
import { trainingRecords } from '@/data/training'
import type { Project } from '@/types/project'

const kindLabels: Record<Project['nodeKind'], string> = {
  'personal-project': 'Personal project',
  'work-experience': 'Work experience',
  utility: 'Utility / tooling',
  'current-build': 'Currently building',
}

const weightLabels: Record<Project['weight'], string> = {
  flagship: 'Flagship',
  major: 'Major',
  minor: 'Minor',
}

const groupedProjects = computed(() => [
  {
    title: 'Personal Projects',
    items: projects.filter((project) => project.nodeKind === 'personal-project'),
  },
  {
    title: 'Work Experience',
    items: projects.filter((project) => project.nodeKind === 'work-experience'),
  },
  {
    title: 'Currently Building',
    items: projects.filter((project) => project.nodeKind === 'current-build'),
  },
  {
    title: 'Utility / Tooling',
    items: projects.filter((project) => project.nodeKind === 'utility'),
  },
])
</script>

<template>
  <section
    id="plain-portfolio"
    class="plain-experience"
    aria-label="Static portfolio fallback"
  >
    <header class="plain-experience__header">
      <p class="plain-experience__eyebrow">Static Evidence Index</p>
      <h2>Evidence-bound AI systems by Parth Tiwari</h2>
      <p>
        This plain route contains the complete crawlable and printable version of the portfolio:
        projects, work evidence, training, capabilities, resume, and contact links.
      </p>
    </header>

    <section class="plain-experience__section" aria-labelledby="plain-about-title">
      <p class="plain-experience__eyebrow">About</p>
      <h3 id="plain-about-title">{{ aboutSignal.heading }}</h3>
      <p
        v-for="paragraph in aboutSignal.paragraphs"
        :key="paragraph"
      >
        {{ paragraph }}
      </p>
      <dl class="plain-experience__facts">
        <div
          v-for="fact in aboutSignal.facts"
          :key="fact.label"
        >
          <dt>{{ fact.label }}</dt>
          <dd>{{ fact.output.join(' ') }}</dd>
        </div>
      </dl>
      <div class="plain-experience__links">
        <a
          v-for="link in socialLinks"
          :key="link.kind"
          :href="link.href"
          target="_blank"
          rel="noreferrer"
        >
          {{ link.label }}
        </a>
        <a
          v-if="isResumeConfigured"
          :href="resumeOpenUrl"
          target="_blank"
          rel="noreferrer"
        >
          Resume
        </a>
      </div>
    </section>

    <section
      v-for="group in groupedProjects"
      :key="group.title"
      class="plain-experience__section"
      :aria-labelledby="`plain-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`"
    >
      <p class="plain-experience__eyebrow">Projects</p>
      <h3 :id="`plain-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`">
        {{ group.title }}
      </h3>

      <article
        v-for="project in group.items"
        :key="project.id"
        class="plain-experience__project"
      >
        <div class="plain-experience__project-head">
          <div>
            <h4>{{ project.name }}</h4>
            <p>{{ project.tagline }}</p>
          </div>
          <p class="plain-experience__meta">
            {{ kindLabels[project.nodeKind] }} / {{ weightLabels[project.weight] }} / {{ project.status }}
          </p>
        </div>

        <p><strong>Problem:</strong> {{ project.panels.problem.quote }}</p>
        <p v-if="project.panels.architecture.summary">
          <strong>Architecture:</strong> {{ project.panels.architecture.summary }}
        </p>

        <div v-if="project.panels.proof.metrics?.length">
          <strong>Proof:</strong>
          <ul>
            <li
              v-for="metric in project.panels.proof.metrics"
              :key="metric.label"
            >
              {{ metric.label }}: {{ metric.display }}
            </li>
          </ul>
        </div>

        <div v-if="project.panels.proof.milestones?.length">
          <strong>Milestones:</strong>
          <ul>
            <li
              v-for="milestone in project.panels.proof.milestones"
              :key="milestone.label"
            >
              {{ milestone.label }} - {{ milestone.status }}<span v-if="milestone.detail">, {{ milestone.detail }}</span>
            </li>
          </ul>
        </div>

        <div>
          <strong>Boundaries:</strong>
          <ul>
            <li
              v-for="item in project.panels.boundary.items"
              :key="`${item.side}-${item.text}`"
            >
              {{ item.side === 'will' ? 'Will' : 'Refuses' }}: {{ item.text }}
            </li>
          </ul>
        </div>

        <div
          v-if="project.artifacts?.length"
          class="plain-experience__artifacts"
        >
          <strong>Artifacts:</strong>
          <ul>
            <li
              v-for="artifact in project.artifacts"
              :key="artifact.id"
            >
              {{ artifact.name }} - {{ artifact.summary }}
            </li>
          </ul>
        </div>

        <p><strong>Stack:</strong> {{ project.stack.join(', ') }}</p>

        <div
          v-if="resolveProjectLinks(project.links).length"
          class="plain-experience__links"
        >
          <a
            v-for="link in resolveProjectLinks(project.links)"
            :key="link.key"
            :href="link.url"
            target="_blank"
            rel="noreferrer"
          >
            {{ link.label }}
          </a>
        </div>
      </article>
    </section>

    <section class="plain-experience__section" aria-labelledby="plain-training-title">
      <p class="plain-experience__eyebrow">Training</p>
      <h3 id="plain-training-title">Training Data</h3>
      <article
        v-for="record in trainingRecords"
        :key="record.id"
        class="plain-experience__project"
      >
        <h4>{{ record.institution }}</h4>
        <p>{{ record.program }} / {{ record.focus }}</p>
        <p>{{ record.location }} / {{ record.period }}</p>
        <p>{{ record.note }}</p>
        <p><strong>Proof:</strong> {{ record.proofChips.join(', ') }}</p>
      </article>
    </section>

    <section class="plain-experience__section" aria-labelledby="plain-capabilities-title">
      <p class="plain-experience__eyebrow">Capability</p>
      <h3 id="plain-capabilities-title">Capability Map</h3>
      <article
        v-for="group in capabilityGroups"
        :key="group.id"
        class="plain-experience__project"
      >
        <h4>{{ group.label }}</h4>
        <p>{{ group.summary }}</p>
        <p>{{ group.skills.join(', ') }}</p>
      </article>
    </section>
  </section>
</template>

<style scoped>
.plain-experience {
  width: min(100%, 1080px);
  margin: 0 auto;
  padding: 3rem 1.25rem 4rem;
  color: #111111;
  background: #ffffff;
}

.plain-experience__header,
.plain-experience__section,
.plain-experience__project {
  display: grid;
  gap: 1rem;
}

.plain-experience__header {
  padding-block: 2rem;
  border-bottom: 1px solid #d9d9d9;
}

.plain-experience__section {
  padding-block: 2rem;
  border-bottom: 1px solid #d9d9d9;
}

.plain-experience__project {
  padding: 1.25rem;
  border: 1px solid #d9d9d9;
}

.plain-experience__project + .plain-experience__project {
  margin-top: 1rem;
}

.plain-experience__project-head {
  display: flex;
  gap: 1rem;
  align-items: start;
  justify-content: space-between;
}

.plain-experience__eyebrow,
.plain-experience__meta {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7a5a00;
}

.plain-experience h2,
.plain-experience h3,
.plain-experience h4,
.plain-experience p {
  margin: 0;
}

.plain-experience h2 {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 7vw, 5rem);
  font-weight: 300;
  line-height: 0.95;
}

.plain-experience h3 {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 3.5rem);
  font-weight: 300;
}

.plain-experience h4 {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 2.25rem);
  font-weight: 300;
}

.plain-experience p,
.plain-experience li,
.plain-experience dd {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.7;
}

.plain-experience ul {
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
}

.plain-experience__facts {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}

.plain-experience__facts div {
  display: grid;
  gap: 0.15rem;
}

.plain-experience__facts dt {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7a5a00;
}

.plain-experience__facts dd {
  margin: 0;
}

.plain-experience__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.plain-experience__links a {
  padding: 0.45rem 0.7rem;
  border: 1px solid #c6c6c6;
  color: #111111;
  text-decoration: none;
}

@media print {
  .plain-experience {
    width: 100%;
    padding: 0;
  }

  .plain-experience__project {
    break-inside: avoid;
  }
}
</style>
