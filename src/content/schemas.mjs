import { z } from 'astro/zod'

const httpsUrl = z.string().url().refine((value) => value.startsWith('https://'), {
  message: 'Public links must use HTTPS.',
})

const sourceSchema = z.object({
  kind: z.enum(['repository', 'artifact', 'command', 'owner-record', 'public-url']),
  locator: z.string().min(3),
  revision: z.string().min(7).optional(),
  public: z.boolean(),
})

export const claimSchema = z.object({
  wording: z.string().min(8),
  display: z.string().min(1),
  context: z.string().min(8),
  denominator: z.string().min(1),
  verifiedAt: z.coerce.date(),
  asOf: z.coerce.date().optional(),
  status: z.enum(['verified', 'blocked', 'retired']),
  publish: z.boolean(),
  sources: z.array(sourceSchema).min(1),
}).superRefine((claim, context) => {
  if (claim.publish && claim.status !== 'verified') {
    context.addIssue({ code: 'custom', path: ['publish'], message: 'Only verified claims may be public.' })
  }
})

const measurementSchema = z.object({
  claimIds: z.array(z.string().min(3)),
  absence: z.string().min(12).optional(),
}).superRefine((measurement, context) => {
  if (measurement.claimIds.length === 0 && !measurement.absence) {
    context.addIssue({ code: 'custom', message: 'Measurement needs a claim or an honest absence.' })
  }
})

const caseStudySchema = z.object({
  thesis: z.string().min(20),
  credit: z.object({
    organization: z.string().min(2),
    role: z.string().min(2),
    contribution: z.string().min(20),
  }),
  intendedUser: z.string().min(20),
  demo: z.object({
    src: z.string().startsWith('/'),
    poster: z.string().startsWith('/'),
    durationLabel: z.string().min(3),
    caption: z.string().min(20),
  }),
  workflow: z.array(z.object({
    title: z.string().min(2),
    description: z.string().min(20),
    media: z.string().startsWith('/'),
    alt: z.string().min(20),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })).min(3),
  research: z.array(z.object({
    source: z.string().min(2),
    finding: z.string().min(20),
    changed: z.string().min(20),
  })).min(3),
  decisions: z.array(z.object({
    decision: z.string().min(12),
    rejected: z.string().min(12),
    tradeoff: z.string().min(20),
  })).min(2),
  failures: z.array(z.object({
    title: z.string().min(4),
    symptom: z.string().min(20),
    cause: z.string().min(20),
    correction: z.string().min(20),
    remainingRisk: z.string().min(12),
  })).min(2),
  limitations: z.array(z.string().min(20)).min(2),
  future: z.array(z.object({
    status: z.enum(['planned', 'investigating', 'blocked']),
    title: z.string().min(4),
    detail: z.string().min(20),
  })).min(2),
  sources: z.array(z.object({
    label: z.string().min(3),
    locator: z.string().min(3),
    public: z.boolean(),
  })).min(2),
})

export const workSchema = z.object({
  title: z.string().min(2),
  order: z.number().int().min(1),
  tier: z.enum(['flagship', 'major', 'minor']),
  effort: z.enum(['flagship', 'substantial', 'focused']),
  status: z.enum(['live', 'shipped', 'in-progress', 'running', 'take-home']),
  started: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  startedSource: sourceSchema.optional(),
  audience: z.array(z.enum(['employer', 'client'])).min(1),
  summary: z.string().min(20),
  arrival: z.object({ sentence: z.string().min(12) }),
  whatItIs: z.array(z.string().min(12)).min(2).max(4),
  problem: z.array(z.string().min(12)).min(1),
  architecture: z.object({
    decision: z.string().min(12),
    paragraphs: z.array(z.string().min(12)).min(1),
  }),
  measurement: measurementSchema,
  boundary: z.object({
    will: z.array(z.string().min(8)).min(1),
    refuses: z.array(z.string().min(8)).min(1),
  }),
  whatBroke: z.object({
    title: z.string().min(4),
    paragraphs: z.array(z.string().min(12)).min(1),
    noteSlug: z.string().min(3).optional(),
  }),
  stackAndLinks: z.object({
    stack: z.array(z.string().min(1)).min(1),
    links: z.array(z.object({
      label: z.string().min(2),
      kind: z.enum(['live', 'repository', 'demo', 'paper']),
      url: httpsUrl,
      verifiedAt: z.coerce.date(),
    })),
  }),
  next: z.object({ slug: z.string().min(2), label: z.string().min(2) }),
  world: z.object({
    story: z.string().min(20),
    dataSources: z.array(z.string().min(3)).min(1),
    storyboardStatus: z.enum(['specced', 'prototyped']),
    motionDeferred: z.literal(true),
  }),
  caseStudy: caseStudySchema.optional(),
  claimRefs: z.array(z.string().min(3)),
}).superRefine((work, context) => {
  if (work.started && !work.startedSource) {
    context.addIssue({ code: 'custom', path: ['startedSource'], message: 'A public start date needs a source.' })
  }
})

export const noteSchema = z.object({
  title: z.string().min(4),
  type: z.enum(['erratum', 'post']),
  publishedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  summary: z.string().min(12),
  relatedProjects: z.array(z.string()),
  claimRefs: z.array(z.string().min(3)),
  sources: z.array(sourceSchema).min(1),
  state: z.enum(['draft', 'published']),
})

export const experienceSchema = z.object({
  role: z.string().min(2),
  organization: z.string().min(2),
  location: z.string().min(2),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  current: z.boolean(),
  summary: z.string().min(12),
  highlights: z.array(z.string().min(8)).min(1),
  source: sourceSchema,
})

export const serviceSchema = z.object({
  order: z.number().int().min(1),
  title: z.string().min(4),
  outcome: z.string().min(12),
  scope: z.array(z.string().min(8)).min(1),
  boundaries: z.array(z.string().min(8)).min(1),
  evidenceProjects: z.array(z.string().min(2)).min(1),
})

export const siteCopySchema = z.object({
  home: z.object({
    hero: z.string().min(20),
    employerDoor: z.object({ label: z.string(), href: z.literal('/work'), note: z.string() }),
    clientDoor: z.object({ label: z.string(), href: z.literal('/hire'), note: z.string() }),
    intro: z.array(z.string().min(12)).min(1),
  }),
  work: z.object({
    heading: z.string(),
    intro: z.string().min(12),
    sortLabels: z.array(z.enum(['Featured', 'Build effort', 'Most recent'])).length(3),
    activeFilterLabel: z.literal('Active now'),
  }),
  notes: z.object({
    heading: z.string(),
    intro: z.string().min(12),
    filters: z.array(z.enum(['All', 'What went wrong', 'Writing'])).length(3),
    writingEmpty: z.string().min(8),
  }),
  about: z.object({ heading: z.string(), paragraphs: z.array(z.string().min(12)).min(2) }),
  resume: z.object({ heading: z.string(), intro: z.string().min(12), downloadLabel: z.string() }),
  hire: z.object({ heading: z.string(), intro: z.string().min(12), contactLabel: z.string() }),
})

export { httpsUrl, sourceSchema }
