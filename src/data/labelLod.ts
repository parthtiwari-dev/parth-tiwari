import { constellationExtent } from '@/data/layout'

/**
 * How much of a label to draw, and whether to draw one at all
 * (PLAN.md 5.3, 5.4 — DESIGN.md §6).
 *
 * The rule comes from **Stellarium Web**, which keeps a 600,000-star catalogue
 * readable by treating label visibility as a function of *importance × zoom*
 * rather than as a fixed set. Twelve is not six hundred thousand, but the
 * failure mode is identical and arrives much sooner than people expect: twelve
 * cards drawn at once is an unreadable pile, and twelve labels that pop in
 * together at some distance threshold reads as a bug.
 *
 * So each project already carries a derived magnitude (`layout.ts`, 3.7 —
 * evidence 0.65 + maturity 0.35), and this turns magnitude plus camera distance
 * into one of four levels. Nothing here is a hand-tuned per-project decision;
 * the same project gets a bigger label for the same reason it gets a bigger
 * star.
 */

export type LabelLod = 'hidden' | 'dot' | 'name' | 'card'

/**
 * The distance at which the whole constellation fits a 45-degree frame.
 *
 * This is what "the overview" means, and it has to be *derived* for the same
 * reason the reveal pose is (4.9). It was `SCALE_DISTANCE.galaxy`, 22 — a
 * number chosen when the guided path never pulled back far enough to contain
 * the ring. Once it did, at about 36 units, every apparent magnitude fell by a
 * third against thresholds that had not moved, and the frame the whole scroll
 * builds toward rendered twelve stars and **no names at all**. The constant was
 * not wrong when it was written; it went stale under it.
 */
const OVERVIEW_DISTANCE = constellationExtent() / Math.tan((45 / 2) * (Math.PI / 180))

/**
 * Apparent prominence: magnitude scaled by how close the camera is.
 *
 * Normalised so that at the overview distance a project's apparent value *is*
 * its magnitude, which is what makes the thresholds below readable as
 * magnitudes at the scale they were chosen against.
 */
export function apparentMagnitude(magnitude: number, distance: number): number {
  return magnitude * (OVERVIEW_DISTANCE / Math.max(distance, 1))
}

/**
 * Thresholds, in apparent magnitude.
 *
 * Magnitudes across the twelve projects land roughly between 0.3 and 0.9, so at
 * the overview most nodes show a dot, the strongest few show a name, and nothing
 * shows a card unless the visitor has pointed at it or focused it. That is the
 * "nine labels never all render at once unless zoomed to overview, and at that
 * scale they are short" behaviour DESIGN.md asks for.
 */
/*
 * 0.68, down from 0.82.
 *
 * Re-normalising alone still left the reveal with two names out of twelve, and
 * the end of the scroll is the one moment the composition is *for* — every
 * project on screen at once, with room around each one. Measured magnitudes run
 * 0.35 to 1.0, so 0.68 promotes the top five there, which is exactly
 * `MAX_NAMES` and therefore the cap does the deciding rather than the
 * threshold. Closer in, everything clears it and the rank cap governs, which is
 * the behaviour that was already correct.
 */
const NAME_THRESHOLD = 0.68
const DOT_THRESHOLD = 0.42

/**
 * At most this many names at once, strongest first.
 *
 * Distance alone is not enough of a filter. Fly into a dense arc and a dozen
 * projects all clear the name threshold together, because they are all equally
 * close — the arc is what got closer, not any one project. Capping by rank
 * keeps the label layer legible at every distance instead of only at the ones
 * that happen to be sparse.
 */
export const MAX_NAMES = 5

export interface LabelCandidate {
  projectId: string
  magnitude: number
  distance: number
  /** Pointed at. Always wins — it is the visitor asking a direct question. */
  hovered: boolean
  /** The current subject in free mode (4.5). */
  focused: boolean
  /** The receding subject in a pairwise comparison (4.6). */
  comparison: boolean
  /** False when the star is behind the camera or off screen. */
  onScreen: boolean
}

export interface LabelDecision {
  projectId: string
  lod: LabelLod
  apparent: number
}

/**
 * Decides every label in one pass, because the cap in `MAX_NAMES` is a decision
 * about the *set* and cannot be made one label at a time.
 */
export function decideLabels(candidates: LabelCandidate[]): LabelDecision[] {
  const scored = candidates.map((candidate) => ({
    candidate,
    apparent: apparentMagnitude(candidate.magnitude, candidate.distance),
  }))

  // Rank once; the name budget is spent strongest-first.
  const ranked = [...scored].sort((a, b) => b.apparent - a.apparent)
  const nameBudget = new Set<string>()
  for (const entry of ranked) {
    if (nameBudget.size >= MAX_NAMES) break
    if (entry.apparent >= NAME_THRESHOLD) nameBudget.add(entry.candidate.projectId)
  }

  return scored.map(({ candidate, apparent }) => {
    if (!candidate.onScreen) {
      return { projectId: candidate.projectId, lod: 'hidden' as LabelLod, apparent }
    }

    // Direct intent outranks the derivation. Someone pointing at a star is
    // asking about that star, and a rule that answers "too faint" is wrong.
    if (candidate.hovered || candidate.focused) {
      return { projectId: candidate.projectId, lod: 'card' as LabelLod, apparent }
    }
    if (candidate.comparison) {
      return { projectId: candidate.projectId, lod: 'name' as LabelLod, apparent }
    }

    if (nameBudget.has(candidate.projectId)) {
      return { projectId: candidate.projectId, lod: 'name' as LabelLod, apparent }
    }
    if (apparent >= DOT_THRESHOLD) {
      return { projectId: candidate.projectId, lod: 'dot' as LabelLod, apparent }
    }
    return { projectId: candidate.projectId, lod: 'hidden' as LabelLod, apparent }
  })
}
