import type { ProjectLinks } from '@/types/project'

export interface ProjectLinkDefinition {
  key: keyof ProjectLinks
  label: string
  eyebrow: string
  description: string
}

export interface ResolvedProjectLink extends ProjectLinkDefinition {
  url: string
}

export const projectLinkDefinitions: ProjectLinkDefinition[] = [
  {
    key: 'github',
    label: 'GitHub',
    eyebrow: 'source',
    description: 'Repository, implementation notes, or public code surface.',
  },
  {
    key: 'liveUI',
    label: 'Live UI',
    eyebrow: 'demo',
    description: 'Interactive user-facing deployment.',
  },
  {
    key: 'liveAPI',
    label: 'Live API',
    eyebrow: 'api',
    description: 'Public API endpoint or hosted service surface.',
  },
  {
    key: 'apiDocs',
    label: 'API Docs',
    eyebrow: 'docs',
    description: 'Swagger, reference docs, or request examples.',
  },
  {
    key: 'demoVideo',
    label: 'Demo Video',
    eyebrow: 'watch',
    description: 'Walkthrough, screen capture, or product demo.',
  },
  {
    key: 'caseStudy',
    label: 'Case Study',
    eyebrow: 'write-up',
    description: 'Architecture note, evaluation write-up, or build story.',
  },
  {
    key: 'docs',
    label: 'Docs',
    eyebrow: 'notes',
    description: 'Public documentation or supporting project notes.',
  },
  {
    key: 'deployment',
    label: 'Deployment',
    eyebrow: 'ship',
    description: 'Deployment evidence, release page, or public artifact.',
  },
]

export function resolveProjectLinks(links: ProjectLinks): ResolvedProjectLink[] {
  return projectLinkDefinitions.flatMap((definition) => {
    const url = links[definition.key]

    if (!url) {
      return []
    }

    return [{ ...definition, url }]
  })
}
