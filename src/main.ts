import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { inject as injectAnalytics } from '@vercel/analytics'
import './style.css'
import App from './App.vue'

gsap.registerPlugin(ScrollTrigger)

/**
 * Vercel Web Analytics (PLAN.md 0.11).
 *
 * The framework-agnostic `inject()` rather than a framework wrapper: there is no
 * router here, so there are no route changes to hook — one page, three modes on
 * query params. It injects a ~1 kB script tag and nothing else; the analytics
 * package itself is a few hundred bytes in the entry, which the bundle budget
 * covers.
 *
 * Skipped on localhost, and not because of the numbers. The insights script is
 * served by Vercel's edge at `/_vercel/insights/script.js`, which does not exist
 * anywhere else, so injecting it locally makes `vite preview` emit a 404 and a
 * failed request on every route at every viewport. `npm run shots` reports
 * exactly those, and a harness that always shows four errors is a harness nobody
 * reads — it was the whole reason the Geist Mono 404 went unnoticed for months.
 * Everything that is not a loopback host is a real deployment and is measured,
 * preview URLs included.
 *
 * **This is half the switch.** Data only starts arriving once Web Analytics is
 * also enabled for the project in the Vercel dashboard — that is an owner action
 * and cannot be done from the repo. Until both halves are on, treat every claim
 * about how people use this site as unmeasured, exactly as before.
 */
const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]', '::1', ''])
if (!LOOPBACK.has(window.location.hostname)) {
  injectAnalytics({ mode: 'production' })
}

createApp(App).use(createPinia()).mount('#app')
