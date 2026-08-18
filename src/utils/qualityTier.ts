/**
 * One quality detection, read once, feeding every expensive knob in the scene
 * (PLAN.md 2.4).
 *
 * Before this there were three independent decisions and one thing that was
 * never decided at all: `useParticleField` branched on `hardwareConcurrency`
 * for particle count, `SceneRoot` hardcoded a DPR range, `MobileStarWorld`
 * capped its own DPR separately, and the sky shader — the largest GPU cost in
 * the app — ran at full quality on every device that could load it.
 *
 * The buyer this site is built for arrives on a phone from cold outreach
 * (PRD.md §3). A fullscreen fragment shader doing 63 noise evaluations per
 * pixel per frame is the wrong first impression to hand them.
 */

export type QualityTier = 'high' | 'medium' | 'low'

export interface QualitySettings {
  tier: QualityTier
  /** Ambient stars in the particle field. */
  particleCount: number
  /** `[min, max]` device pixel ratio for the renderer. */
  dpr: [number, number]
  /**
   * fbm octaves in `iridescent.frag.glsl`, injected as `SKY_OCTAVES`.
   *
   * Cost is roughly linear in this: the shader makes 7 `triFbm` calls, each of
   * which runs `fbm` three times, each of which loops this many times. At 3
   * that is 63 `noise()` evaluations per fragment; at 1 it is 21.
   *
   * Degrades as a softer, lower-contrast nebula rather than a missing one —
   * deliberately chosen over dropping the aurora or milky-dust layers, which
   * would change the composition instead of its detail.
   */
  skyOctaves: number
  /** Whether post-processing is worth its cost on this device. */
  postFx: boolean
}

const SETTINGS: Record<QualityTier, Omit<QualitySettings, 'tier'>> = {
  high: { particleCount: 10000, dpr: [1, 1.25], skyOctaves: 3, postFx: true },
  medium: { particleCount: 5000, dpr: [1, 1.1], skyOctaves: 2, postFx: true },
  low: { particleCount: 2000, dpr: [1, 1], skyOctaves: 1, postFx: false },
}

function detectTier(): QualityTier {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return 'low'

  // Reduced motion is a stated preference, not a capability guess. Someone who
  // asked for less movement is not served by 12,000 drifting particles, whatever
  // their hardware can manage.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'low'

  const cores = navigator.hardwareConcurrency ?? 0
  // Chromium-only. Absent elsewhere, so it can lower the tier but never raise it.
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory

  if (memory !== undefined && memory <= 4) return 'low'

  // A coarse pointer on a narrow viewport is a phone. Core count lies here —
  // mid-range phones report 8 while thermally throttling within seconds, which
  // is exactly the device that must not get the full sky shader.
  const isHandset =
    window.matchMedia?.('(pointer: coarse)').matches === true && window.innerWidth < 820
  if (isHandset) return cores >= 8 ? 'medium' : 'low'

  if (cores >= 12) return 'high'
  if (cores >= 6) return 'medium'
  return 'low'
}

let cached: QualitySettings | null = null

/**
 * Memoised: the tier is resolved on first call and reused. Deliberately not
 * reactive — re-tiering mid-session would rebuild geometry and recompile
 * shaders while the user is looking at them, which costs more than it saves.
 */
export function getQuality(): QualitySettings {
  if (cached) return cached
  const tier = detectTier()
  cached = { tier, ...SETTINGS[tier] }
  return cached
}

/** Test seam. Not used in application code. */
export function __resetQualityForTests(): void {
  cached = null
}
