import { mountScrollScenes, restoreWorldFocus } from '../shared/lifecycle'

/**
 * SecondSelf / A Little Further, Together. Choreography, captions and rehearsal copy are
 * ported unchanged from the approved study (design/directions/secondself-world.js). The
 * review controls change this illustration only: nothing is sent and no request is made.
 */
type Decision = 'pending' | 'approve' | 'revise' | 'reject'

const $ = <T extends Element = HTMLElement>(selector: string) => document.querySelector(selector) as T
const clamp = (x: number) => Math.max(0, Math.min(1, x))
let decision: Decision = 'pending'
let path = 'lexical'
let inspected = ''
const categories = ['project', 'experience', 'unsupported']
const captions = ['A companion for the search', 'Carry what is true', 'Exact terms + related experience', 'An unsupported claim falls away', 'A packet takes shape', 'Come home with something reviewable', 'Your decision. No outbound action.', 'A little further, together']
const decisionCaptions: Record<Decision, string> = { pending: 'Awaiting your decision / nothing sent', approve: 'Approved in rehearsal / nothing sent', revise: 'Returned for revision / nothing sent', reject: 'Withdrawn in rehearsal / nothing sent' }

const homeRoom = $('.home-room')
const landscape = $('.landscape')
const routeLine = $<SVGPathElement>('.route-line')
const ownerMark = $<SVGGElement>('.owner-mark')
const companion = $<SVGGElement>('.companion-mark')
const leaves = [$<SVGGElement>('.leaf-project'), $<SVGGElement>('.leaf-experience'), $<SVGGElement>('.leaf-unsupported')]
const envelope = $<SVGGElement>('.journey-envelope')
const flap = $<SVGPathElement>('.letter-flap')
const seal = $<SVGCircleElement>('.letter-seal')
const note = $('#room-state')

const scenes = mountScrollScenes({
  paint(i, p, reduced) {
    const home = i === 0 ? 1 : i === 1 ? 1 - clamp(p * 2) : i === 5 ? clamp(p * 2) : i >= 6 ? 1 : 0
    homeRoom.style.clipPath = `inset(0 ${(1 - home) * 100}% 0 0)`
    const t = i + (reduced ? 1 : p)
    const trip = t < 1 ? 0 : t < 4 ? (t - 1) / 3 : t < 5 ? 1 : t < 6 ? 6 - t : 0
    landscape.style.transform = `translateX(${-trip * 23}%)`
    routeLine.style.strokeDashoffset = String(-t * 70)
    routeLine.style.opacity = i >= 1 && i <= 5 ? '.7' : '0'
    const walk = Math.sin(t * 34) * 5
    const x = 220 + trip * 700
    const y = 590 - trip * 65
    ownerMark.setAttribute('transform', 'translate(175,590)')
    companion.setAttribute('transform', `translate(${x},${y + walk}) rotate(${Math.sin(t * 20) * 4})`)
    leaves.forEach((element, n) => {
      let visible = i >= 1 && i <= 4 ? 1 : 0
      const gather = i === 4 ? clamp(p * 2) : i > 4 ? 1 : 0
      const fall = n === 2 && i >= 3 ? (i === 3 ? clamp(p * 2) : 1) : 0
      if (n === 2) visible *= 1 - fall
      const lx = x + (n - 1) * 130 * (1 - gather)
      const ly = y - 145 * (1 - gather) + fall * 250
      element.setAttribute('transform', `translate(${lx},${ly}) rotate(${(n - 1) * 12 * (1 - gather) + fall * 60}) scale(.7)`)
      element.style.opacity = String(visible * (1 - gather))
      element.style.filter = inspected === categories[n] ? 'drop-shadow(0 0 12px #fff4c6)' : ''
    })
    const show = i >= 4 && i <= 6
    envelope.style.opacity = show ? (decision === 'reject' && i === 6 ? '.2' : '1') : '0'
    envelope.setAttribute('transform', `translate(${i === 6 ? 850 : x},${i === 6 ? (decision === 'reject' ? 720 : 510) : y - 90}) rotate(${i === 4 ? (1 - p) * 15 : 0})`)
    flap.style.transform = decision === 'revise' && i === 6 ? 'scaleY(-1)' : 'scaleY(1)'
    seal.style.opacity = i >= 5 && decision !== 'revise' ? '1' : '0'
    note.textContent = i === 6 ? decisionCaptions[decision] : captions[i]
    routeLine.style.stroke = path === 'semantic' ? '#f6bacb' : '#ffdb93'
  },
})

document.querySelectorAll<HTMLButtonElement>('[data-path]').forEach((button) => button.addEventListener('click', () => {
  path = button.dataset.path ?? 'lexical'
  document.querySelectorAll('[data-path]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)))
  $('.path-result').textContent = path === 'lexical' ? 'Lexical search finds exact skills and project terms.' : 'Semantic search surfaces related experience. Similarity does not establish a new fact.'
  scenes.refresh()
}))

const evidence: Record<string, string> = {
  project: 'Project evidence can enter with its source attached. No extra result is invented.',
  experience: 'Experience evidence can enter with provenance. Related wording cannot expand what actually happened.',
  unsupported: 'Removed before drafting. An unsupported claim does not earn a place by sounding convincing.',
}
document.querySelectorAll<HTMLButtonElement>('[data-evidence]').forEach((button) => button.addEventListener('click', () => {
  inspected = button.dataset.evidence ?? ''
  $('.evidence-result').textContent = evidence[inspected] ?? ''
  document.querySelectorAll('[data-evidence]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)))
  scenes.refresh()
}))

const review = (value: Decision) => {
  decision = value
  $('.review-result').textContent = {
    approve: 'Approved in this rehearsal. Nothing was sent. The real system still operates inside its verified outbound boundaries.',
    revise: 'Returned for revision in this rehearsal. Nothing was sent; the packet is open for changes.',
    reject: 'Rejected in this rehearsal. Nothing was sent. The prepared packet is withdrawn.',
    pending: 'Awaiting your decision in this illustration. Nothing has been sent.',
  }[value]
  document.querySelectorAll<HTMLButtonElement>('[data-decision]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.decision === value)))
  scenes.refresh()
}
document.querySelectorAll<HTMLButtonElement>('[data-decision]').forEach((button) => button.addEventListener('click', () => review(button.dataset.decision as Decision)))
$('.reset-review').addEventListener('click', () => review('pending'))
restoreWorldFocus()
