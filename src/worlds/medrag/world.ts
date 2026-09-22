import { mountScrollScenes, restoreWorldFocus } from '../shared/lifecycle'

/**
 * MedRAG / The Theatre of an Answer. Choreography ported unchanged from the approved study
 * (design/directions/medrag-world.js); every caption now reads the recorded counts from the
 * page's data block instead of repeating them as literals.
 */
type Query = { id: number; retrieved: number; cited: number; refused: boolean }
type Payload = { queries: [Query, Query]; evaluation: { questions: number; refused: number } }

const readPayload = (): Payload | undefined => {
  try {
    return JSON.parse(document.querySelector('#medrag-world-data')?.textContent ?? '') as Payload
  } catch {
    return undefined
  }
}

const payload = readPayload()
if (payload) start(payload)
restoreWorldFocus()

function start({ queries: [answered, withheld], evaluation }: Payload) {
  const $ = <T extends Element = HTMLElement>(selector: string) => document.querySelector(selector) as T
  const pieces = [...document.querySelectorAll<SVGGElement>('.scenic-piece')]
  const clamp = (x: number) => Math.max(0, Math.min(1, x))
  const ease = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x) }
  let query = answered.id
  const selected = () => (query === withheld.id ? withheld : answered)
  const outcome = (record: Query) => `${record.cited} cited / ${record.refused ? 'refused' : 'not refused'}`
  const captions = [
    'The theatre of an answer',
    'A bounded collection. The curtain opens.',
    `Query ${answered.id} / ${answered.retrieved} retrieved chunks`,
    `Query ${answered.id} / ${answered.retrieved} retrieved / ${outcome(answered)}`,
    'Two records. Two endings.',
    `Query ${withheld.id} / ${withheld.retrieved} retrieved chunks`,
    `Query ${withheld.id} / ${withheld.cited} cited / refusal recorded`,
    `${evaluation.refused} refusals / ${evaluation.questions} recorded queries`,
  ]
  const leftCurtain = $('.curtain-left')
  const rightCurtain = $('.curtain-right')
  const answerForm = $<SVGGElement>('.answer-form')
  const citationLines = $<SVGGElement>('.citation-lines')
  const stageLight = $('.stage-light')
  const note = $('#visual-state')
  const result = $('.interaction-result')

  const scenes = mountScrollScenes({
    paint(i, p, reduced) {
      const open = reduced ? 1 : i === 0 ? ease((p - 0.15) / 0.75) : 1
      leftCurtain.style.transform = `translateX(${-open * 102}%) skewY(${-open * 5}deg)`
      rightCurtain.style.transform = `translateX(${open * 102}%) skewY(${open * 5}deg)`
      const arrival = i === 2 ? ease(p * 1.6) : i > 2 ? 1 : 0
      const refused = i === 6 || i === 7 || (i === 4 && query === withheld.id)
      pieces.forEach((element, n) => {
        const side = n < 4 ? -1 : 1
        const rank = n % 4
        const entry = i === 2 ? ease((p - rank * 0.08) * 1.7) : arrival
        const retreat = refused ? (i === 6 ? ease(p * 2) : 1) : 0
        const x = 250 + rank * 230 + (n >= 4 ? 35 : 0)
        const y = n < 4 ? 320 : 490
        element.setAttribute('transform', `translate(${x + side * retreat * 350},${y - (1 - entry) * (850 + n * 30)}) rotate(${side * (1 - entry) * 24 + side * retreat * 10}) scale(${0.68 - retreat * 0.13})`)
        element.style.opacity = String(entry * (1 - retreat * 0.7))
      })
      const answer = i === 3 ? ease(p * 2) : i === 4 && query === answered.id ? 1 : 0
      answerForm.style.opacity = String(answer)
      answerForm.setAttribute('transform', `translate(0,${(1 - answer) * 160})`)
      citationLines.style.opacity = String(answer)
      stageLight.style.opacity = refused ? '1' : '.4'
      note.textContent = i === 4 ? `Query ${selected().id} / ${selected().retrieved} retrieved / ${outcome(selected())}` : captions[i]
    },
  })

  document.querySelectorAll<HTMLButtonElement>('[data-query]').forEach((button) => button.addEventListener('click', () => {
    query = Number(button.dataset.query)
    document.querySelectorAll('[data-query]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)))
    const record = selected()
    result.textContent = `Query ${record.id}: ${record.retrieved} retrieved, ${record.cited} cited. ${record.refused ? 'Refused.' : 'Not refused.'}`
    scenes.refresh()
  }))
}
