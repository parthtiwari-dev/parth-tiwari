import { mountScrollScenes, restoreWorldFocus } from '../shared/lifecycle'

/**
 * UPI Fraud Engine / The Narrow Harbour. Choreography ported unchanged from the approved
 * study (design/directions/upi-fraud-engine-world.js). Captions and the recorded-day readout
 * read the committed replay and held-out records from the page's data block.
 */
type Day = { date: string; num_transactions: number; num_alerts: number; precision: number; recall: number }
type Payload = {
  heldoutRows: number
  budget: number
  daily: Day[]
  cumulative: { total_transactions: number; total_fraud: number; total_caught: number; total_missed: number; overall_recall: number }
}

const readPayload = (): Payload | undefined => {
  try {
    return JSON.parse(document.querySelector('#upi-fraud-engine-world-data')?.textContent ?? '') as Payload
  } catch {
    return undefined
  }
}

const payload = readPayload()
if (payload) start(payload)
restoreWorldFocus()

function start({ heldoutRows, budget, daily, cumulative }: Payload) {
  const $ = <T extends Element = HTMLElement>(selector: string) => document.querySelector(selector) as T
  const all = <T extends Element = HTMLElement>(selector: string) => [...document.querySelectorAll<T>(selector)]
  const percent = (value: number) => `${(value * 100).toFixed(2)}%`
  const longDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  let day = 0
  let view = 'all'
  const captions = [
    'The current continues.',
    'Past information. Frozen transforms.',
    `A ${budget * 100}% project review budget.`,
    `Held-out: ${heldoutRows.toLocaleString('en-US')} transactions.`,
    `${daily.length === 7 ? 'Seven' : daily.length} recorded days.`,
    `Replay: ${cumulative.total_transactions.toLocaleString('en-US')} transactions.`,
    `${cumulative.total_caught} caught / ${cumulative.total_missed} missed / ${cumulative.total_fraud} fraud.`,
    'A signal is a reason to review.',
  ]
  const currents = $<SVGGElement>('.currents')
  const tide = $<SVGCircleElement>('.tide-ring')
  const beam = $<SVGPathElement>('.light-beam')
  const gate = $<SVGPathElement>('.review-gate')
  const lights = all<SVGGElement>('.current-light')
  const missed = all<SVGCircleElement>('.fraud-dot.missed')
  const hand = $<SVGGElement>('.dial-hand')
  const status = $('#sea-status')

  const scenes = mountScrollScenes({
    paint(i, p, reduced) {
      const t = reduced ? 0 : i + p
      currents.style.transform = `translate(${Math.sin(t * 0.9) * 35}px,${(t % 1) * 15}px)`
      tide.style.transform = `rotate(${t * 12}deg)`
      beam.style.transform = `rotate(${Math.sin(t * 0.6) * 16}deg)`
      gate.style.transform = `rotate(${i >= 2 && i < 6 ? -34 : 0}deg)`
      $<SVGTextElement>('.budget-label').style.opacity = i === 2 ? '1' : '0'
      $<SVGTextElement>('.budget-sub').style.opacity = i === 2 ? '1' : '0'
      $<SVGGElement>('.signal-stream').style.opacity = i >= 6 ? '0' : '.7'
      lights.forEach((element, n) => {
        const x = (n * 137 + t * 180) % 1180
        const y = 90 + ((n * 83) % 660) + Math.sin(x / 170 + n) * 20
        element.setAttribute('transform', `translate(${x},${y})`)
      })
      $<SVGGElement>('.fraud-field').style.opacity = i === 6 ? '1' : '0'
      missed.forEach((element) => { element.style.opacity = view === 'caught' ? '.12' : '.85' })
      hand.style.opacity = i === 4 ? '1' : '0'
      hand.style.transform = `rotate(${(day * 360) / daily.length}deg)`
      status.textContent = i === 4 ? `${daily[day].date} / ${daily[day].num_alerts} alerts` : captions[i]
    },
  })

  all<HTMLButtonElement>('[data-day]').forEach((button) => button.addEventListener('click', () => {
    day = Number(button.dataset.day)
    const row = daily[day]
    all('[data-day]').forEach((element) => element.setAttribute('aria-pressed', String(element === button)))
    $('#day-date').textContent = longDate(row.date)
    $('#day-precision').textContent = percent(row.precision)
    $('#day-recall').textContent = percent(row.recall)
    $('#day-counts').textContent = `${row.num_alerts} alerts / ${row.num_transactions.toLocaleString('en-US')} transactions`
    scenes.refresh()
  }))
  all<HTMLButtonElement>('[data-view]').forEach((button) => button.addEventListener('click', () => {
    view = button.dataset.view ?? 'all'
    all('[data-view]').forEach((element) => element.setAttribute('aria-pressed', String(element === button)))
    $('.reveal-result').textContent = view === 'all'
      ? `${cumulative.total_caught} caught inside. ${cumulative.total_missed} missed outside. Both remain part of the record.`
      : `Focusing on the ${cumulative.total_caught} caught. The ${cumulative.total_missed} missed remain dimly visible; recall is still ${percent(cumulative.overall_recall)}.`
    scenes.refresh()
  }))
}
