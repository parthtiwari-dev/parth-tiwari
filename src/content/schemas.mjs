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

const worldAudioSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('withheld'), explanation: z.string().min(20) }),
  z.object({
    status: z.literal('published'),
    source: z.string().min(3),
    licenceRecord: z.string().min(8),
    excerptUrl: z.string().startsWith('/'),
    durationSeconds: z.number().positive(),
  }),
])

export const worldSchema = z.object({
  projectSlug: z.string().min(2),
  published: z.boolean(),
  reviewedAt: z.coerce.date(),
  selectedTreatment: z.string().min(4),
  staticFrame: z.object({
    src: z.string().startsWith('/'),
    alt: z.string().min(24),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  scenes: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    label: z.string().min(3),
    heading: z.string().min(8),
    narration: z.string().min(20),
  })).min(3),
  accents: z.object({
    primary: z.string().regex(/^#[0-9a-f]{6}$/i),
    secondary: z.string().regex(/^#[0-9a-f]{6}$/i),
    fault: z.string().regex(/^#[0-9a-f]{6}$/i),
  }),
  dataArtifact: z.string().regex(/^[a-z0-9-]+\.json$/),
  audio: worldAudioSchema,
  sourceAudit: z.array(z.object({
    label: z.string().min(3),
    revision: z.string().min(7),
  })).min(1),
})

const envelopeSchema = z.object({
  rms: z.array(z.number().min(0).max(1)).length(256),
  peak: z.array(z.number().min(0).max(1)).length(256),
})

export const beatMindWorldDataV1Schema = z.object({
  version: z.literal(1),
  project: z.literal('beatmind'),
  reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  exportedAt: z.string().datetime(),
  sourceAudit: z.object({ repository: z.literal('BeatMind'), commit: z.string().regex(/^[0-9a-f]{7,40}$/i) }),
  analysis: z.object({
    durationSeconds: z.number().positive(),
    bpm: z.number().positive(),
    key: z.string().min(2),
    downbeatTimes: z.array(z.number().nonnegative()).min(2),
    sections: z.array(z.object({
      index: z.number().int().nonnegative(),
      label: z.string().min(1),
      startSeconds: z.number().nonnegative(),
      endSeconds: z.number().positive(),
      barCount: z.number().int().nonnegative().nullable(),
    })).min(1),
  }),
  envelopes: z.object({
    source: envelopeSchema,
    vocals: envelopeSchema,
    backing_vocals: envelopeSchema,
    drums: envelopeSchema,
    bass: envelopeSchema,
    other: envelopeSchema,
  }),
  trace: z.discriminatedUnion('available', [
    z.object({ available: z.literal(false), reason: z.string().min(20) }),
    z.object({ available: z.literal(true), stages: z.array(z.object({
      state: z.enum(['failed', 'recovered']),
      type: z.string().min(2),
      stage: z.string().min(2),
    })).length(2) }),
  ]),
})

const vividFrameSchema = z.object({
  src: z.string().startsWith('/'),
  alt: z.string().min(24),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  label: z.string().min(3),
  continuityNote: z.string().min(12),
})

/**
 * A deliberately small, publication-only export.  Prompts, seeds, run IDs,
 * and raw evaluator material never belong in the portfolio build.
 */
export const vividWorldDataV1Schema = z.object({
  version: z.literal(1),
  project: z.literal('vivid'),
  reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sourceAudit: z.object({ repository: z.literal('Vivid'), commit: z.string().regex(/^[0-9a-f]{7,40}$/i) }),
  portfolioUse: z.object({
    ownerCleared: z.literal(true),
    sequenceLabel: z.string().min(12),
    commercialModelLicence: z.literal('unresolved'),
    licenceBoundary: z.string().min(20),
  }),
  plan: z.array(z.object({
    label: z.string().min(3),
    detail: z.string().min(12),
  })).min(3).max(6),
  characterAnchor: vividFrameSchema,
  frames: z.array(vividFrameSchema).length(4),
  evaluation: z.object({
    baselineClaim: z.string().min(3),
    rejectedTurboClaim: z.string().min(3),
    rejectedLabel: z.string().min(12),
  }),
  failureEvidence: z.object({
    status: z.literal('visual-comparison-unavailable'),
    explanation: z.string().min(24),
  }),
})

/**
 * Tathya reads one committed, sanitized snapshot of the record. `provenance`
 * is the guard: a 'placeholder' artifact can be committed while the world is
 * built, but the world entry stays `published: false` and the gate refuses to
 * pass until a real 'committed-export' from the Tathya repo replaces it.
 * Raw source URLs, publisher names and real subject text never belong here.
 */
const tathyaCaseFileSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(2),
  sourceCount: z.number().int().positive(),
  composition: z.object({
    official: z.number().int().nonnegative(),
    media: z.number().int().nonnegative(),
    citizen: z.number().int().nonnegative(),
  }),
  claimCount: z.number().int().nonnegative(),
  citedClaimCount: z.number().int().nonnegative(),
  status: z.literal('open'),
}).superRefine((file, context) => {
  const parts = file.composition.official + file.composition.media + file.composition.citizen
  if (parts !== file.sourceCount) {
    context.addIssue({ code: 'custom', message: `caseFile ${file.id} composition sums to ${parts}, not sourceCount ${file.sourceCount}.` })
  }
  if (file.citedClaimCount > file.claimCount) {
    context.addIssue({ code: 'custom', message: `caseFile ${file.id} has more cited claims than claims.` })
  }
})

