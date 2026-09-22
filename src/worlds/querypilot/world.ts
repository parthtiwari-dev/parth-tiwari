import { mountScrollScenes, restoreWorldFocus } from '../shared/lifecycle'

/**
 * QueryPilot / The Cartographer's Fold. Choreography ported unchanged from the approved
 * study (design/directions/querypilot-world.js). The ledger and captions read the committed
 * record and the verified core-benchmark counts from the page's data block.
 */
type Payload = {
  record: { id: string; attempts: number }
  ledger: { core: number; beforeCorrection: number; afterCorrection: number }
}

const readPayload = (): Payload | undefined => {
  try {
    return JSON.parse(document.querySelector('#querypilot-world-data')?.textContent ?? '') as Payload
  } catch {
    return undefined
  }
}

const payload = readPayload()
if (payload) start(payload)
restoreWorldFocus()

function start({ record, ledger: counts }: Payload) {
  const $ = <T extends Element = HTMLElement>(selector: string) => document.querySelector(selector) as T
  const all = <T extends Element = HTMLElement>(selector: string) => [...document.querySelectorAll<T>(selector)]
  const clamp = (x: number) => Math.max(0, Math.min(1, x))
  const ease = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x) }
  const proposal = $<SVGPathElement>('#proposal-route')
  const corrected = $<SVGPathElement>('#corrected-route')
  const proposalLength = proposal.getTotalLength()
  const correctedLength = corrected.getTotalLength()
  proposal.style.strokeDasharray = String(proposalLength)
  corrected.style.strokeDasharray = String(correctedLength)
  let angle = 0
  let attempt = record.attempts
  let intent = 'read'
  let ledger = 'after'
  const captions = ['A question waits at the edge.', `${record.id} / a recorded question`, 'Four names in the retrieved context.', 'A proposed route meets the checks.', 'First attempt: unsuccessful.', 'Three attempts. One recorded final statement.', 'The read-only boundary remains.', `${counts.afterCorrection} / ${counts.core} core executions.`, 'Execution is not semantic accuracy.']
  const atlas = $('.atlas')
  const foldWest = $('.fold-west')
  const foldEast = $('.fold-east')
  const rises = all<SVGGElement>('.district-rise')
  const labels = all<SVGGElement>('.map-label')
  const tiles = all<SVGRectElement>('.ledger-tile')
  const status = $('#map-status')

  const scenes = mountScrollScenes({
    paint(i, p, reduced) {
      const small = innerWidth <= 900
      const scale = small ? Math.min(innerWidth / 1070, innerHeight * 0.41 / 760) : Math.min(innerWidth * 0.7 / 960, innerHeight * 0.72 / 640)
      const open = i === 0 ? ease((p - 0.05) / 0.8) : 1
      const tilt = i === 0 ? 28 - open * 8 : i === 7 ? 4 : i === 8 ? 12 : 20
      const yaw = i === 7 ? 0 : i === 8 ? -4 : -12 + angle * 0.4
      const x = small ? 0 : innerWidth * 0.17
      atlas.style.transform = reduced ? 'translate(-50%,-50%)' : `translate(-50%,-50%) translateX(${x}px) rotateX(${tilt}deg) rotateZ(${yaw}deg) scale(${scale})`
      foldWest.style.transform = `rotateY(${-open * 165}deg)`
      foldEast.style.transform = `rotateY(${open * 165}deg)`
      foldWest.style.opacity = String(1 - ease((open - 0.75) * 4))
      foldEast.style.opacity = String(1 - ease((open - 0.75) * 4))
      const rise = i < 2 ? (i === 1 ? ease(p * 1.7) : 0) : 1
      rises.forEach((element, n) => {
        const r = i === 1 ? ease((p - n * 0.08) * 1.7) : rise
        element.style.transform = `scaleY(${0.04 + r * 0.96})`
        element.style.opacity = String(0.18 + r * 0.82)
      })
      labels.forEach((element) => { element.style.opacity = i >= 1 ? '1' : '0' })
      $<SVGGElement>('.city').style.opacity = i >= 7 ? '0' : '1'
      $<SVGGElement>('.survey').style.opacity = i >= 7 ? '.3' : '1'
      $<SVGGElement>('.routes').style.opacity = i >= 7 ? '0' : '1'
      const progress = i === 2 ? ease(p) * 0.3 : i === 3 ? 0.3 + ease(p) * 0.43 : i === 4 ? 0.73 : i >= 5 ? 1 : 0
      let repaired = i === 5 ? ease(p * 1.7) : i >= 6 ? 1 : 0
      if (i === 5 && attempt !== record.attempts) repaired = attempt === 1 ? 0 : 0.42
      proposal.style.strokeDashoffset = String(proposalLength * (1 - progress))
      proposal.style.opacity = i >= 5 ? '.15' : '1'
      corrected.style.strokeDashoffset = String(correctedLength * (1 - repaired))
      $<SVGRectElement>('.broken-gap').style.opacity = i >= 4 ? '1' : '0'
      $<SVGGElement>('.fracture').style.opacity = String(i === 4 ? ease(p * 2) : i === 5 && attempt === 1 ? 1 : 0)
      const path = i >= 5 ? corrected : proposal
      const t = i >= 5 ? repaired : progress
      const point = path.getPointAtLength(t * path.getTotalLength())
      const previous = path.getPointAtLength(Math.max(0, t * path.getTotalLength() - 2))
      const heading = Math.atan2(point.y - previous.y, point.x - previous.x) * 180 / Math.PI
      const traveller = $<SVGGElement>('.traveller')
      traveller.setAttribute('transform', `translate(${point.x},${point.y}) rotate(${heading})`)
      traveller.style.opacity = i >= 2 && i <= 6 ? '1' : '0'
      $<SVGPathElement>('.gate-bar').style.opacity = i === 6 && intent === 'read' ? '.15' : '1'
      $<SVGGElement>('.database-gate').style.opacity = i === 6 && intent === 'write' ? '1' : '.85'
      $<SVGGElement>('.ledger-grid').style.opacity = i === 7 ? '1' : '0'
      tiles.forEach((element, n) => {
        const recovered = n >= counts.beforeCorrection && n < counts.afterCorrection
        const filled = n < counts.beforeCorrection || (ledger === 'after' && n < counts.afterCorrection)
        element.style.fill = filled ? (recovered ? '#b8472c' : '#315674') : 'none'
        element.style.stroke = filled ? (recovered ? '#b8472c' : '#315674') : '#73818a'
        element.style.transform = i === 7 ? `translateY(${(1 - ease(p * 2 - n * 0.006)) * 40}px)` : 'none'
      })
      $<SVGGElement>('.arrival-stamp').style.opacity = String(i === 8 ? ease(p * 2) : 0)
      status.textContent = i === 5
        ? attempt === record.attempts ? `Attempt ${record.attempts} / execution succeeded` : attempt === 1 ? 'First attempt / unsuccessful' : 'Intermediate SQL not preserved'
        : i === 6
          ? intent === 'read' ? 'Read-only intent / remaining checks still apply' : 'Destructive intent / blocked in illustration'
          : i === 7 ? `${ledger === 'after' ? counts.afterCorrection : counts.beforeCorrection} / ${counts.core} core executions` : captions[i]
    },
  })

  $<HTMLInputElement>('#atlas-angle').addEventListener('input', (event) => {
    angle = Number((event.target as HTMLInputElement).value)
    scenes.refresh()
  })
  all<HTMLButtonElement>('[data-table]').forEach((button) => button.addEventListener('click', () => {
    all('[data-table]').forEach((element) => element.setAttribute('aria-pressed', String(element === button)))
    all<SVGGElement>('.district').forEach((element) => element.classList.toggle('is-selected', element.dataset.district === button.dataset.table))
    $('.table-result').textContent = `${button.dataset.table}: present in the retrieved schema context for ${record.id}. Position and architecture are illustrative.`
    scenes.refresh()
  }))
  all<HTMLButtonElement>('[data-attempt]').forEach((button) => button.addEventListener('click', () => {
    attempt = Number(button.dataset.attempt)
    all('[data-attempt]').forEach((element) => element.setAttribute('aria-pressed', String(element === button)))
    $('.attempt-result').textContent = attempt === 1
      ? 'First attempt: unsuccessful. Its SQL and specific failure reason are not preserved in this Day 6 record.'
      : attempt === record.attempts
        ? 'Final attempt: execution succeeded. Three attempts recorded. The exact final SQL can be inspected below.'
        : 'Three attempts are recorded, but intermediate SQL is not preserved. This is a record gap, not a reconstructed second attempt.'
    scenes.refresh()
  }))
  all<HTMLButtonElement>('[data-intent]').forEach((button) => button.addEventListener('click', () => {
    intent = button.dataset.intent ?? 'read'
    all('[data-intent]').forEach((element) => element.setAttribute('aria-pressed', String(element === button)))
    $('.guard-result').textContent = intent === 'read'
      ? 'Illustration: read-only intent may proceed after the remaining checks. No database request is made.'
      : 'Illustration: destructive intent is blocked. Correction cannot grant write permission. No SQL was executed.'
    scenes.refresh()
  }))
  all<HTMLButtonElement>('[data-ledger]').forEach((button) => button.addEventListener('click', () => {
    ledger = button.dataset.ledger ?? 'after'
    all('[data-ledger]').forEach((element) => element.setAttribute('aria-pressed', String(element === button)))
    $('.ledger-result').textContent = ledger === 'after'
      ? `${counts.afterCorrection} of ${counts.core} core queries executed successfully. Four recovered; three still unsuccessful.`
      : `${counts.beforeCorrection} of ${counts.core} core queries executed successfully before correction. Seven were unsuccessful.`
    scenes.refresh()
  }))
}
