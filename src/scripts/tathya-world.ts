import { mountWorldLifecycle, type WorldFrame, type WorldLifecycle } from './world-lifecycle'

/*
 * The Long Table.
 *
 * A dark archival table seen from above. Scroll selects the scene; it does not
 * scrub inside one. When a scene becomes current a local clock starts, its
 * events fire at fixed millisecond offsets, each snapping in a few hundred ms,
 * then the frame holds perfectly still. The camera hard-cuts between fixed
 * framings. The verdict slab comes down three times across the sequence and
 * leaves no mark.
 *
 * The canvas carries no words. Every count, label and sentence lives in the
 * static HTML beside it. Slip positions are authored; jitter is a deterministic
 * hash, never an RNG, so the table is identical on every load.
 */

type SourceType = 'official' | 'media' | 'citizen'
interface CaseFile {
  id: string
  label: string
  sourceCount: number
  composition: Record<SourceType, number>
  claimCount: number
  verifiableFacts: boolean
  openQuestion: boolean
}
interface TathyaData {
  provenance: string
  feed: { caseFileCount: number }
  caseFiles: CaseFile[]
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3)
const easeInQuad = (t: number) => { const x = clamp(t); return x * x }
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)))
const easeOutBack = (t: number) => {
  const x = clamp(t)
  const c1 = 1.5
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}
// a careful hand sets a slip down: overshoot a hair, settle
const settle = easeOutBack
// deterministic hash in [0, 1) keyed on an integer; stands in for a random source
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const parseData = (): TathyaData | undefined => {
  const node = document.querySelector('#tathya-world-data')
  if (!(node instanceof HTMLScriptElement) || !node.textContent) return undefined
  try {
    return JSON.parse(node.textContent) as TathyaData
  } catch {
    return undefined
  }
}

const root = document.querySelector('[data-world-root]')
const canvas = document.querySelector('[data-world-canvas]')
const bar = document.querySelector('[data-world-progress]')
const counter = document.querySelector('[data-world-scene-count]')
const label = document.querySelector('[data-world-scene-label]')
const sceneNodes = [...document.querySelectorAll<HTMLElement>('[data-world-scene]')]
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

// ---- palette ------------------------------------------------------------------
const C = {
  lamp: '253,238,205',
  paperLit: '#f6ecd2',
  paperMid: '#e2d1a8',
  paperLow: '#9c8c69',
  paperEdge: '#241c11',
  ink: '#2a2216',
  cord: 'rgba(210,190,146,0.95)',
  cordDim: 'rgba(210,190,146,0.4)',
  bound: 'rgba(90,214,166,0.7)',
  thread: 'rgba(124,224,176,0.98)',
  stamp: '#bb361f',
  stampHang: '#4a1a10',
  stampDeep: '#5c1607',
  slot: 'rgba(236,224,196,0.16)',
}

// ---- camera per scene: look-at in table space, zoom, rake (fake perspective) --
// Copy sits left on even scenes and right on odd scenes, so each framing biases
// the record to the opposite side. Zoom stays wide: the table is never empty.
interface Cam { u: number; v: number; zoom: number; rake: number }
const CAMS: Cam[] = [
  { u: 0.5, v: -0.1, zoom: 0.5, rake: 0.26 }, // 01 the whole table, record to the right
  { u: 0.6, v: -0.16, zoom: 0.94, rake: 0.2 }, // 02 file A arriving, to the left
  { u: 0.6, v: -0.52, zoom: 0.88, rake: 0.08 }, // 03 near top-down on file A, to the right
  { u: 0.56, v: -0.08, zoom: 0.72, rake: 0.16 }, // 04 file A left, cords sweeping right
  { u: 0.48, v: -0.5, zoom: 0.54, rake: 0.14 }, // 05 all three files, to the right
  { u: 0.48, v: 0.5, zoom: 0.56, rake: 0.1 }, // 06 all three to the left, thread crossing
  { u: 0.42, v: -0.48, zoom: 0.66, rake: 0.08 }, // 07 the files to the right, the strike
  { u: 0.42, v: 0.2, zoom: 0.36, rake: 0.24 }, // 08 pull way back, the table recedes
]
// how long a scene stays "busy" (events + a hold) before the frame goes still.
// The strike scenes (index 2, 4, 6) run long enough to seat the full slab cycle.
const BUSY_MS = [1200, 1900, 2400, 2200, 2400, 2100, 2750, 1400]
// where the lamp and the eye rest in each scene, in table space
const FOCUS: Array<[number, number]> = [
  [0.5, 0.1], [0.62, -0.34], [0.62, -0.34], [0.6, -0.2],
  [0.5, -0.02], [0.5, 0.0], [0.42, -0.1], [0.35, -0.1],
]

