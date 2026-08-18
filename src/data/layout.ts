import * as THREE from 'three'
import { projects } from '@/data/projects'
import type { Project } from '@/types/project'

/**
 * Node positions, sizes and orbital speeds, derived from project data
 * (PLAN.md 3.1, 3.3 — DESIGN.md §2).
 *
 * Every value here is a consequence of something the project record already
 * says. Nothing is placed by hand. That is the site's whole argument applied to
 * itself: a portfolio claiming systems should act only on evidence cannot be
 * built on twelve typed coordinate triples that mean nothing.
 *
 * The axes, and what each encodes:
 *
 * | Axis   | Encodes        | Derived from                                  |
 * |--------|----------------|-----------------------------------------------|
 * | radius | maturity       | `status` + whether a public link resolves      |
 * | angle  | chronology     | `started`, oldest first, read clockwise        |
 * | size   | evidence depth | `weight` + metrics + milestones + artifacts    |
 * | speed  | recency        | `status`                                       |
 * | height | origin         | work above the plane, personal below           |
 *
 * Adding a project adds a record. It does not touch this file.
 */

/** Schematic radii. True-scale is 3.6; this is the compressed, legible mode. */
const INNER_RADIUS = 4.2
const OUTER_RADIUS = 13.5

/**
 * The ring stops short of a full turn. At 360° the newest project sits next to
 * the oldest, which reads as adjacency rather than as a year and a half apart.
 * The gap is the seam, and it points at the camera's start.
 */
const ARC_DEGREES = 320
const ARC_START_DEGREES = 110

const MIN_NODE_RADIUS = 0.09
const MAX_NODE_RADIUS = 0.36

/** Peak vertical displacement. Small: this is a tilt, not a second axis. */
const MAX_HEIGHT = 1.6

export interface DerivedNode {
  position: THREE.Vector3
  /** Sphere radius in world units. */
  radius: number
  /** Orbital angle in radians, for 3.2's per-instance shader phase. */
  angle: number
  /** Distance from the star. */
  orbitRadius: number
  /** Radians per second. Zero means visibly still. */
  speed: number
  /** 0–1 composite feeding label priority (3.7). */
  magnitude: number
  maturity: number
  evidence: number
}

/**
 * How finished and how real. Shipped-and-reachable sits closest to the star;
 * exploration sits far out.
 *
 * A live link counts because it is the difference between a claim and a thing a
 * stranger can open — which is the same standard the rest of the site is held
 * to. `oncoverse` has never deployed and its links panel is deliberately empty,
 * so it stays out at the rim, correctly.
 */
function maturityOf(project: Project): number {
  const byStatus: Record<Project['status'], number> = {
    complete: 0.8,
    active: 0.7,
    'in-progress': 0.45,
    experience: 0.3,
  }
  const hasPublicLink = Boolean(
    project.links.liveUI ?? project.links.liveAPI ?? project.links.github,
  )
  return Math.min(1, byStatus[project.status] + (hasPublicLink ? 0.2 : 0))
}

/**
 * How much can actually be proven. `weight` is the author's judgement; the
 * counts are the receipts, and they are capped so a project cannot inflate
 * itself purely by listing more bullet points.
 */
function evidenceOf(project: Project): number {
  const byWeight: Record<Project['weight'], number> = {
    flagship: 0.62,
    major: 0.42,
    minor: 0.24,
  }
  const metrics = project.panels.proof.metrics?.length ?? 0
  const milestones = project.panels.proof.milestones?.length ?? 0
  const artifacts = project.artifacts?.length ?? 0
  const images = project.images?.length ?? 0
  const receipts = Math.min(1, (metrics + milestones + artifacts + images) / 8)
  return Math.min(1, byWeight[project.weight] + receipts * 0.38)
}

/** Motion means attention. A dormant project is nearly still, and that is true. */
function speedOf(project: Project): number {
  const bySttatus: Record<Project['status'], number> = {
    active: 0.055,
    'in-progress': 0.032,
    complete: 0.011,
    experience: 0.004,
  }
  return bySttatus[project.status]
}

/** `YYYY-MM` → sortable integer. */
function startedKey(project: Project): number {
  const [year, month] = project.started.split('-')
  return Number(year) * 12 + Number(month)
}

function derive(): Map<string, DerivedNode> {
  const chronological = [...projects].sort((a, b) => startedKey(a) - startedKey(b))
  const lastIndex = Math.max(1, chronological.length - 1)
  const result = new Map<string, DerivedNode>()

  chronological.forEach((project, index) => {
    const maturity = maturityOf(project)
    const evidence = evidenceOf(project)

    // Even angular spacing, not proportional to elapsed time. Real gaps between
    // starts are wildly uneven and a time-proportional ring would bunch eight
    // projects into one arc and leave the rest empty — unreadable, and the
    // schematic/true toggle in 3.6 is where honest spacing gets to live.
    const t = index / lastIndex
    const angle = THREE.MathUtils.degToRad(ARC_START_DEGREES + t * ARC_DEGREES)

    const orbitRadius = THREE.MathUtils.lerp(OUTER_RADIUS, INNER_RADIUS, maturity)
    const height = (project.origin === 'work' ? 1 : -1) * evidence * MAX_HEIGHT

    result.set(project.id, {
      position: new THREE.Vector3(
        Math.cos(angle) * orbitRadius,
        height,
        Math.sin(angle) * orbitRadius,
      ),
      radius: THREE.MathUtils.lerp(MIN_NODE_RADIUS, MAX_NODE_RADIUS, evidence),
      angle,
      orbitRadius,
      speed: speedOf(project),
      // Bright things are near and well-evidenced. Used for label priority, so
      // the labels that appear first are the ones worth reading first.
      magnitude: THREE.MathUtils.clamp(evidence * 0.65 + maturity * 0.35, 0, 1),
      maturity,
      evidence,
    })
  })

  return result
}

export const nodeLayout: Map<string, DerivedNode> = derive()

/**
 * Throws rather than returning a fallback: a missing entry means a project
 * exists that the derivation did not see, and a silently placed node at the
 * origin is exactly the meaningless decoration this file exists to remove.
 */
export function layoutFor(projectId: string): DerivedNode {
  const node = nodeLayout.get(projectId)
  if (!node) throw new Error(`No derived layout for project "${projectId}"`)
  return node
}