export const tathyaWorldDataV1Schema = z.object({
  version: z.literal(1),
  project: z.literal('tathya'),
  provenance: z.enum(['committed-export', 'placeholder']),
  reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sourceAudit: z.object({ repository: z.literal('Tathya'), commit: z.string().regex(/^[0-9a-f]{7,40}$/i) }),
  snapshot: z.object({
    takenAt: z.string().min(4),
    meaning: z.string().min(20),
  }),
  sourceTypes: z.tuple([z.literal('official'), z.literal('media'), z.literal('citizen')]),
  caseFiles: z.array(tathyaCaseFileSchema).min(2).max(8),
  sharedSources: z.array(z.object({
    sourceType: z.enum(['official', 'media', 'citizen']),
    fileIds: z.array(z.string().min(1)).length(2),
  })),
  conflicts: z.array(z.object({
    fileId: z.string().min(1),
    resolved: z.literal(false),
  })).min(1),
  silentFailure: z.object({
    present: z.literal(true),
    sourceLabel: z.string().min(6),
    explanation: z.string().min(20),
  }),
  corpusBenchmark: z.object({
    available: z.literal(false),
    reason: z.string().min(20),
  }),
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

const imageProofSchema = z.object({
  kind: z.literal('image'),
  src: z.string().startsWith('/'),
  alt: z.string().min(20),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  fit: z.enum(['cover', 'contain']).optional(),
})

const evidenceRecordSchema = z.object({
  kind: z.literal('record'),
  label: z.string().min(3),
  title: z.string().min(8),
  sourceLabel: z.string().min(8),
  rows: z.array(z.object({
    label: z.string().min(2),
    value: z.string().min(2),
    tone: z.enum(['default', 'pass', 'warn', 'blocked']).optional(),
  })).min(2).max(8),
})

const proofFrameSchema = z.discriminatedUnion('kind', [imageProofSchema, evidenceRecordSchema])

const demoProofSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('video'),
    src: z.string().startsWith('/'),
    poster: z.string().startsWith('/'),
    durationLabel: z.string().min(3),
    caption: z.string().min(20),
  }),
  imageProofSchema.extend({
    label: z.string().min(3),
    caption: z.string().min(20),
  }),
  evidenceRecordSchema.extend({
    caption: z.string().min(20),
  }),
])

const caseStudySchema = z.object({
  reviewedAt: z.coerce.date(),
  classification: z.string().min(4),
  thesis: z.string().min(20),
  credit: z.object({
    organization: z.string().min(2),
    role: z.string().min(2),
    contribution: z.string().min(20),
    contributionSummary: z.string().min(8),
  }),
  cover: z.object({
    proof: proofFrameSchema,
    labels: z.array(z.string().min(3)).length(2),
  }),
  headings: z.object({
    overview: z.string().min(20),
    problem: z.string().min(20),
    architectureCaption: z.string().min(12),
    evidence: z.string().min(20),
  }),
  intendedUser: z.string().min(20),
  demo: demoProofSchema,
  workflow: z.array(z.object({
    title: z.string().min(2),
    description: z.string().min(20),
    proof: proofFrameSchema,
  })).min(3),
  responsibilities: z.array(z.object({
    label: z.string().min(2),
    detail: z.string().min(20),
  })).min(2).max(4),
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
  architectureSteps: z.array(z.object({
    label: z.string().min(2),
    detail: z.string().min(12),
  })).min(3).max(5),
  failures: z.array(z.object({
    title: z.string().min(4),
    symptom: z.string().min(20),
    cause: z.string().min(20),
    correction: z.string().min(20),
    remainingRisk: z.string().min(12),
  })).min(2),
  limitations: z.array(z.string().min(20)).min(2),
  evidenceNote: z.string().min(20),
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
  relatedNoteLabel: z.string().min(8).optional(),
  ending: z.object({
    heading: z.string().min(16),
    body: z.string().min(20),
    contactLabel: z.string().min(8),
  }),
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
    storyboardStatus: z.enum(['specced', 'prototyped', 'built']),
    motionDeferred: z.boolean(),
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

export const educationSchema = z.object({
  institution: z.string().min(2),
  location: z.string().min(2),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}$/),
  credential: z.string().min(4),
  focus: z.string().min(2),
  note: z.string().min(12),
  source: sourceSchema,
})

export const resumeSchema = z.object({
  headline: z.string().min(8),
  location: z.string().min(2),
  summary: z.string().min(24),
  skillGroups: z.array(z.object({
    label: z.string().min(3),
    items: z.array(z.string().min(1)).min(2),
  })).min(3),
  projectIds: z.array(z.string().min(2)).min(3).max(6),
  reviewedAt: z.coerce.date(),
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