// ---- the record on the table -----------------------------------------------
interface Slip {
  u: number
  v: number
  rot: number
  type: SourceType
  origin: [number, number] // edge anchor in table space
  file: string
  bornScene: number
}

function buildRecord(data: TathyaData): Slip[] {
  const slips: Slip[] = []
  const centres: Record<string, [number, number]> = {
    'file-a': [0.62, -0.34],
    'file-b': [0.62, 0.32],
    'file-c': [0.32, -0.02],
  }
  const bornBy: Record<string, number> = { 'file-a': 1, 'file-b': 4, 'file-c': 4 }
  const originFor = (type: SourceType): [number, number] =>
    type === 'official' ? [0, 0.32] : type === 'media' ? [1, 0.52] : [2, 0.5]

  data.caseFiles.forEach((file, fi) => {
    const [cu, cv] = centres[file.id] ?? [0.5, fi * 0.32 - 0.32]
    const order: SourceType[] = []
    ;(['official', 'media', 'citizen'] as SourceType[]).forEach((t) => {
      for (let i = 0; i < file.composition[t]; i += 1) order.push(t)
    })
    order.forEach((type, i) => {
      const col = i % 2
      const rowN = Math.floor(i / 2)
      const jU = (hash(fi * 17 + i) - 0.5) * 0.02
      const jV = (hash(fi * 31 + i * 3) - 0.5) * 0.02
      slips.push({
        u: cu - rowN * 0.09 + jU,
        v: cv + (col - 0.5) * 0.14 + jV,
        rot: (hash(fi * 41 + i * 7) - 0.5) * 0.16,
        type,
        origin: originFor(type),
        file: file.id,
        bornScene: bornBy[file.id] ?? 4,
      })
    })
  })

  return slips
}

// ---- lifecycle --------------------------------------------------------------
let lifecycle: WorldLifecycle | undefined

const stop = () => {
  lifecycle?.destroy()
  lifecycle = undefined
}

