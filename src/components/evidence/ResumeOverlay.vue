<script setup lang="ts">
import {
  isResumeConfigured,
  resumeConfig,
  resumeOpenUrl,
  resumePreviewUrl,
} from '@/data/resume'
</script>

<template>
  <article class="resume-overlay">
    <header class="resume-overlay__intro">
      <p class="panel-label">Drive-rendered PDF</p>
      <h2>{{ resumeConfig.title }}</h2>
      <p>
        The resume surface is linked to one Google Drive file. Replace that PDF in Drive and the site keeps rendering the latest version without changing the component.
      </p>
    </header>

    <div v-if="isResumeConfigured" class="resume-overlay__viewer">
      <iframe
        :src="resumePreviewUrl"
        :title="resumeConfig.title"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
    </div>

    <div v-else class="resume-overlay__empty">
      <p class="panel-label">Awaiting Link</p>
      <h3>Resume renderer is ready.</h3>
      <p>
        Add the Google Drive file ID or Drive share link in <code>src/data/resume.ts</code> to enable the top-bar Resume action.
      </p>
    </div>

    <footer v-if="isResumeConfigured" class="resume-overlay__actions">
      <a :href="resumeOpenUrl" target="_blank" rel="noreferrer">
        Open in Drive
      </a>
    </footer>
  </article>
</template>

<style scoped>
.resume-overlay {
  display: grid;
  gap: clamp(1rem, 2.2vw, 1.4rem);
  min-height: 100%;
}

.resume-overlay__intro {
  display: grid;
  gap: 0.6rem;
  max-width: 62rem;
}

.panel-label {
  margin: 0;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.resume-overlay h2,
.resume-overlay h3 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-weight: 300;
}

.resume-overlay h2 {
  font-size: clamp(2.3rem, 5vw, 5rem);
  letter-spacing: 0.03em;
  line-height: 0.92;
}

.resume-overlay h3 {
  font-size: clamp(1.9rem, 4vw, 4rem);
  line-height: 0.95;
}

.resume-overlay__intro p:not(.panel-label),
.resume-overlay__empty p:not(.panel-label) {
  margin: 0;
  color: var(--ice-muted);
  line-height: 1.55;
}

.resume-overlay__viewer {
  min-height: min(64vh, 42rem);
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  background: color-mix(in srgb, var(--bg) 74%, black);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 1.2rem 3rem rgb(0 0 0 / 0.26);
}

.resume-overlay__viewer iframe {
  display: block;
  width: 100%;
  height: min(64vh, 42rem);
  border: 0;
  background: var(--bg);
}

.resume-overlay__empty {
  display: grid;
  align-content: center;
  gap: 0.8rem;
  min-height: 20rem;
  padding: clamp(1rem, 2.2vw, 1.6rem);
  border: 1px solid color-mix(in srgb, var(--gold) 44%, transparent);
  background:
    radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--gold) 10%, transparent), transparent 32%),
    color-mix(in srgb, var(--bg) 64%, transparent);
}

.resume-overlay code {
  color: var(--gold-glow);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.92em;
}

.resume-overlay__actions {
  display: flex;
  justify-content: flex-end;
}

.resume-overlay__actions a {
  border: 1px solid color-mix(in srgb, var(--gold) 62%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gold) 14%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 58%, transparent);
  color: var(--gold-glow);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.13em;
  padding: 0.55rem 0.78rem;
  text-decoration: none;
  text-transform: uppercase;
}

.resume-overlay__actions a:hover,
.resume-overlay__actions a:focus-visible {
  border-color: var(--ice);
  color: var(--ice);
  outline: none;
}

@media (max-width: 620px) {
  .resume-overlay {
    gap: 0.9rem;
  }

  .resume-overlay h2 {
    font-size: clamp(2.7rem, 14vw, 4.25rem);
  }

  .resume-overlay__intro p:not(.panel-label) {
    display: none;
  }

  .resume-overlay__actions {
    order: 2;
    justify-content: stretch;
  }

  .resume-overlay__actions a {
    display: block;
    width: 100%;
    padding: 0.78rem 0.9rem;
    text-align: center;
  }

  .resume-overlay__viewer {
    order: 3;
    min-height: 62vh;
  }

  .resume-overlay__viewer iframe {
    height: 62vh;
  }

  .resume-overlay__empty {
    min-height: 18rem;
  }
}
</style>
