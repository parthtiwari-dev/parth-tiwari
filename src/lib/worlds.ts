import type { CollectionEntry } from 'astro:content'
import { beatMindWorldDataV1Schema } from '../content/schemas.mjs'
import beatMindWorldDataSource from '../data/worlds/beatmind-world-v1.json'

export type WorldEntry = CollectionEntry<'worlds'>
export type BeatMindWorldDataV1 = ReturnType<typeof beatMindWorldDataV1Schema.parse>

const worldDataByArtifact: Record<string, unknown> = {
  'beatmind-world-v1.json': beatMindWorldDataSource,
}

export function publishedWorldHref(projectSlug: string, worlds: WorldEntry[]): string | undefined {
  const world = worlds.find((entry) => entry.data.projectSlug === projectSlug && entry.data.published)
  return world ? `/work/${projectSlug}/world/` : undefined
}

export function projectDoorHref(project: CollectionEntry<'work'>, worlds: WorldEntry[]): string | undefined {
  return publishedWorldHref(project.id, worlds) ?? (project.data.caseStudy ? `/work/${project.id}/` : undefined)
}

export function loadValidatedWorldData(world: WorldEntry): BeatMindWorldDataV1 {
  const source = worldDataByArtifact[world.data.dataArtifact]
  if (!source) throw new Error(`No build-time world artifact is registered for ${world.data.dataArtifact}.`)
  if (world.data.projectSlug !== 'beatmind') throw new Error(`No versioned world-data schema exists for ${world.data.projectSlug}.`)
  return beatMindWorldDataV1Schema.parse(source)
}
