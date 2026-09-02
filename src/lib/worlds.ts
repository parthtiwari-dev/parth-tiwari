import type { CollectionEntry } from 'astro:content'
import { beatMindWorldDataV1Schema, vividWorldDataV1Schema } from '../content/schemas.mjs'
import beatMindWorldDataSource from '../data/worlds/beatmind-world-v1.json'
import vividWorldDataSource from '../data/worlds/vivid-world-v1.json'

export type WorldEntry = CollectionEntry<'worlds'>
export type BeatMindWorldDataV1 = ReturnType<typeof beatMindWorldDataV1Schema.parse>
export type VividWorldDataV1 = ReturnType<typeof vividWorldDataV1Schema.parse>
export type ValidatedWorldData =
  | { kind: 'beatmind'; data: BeatMindWorldDataV1 }
  | { kind: 'vivid'; data: VividWorldDataV1 }

const worldDataByArtifact: Record<string, unknown> = {
  'beatmind-world-v1.json': beatMindWorldDataSource,
  'vivid-world-v1.json': vividWorldDataSource,
}

export function publishedWorldHref(projectSlug: string, worlds: WorldEntry[]): string | undefined {
  const world = worlds.find((entry) => entry.data.projectSlug === projectSlug && entry.data.published)
  return world ? `/work/${projectSlug}/world/` : undefined
}

export function projectDoorHref(project: CollectionEntry<'work'>, worlds: WorldEntry[]): string | undefined {
  return publishedWorldHref(project.id, worlds) ?? (project.data.caseStudy ? `/work/${project.id}/` : undefined)
}

export function loadValidatedWorldData(world: WorldEntry): ValidatedWorldData {
  const source = worldDataByArtifact[world.data.dataArtifact]
  if (!source) throw new Error(`No build-time world artifact is registered for ${world.data.dataArtifact}.`)
  if (world.data.projectSlug === 'beatmind') return { kind: 'beatmind', data: beatMindWorldDataV1Schema.parse(source) }
  if (world.data.projectSlug === 'vivid') return { kind: 'vivid', data: vividWorldDataV1Schema.parse(source) }
  throw new Error(`No versioned world-data schema exists for ${world.data.projectSlug}.`)
}
