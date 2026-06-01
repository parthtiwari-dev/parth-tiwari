<script setup lang="ts">
import { ref } from 'vue'
import CopiedToast from '@/components/shared/CopiedToast.vue'
import { contactMethods, type ContactMethod } from '@/data/contact'

const toastVisible = ref(false)
const toastMessage = ref('[copied]')
let toastTimer: number | null = null

function fallbackCopy(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

async function copyContact(method: ContactMethod) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(method.copyValue)
    } else {
      fallbackCopy(method.copyValue)
    }

    toastMessage.value = `[copied ${method.label.toLowerCase()}]`
  } catch {
    toastMessage.value = '[copy blocked]'
  }

  toastVisible.value = true

  if (toastTimer) {
    window.clearTimeout(toastTimer)
  }

  toastTimer = window.setTimeout(() => {
    toastVisible.value = false
    toastTimer = null
  }, 1500)
}
</script>

<template>
  <article class="contact-overlay">
    <header class="contact-overlay__intro">
      <p class="panel-label">Signal Handoff</p>
      <h2>Contact.</h2>
      <p>
        Clean public channels only. Copy a signal, open the profile, and keep the constellation intact behind the glass.
      </p>
    </header>

    <div class="contact-overlay__grid">
      <section
        v-for="method in contactMethods"
        :key="method.kind"
        class="contact-row"
      >
        <div>
          <p>{{ method.label }}</p>
          <h3>{{ method.value }}</h3>
        </div>
        <div class="contact-row__actions">
          <button type="button" @click="copyContact(method)">
            Copy
          </button>
          <a :href="method.href" target="_blank" rel="noreferrer">
            {{ method.actionLabel }}
          </a>
        </div>
      </section>
    </div>

    <footer class="contact-overlay__footer">
      <span>Public-safe contact only</span>
      <span>No private tokens, accounts, or client data travel through this surface.</span>
    </footer>

    <CopiedToast :show="toastVisible" :message="toastMessage" />
  </article>
</template>

<style scoped>
.contact-overlay {
  display: grid;
  gap: clamp(1.2rem, 3vw, 2.2rem);
}

.contact-overlay__intro {
  display: grid;
  max-width: 64rem;
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

.contact-overlay h2,
.contact-row h3 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-weight: 300;
}

.contact-overlay h2 {
  font-size: clamp(2.8rem, 6.6vw, 6.5rem);
  letter-spacing: 0.03em;
  line-height: 0.9;
}

.contact-row h3 {
  overflow-wrap: anywhere;
  font-size: clamp(1.7rem, 3.6vw, 3.8rem);
  line-height: 0.96;
}

.contact-overlay__intro > p:not(.panel-label) {
  margin: 0;
  color: var(--ice-muted);
  line-height: 1.58;
}

.contact-overlay__grid {
  display: grid;
  gap: 0.9rem;
}

.contact-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  min-height: 9rem;
  padding: clamp(1rem, 2.2vw, 1.45rem);
  border: 1px solid color-mix(in srgb, var(--ice-faint) 54%, transparent);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--teal-active) 12%, transparent), transparent 30%),
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 5%, transparent), transparent 42%),
    color-mix(in srgb, var(--bg) 58%, transparent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 1.1rem 2.4rem rgb(0 0 0 / 0.2);
}

.contact-row p,
.contact-row__actions button,
.contact-row__actions a,
.contact-overlay__footer span {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.contact-row p {
  margin: 0 0 0.55rem;
  color: var(--gold);
}

.contact-row__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.55rem;
}

.contact-row__actions button,
.contact-row__actions a {
  border: 1px solid color-mix(in srgb, var(--ice-faint) 62%, transparent);
  background: color-mix(in srgb, var(--bg) 56%, transparent);
  color: var(--ice-muted);
  cursor: pointer;
  padding: 0.48rem 0.72rem;
  text-decoration: none;
}

.contact-row__actions button:hover,
.contact-row__actions button:focus-visible,
.contact-row__actions a:hover,
.contact-row__actions a:focus-visible {
  border-color: var(--gold);
  color: var(--gold-glow);
  outline: none;
}

.contact-overlay__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  border-top: 1px solid color-mix(in srgb, var(--ice-faint) 50%, transparent);
  padding-top: 1rem;
}

.contact-overlay__footer span {
  color: var(--ice-muted);
}

@media (max-width: 820px) {
  .contact-row {
    grid-template-columns: 1fr;
  }

  .contact-row__actions {
    justify-content: flex-start;
  }
}
</style>