const start = () => {
  stop()
  const data = parseData()
  if (
    reduced.matches ||
    !(root instanceof HTMLElement) ||
    !(canvas instanceof HTMLCanvasElement) ||
    !(bar instanceof HTMLElement) ||
    !(counter instanceof HTMLElement) ||
    !(label instanceof HTMLElement) ||
    !data
  ) {
    if (root instanceof HTMLElement) root.dataset.worldMode = 'static'
    return
  }
  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) {
    root.dataset.worldMode = 'static'
    return
  }

  root.dataset.worldReady = 'true'
  root.dataset.worldMode = 'animated'

  const slips = buildRecord(data)
  // the day's other files, faint slots around the working table in every scene
  const otherFiles = clamp(data.feed.caseFileCount - data.caseFiles.length, 4, 12)
  const slots = Array.from({ length: otherFiles }, (_, i) => {
    const ring = i / otherFiles
    return {
      u: 0.05 + hash(i * 5 + 1) * 0.9,
      v: (ring < 0.5 ? -1 : 1) * (0.5 + hash(i * 9 + 2) * 0.55),
      rot: (hash(i * 13 + 3) - 0.5) * 0.4,
      wobble: hash(i * 21 + 4),
    }
  })

  let sceneIndex = -1
  let sceneStart = performance.now()
  let camFrom: Cam = { ...CAMS[0] }
  let cam: Cam = { ...CAMS[0] }
  let camCut = performance.now() - 1000

  const setScene = (index: number) => {
    if (index === sceneIndex) return
    camFrom = { ...cam }
    sceneIndex = index
    sceneStart = performance.now()
    camCut = performance.now()
    const node = sceneNodes[index]
    root.dataset.worldActiveScene = node?.id ?? ''
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(sceneNodes.length).padStart(2, '0')}`
    label.textContent = node?.querySelector('.world-scene-copy > p')?.textContent?.trim() ?? ''
    sceneNodes.forEach((scene, i) => scene.classList.toggle('is-current', i === index))
  }

  // ---- projection: table (u along, v across) -> screen, with a mild rake -----
  let W = 0
  let H = 0
  const project = (u: number, v: number, k: Cam, shakeX = 0, shakeY = 0) => {
    // On phones the narration is pinned to the bottom, so the table sits high.
    const cy = H * (W < 760 ? 0.34 : 0.5)
    const du = u - k.u
    const dv = v - k.v
    let sx = W / 2 + dv * W * 0.46 * k.zoom
    let sy = cy - du * H * 0.92 * k.zoom
    const depth = (sy - cy) / H // negative = far (up), positive = near
    sy += depth * k.rake * H * 0.5
    sx = W / 2 + (sx - W / 2) * (1 - depth * k.rake * 0.4)
    const scale = k.zoom * (1 - depth * k.rake * 0.6)
    return { x: sx + shakeX, y: sy + shakeY, s: Math.max(0.1, scale) }
  }
  const edge = (o: [number, number], k: Cam) => {
    if (o[0] === 2) return project(1.05, lerp(-0.95, 0.95, o[1]), k)
    return project(lerp(0.04, 0.98, o[1]), o[0] === 0 ? -1.12 : 1.12, k)
  }

  // ---- primitives ----------------------------------------------------------
  const rr = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  const drawSlip = (
    px: number,
    py: number,
    s: number,
    rot: number,
    type: SourceType,
    alpha: number,
    lift = 0,
    claimReveal = 1,
  ) => {
    if (alpha <= 0.01 || s <= 0.04) return
    const w = 150 * s
    const h = 96 * s
    ctx.save()
    ctx.translate(px, py - lift)
    ctx.rotate(rot)
    const so = 7 * s + lift * 0.22
    ctx.globalAlpha = alpha * 0.3 * clamp(1 - lift / 300)
    ctx.fillStyle = '#000'
    rr(-w / 2 + so * 0.5, -h / 2 + so * 0.5 + 2 * s, w, h, 6 * s)
    ctx.fill()
    ctx.globalAlpha = alpha * 0.22 * clamp(1 - lift / 300)
    rr(-w / 2 + so, -h / 2 + so + 3 * s, w, h, 6 * s)
    ctx.fill()
    ctx.globalAlpha = alpha
    const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 3, h / 2)
    g.addColorStop(0, C.paperLit)
    g.addColorStop(0.65, C.paperMid)
    g.addColorStop(1, C.paperLow)
    ctx.fillStyle = g
    rr(-w / 2, -h / 2, w, h, 5 * s)
    ctx.fill()
    ctx.strokeStyle = C.paperEdge
    ctx.lineWidth = Math.max(0.6, 1.2 * s)
    ctx.stroke()
    if (s > 0.24) {
      const gx = -w / 2 + 18 * s
      const gy = -h / 2 + 19 * s
      const r = 5.5 * s
      ctx.fillStyle = C.ink
      ctx.strokeStyle = C.ink
      ctx.lineWidth = Math.max(0.8, 1.4 * s)
      if (type === 'official') {
        ctx.fillRect(gx - r, gy - r, r * 2, r * 2)
      } else {
        ctx.beginPath()
        ctx.arc(gx, gy, r, 0, Math.PI * 2)
        ctx.stroke()
        if (type === 'citizen') {
          ctx.beginPath()
          ctx.arc(gx, gy, r * 0.42, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.strokeStyle = 'rgba(42,34,22,0.4)'
      ctx.lineWidth = Math.max(0.6, 1.1 * s)
      const lines = Math.round(clamp(claimReveal) * 4)
      for (let li = 0; li < lines; li += 1) {
        const yy = -h / 2 + 36 * s + li * 14 * s
        ctx.beginPath()
        ctx.moveTo(-w / 2 + 16 * s, yy)
        ctx.lineTo(w / 2 - (16 + (li % 2) * 22) * s, yy)
        ctx.stroke()
      }
    }
    ctx.restore()
    ctx.globalAlpha = 1
  }

  // a faint dashed placeholder for one of the day's other files
  const drawSlot = (px: number, py: number, s: number, rot: number, alpha: number) => {
    if (alpha <= 0.01 || s <= 0.04) return
    const w = 130 * s
    const h = 84 * s
    ctx.save()
    ctx.translate(px, py)
    ctx.rotate(rot)
    ctx.globalAlpha = alpha
    ctx.fillStyle = C.slot
    rr(-w / 2, -h / 2, w, h, 4 * s)
    ctx.fill()
    ctx.strokeStyle = `rgba(${C.lamp},${(alpha * 1.4).toFixed(3)})`
    ctx.lineWidth = Math.max(0.5, s)
    ctx.setLineDash([4 * s, 5 * s])
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()
    ctx.globalAlpha = 1
  }

  const drawCord = (x1: number, y1: number, x2: number, y2: number, taut: number, alpha: number, col = C.cord, width = 1.6) => {
    const sag = lerp(30, 2, easeOutExpo(taut))
    const thrum = taut > 0.6 && taut < 1 ? Math.sin(taut * 40) * (1 - taut) * 12 : 0
    ctx.strokeStyle = col
    ctx.globalAlpha = alpha
    ctx.lineWidth = width
    ctx.beginPath()
    const N = 18
    for (let i = 0; i <= N; i += 1) {
      const t = i / N
      const x = lerp(x1, x2, t)
      const y = lerp(y1, y2, t) + Math.sin(Math.PI * t) * (sag + thrum)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.arc(x2, y2, 2.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // the lamp pool, in screen space, recomputed each frame in drawTable
  let lampX = 0
  let lampY = 0
  let lampR = 1
  // 1 in the centre of the pool, easing to ~0.32 at its edge and beyond
  const litAt = (x: number, y: number) => {
    const dx = (x - lampX) / lampR
    const dy = (y - lampY) / (lampR * 0.62)
    return lerp(0.32, 1, easeOutCubic(1 - clamp(Math.hypot(dx, dy))))
  }

  const drawTable = (k: Cam) => {
    // the void behind the table
    ctx.fillStyle = '#080605'
    ctx.fillRect(0, 0, W, H)
    // the table surface, sized to bleed past the frame
    const a = project(-0.5, -2.2, k)
    const b = project(1.6, -2.2, k)
    const c = project(1.6, 2.2, k)
    const d = project(-0.5, 2.2, k)
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.lineTo(c.x, c.y)
    ctx.lineTo(d.x, d.y)
    ctx.closePath()
    ctx.clip()
    const tg = ctx.createLinearGradient(0, Math.min(a.y, b.y), 0, Math.max(c.y, d.y))
    tg.addColorStop(0, '#0f0b08')
    tg.addColorStop(0.5, '#20180f')
    tg.addColorStop(1, '#332619')
    ctx.fillStyle = tg
    ctx.fillRect(0, 0, W, H)
    // register rules across the table
    ctx.strokeStyle = 'rgba(236,224,196,0.07)'
    ctx.lineWidth = 1
    for (let r = 1; r <= 9; r += 1) {
      const p0 = project(r / 10, -2, k)
      const p1 = project(r / 10, 2, k)
      ctx.beginPath()
      ctx.moveTo(p0.x, p0.y)
      ctx.lineTo(p1.x, p1.y)
      ctx.stroke()
    }
    // the lamp: one soft warm ellipse falling on the surface, brightest where the
    // scene's focus sits. Damped toward table centre so it never lurches.
    const focus = FOCUS[sceneIndex] ?? [0.5, 0]
    const lp = project(lerp(0.5, focus[0], 0.6), lerp(0, focus[1], 0.6), k)
    lampX = lp.x
    lampY = lp.y - H * 0.02
    lampR = Math.min(W, H) * 0.86
    const warm = sceneIndex === 0 || sceneIndex === 7 ? 0.2 : sceneIndex === 6 ? 0.26 : 0.34
    ctx.save()
    ctx.translate(lampX, lampY)
    ctx.scale(1, 0.62)
    const lg = ctx.createRadialGradient(0, 0, 0, 0, 0, lampR)
    lg.addColorStop(0, `rgba(${C.lamp},${warm})`)
    lg.addColorStop(0.55, `rgba(${C.lamp},${(warm * 0.4).toFixed(3)})`)
    lg.addColorStop(1, `rgba(${C.lamp},0)`)
    ctx.fillStyle = lg
    ctx.fillRect(-lampR, -lampR, lampR * 2, lampR * 2)
    ctx.restore()
    ctx.restore()
  }

  // one loose cord looped around a set of screen points, drawn on by amount
  const drawBinding = (pts: Array<{ x: number; y: number }>, amount: number, alpha: number) => {
    if (pts.length < 2 || amount <= 0.01) return
    let cx = 0
    let cy = 0
    pts.forEach((p) => {
      cx += p.x
      cy += p.y
    })
    cx /= pts.length
    cy /= pts.length
    const ring = pts
      .map((p) => ({ ang: Math.atan2(p.y - cy, p.x - cx), x: p.x, y: p.y }))
      .sort((p, q) => p.ang - q.ang)
      .map((p) => {
        const dx = p.x - cx
        const dy = p.y - cy
        const dd = Math.hypot(dx, dy) || 1
        const kk = (dd + 44) / dd
        return { x: cx + dx * kk, y: cy + dy * kk }
      })
    const total = ring.length
    const shown = Math.max(2, Math.floor(total * easeOutCubic(amount)) + 1)
    ctx.strokeStyle = C.bound
    ctx.globalAlpha = alpha
    ctx.lineWidth = 2
    ctx.setLineDash([6, 6])
    ctx.beginPath()
    for (let i = 0; i < shown; i += 1) {
      const curr = ring[i % total]
      const next = ring[(i + 1) % total]
      const mx = (curr.x + next.x) / 2
      const my = (curr.y + next.y) / 2
      if (i === 0) ctx.moveTo(mx, my)
      ctx.quadraticCurveTo(curr.x, curr.y, mx, my)
    }
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
  }

  // ---- the verdict: strikes the record, leaves no mark --------------------
  const STRIKE: Record<number, number> = { 2: 1200, 4: 1300, 6: 1550 }
  const STAMP_H = 60

  interface StrikeState { y: number; sharp: number; shakeX: number; shakeY: number; flash: number; alpha: number; active: boolean; done: number }
  const strikeState = (t: number): StrikeState => {
    const at = STRIKE[sceneIndex]
    const s: StrikeState = { y: 0, sharp: 0, shakeX: 0, shakeY: 0, flash: 0, alpha: 1, active: at !== undefined, done: 0 }
    if (!s.active) return s
    const hangY = 70
    const restY = -STAMP_H - 140
    const hitY = H * (W < 760 ? 0.24 : 0.46) - STAMP_H / 2
    s.y = lerp(restY, hangY, easeOutCubic(clamp((t - (at - 620)) / 360)))
    if (t < at - 620) s.alpha = 0
    if (t >= at) {
      const dt = t - at
      if (dt < 70) {
        s.y = lerp(hangY, hitY, easeInQuad(dt / 70))
        s.sharp = dt / 70
      } else if (dt < 210) {
        s.y = hitY
        s.sharp = 1
        const amp = (1 - (dt - 70) / 140) * 26
        s.shakeX = Math.sin(dt * 1.9) * amp
        s.shakeY = Math.cos(dt * 2.5) * amp * 0.7
        if (dt < 104) s.flash = 1 - (dt - 70) / 34
      } else if (dt < 640) {
        s.y = lerp(hitY, hangY, easeOutCubic((dt - 210) / 430))
        s.sharp = 1 - (dt - 210) / 430
        s.done = clamp((dt - 210) / 300)
      } else {
        s.done = 1
        const goneT = clamp((dt - 640) / 420)
        s.y = lerp(hangY, restY, easeOutCubic(goneT))
        s.alpha = 1 - goneT
      }
    }
    return s
  }

  const drawStamp = (s: StrikeState) => {
    if (!s.active || s.alpha <= 0.02) return
    const sw = Math.min(W * 0.34, 300)
    const midX = W * (W < 760 ? 0.5 : 0.58)
    const sx = midX - sw / 2
    const y = s.y
    // the arm it hangs from
    ctx.globalAlpha = s.alpha * 0.5
    ctx.fillStyle = '#130e09'
    ctx.fillRect(midX - 7, -30, 14, y + 12)
    ctx.fillRect(midX - 30, y - 10, 60, 20)
    // contact shadow, only on the strike
    if (s.sharp > 0.05) {
      ctx.globalAlpha = s.alpha * s.sharp * 0.5
      ctx.fillStyle = '#000'
      rr(sx - 8, y + STAMP_H + 4, sw + 16, 20, 8)
      ctx.fill()
    }
    // the slab: dark iron while it hangs, oxblood on the strike
    ctx.globalAlpha = s.alpha
    const top = s.sharp > 0.25 ? C.stamp : C.stampHang
    const g = ctx.createLinearGradient(0, y, 0, y + STAMP_H)
    g.addColorStop(0, top)
    g.addColorStop(1, C.stampDeep)
    ctx.fillStyle = g
    rr(sx, y, sw, STAMP_H, 5)
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    // recessed face
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    rr(sx + 16, y + 13, sw - 32, STAMP_H - 26, 3)
    ctx.fill()
    // a single struck ridge across the face
    ctx.strokeStyle = `rgba(255,220,210,${(0.1 + s.sharp * 0.28).toFixed(2)})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(sx + 22, y + STAMP_H / 2)
    ctx.lineTo(sx + sw - 22, y + STAMP_H / 2)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  // ---- the scene ---------------------------------------------------------
  const draw = (frame: WorldFrame): boolean => {
    W = frame.width
    H = frame.height
    ctx.setTransform(frame.dpr, 0, 0, frame.dpr, 0, 0)
    if (sceneIndex < 0) setScene(0)
    const t = frame.now - sceneStart
    const camT = easeOutExpo(clamp((frame.now - camCut) / 180))
    cam = {
      u: lerp(camFrom.u, CAMS[sceneIndex].u, camT),
      v: lerp(camFrom.v, CAMS[sceneIndex].v, camT),
      zoom: lerp(camFrom.zoom, CAMS[sceneIndex].zoom, camT),
      rake: lerp(camFrom.rake, CAMS[sceneIndex].rake, camT),
    }
    const strike = strikeState(t)
    ctx.save()
    ctx.translate(strike.shakeX, strike.shakeY)
    drawTable(cam)

    // the day's other files: faint, always present, a settled reveal in scene 1
    slots.forEach((slot, i) => {
      const on = sceneIndex === 0 ? clamp((t - 120 - i * 44) / 260) : 1
      if (on <= 0) return
      const p = project(slot.u, slot.v, cam)
      drawSlot(p.x, p.y, p.s, slot.rot, on * (0.18 + litAt(p.x, p.y) * 0.34))
    })

    // placed slips (persist across scenes)
    slips.forEach((slip, i) => {
      if (slip.bornScene > sceneIndex) return
      const arriving = sceneIndex === slip.bornScene
      const stagger = 140 + (i % 4) * 130
      const settleT = arriving ? clamp((t - stagger) / 440) : 1
      if (settleT <= 0) return
      const dim = sceneIndex === 5 && slip.type !== 'media' ? 0.3 : sceneIndex === 7 ? 0 : 1
      const rest = project(slip.u, slip.v, cam)
      let p = rest
      let rot = slip.rot
      let liftPx = 0
      if (arriving) {
        const from = edge(slip.origin, cam)
        const entry = { x: lerp(from.x, rest.x, -0.1), y: from.y }
        const eased = settle(settleT)
        p = { x: lerp(entry.x, rest.x, eased), y: lerp(entry.y, rest.y, eased), s: lerp(rest.s * 0.92, rest.s, clamp(eased)) }
        rot = lerp(slip.rot + 0.3, slip.rot, clamp(eased))
        liftPx = (1 - clamp(eased)) * 52
      }
      const e = edge(slip.origin, cam)
      if (arriving && sceneIndex <= 2) {
        const taut = clamp((settleT - 0.4) / 0.4)
        if (taut > 0) drawCord(e.x, e.y, p.x, p.y, taut, 0.55, C.cord)
      } else if (sceneIndex === 3 && slip.file === 'file-a') {
        const taut = clamp((t - 260 - (i % 3) * 120) / 400)
        drawCord(e.x, e.y, p.x, p.y, taut, 0.6 * clamp(taut * 2), C.bound)
      } else if (sceneIndex > slip.bornScene && sceneIndex !== 5) {
        const dx = e.x - p.x
        const dy = e.y - p.y
        const d = Math.hypot(dx, dy) || 1
        drawCord(p.x, p.y, p.x + (dx / d) * 22 * p.s, p.y + (dy / d) * 22 * p.s, 1, 0.32, C.cordDim, 1.3)
      }
      const claimReveal = sceneIndex < 3 ? 0 : sceneIndex === 3 && slip.file === 'file-a' ? clamp((t - 320) / 900) : 1
      drawSlip(p.x, p.y, p.s, rot, slip.type, settleT * dim * lerp(0.6, 1, litAt(p.x, p.y)), Math.max(0, liftPx), claimReveal)
    })

    runScene(sceneIndex, t, cam)

    // the room darkens as the verdict comes down
    if (strike.sharp > 0.02) {
      ctx.globalAlpha = strike.sharp * 0.42
      ctx.fillStyle = '#000'
      ctx.fillRect(-40, -40, W + 80, H + 80)
      ctx.globalAlpha = 1
    }

    drawStamp(strike)
    ctx.restore()

    if (strike.flash > 0.01) {
      ctx.globalAlpha = strike.flash * 0.6
      ctx.fillStyle = `rgba(${C.lamp},1)`
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = 1
    }

    // edge vignette
    const ev = ctx.createRadialGradient(W / 2, H * 0.46, H * 0.16, W / 2, H * 0.5, Math.max(W, H) * 0.84)
    ev.addColorStop(0, 'rgba(0,0,0,0)')
    ev.addColorStop(1, 'rgba(0,0,0,0.52)')
    ctx.fillStyle = ev
    ctx.fillRect(0, 0, W, H)

    const frac = clamp(frame.progress / Math.max(1, sceneNodes.length - 1))
    if (bar) bar.style.transform = `scaleX(${frac.toFixed(4)})`

    return t < BUSY_MS[sceneIndex] || camT < 1 || strike.sharp > 0.01 || strike.flash > 0.01
  }

  function runScene(index: number, t: number, k: Cam) {
    // 03 behind a file: two empty slots beside file A, where an official record and
    // a citizen account would sit. The count and the gap, shown as physical space.
    if (index === 2) {
      const spots: Array<[number, SourceType]> = [[-0.28, 'official'], [0.28, 'citizen']]
      spots.forEach(([dv, type], j) => {
        const appear = clamp((t - 360 - j * 220) / 420)
        if (appear <= 0) return
        const p = project(0.68, -0.34 + dv, k)
        drawSlot(p.x, p.y, p.s, 0.04, appear * 0.5)
        // the glyph that is missing, drawn faint inside the empty slot
        ctx.save()
        ctx.globalAlpha = appear * 0.4
        ctx.strokeStyle = `rgba(${C.lamp},0.9)`
        ctx.lineWidth = Math.max(0.8, 1.4 * p.s)
        const r = 6 * p.s
        if (type === 'official') ctx.strokeRect(p.x - 26 * p.s - r, p.y - r, r * 2, r * 2)
        else {
          ctx.beginPath()
          ctx.arc(p.x - 26 * p.s, p.y, r, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.restore()
        ctx.globalAlpha = 1
      })
    }

    // 05 the file: a loose cord binds each present file
    if (index === 4) {
      data.caseFiles.forEach((file, fi) => {
        const pts = slips.filter((s) => s.file === file.id).map((s) => {
          const p = project(s.u, s.v, k)
          return { x: p.x, y: p.y }
        })
        drawBinding(pts, clamp((t - 260 - fi * 180) / 680), 0.85)
      })
    }

    // 06 one publisher, many files: a single bright thread through every media slip
    if (index === 5) {
      const rail = edge([1, 0.52], k)
      const media = slips.filter((s) => s.type === 'media').map((s) => project(s.u, s.v, k))
      const drawn = clamp((t - 200) / 950)
      const pulse = 0.72 + Math.sin(t / 170) * 0.28
      const nodes = [rail, ...media]
      const upto = 1 + Math.floor((nodes.length - 1) * easeOutCubic(drawn))
      ctx.globalAlpha = clamp(drawn * 2) * pulse
      ctx.strokeStyle = C.thread
      ctx.lineWidth = 2.2
      ctx.beginPath()
      ctx.moveTo(rail.x, rail.y)
      for (let i = 1; i < upto; i += 1) ctx.lineTo(nodes[i].x, nodes[i].y)
      ctx.stroke()
      nodes.slice(0, upto).forEach((n) => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = C.thread
        ctx.fill()
      })
      ctx.globalAlpha = 1
    }

    // 07 the boundary: a raised dogear tab on the open-question files, a struck
    // frame under the file with verifiable facts
    if (index === 6) {
      data.caseFiles.forEach((file) => {
        const pts = slips.filter((s) => s.file === file.id).map((s) => project(s.u, s.v, k))
        if (!pts.length) return
        const cx = pts.reduce((sum, p) => sum + p.x, 0) / pts.length
        const top = Math.min(...pts.map((p) => p.y))
        const bottom = Math.max(...pts.map((p) => p.y))
        const left = Math.min(...pts.map((p) => p.x))
        const right = Math.max(...pts.map((p) => p.x))
        const sc = pts[0].s
        if (file.openQuestion) {
          const lift = easeOutCubic(clamp((t - 240) / 440))
          const tx = right - 6 * sc
          const ty = top - 4 * sc
          ctx.save()
          ctx.globalAlpha = lift
          ctx.fillStyle = `rgba(${C.lamp},0.9)`
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(tx + 26 * sc, ty - 6 * sc - lift * 10 * sc)
          ctx.lineTo(tx + 30 * sc, ty + 12 * sc - lift * 10 * sc)
          ctx.lineTo(tx + 4 * sc, ty + 18 * sc)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
          ctx.globalAlpha = 1
        }
        if (file.verifiableFacts) {
          const slideIn = easeOutExpo(clamp((t - 300) / 460))
          ctx.save()
          ctx.globalAlpha = slideIn * 0.9
          ctx.strokeStyle = `rgba(124,224,176,${(slideIn * 0.95).toFixed(2)})`
          ctx.lineWidth = 2.4
          rr(left - 14 * sc, bottom + 14 * sc, right - left + 28 * sc, 14 * sc, 3 * sc)
          ctx.stroke()
          // a check tick struck into the frame
          const kx = cx - 8 * sc
          const ky = bottom + 21 * sc
          ctx.beginPath()
          ctx.moveTo(kx, ky)
          ctx.lineTo(kx + 5 * sc, ky + 5 * sc)
          ctx.lineTo(kx + 16 * sc, ky - 6 * sc)
          ctx.stroke()
          ctx.restore()
          ctx.globalAlpha = 1
        }
      })
    }

    // 08 open: the blank finding sheet, near the front, left empty, the one lit thing
    if (index === 7) {
      const fp = project(0.16, -0.4, k)
      const a = clamp((t - 200) / 520)
      if (a <= 0) return
      // a small warm pool just for the sheet
      const glow = ctx.createRadialGradient(fp.x, fp.y, 0, fp.x, fp.y, 260 * fp.s)
      glow.addColorStop(0, `rgba(${C.lamp},${(a * 0.16).toFixed(3)})`)
      glow.addColorStop(1, `rgba(${C.lamp},0)`)
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)
      ctx.save()
      ctx.translate(fp.x, fp.y)
      ctx.globalAlpha = a
      const fw = 230 * fp.s
      const fh = 150 * fp.s
      ctx.fillStyle = 'rgba(0,0,0,0.34)'
      rr(-fw / 2 + 8, -fh / 2 + 10, fw, fh, 5 * fp.s)
      ctx.fill()
      const g = ctx.createLinearGradient(-fw / 2, 0, fw / 3, 0)
      g.addColorStop(0, C.paperLit)
      g.addColorStop(1, C.paperMid)
      ctx.fillStyle = g
      rr(-fw / 2, -fh / 2, fw, fh, 4 * fp.s)
      ctx.fill()
      ctx.strokeStyle = C.paperEdge
      ctx.lineWidth = fp.s
      ctx.stroke()
      ctx.strokeStyle = 'rgba(42,34,22,0.3)'
      ctx.lineWidth = 0.9 * fp.s
      for (let r = 0; r < 5; r += 1) {
        const yy = -fh / 2 + 26 * fp.s + r * 20 * fp.s
        ctx.beginPath()
        ctx.moveTo(-fw / 2 + 14 * fp.s, yy)
        ctx.lineTo(fw / 2 - 14 * fp.s, yy)
        ctx.stroke()
      }
      ctx.restore()
      ctx.globalAlpha = 1
    }
  }

  lifecycle = mountWorldLifecycle({
    root,
    canvas,
    sceneCount: sceneNodes.length,
    draw,
    onActiveScene(index) {
      setScene(index)
    },
  })
}

window.addEventListener('pagehide', stop)
window.addEventListener('pageshow', () => {
  if (!lifecycle) start()
})
window.addEventListener('world:destroy', stop)
reduced.addEventListener('change', start)

try {
  if (sessionStorage.getItem('paper-world-focus-path') === window.location.pathname) {
    sessionStorage.removeItem('paper-world-focus-path')
    requestAnimationFrame(() => document.querySelector<HTMLElement>('#world-title')?.focus({ preventScroll: true }))
  }
} catch {
  /* sessionStorage can throw in privacy modes */
}

start()
