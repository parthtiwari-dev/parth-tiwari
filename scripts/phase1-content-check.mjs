import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { claimSchema, educationSchema, experienceSchema, noteSchema, serviceSchema, siteCopySchema, workSchema } from '../src/content/schemas.mjs'

const root = process.cwd()

async function readJsonDirectory(relativeDirectory, schema) {
  const directory = path.join(root, relativeDirectory)
  const names = (await readdir(directory)).filter((name) => name.endsWith('.json')).sort()
  return Promise.all(names.map(async (name) => {
    const data = JSON.parse(await readFile(path.join(directory, name), 'utf8'))
    return { id: name.replace(/\.json$/, ''), data: schema.parse(data), raw: JSON.stringify(data) }
  }))
}

async function readMarkdownDirectory(relativeDirectory, schema) {
  const directory = path.join(root, relativeDirectory)
  const names = (await readdir(directory)).filter((name) => name.endsWith('.md')).sort()
  return Promise.all(names.map(async (name) => {
    const raw = await readFile(path.join(directory, name), 'utf8')
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
    assert(match, `${name} must use JSON frontmatter between --- markers`)
    return { id: name.replace(/\.md$/, ''), data: schema.parse(JSON.parse(match[1])), body: match[2], raw }
  }))
}

const claims = await readJsonDirectory('src/content/claims', claimSchema)
const work = await readMarkdownDirectory('src/content/work', workSchema)
const notes = await readMarkdownDirectory('src/content/notes', noteSchema)
const education = await readJsonDirectory('src/content/education', educationSchema)
const experience = await readJsonDirectory('src/content/experience', experienceSchema)
const services = await readJsonDirectory('src/content/services', serviceSchema)
const site = await readJsonDirectory('src/content/site', siteCopySchema)

assert.equal(work.length, 12, 'the register must contain all twelve projects')
assert.equal(education.length, 2, 'the profile must contain both verified education records')
assert.equal(new Set(work.map((entry) => entry.data.order)).size, 12, 'project order values must be unique')
assert(work.find((entry) => entry.id === 'beatmind')?.data.caseStudy, 'BeatMind must satisfy the Phase 2 case-study contract')

const workIds = new Set(work.map((entry) => entry.id))
const noteIds = new Set(notes.map((entry) => entry.id))
const claimMap = new Map(claims.map((entry) => [entry.id, entry.data]))

for (const entry of work) {
  assert(workIds.has(entry.data.next.slug), `${entry.id} points to missing next project ${entry.data.next.slug}`)
  if (entry.data.whatBroke.noteSlug) assert(noteIds.has(entry.data.whatBroke.noteSlug), `${entry.id} points to missing note`)
  assert.deepEqual(new Set(entry.data.measurement.claimIds), new Set(entry.data.claimRefs), `${entry.id} measurement and claimRefs must match`)
  for (const claimId of entry.data.claimRefs) {
    const claim = claimMap.get(claimId)
    assert(claim, `${entry.id} references missing claim ${claimId}`)
    assert.equal(claim.status, 'verified', `${entry.id} references non-verified claim ${claimId}`)
    assert.equal(claim.publish, true, `${entry.id} references unpublished claim ${claimId}`)
  }
}

for (const entry of notes) {
  for (const projectId of entry.data.relatedProjects) assert(workIds.has(projectId), `${entry.id} references missing project ${projectId}`)
  for (const claimId of entry.data.claimRefs) {
    const claim = claimMap.get(claimId)
    assert(claim?.status === 'verified' && claim.publish, `${entry.id} references unavailable claim ${claimId}`)
  }
  if (/\d/.test(entry.body)) assert(entry.data.claimRefs.length > 0, `${entry.id} contains a number without a claim reference`)
}

for (const service of services) {
  for (const projectId of service.data.evidenceProjects) assert(workIds.has(projectId), `${service.id} references missing evidence project ${projectId}`)
}

const publicText = [...work, ...notes, ...education, ...experience, ...services, ...site].map((entry) => entry.raw).join('\n')
assert.equal(publicText.includes('—'), false, 'user-facing content must not contain em dashes')

const publishedClaims = claims.filter((entry) => entry.data.publish)
console.log(`PASS ${work.length} project entries validate with all base beats`)
console.log('PASS BeatMind validates against the complete Phase 2 case-study contract')
console.log(`PASS ${notes.length} errata entries validate; general Posts remain empty by decision`)
console.log(`PASS ${publishedClaims.length} public quantitative claims resolve to verified source records`)
console.log(`PASS ${education.length} education, ${experience.length} experience and ${services.length} service records validate`)
console.log('PASS project, note, next-project, and evidence references resolve')
console.log('PASS user-facing content contains no em dash')
