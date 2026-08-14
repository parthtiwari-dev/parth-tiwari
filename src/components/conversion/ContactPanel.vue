<script setup lang="ts">
/**
 * The ranked contact surface (PRD.md 7.3, DESIGN.md 2b).
 *
 * Booking is primary. The form is for people not ready to talk yet. Email and
 * WhatsApp stay visible as direct channels. Four co-equal buttons dilute intent,
 * so the hierarchy is expressed in size and order, not in a row of equals.
 *
 * No prices anywhere — every path leads to a conversation.
 */
import { computed, ref } from 'vue'
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  IS_WHATSAPP_CONFIGURED,
  WHATSAPP_URL,
} from '@/config/site'
import BookingCta from './BookingCta.vue'

const name = ref('')
const need = ref('')

const isSubmittable = computed(() => name.value.trim().length > 0 && need.value.trim().length > 0)

/**
 * TODO: replace with a serverless endpoint (Vercel function) that posts the message
 * and returns a real confirmation state.
 *
 * `mailto:` is the honest interim: it needs no backend, no third-party form
 * service, and it cannot silently drop a lead the way an unwired form would. Its
 * cost is that it depends on the visitor having a mail client configured, which is
 * exactly why email and WhatsApp are also exposed as plain links below.
 */
function submit() {
  if (!isSubmittable.value) {
    return
  }

  const subject = `Project enquiry from ${name.value.trim()}`
  const body = `${need.value.trim()}\n\n— ${name.value.trim()}`

  window.location.href =
    `${CONTACT_EMAIL_HREF}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
</script>

<template>
  <section class="contact-panel" aria-labelledby="contact-panel-title">
    <header class="contact-panel__head">
      <p class="contact-panel__eyebrow">Contact</p>
      <h2 id="contact-panel-title">Start a conversation</h2>
      <p class="contact-panel__lede">
        Tell me what you are trying to build, or book a call and we can work out
        whether it is worth building at all.
      </p>
    </header>

    <div class="contact-panel__primary">
      <BookingCta placement="inline" />
      <p class="contact-panel__note">Fastest route. No form, no back and forth.</p>
    </div>

    <form class="contact-panel__form" novalidate @submit.prevent="submit">
      <p class="contact-panel__eyebrow">Or send a message</p>

      <div class="contact-panel__field">
        <label for="contact-name">Your name</label>
        <input
          id="contact-name"
          v-model="name"
          type="text"
          name="name"
          autocomplete="name"
          required
        />
      </div>

      <div class="contact-panel__field">
        <label for="contact-need">What do you need built?</label>
        <textarea
          id="contact-need"
          v-model="need"
          name="need"
          rows="4"
          required
        ></textarea>
      </div>

      <button
        class="contact-panel__submit"
        type="submit"
        :disabled="!isSubmittable"
        :aria-disabled="!isSubmittable ? 'true' : undefined"
      >
        Send message
      </button>

      <p class="contact-panel__hint">
        This opens your email client with the message ready to send.
      </p>
    </form>

    <div class="contact-panel__direct">
      <p class="contact-panel__eyebrow">Direct</p>
      <ul>
        <li>
          <a :href="CONTACT_EMAIL_HREF">
            <span>Email</span>
            <small>{{ CONTACT_EMAIL }}</small>
          </a>
        </li>
        <!-- WhatsApp renders only when a real number exists. An unset number must
             not become a link to nowhere — see WHATSAPP_NUMBER in @/config/site. -->
        <li v-if="IS_WHATSAPP_CONFIGURED">
          <a :href="WHATSAPP_URL" target="_blank" rel="noreferrer">
            <span>WhatsApp</span>
            <small>Message directly</small>
          </a>
        </li>
      </ul>
    </div>

    <!--
      A testimonial belongs here and there is not one yet (PRD.md 11.1). The slot
      renders nothing rather than a placeholder: a site whose thesis is evidence
      cannot fabricate its own. Fill it from real, attributed data or leave it out.
    -->
  </section>
</template>

<style scoped>
.contact-panel {
  display: grid;
  gap: 1.75rem;
  width: 100%;
}

.contact-panel__head,
.contact-panel__primary,
.contact-panel__form,
.contact-panel__direct {
  display: grid;
  gap: 0.75rem;
}

.contact-panel__eyebrow {
  margin: 0;
  color: var(--gold);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.contact-panel h2 {
  margin: 0;
  color: var(--ice);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 300;
  line-height: 1.05;
}

.contact-panel__lede,
.contact-panel__note,
.contact-panel__hint {
  margin: 0;
  color: var(--ice-muted);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.contact-panel__primary {
  justify-items: start;
  gap: 0.5rem;
}

.contact-panel__field {
  display: grid;
  gap: 0.35rem;
}

.contact-panel__field label {
  color: var(--ice-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.contact-panel__field input,
.contact-panel__field textarea {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 62%, transparent);
  border-radius: 0.35rem;
  background: color-mix(in srgb, var(--bg) 45%, transparent);
  color: var(--ice);
  font-family: var(--font-body);
  font-size: var(--text-base);
  resize: vertical;
}

.contact-panel__field input:focus-visible,
.contact-panel__field textarea:focus-visible,
.contact-panel__submit:focus-visible,
.contact-panel__direct a:focus-visible {
  outline: 2px solid var(--gold-glow);
  outline-offset: 2px;
}

.contact-panel__submit {
  justify-self: start;
  min-height: 2.75rem;
  padding: 0.6rem 1.1rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 70%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--bg) 45%, transparent);
  color: var(--ice);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.24s var(--ease-out-expo);
}

.contact-panel__submit:hover:not(:disabled) {
  border-color: var(--gold);
  color: var(--gold-glow);
}

.contact-panel__submit:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.contact-panel__direct ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.contact-panel__direct a {
  display: inline-flex;
  min-height: 2.75rem;
  flex-direction: column;
  justify-content: center;
  padding: 0.45rem 0.85rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 52%, transparent);
  border-radius: 0.35rem;
  color: var(--ice);
  text-decoration: none;
}

.contact-panel__direct a:hover {
  border-color: var(--gold);
}

.contact-panel__direct span {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.contact-panel__direct small {
  color: var(--ice-muted);
  font-family: var(--font-body);
  font-size: var(--text-xs);
}

@media (prefers-reduced-motion: reduce) {
  .contact-panel__submit {
    transition: none;
  }
}
</style>
