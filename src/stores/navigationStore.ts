import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { projects } from '@/data/projects'

/**
 * Which camera has authority, what it is looking at, and how close it is
 * (PLAN.md 4.1, 4.2, 4.5, 4.6, 4.7).
 *
 * Two modes over one scene, from NASA's Eyes on the Solar System (DESIGN.md §3):
 * guided scrollytelling on top of a free-orbit simulation, over identical data.
 * Neither is a downgrade of the other, and the switch is implicit — the moment
 * someone drags, guided scrub yields and a quiet "resume tour" affordance
 * appears. No modal, no mode picker.
 *
 * **Only discrete state lives here.** Azimuth, polar angle, distance and field
 * of view change every frame and are deliberately kept out of Vue in
 * `composables/useFreeOrbit.ts`, per the rule in DESIGN.md §4: continuous
 * camera values never touch reactive state, or TresJS diffs the scene graph on
 * every frame. What is here is what the DOM genuinely needs to re-render on.
 */

export type NavigationMode = 'guided' | 'free'

/**
 * The three zoom scales (4.5). Derived from distance, never set directly, so the
 * label and the camera cannot disagree — the readout is a description of where
 * the camera is, not a second source of truth about it.
 */
export type ZoomScale = 'galaxy' | 'system' | 'project'

/**
 * Orbit distance, in constellation units, at each scale's resting point.
 *
 * `galaxy` is 22 because that is where the authored opening pose actually sits
 * — `CAMERA_POSES[0]` is 21.3 units from its target. Picking a round 30 instead
 * put the arrival shot *below* the galaxy threshold, so the readout said
 * "neighbourhood" while the viewer was plainly looking at the whole
 * constellation, and the first zoom press then skipped a scale.
 */
export const SCALE_DISTANCE: Record<ZoomScale, number> = {
  galaxy: 22,
  system: 13,
  project: 6,
}

export const SCALE_ORDER: ZoomScale[] = ['galaxy', 'system', 'project']

const projectIds = new Set(projects.map((project) => project.id))

export const useNavigationStore = defineStore('navigation', () => {
  const mode = ref<NavigationMode>('guided')

  /** The node the rig is centred on, or null for the constellation as a whole. */
  const focusedProjectId = ref<string | null>(null)

  /**
   * The node focused before this one (4.6).
   *
   * Pairwise comparison is the whole reason scale reads as scale here: a size
   * difference is only legible against something else in frame. So the previous
   * subject is not discarded when a new one is chosen — it stays labelled and
   * visibly receding until the viewer zooms back out, which is what makes
   * "bigger node = stronger evidence" a thing you can *see* rather than a
   * sentence in the legend.
   */
  const previousProjectId = ref<string | null>(null)

  /** Live orbit distance, pushed from the render loop at most once per change. */
  const distance = ref(SCALE_DISTANCE.galaxy)

  const zoomScale = computed<ZoomScale>(() => {
    if (distance.value <= (SCALE_DISTANCE.project + SCALE_DISTANCE.system) / 2) return 'project'
    if (distance.value <= (SCALE_DISTANCE.system + SCALE_DISTANCE.galaxy) / 2) return 'system'
    return 'galaxy'
  })

  const isFree = computed(() => mode.value === 'free')

  /**
   * Any direct manipulation enters free mode. Deliberately not a toggle anyone
   * has to find: the first drag is the intent.
   */
  function enterFree() {
    if (mode.value !== 'free') mode.value = 'free'
  }

  /** The "resume tour" affordance. Hands authority back to the scroll path. */
  function resumeGuided() {
    mode.value = 'guided'
    focusedProjectId.value = null
    previousProjectId.value = null
  }

  function focusProject(projectId: string | null) {
    if (projectId !== null && !projectIds.has(projectId)) return
    if (projectId === focusedProjectId.value) return

    // Only remember a real predecessor — re-focusing from nothing is not a
    // comparison, and pointing the ghost label at the node you just left when
    // you left it for empty space would be a claim about nothing.
    previousProjectId.value = focusedProjectId.value
    focusedProjectId.value = projectId
    if (projectId !== null) enterFree()
  }

  function setDistance(next: number) {
    // Guard the write: this is called from the render loop, and an unchanged
    // ref assignment still costs a dependency check on every frame.
    if (Math.abs(next - distance.value) > 0.01) distance.value = next
  }

  return {
    mode,
    isFree,
    focusedProjectId,
    previousProjectId,
    distance,
    zoomScale,
    enterFree,
    resumeGuided,
    focusProject,
    setDistance,
  }
})
