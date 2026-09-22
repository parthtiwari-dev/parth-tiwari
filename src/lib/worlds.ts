import { getCollection, type CollectionEntry } from 'astro:content'
import { beatMindWorldDataV1Schema, tathyaWorldDataV1Schema, vividWorldDataV1Schema } from '../content/schemas.mjs'
import beatMindWorldDataSource from '../data/worlds/beatmind-world-v1.json'
import tathyaWorldDataSource from '../data/worlds/tathya-world-v1.json'
import vividWorldDataSource from '../data/worlds/vivid-world-v1.json'

export type WorldEntry = CollectionEntry<'worlds'>
export type BeatMindWorldDataV1 = ReturnType<typeof beatMindWorldDataV1Schema.parse>
export type VividWorldDataV1 = ReturnType<typeof vividWorldDataV1Schema.parse>
export type TathyaWorldDataV1 = ReturnType<typeof tathyaWorldDataV1Schema.parse>
export type ValidatedWorldData =
  | { kind: 'beatmind'; data: BeatMindWorldDataV1 }
  | { kind: 'vivid'; data: VividWorldDataV1 }
  | { kind: 'tathya'; data: TathyaWorldDataV1 }

/**
 * Worlds rendered by the shared `/work/[slug]/world/` route. Illustrated DOM/SVG worlds
 * each own `src/pages/work/<slug>/world.astro`, because a page receives the CSS of every
 * component it imports and their approved global styles must never meet on one page.
 */
export const sharedRouteWorldSlugs: ReadonlySet<string> = new Set(['beatmind', 'vivid', 'tathya'])

const worldDataByArtifact: Record<string, unknown> = {
  'beatmind-world-v1.json': beatMindWorldDataSource,
  'vivid-world-v1.json': vividWorldDataSource,
  'tathya-world-v1.json': tathyaWorldDataSource,
}

export function publishedWorldHref(projectSlug: string, worlds: WorldEntry[]): string | undefined {
  const world = worlds.find((entry) => entry.data.projectSlug === projectSlug && entry.data.published)
  return world ? `/work/${projectSlug}/world/` : undefined
}

export function projectDoorHref(project: CollectionEntry<'work'>, worlds: WorldEntry[]): string | undefined {
  return publishedWorldHref(project.id, worlds) ?? (project.data.caseStudy ? `/work/${project.id}/` : undefined)
}

export interface DedicatedWorldProps {
  project: CollectionEntry<'work'>
  world: WorldEntry
  claims: CollectionEntry<'claims'>[]
}

/**
 * `getStaticPaths` for a dedicated world page at `src/pages/work/<slug>/[world].astro`.
 * The route exists only while the world record is published, as on the shared route.
 */
export async function dedicatedWorldPaths(slug: string) {
  const [projects, worlds, claims] = await Promise.all([getCollection('work'), getCollection('worlds'), getCollection('claims')])
  const world = worlds.find((entry) => entry.data.projectSlug === slug && entry.data.published)
  if (!world) return []
  const project = projects.find((entry) => entry.id === slug && entry.data.caseStudy)
  if (!project) throw new Error(`Published world ${slug} has no published paper case study.`)
  return [{ params: { world: 'world' }, props: { project, world, claims } satisfies DedicatedWorldProps }]
}

/** A verified, publishable claim, or a build failure: world copy never shows an unverified number. */
export function requireClaim(claims: CollectionEntry<'claims'>[], id: string) {
  const claim = claims.find((entry) => entry.id === id)
  if (!claim || claim.data.status !== 'verified' || !claim.data.publish) throw new Error(`World claim ${id} is not verified and publishable.`)
  return claim
}

export function loadValidatedWorldData(world: WorldEntry): ValidatedWorldData {
  const source = worldDataByArtifact[world.data.dataArtifact]
  if (!source) throw new Error(`No build-time world artifact is registered for ${world.data.dataArtifact}.`)
  if (world.data.projectSlug === 'beatmind') return { kind: 'beatmind', data: beatMindWorldDataV1Schema.parse(source) }
  if (world.data.projectSlug === 'vivid') return { kind: 'vivid', data: vividWorldDataV1Schema.parse(source) }
  if (world.data.projectSlug === 'tathya') return { kind: 'tathya', data: tathyaWorldDataV1Schema.parse(source) }
  throw new Error(`No versioned world-data schema exists for ${world.data.projectSlug}.`)
}
