import { mountEventScenes, restoreWorldFocus } from '../shared/lifecycle'

/**
 * Order Supervisor / Inside the Night Watch. States, staged phases, rebound and framing are
 * ported unchanged from the approved Study II (design/directions/order-supervisor-world.js).
 * x/y/scale frame one persistent mechanism; explode lifts the face and bezel.
 */
type WatchState = {
  x: number; y: number; z: number; angle: number; explode: number; gear: number; feed: number; track: number
  proposal: number; p: number; event: number; e: number; latch: number; seal: number; caption: string
}

const states: WatchState[] = [
  { x: 705, y: 450, z: 0.94, angle: -13, explode: 0, gear: 0, feed: 0, track: 0.25, proposal: -220, p: 0, event: 200, e: 0, latch: 0, seal: 0, caption: 'One order. The watch begins.' },
  { x: 710, y: 465, z: 1.04, angle: -22, explode: 1, gear: 15, feed: -90, track: 0.6, proposal: -220, p: 0, event: 200, e: 0, latch: 0, seal: 0, caption: 'Beneath the face: a persistent workflow.' },
  { x: 720, y: 450, z: 1.46, angle: 0, explode: 1.7, gear: 30, feed: 0, track: 1, proposal: -220, p: 0, event: 200, e: 0, latch: 0, seal: 0, caption: 'The record continues through every cycle.' },
  { x: 770, y: 545, z: 1.62, angle: 15, explode: 2, gear: 200, feed: 20, track: 1, proposal: -80, p: 1, event: 0, e: 1, latch: 0, seal: 0, caption: 'An event wakes the next reasoning cycle.' },
  { x: 740, y: 460, z: 1.3, angle: 8, explode: 2, gear: 200, feed: 20, track: 1, proposal: -80, p: 0.7, event: 0, e: 0, latch: 0, seal: 0, caption: 'The gears rest. The record remains open.' },
  { x: 850, y: 445, z: 2.05, angle: 0, explode: 2, gear: 225, feed: 20, track: 1, proposal: 0, p: 1, event: 200, e: 0, latch: 0, seal: 0, caption: 'The recommendation stops at the boundary.' },
  { x: 670, y: 440, z: 1.52, angle: -8, explode: 2, gear: 345, feed: 0, track: 1, proposal: -12, p: 0.5, event: 0, e: 1, latch: -95, seal: 1, caption: 'A lifecycle condition releases completion.' },
  { x: 710, y: 435, z: 0.82, angle: 0, explode: 0, gear: 365, feed: 0, track: 1, proposal: -80, p: 0, event: 160, e: 0, latch: 0, seal: 1, caption: 'The final reason stays in the record.' },
]

const byId = (id: string) => document.getElementById(id) as unknown as SVGGElement
const camera = byId('camera')
const face = byId('face')
const bezel = byId('bezel')
const track = byId('record-track')
const feed = byId('record-feed')
const proposal = byId('proposal')
const event = byId('event')
const latch = byId('latch')
const seal = byId('seal')
const gears = [...document.querySelectorAll<SVGGElement>('.gear')]
const caption = document.getElementById('instrument-state')
const clamp = (value: number) => Math.max(0, Math.min(1, value))
const arrival = new Set(['proposal', 'event', 'e', 'p', 'feed', 'gear'])
const release = new Set(['latch', 'seal'])

mountEventScenes<WatchState>({
  states,
  duration: 2800,
  paint(s) {
    const portrait = innerWidth <= 900
    const x = portrait ? 600 + (s.x - 700) * 0.45 : s.x
    const z = portrait ? s.z * 0.91 : s.z
    camera.setAttribute('transform', `translate(${x} ${s.y}) scale(${z}) rotate(${s.angle})`)
    face.setAttribute('transform', `translate(${s.explode * 60} ${-s.explode * 230}) scale(${1 + s.explode * 0.13})`)
    face.setAttribute('opacity', String(Math.max(0, 1 - s.explode * 0.72)))
    bezel.setAttribute('transform', `translate(${-s.explode * 45} ${-s.explode * 120}) scale(${1 + s.explode * 0.07})`)
    bezel.setAttribute('opacity', String(Math.max(0.1, 1 - s.explode * 0.5)))
    gears.forEach((gear, index) => gear.setAttribute('transform', `rotate(${s.gear * Number(gear.dataset.direction) * (index % 2 ? 0.74 : 1)})`))
    track.setAttribute('opacity', String(s.track))
    feed.setAttribute('transform', `translate(0 ${s.feed})`)
    proposal.setAttribute('transform', `translate(${s.proposal} 0)`)
    proposal.setAttribute('opacity', String(s.p))
    event.setAttribute('transform', `translate(${s.event} 0)`)
    event.setAttribute('opacity', String(s.e))
    latch.setAttribute('transform', `translate(0 ${s.latch})`)
    seal.setAttribute('opacity', String(s.seal))
  },
  onSelect(_, state) {
    if (caption) caption.textContent = state.caption
  },
  // Arrival, contact, release: independent phases within one bounded event.
  phase(key, progress) {
    if (arrival.has(key)) return clamp((progress - 0.12) / 0.72)
    if (release.has(key)) return clamp((progress - 0.6) / 0.4)
    return progress
  },
  // Small mechanical rebound, only when the recommendation meets the closed latch.
  adjust(current, progress, active) {
    if (active === 5 && progress > 0.65 && progress < 0.9) current.proposal -= Math.sin((progress - 0.65) / 0.25 * Math.PI) * 9
  },
  intro(current) {
    current.z = 0.72
    current.angle = -24
  },
})
restoreWorldFocus()
