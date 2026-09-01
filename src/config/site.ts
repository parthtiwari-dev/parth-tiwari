/**
 * Site-wide identity constants.
 *
 * Everything that names or addresses this site lives here. `parthtiwari.com` is
 * planned, so swapping the domain must stay a one-line change (PRD.md 7.5).
 *
 * `SiteMeta.astro`, Astro's `site` setting, the generated sitemap and robots.txt
 * all derive or repeat this origin. Change those four surfaces in the same commit
 * when the verified public domain changes.
 */

/**
 * Production origin. No trailing slash — append paths explicitly.
 *
 * This is `parth-tiwari-1.vercel.app`, NOT `parth-tiwari.vercel.app`.
 *
 * Resolved on 2026-08-13 from the Vercel project's own `domains` array
 * (project `parth-tiwari`, prj_DiULfW120T9OTwa0ARp7z01Q145l), which lists exactly:
 *   parth-tiwari-1.vercel.app
 *   parth-tiwari-parthtiwari-devs-projects.vercel.app
 *   parth-tiwari-git-main-parthtiwari-devs-projects.vercel.app
 *
 * `parth-tiwari.vercel.app` is absent from that list. It resolves 200 and serves a
 * different site (page title "Parth Tiwari"), i.e. it is claimed by someone else —
 * the same trap as `vivid.vercel.app` (CLAUDE.md). Every canonical, og:url and
 * JSON-LD @id previously pointed at it, which told crawlers this site's canonical
 * home was a stranger's page. Do not restore it.
 *
 * Replace with `https://parthtiwari.com` once that domain is bought and attached.
 */
export const SITE_URL = 'https://parth-tiwari-1.vercel.app'

export const OWNER_NAME = 'Parth Tiwari'

/** A real, publication-cleared image. Kept absolute because unfurlers do not resolve relative paths reliably. */
export const OG_IMAGE_URL = `${SITE_URL}/media/parth-portrait.jpg`

/**
 * Booking link — the primary conversion channel (PRD.md 7.3).
 *
 * `https://cal.com/parth-tiwari` returned HTTP 404 when first checked on
 * 2026-08-13 (handle unclaimed). Owner claimed the handle and confirmed the
 * page loads; re-verified 200 with a live Cal.com booking page title before
 * this flag was flipped.
 */
export const BOOKING_URL = 'https://cal.com/parth-tiwari'

/** Confirmed live 2026-08-14 — see BOOKING_URL. */
export const IS_BOOKING_CONFIRMED: boolean = true

export const CONTACT_EMAIL = 'parthti2003@gmail.com'

export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`

/**
 * WhatsApp — an always-visible direct channel, especially effective for Indian
 * SMB buyers (PRD.md 7.3).
 *
 * International format, digits only, no `+` and no spaces: country code 91
 * followed by the ten-digit number. Supplied by the owner 2026-08-18.
 *
 * It stayed empty until then on purpose — a guessed phone number is worse than
 * no phone number, and every WhatsApp affordance is still gated on
 * `IS_WHATSAPP_CONFIGURED` so emptying this string removes them cleanly rather
 * than shipping a link to nowhere.
 */
export const WHATSAPP_NUMBER: string = '917000181882'

export const IS_WHATSAPP_CONFIGURED: boolean = WHATSAPP_NUMBER.trim().length > 0

/** Empty string when unconfigured — callers must check `IS_WHATSAPP_CONFIGURED` first. */
export const WHATSAPP_URL = IS_WHATSAPP_CONFIGURED
  ? `https://wa.me/${WHATSAPP_NUMBER.trim()}`
  : ''

/**
 * Where a booking action actually points today.
 * Resolves to the booking tool once confirmed, and to email until then, so the
 * primary CTA is never a broken promise.
 */
export const PRIMARY_CONTACT_HREF = IS_BOOKING_CONFIRMED ? BOOKING_URL : CONTACT_EMAIL_HREF

/** Label matching `PRIMARY_CONTACT_HREF`, so the button never mislabels its destination. */
export const PRIMARY_CONTACT_LABEL = IS_BOOKING_CONFIRMED ? 'Book a call' : 'Email Parth'
