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
  claimRefs: ['claim-one'],
}

assert.equal(workSchema.safeParse(validWork).success, true, 'valid work fixture must pass')
assert.equal(claimSchema.safeParse(validClaim).success, true, 'valid claim fixture must pass')

const missingBeat = structuredClone(validWork)
delete missingBeat.boundary
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
