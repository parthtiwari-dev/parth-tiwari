/**
 * Site-wide identity constants.
 *
 * Everything that names or addresses this site lives here. `parthtiwari.com` is
 * planned, so swapping the domain must stay a one-line change (PRD.md 7.5).
 *
 * ---------------------------------------------------------------------------
 * index.html is NOT covered by this file and must be edited alongside it.
 * ---------------------------------------------------------------------------
 * index.html is static HTML served before any JS runs — crawlers and social
 * unfurlers read it without executing the bundle — so it cannot import TypeScript.
 * A build-time injection step was considered and rejected as over-engineering for
 * one constant. Instead: when SITE_URL or SITE_NAME changes, change these
 * index.html occurrences in the same commit. This is the complete list.
 *
 * SITE_URL — 13 occurrences, all now `https://parth-tiwari-1.vercel.app`.
 * Line numbers are as of this commit; the identifiers are what matters if they drift:
 *   L30  <meta property="og:url">              content="{SITE_URL}/"
 *   L31  <meta property="og:image">            content="{SITE_URL}/og.png"
 *   L41  <meta name="twitter:image">           content="{SITE_URL}/og.png"
 *   L42  <link rel="canonical">                href="{SITE_URL}/"
 *   L54  JSON-LD Person       @id              "{SITE_URL}/#person"
 *   L56  JSON-LD Person       url              "{SITE_URL}/"
 *   L80  JSON-LD WebSite      @id              "{SITE_URL}/#website"
 *   L81  JSON-LD WebSite      url              "{SITE_URL}/"
 *   L85  JSON-LD WebSite      publisher.@id    "{SITE_URL}/#person"
 *   L90  JSON-LD ProfilePage  @id              "{SITE_URL}/#profile"
 *   L91  JSON-LD ProfilePage  url              "{SITE_URL}/"
 *   L94  JSON-LD ProfilePage  about.@id        "{SITE_URL}/#person"
 *   L97  JSON-LD ProfilePage  isPartOf.@id     "{SITE_URL}/#website"
 *
 * SITE_NAME:
 *   <title>                               "... | {SITE_NAME}"
 *   <meta property="og:site_name">
 *   <meta property="og:image:alt">
 *   JSON-LD WebSite      name
 *   JSON-LD ProfilePage  name
 *
 * Outside index.html, `public/sitemap.xml` and `public/robots.txt` also carry the
 * absolute URL and must move with it. (Both are outside this file's ownership.)
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

/** The site's name. `EVIDENCEBOUND` is retired (CLAUDE.md, PRD.md 10). */
export const SITE_NAME = 'EPHEMERIS'

export const OWNER_NAME = 'Parth Tiwari'

/** Absolute URL of the Open Graph card. Kept absolute: unfurlers do not resolve relative paths. */
export const OG_IMAGE_URL = `${SITE_URL}/og.png`

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
 * TODO(owner): supply the number in international format, digits only, including
 * country code and no `+` or spaces (e.g. `919812345678`). Deliberately left
 * empty: a guessed phone number is worse than no phone number, so every WhatsApp
 * affordance stays unrendered until this is filled in.
 */
export const WHATSAPP_NUMBER: string = ''

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
