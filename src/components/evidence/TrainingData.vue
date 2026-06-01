<script setup lang="ts">
import { trainingRecords } from '@/data/training'
</script>

<template>
  <article class="training-data">
    <header class="training-data__intro">
      <p class="panel-label">Origin Records</p>
      <h2>Training data, kept honest.</h2>
      <p>
        Two formal records sit behind the systems: a GenAI-focused data science program and an AI/ML computer-science degree. The portfolio keeps the claim small and lets the work carry the weight.
      </p>
    </header>

    <ol class="training-data__timeline" aria-label="Training records">
      <li
        v-for="record in trainingRecords"
        :key="record.id"
        class="training-card"
      >
        <div class="training-card__marker" aria-hidden="true" />
        <div class="training-card__meta">
          <span>{{ record.period }}</span>
          <span>{{ record.location }}</span>
        </div>
        <h3>{{ record.institution }}</h3>
        <p class="training-card__program">{{ record.program }}</p>
        <p class="training-card__focus">{{ record.focus }}</p>
        <p class="training-card__note">{{ record.note }}</p>
        <div class="training-card__chips" aria-label="Proof chips">
          <span v-for="chip in record.proofChips" :key="chip">
            {{ chip }}
          </span>
        </div>
      </li>
    </ol>
  </article>
</template>

<style scoped>
.training-data {
  display: grid;
  gap: clamp(1.4rem, 3vw, 2.4rem);
}

.training-data__intro {
  display: grid;
  max-width: 66rem;
  gap: 0.8rem;
}

.panel-label {
  margin: 0;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.training-data h2,
.training-card h3 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-weight: 300;
}

.training-data h2 {
  font-size: clamp(2.8rem, 6.6vw, 6.6rem);
  letter-spacing: 0.03em;
  line-height: 0.9;
}

.training-card h3 {
  font-size: clamp(2rem, 4vw, 4.3rem);
  line-height: 0.96;
}

.training-data__intro > p:not(.panel-label),
.training-card__program,
.training-card__focus,
.training-card__note {
  margin: 0;
  color: var(--ice-muted);
  line-height: 1.58;
}

.training-data__timeline {
  position: relative;
  display: grid;
  gap: 1rem;
  margin: 0;
  padding: 0 0 0 1.5rem;
  list-style: none;
}

.training-data__timeline::before {
  position: absolute;
  top: 0.3rem;
  bottom: 0.3rem;
  left: 0.35rem;
  width: 1px;
  background: linear-gradient(180deg, var(--gold), color-mix(in srgb, var(--teal-active) 70%, transparent));
  content: '';
  opacity: 0.7;
}

.training-card {
  position: relative;
  display: grid;
  gap: 0.85rem;
  min-height: 14rem;
  padding: clamp(1rem, 2.2vw, 1.55rem);
  border: 1px solid color-mix(in srgb, var(--ice-faint) 54%, transparent);
  background:
    radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--gold) 11%, transparent), transparent 30%),
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 6%, transparent), transparent 42%),
    color-mix(in srgb, var(--bg) 58%, transparent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 1.2rem 2.8rem rgb(0 0 0 / 0.22);
}

.training-card__marker {
  position: absolute;
  top: 1.35rem;
  left: -1.52rem;
  width: 0.62rem;
  aspect-ratio: 1;
  border-radius: 999px;
  background: var(--gold-glow);
  box-shadow: 0 0 1.2rem color-mix(in srgb, var(--gold) 68%, transparent);
}

.training-card__meta,
.training-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.training-card__meta span,
.training-card__chips span {
  border: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  color: var(--ice-muted);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  padding: 0.24rem 0.45rem;
  text-transform: uppercase;
}

.training-card__chips span {
  border-color: color-mix(in srgb, var(--gold) 58%, transparent);
  color: var(--gold-glow);
}

.training-card__program {
  color: var(--ice);
  font-size: clamp(1rem, 1.8vw, 1.35rem);
}

.training-card__focus {
  color: var(--teal-active);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (min-width: 900px) {
  .training-data__timeline {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .training-data__timeline {
    padding-left: 0;
  }

  .training-data__timeline::before,
  .training-card__marker {
    display: none;
  }
}
</style>
