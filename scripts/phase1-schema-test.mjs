import assert from 'node:assert/strict'
import { claimSchema, workSchema } from '../src/content/schemas.mjs'

const source = { kind: 'artifact', locator: 'repo/path/file.json', public: false }
const validClaim = {
  wording: 'A measured result with clear context.',
  display: 'measured result',
  context: 'A bounded internal evaluation.',
  denominator: 'one fixed evaluation set',
  verifiedAt: '2026-08-28',
  status: 'verified',
  publish: true,
  sources: [source],
}

const validWork = {
  title: 'Project', order: 1, tier: 'major', effort: 'substantial', status: 'shipped',
  audience: ['employer'], summary: 'A sufficiently specific project summary for validation.',
  arrival: { sentence: 'A complete and readable arrival sentence.' },
  whatItIs: ['A complete plain-language explanation.', 'A second complete explanatory sentence.'],
  problem: ['A concrete problem that the project had to solve.'],
  architecture: { decision: 'Keep authority outside the generated response.', paragraphs: ['A complete architecture explanation lives here.'] },
  measurement: { claimIds: ['claim-one'] },
  boundary: { will: ['Show supported evidence.'], refuses: ['Invent unsupported evidence.'] },
  whatBroke: { title: 'A real failure', paragraphs: ['A complete account of what broke and why.'] },
  stackAndLinks: { stack: ['TypeScript'], links: [{ label: 'Repository', kind: 'repository', url: 'https://example.com/repo', verifiedAt: '2026-08-28' }] },
  next: { slug: 'next-project', label: 'Next project' },
  world: { story: 'A complete data-led scroll story for a later phase.', dataSources: ['evaluation artifact'], storyboardStatus: 'specced', motionDeferred: true },
  caseStudy: {
    thesis: 'A specific project thesis that explains the complete product argument.',
    credit: { organization: 'Organization', role: 'Engineer', contribution: 'I designed and built the complete implementation end to end.' },
    intendedUser: 'A clearly defined person with a real need for this product workflow.',
    demo: { src: '/media/demo.webm', poster: '/media/poster.jpg', durationLabel: '10-second capture', caption: 'A real product capture with an honest explanation of what it proves.' },
    workflow: [
      { title: 'Start', description: 'A complete description of the first product workflow step.', media: '/media/one.jpg', alt: 'A useful alternative for the first real product frame', width: 1600, height: 1000 },
      { title: 'Work', description: 'A complete description of the second product workflow step.', media: '/media/two.jpg', alt: 'A useful alternative for the second real product frame', width: 1600, height: 1000 },
      { title: 'Finish', description: 'A complete description of the third product workflow step.', media: '/media/three.jpg', alt: 'A useful alternative for the third real product frame', width: 1600, height: 1000 },
    ],
    research: Array.from({ length: 3 }, (_, index) => ({ source: `Source ${index}`, finding: 'A specific finding long enough to affect the product decision.', changed: 'A concrete product or engineering decision changed because of the finding.' })),
    decisions: Array.from({ length: 2 }, () => ({ decision: 'Use durable state for expensive work.', rejected: 'Keep one request open until completion.', tradeoff: 'The implementation grows, but recovery and visible state become truthful.' })),
    failures: Array.from({ length: 2 }, () => ({ title: 'Visible failure', symptom: 'The interface showed a result that did not match the committed state.', cause: 'Two independent defects hid each other during the original diagnosis.', correction: 'The complete path was traced and current state became explicit.', remainingRisk: 'New paths still need end-to-end checks.' })),
    limitations: ['The current model has one specific practical limit that remains visible.', 'The current pilot has not established broad adoption or scale evidence.'],
    future: [
      { status: 'planned', title: 'Next capability', detail: 'A concrete capability planned after the current evidence is stable.' },
      { status: 'blocked', title: 'Blocked capability', detail: 'A capability blocked until its required source data can be verified.' },
    ],
    sources: [
      { label: 'Private repository evidence', locator: 'private repository', public: false },
      { label: 'Public product evidence', locator: 'https://example.com', public: true },
    ],
  },
  claimRefs: ['claim-one'],
}

assert.equal(workSchema.safeParse(validWork).success, true, 'valid work fixture must pass')
assert.equal(claimSchema.safeParse(validClaim).success, true, 'valid claim fixture must pass')

const missingBeat = structuredClone(validWork)
delete missingBeat.caseStudy.failures
assert.equal(workSchema.safeParse(missingBeat).success, false, 'missing case-study beat must fail')

const missingSource = structuredClone(validClaim)
delete missingSource.sources
assert.equal(claimSchema.safeParse(missingSource).success, false, 'missing claim source must fail')

const invalidLink = structuredClone(validWork)
invalidLink.stackAndLinks.links[0].url = '/relative-link'
assert.equal(workSchema.safeParse(invalidLink).success, false, 'invalid public link must fail')

console.log('PASS schema rejects missing case-study beat')
console.log('PASS schema rejects missing claim source')
console.log('PASS schema rejects invalid public link shape')
