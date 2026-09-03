import { mountWorldLifecycle, type WorldFrame, type WorldLifecycle } from './world-lifecycle'

/*
 * The Long Table.
 *
 * A scroll-directed archival table. Scroll selects the scene; it does not scrub
 * inside one. When a scene becomes current a local clock starts and its events
 * fire at fixed millisecond offsets, each completing in a few hundred ms, then
 * the frame holds still. The verdict strikes the record and leaves no mark.
 *
 * Every count and split is read from the committed Tathya export. Slip positions
 * on the table are authored. No Math.random: jitter is a deterministic hash so
 * the composition is identical on every load and the gate stays satisfied.
 */

type SourceType = 'official' | 'media' | 'citizen'
interface CaseFile {
  id: string
  label: string
  sourceCount: number
  composition: Record<SourceType, number>
  claimCount: number
  citedClaimCount: number
}
interface TathyaData {
  provenance: string
  sourceAudit: { commit: string }
  caseFiles: CaseFile[]
  sharedSources: Array<{ sourceType: SourceType; fileIds: string[] }>
  silentFailure: { sourceLabel: string }
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3)
const easeInQuad = (t: number) => { const x = clamp(t); return x * x }
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)))
const easeOutBack = (t: number) => {
  const x = clamp(t)
  const c1 = 1.35
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}
// a careful hand sets a slip down: overshoot a hair, settle
const settle = easeOutBack
// deterministic hash in [0, 1) keyed on an integer; replaces Math.random
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
  tableFar: '#0b0908',
  tableNear: '#241d15',
  rule: 'rgba(233,216,180,0.09)',
  lamp: '244,228,190',
  paperLit: '#e7d9b9',
  paperMid: '#c3b088',
  paperLow: '#5f5442',
  paperEdge: '#241d13',
  ink: '#2c2417',
  cord: 'rgba(178,158,120,0.85)',
  cordDim: 'rgba(178,158,120,0.4)',
  bound: 'rgba(79,211,155,0.55)',
  stamp: '#ad301c',
  stampDeep: '#5c1809',
  stampFace: 'rgba(244,214,206,0.9)',
  faint: 'rgba(233,222,196,0.6)',
}

// ---- camera per scene: look-at in table space, zoom, rake (fake perspective) --
interface Cam { u: number; v: number; zoom: number; rake: number }
const CAMS: Cam[] = [
  { u: 0.46, v: -0.06, zoom: 0.74, rake: 0.16 }, // 01 whole table, empty
  { u: 0.40, v: -0.30, zoom: 1.30, rake: 0.34 }, // 02 close on the first slip
  { u: 0.44, v: -0.26, zoom: 1.12, rake: 0.10 }, // 03 top-down, the discard
  { u: 0.44, v: -0.24, zoom: 0.98, rake: 0.22 }, // 04 cords radiating to the edges
  { u: 0.44, v: -0.30, zoom: 1.14, rake: 0.20 }, // 05 the bound file
  { u: 0.52, v: -0.02, zoom: 1.42, rake: 0.05 }, // 06 straight down, the conflict pair
  { u: 0.60, v: 0.10, zoom: 1.06, rake: 0.46 }, // 07 low across, the clean rectangle
  { u: 0.40, v: 0.02, zoom: 0.58, rake: 0.32 }, // 08 pull back, the table recedes
]
// how long a scene stays "busy" (events + a hold) before the frame goes still
const BUSY_MS = [1000, 1700, 1800, 1800, 1900, 2300, 2100, 1600]

// ---- the record on the table -----------------------------------------------
interface Slip {
  u: number
  v: number
  rot: number
  type: SourceType
  origin: [number, number] // edge anchor in table space
  file: string
  uncited?: boolean
  shared?: boolean
  fails?: boolean
  bornScene: number // first scene this slip is on the table
}

function buildRecord(data: TathyaData): Slip[] {
  const slips: Slip[] = []
  const fileA = data.caseFiles[0]
  const fileB = data.caseFiles[1] ?? data.caseFiles[0]

  const layout = (
    file: CaseFile,
    cu: number,
    cv: number,
    spread: number,
    seed: number,
    bornScene: number,
  ) => {
    const order: SourceType[] = []
    ;(['official', 'media', 'citizen'] as SourceType[]).forEach((t) => {
      for (let i = 0; i < file.composition[t]; i += 1) order.push(t)
    })
    order.forEach((type, i) => {
      const a = (i / order.length) * Math.PI * 2 + hash(seed + i) * 1.4
      const r = spread * (0.35 + hash(seed + i * 3) * 0.65)
      const side = hash(seed + i * 7)
      const origin: [number, number] =
        side < 0.34 ? [0, 0.12 + hash(seed + i) * 0.7] : side < 0.68 ? [1, 0.12 + hash(seed + i * 2) * 0.7] : [2, hash(seed + i * 5)]
      slips.push({
        u: cu + Math.sin(a) * r * 0.7,
        v: cv + Math.cos(a) * r,
        rot: (hash(seed + i * 11) - 0.5) * 0.5,
        type,
        origin,
        file: file.id,
        // the first slip of file A is set down in the Intake scene; the rest join in Identity
        bornScene: bornScene === 2 && i === 0 ? 1 : bornScene,
      })
    })
  }

  layout(fileA, 0.42, -0.34, 0.2, 3, 2) // file A: first slip in scene 1, rest in scene 2
  layout(fileB, 0.66, 0.3, 0.17, 20, 4) // file B appears alongside the file scene

  // a slip in file A has no citation (not the first one, which the intake scene follows)
  const uncitedA = slips.filter((s) => s.file === fileA.id && s.type === 'media')[1]
  if (uncitedA) uncitedA.uncited = true

  // the shared source belongs to both files
  const shared = data.sharedSources[0]
  if (shared) {
    slips.push({
      u: 0.54,
      v: -0.02,
      rot: 0.06,
      type: shared.sourceType,
      origin: [1, 0.5],
      file: `${shared.fileIds[0]}+${shared.fileIds[1]}`,
      shared: true,
      bornScene: 4,
    })
  }

  // the source that failed silently, on file B, withdrawn in scene 7
  const failSlip = slips.find((s) => s.file === fileB.id && s.type === 'official') ?? slips.find((s) => s.file === fileB.id)
  if (failSlip) failSlip.fails = true

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
  const fileA = data.caseFiles[0]
  const readoutA = `${fileA.label.toUpperCase()}   ${fileA.sourceCount} sources   ${fileA.composition.official}/${fileA.composition.media}/${fileA.composition.citizen}`

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
    const du = u - k.u
    const dv = v - k.v
    // top-down base
    let sx = W / 2 + dv * W * 0.46 * k.zoom
    let sy = H / 2 - du * H * 0.92 * k.zoom
    // rake: pull the far half up and in, drop the near half down and out
    const depth = (sy - H / 2) / H // negative = far (up), positive = near
    sy += depth * k.rake * H * 0.5
    sx = W / 2 + (sx - W / 2) * (1 - depth * k.rake * 0.4)
    const scale = k.zoom * (1 - depth * k.rake * 0.6)
    return { x: sx + shakeX, y: sy + shakeY, s: Math.max(0.12, scale) }
  }
  const edge = (o: [number, number], k: Cam) => {
    if (o[0] === 2) return project(1.05, lerp(-0.95, 0.95, o[1]), k)
    return project(lerp(0.04, 0.98, o[1]), o[0] === 0 ? -1.08 : 1.08, k)
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
  ) => {
    if (alpha <= 0.01 || s <= 0.05) return
    const w = 62 * s
    const h = 40 * s
    ctx.save()
    ctx.translate(px, py - lift)
    ctx.rotate(rot)
    // shadow spreads with the lift
    const so = 6 * s + lift * 0.24
    ctx.globalAlpha = alpha * 0.4 * clamp(1 - lift / 260)
    ctx.fillStyle = '#000'
    rr(-w / 2 + so, -h / 2 + so + 2 * s, w, h, 4 * s)
    ctx.fill()
    ctx.globalAlpha = alpha
    const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2)
    g.addColorStop(0, C.paperLit)
    g.addColorStop(0.6, C.paperMid)
    g.addColorStop(1, C.paperLow)
    ctx.fillStyle = g
    rr(-w / 2, -h / 2, w, h, 3 * s)
    ctx.fill()
    ctx.strokeStyle = C.paperEdge
    ctx.lineWidth = Math.max(0.5, s)
    ctx.stroke()
    if (s > 0.42) {
      const gx = -w / 2 + 8 * s
      const gy = -h / 2 + 9 * s
      const r = 3 * s
      ctx.fillStyle = C.ink
      ctx.strokeStyle = C.ink
      ctx.lineWidth = Math.max(0.6, s)
      if (type === 'official') {
        ctx.fillRect(gx - r, gy - r, r * 2, r * 2)
      } else if (type === 'media') {
        ctx.beginPath()
        ctx.arc(gx, gy, r, 0, Math.PI * 2)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(gx, gy, r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(gx, gy, r * 0.4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.strokeStyle = 'rgba(44,36,23,0.4)'
      ctx.lineWidth = Math.max(0.5, 0.8 * s)
      for (let li = 0; li < 2; li += 1) {
        const yy = 3 * s + li * 8 * s
        ctx.beginPath()
        ctx.moveTo(-w / 2 + 8 * s, yy)
        ctx.lineTo(w / 2 - (li === 0 ? 10 : 20) * s, yy)
        ctx.stroke()
      }
    }
    ctx.restore()
    ctx.globalAlpha = 1
  }

  const drawCord = (x1: number, y1: number, x2: number, y2: number, taut: number, alpha: number, col = C.cord) => {
    const sag = lerp(28, 3, easeOutExpo(taut))
    const thrum = taut > 0.6 && taut < 1 ? Math.sin(taut * 40) * (1 - taut) * 14 : 0
    ctx.strokeStyle = col
    ctx.globalAlpha = alpha
    ctx.lineWidth = 1.4
    ctx.beginPath()
    const N = 16
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
    ctx.arc(x1, y1, 1.8, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x2, y2, 1.8, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  const mono = (str: string, x: number, y: number, size: number, col: string, align: CanvasTextAlign, alpha: number) => {
    ctx.globalAlpha = alpha
    ctx.fillStyle = col
    ctx.font = `${size}px "DM Mono", ui-monospace, monospace`
    ctx.textAlign = align
    ctx.fillText(str, x, y)
    ctx.textAlign = 'left'
    ctx.globalAlpha = 1
  }

  const drawTable = (k: Cam) => {
    ctx.fillStyle = '#0a0705'
    ctx.fillRect(0, 0, W, H)
    // the lit table surface, sized to always bleed past the frame
    const a = project(-0.4, -1.9, k)
    const b = project(1.5, -1.9, k)
    const c = project(1.5, 1.9, k)
    const d = project(-0.4, 1.9, k)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.lineTo(c.x, c.y)
    ctx.lineTo(d.x, d.y)
    ctx.closePath()
    const tg = ctx.createLinearGradient(0, Math.min(a.y, b.y), 0, Math.max(c.y, d.y))
    tg.addColorStop(0, '#0d0a07')
    tg.addColorStop(0.55, '#221a11')
    tg.addColorStop(1, '#2f2416')
    ctx.fillStyle = tg
    ctx.fill()
    // ledger rules: horizontal lines running across the table, register-style
    ctx.strokeStyle = 'rgba(233,216,180,0.11)'
    ctx.lineWidth = 1
    for (let r = 1; r <= 9; r += 1) {
      const u = r / 10
      const p0 = project(u, -1.8, k)
      const p1 = project(u, 1.8, k)
      ctx.beginPath()
      ctx.moveTo(p0.x, p0.y)
      ctx.lineTo(p1.x, p1.y)
      ctx.stroke()
    }
    // the lamp pool: a warm work-light hitting the near-left of the table
    const lampX = W * 0.4
    const lampY = H * 0.42
    const rad = Math.max(W, H) * 0.66
    const lg = ctx.createRadialGradient(lampX, lampY, 0, lampX, lampY, rad)
    const warm = sceneIndex === 6 ? 0.2 : sceneIndex === 7 ? 0.34 : 0.28
    lg.addColorStop(0, `rgba(${C.lamp},${warm})`)
    lg.addColorStop(0.42, `rgba(${C.lamp},${(warm * 0.32).toFixed(3)})`)
    lg.addColorStop(1, `rgba(${C.lamp},0)`)
    ctx.fillStyle = lg
    ctx.fillRect(0, 0, W, H)
  }

  // one loose cord looped around a set of screen points, drawn on by amount
  const drawBinding = (pts: Array<{ x: number; y: number }>, amount: number, alpha: number) => {
    if (pts.length < 3 || amount <= 0.01) return
    let cx = 0
    let cy = 0
    pts.forEach((p) => {
      cx += p.x
      cy += p.y
    })
    cx /= pts.length
    cy /= pts.length
    const ring = pts
      .map((p) => ({ a: Math.atan2(p.y - cy, p.x - cx), x: p.x, y: p.y }))
      .sort((p, q) => p.a - q.a)
      .map((p) => {
        const dx = p.x - cx
        const dy = p.y - cy
        const dd = Math.hypot(dx, dy) || 1
        const k = (dd + 30) / dd
        return { x: cx + dx * k, y: cy + dy * k }
      })
    const total = ring.length
    const shown = Math.max(2, Math.floor(total * easeOutCubic(amount)) + 1)
    ctx.strokeStyle = C.bound
    ctx.globalAlpha = alpha
    ctx.lineWidth = 1.4
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    for (let i = 0; i < shown; i += 1) {
      const cur = ring[i % total]
      const nxt = ring[(i + 1) % total]
      const mx = (cur.x + nxt.x) / 2
      const my = (cur.y + nxt.y) / 2
      if (i === 0) ctx.moveTo(mx, my)
      ctx.quadraticCurveTo(cur.x, cur.y, mx, my)
    }
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
  }

  // ---- the verdict: strikes the record, leaves no mark --------------------
  // scene index -> ms into that scene when the verdict comes down
  const STRIKE: Record<number, number> = { 2: 950, 4: 1050, 5: 1420 }
  const STAMP_H = 52

  interface StrikeState { y: number; sharp: number; shakeX: number; shakeY: number; flash: number; alpha: number; active: boolean }
  const strikeState = (t: number): StrikeState => {
    const present = sceneIndex >= 1 && sceneIndex <= 5
    const exiting = sceneIndex === 6
    const s: StrikeState = { y: 0, sharp: 0, shakeX: 0, shakeY: 0, flash: 0, alpha: 1, active: present || exiting }
    if (!s.active) return s
    const hangY = 74 // clears the fixed nav bar
    const restY = -STAMP_H - 100
    const hitY = H * 0.47 - STAMP_H / 2
    s.y = lerp(restY, hangY, easeOutCubic(clamp(t / 420)))
    const at = STRIKE[sceneIndex]
    if (at !== undefined && t >= at) {
      const dt = t - at
      if (dt < 88) {
        s.y = lerp(hangY, hitY, easeInQuad(dt / 88))
        s.sharp = dt / 88
      } else if (dt < 168) {
        s.y = hitY
        s.sharp = 1
        const amp = (1 - (dt - 88) / 80) * 16
        s.shakeX = Math.sin(dt * 1.6) * amp
        s.shakeY = Math.cos(dt * 2.1) * amp * 0.7
        if (dt < 116) s.flash = 1 - (dt - 88) / 28
      } else if (dt < 570) {
        s.y = lerp(hitY, hangY, easeOutCubic((dt - 168) / 402))
        s.sharp = 1 - (dt - 168) / 402
      }
    }
    if (exiting) {
      s.y = lerp(hangY, restY, easeOutCubic(clamp(t / 520)))
      s.alpha = clamp(1 - t / 540)
    }
    return s
  }

  const drawStamp = (s: StrikeState) => {
    if (!s.active || s.alpha <= 0.02) return
    const sw = Math.min(W * 0.46, 340)
    const sx = W / 2 - sw / 2
    const y = s.y
    // the arm it hangs from
    ctx.globalAlpha = s.alpha * 0.55
    ctx.fillStyle = '#16110c'
    ctx.fillRect(W / 2 - 6, -20, 12, y + 10)
    ctx.fillRect(W / 2 - 26, y - 8, 52, 16)
    // contact shadow beneath, only on the strike
    if (s.sharp > 0.05) {
      ctx.globalAlpha = s.alpha * s.sharp * 0.4
      ctx.fillStyle = '#000'
      rr(sx - 6, y + STAMP_H + 4, sw + 12, 16, 6)
      ctx.fill()
    }
    // the slab
    ctx.globalAlpha = s.alpha
    const g = ctx.createLinearGradient(0, y, 0, y + STAMP_H)
    g.addColorStop(0, C.stamp)
    g.addColorStop(1, C.stampDeep)
    ctx.fillStyle = g
    rr(sx, y, sw, STAMP_H, 4)
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.55)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = 'rgba(0,0,0,0.26)'
    rr(sx + 14, y + 11, sw - 28, STAMP_H - 22, 2)
    ctx.fill()
    mono('VERDICT', W / 2, y + STAMP_H / 2 + 4.5, 13, `rgba(244,214,206,${(0.34 + s.sharp * 0.58).toFixed(2)})`, 'center', s.alpha)
    ctx.globalAlpha = 1
  }

  // ---- the scene ---------------------------------------------------------
  const draw = (frame: WorldFrame): boolean => {
    W = frame.width
    H = frame.height
    ctx.setTransform(frame.dpr, 0, 0, frame.dpr, 0, 0)
    if (sceneIndex < 0) setScene(0)
    const t = frame.now - sceneStart
    const camT = easeOutExpo(clamp((frame.now - camCut) / 260))
    cam = {
      u: lerp(camFrom.u, CAMS[sceneIndex].u, camT),
      v: lerp(camFrom.v, CAMS[sceneIndex].v, camT),
      zoom: lerp(camFrom.zoom, CAMS[sceneIndex].zoom, camT),
      rake: lerp(camFrom.rake, CAMS[sceneIndex].rake, camT),
    }
    // the verdict's strike shakes the whole frame: compute it first, translate,
    // then draw the table, the record and the slab so they jolt together.
    const strike = strikeState(t)
    ctx.save()
    ctx.translate(strike.shakeX, strike.shakeY)
    drawTable(cam)

    // placed slips (persist across scenes)
    slips.forEach((slip, i) => {
      if (slip.bornScene > sceneIndex) return
      if (slip.fails && sceneIndex >= 6) return // withdrawn in scene 7 (handled below)
      const arriving = sceneIndex === slip.bornScene
      const stagger = slip.bornScene === 1 ? 260 : 160 + (i % 5) * 120
      const settleT = arriving ? clamp((t - stagger) / 420) : 1
      if (settleT <= 0) return
      const dim = sceneIndex === 5 && !slip.shared ? 0.4 : 1 // conflict scene: quiet the rest
      const rest = project(slip.u, slip.v, cam)
      let p = rest
      let rot = slip.rot
      let lift = 0
      if (arriving) {
        // carried in from off-frame on the side it came from, then set down by hand
        const from = edge(slip.origin, cam)
        const entry = { x: lerp(from.x, rest.x, -0.15), y: from.y }
        const s = settle(settleT)
        p = { x: lerp(entry.x, rest.x, s), y: lerp(entry.y, rest.y, s), s: lerp(rest.s * 0.9, rest.s, clamp(s)) }
        rot = lerp(slip.rot + 0.4, slip.rot, clamp(s))
        lift = (1 - clamp(s)) * 46
      }
      const e = edge(slip.origin, cam)
      if (slip.uncited) {
        // a slip with no source: its cord is pinned once and lies slack, going nowhere
        if (sceneIndex >= 3) {
          const ang = hash(i) * Math.PI * 2
          drawCord(p.x, p.y, p.x + Math.cos(ang) * 52 * p.s, p.y + Math.sin(ang) * 26 * p.s + 8, 0, 0.55, C.cordDim)
        }
      } else if (sceneIndex === 3) {
        // citation scene: the cords whip taut back to their origins
        const taut = clamp((t - 220 - (i % 4) * 90) / 360)
        drawCord(e.x, e.y, p.x, p.y, taut, 0.5 * settleT * clamp(taut * 2), C.bound)
      } else if (sceneIndex === 1 && arriving) {
        // intake: the cord whips taut as the first slip is set down
        const taut = clamp((settleT - 0.45) / 0.4)
        if (taut > 0) drawCord(e.x, e.y, p.x, p.y, taut, 0.5, C.cord)
      } else if (sceneIndex > 3 && !arriving) {
        // afterward: a short stub toward the origin, so the cord reads without clutter
        const dx = e.x - p.x
        const dy = e.y - p.y
        const d = Math.hypot(dx, dy) || 1
        const len = 16 * p.s
        drawCord(p.x, p.y, p.x + (dx / d) * len, p.y + (dy / d) * len, 1, 0.4, C.cordDim)
      }
      drawSlip(p.x, p.y, p.s, rot, slip.type, settleT * dim, Math.max(0, lift))
      // 02 intake: the type of the fresh slip, spelled out
      if (sceneIndex === 1 && arriving && settleT > 0.5) {
        mono(`${slip.type} source`, p.x, p.y + 34 * p.s, 11, C.faint, 'center', clamp((settleT - 0.5) / 0.4))
      }
    })

    // ---- scene-specific beats ----
    runScene(sceneIndex, t, cam)

    // the room darkens as the verdict looms
    if (strike.sharp > 0.02) {
      ctx.globalAlpha = strike.sharp * 0.24
      ctx.fillStyle = '#000'
      ctx.fillRect(-40, -40, W + 80, H + 80)
      ctx.globalAlpha = 1
    }

    // the verdict slab
    drawStamp(strike)
    ctx.restore()

    // hard flash at the instant of contact, over everything, untranslated
    if (strike.flash > 0.01) {
      ctx.globalAlpha = strike.flash * 0.5
      ctx.fillStyle = `rgba(${C.lamp},1)`
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = 1
    }

    // edge vignette
    const ev = ctx.createRadialGradient(W / 2, H * 0.46, H * 0.16, W / 2, H * 0.5, Math.max(W, H) * 0.82)
    ev.addColorStop(0, 'rgba(0,0,0,0)')
    ev.addColorStop(1, 'rgba(0,0,0,0.58)')
    ctx.fillStyle = ev
    ctx.fillRect(0, 0, W, H)

    // progress bar
    const frac = clamp(frame.progress / Math.max(1, sceneNodes.length - 1))
    if (bar) bar.style.transform = `scaleX(${frac.toFixed(4)})`

    // keep animating while the scene is busy, the camera is still cutting, or the
    // verdict is mid-strike; then the frame holds perfectly still
    return t < BUSY_MS[sceneIndex] || camT < 1 || strike.sharp > 0.01
  }

  function runScene(index: number, t: number, k: Cam) {
    // 03 identity: two duplicate slips near file A, one flicked off the edge
    if (index === 2) {
      const near = project(0.34, -0.5, k)
      const off = project(0.34 + 0.5, -0.5 - 0.4, k)
      const flick = easeInQuad(clamp((t - 500) / 240))
      const merge = clamp((t - 260) / 300)
      // survivor
      drawSlip(lerp(near.x, project(0.4, -0.32, k).x, merge), lerp(near.y, project(0.4, -0.32, k).y, merge), near.s, 0.1, 'media', 1)
      // the stale copy, flicked away
      if (flick < 1) {
        drawSlip(lerp(near.x + 14, off.x, flick), lerp(near.y + 10, off.y, flick), near.s * (1 - flick * 0.5), 0.4 + flick * 2.4, 'media', 1 - flick)
      }
      mono('duplicate discarded', near.x, near.y - 26, 11, C.faint, 'center', clamp((t - 200) / 300) * (1 - flick))
    }

    // 04 citation: the uncited slip gets a caption
    if (index === 3) {
      const u = slips.find((s) => s.uncited)
      if (u) {
        const p = project(u.u, u.v, k)
        mono('no citation', p.x + 14, p.y + 22, 11, C.faint, 'left', clamp((t - 500) / 400))
      }
    }

    // 05 the file: a loose cord binds file A, the readout writes on
    if (index === 4) {
      const fa = slips.filter((s) => s.file === (slips[0]?.file ?? '') && s.bornScene <= 4)
      const pts = fa.map((s) => {
        const p = project(s.u, s.v, k)
        return { x: p.x, y: p.y }
      })
      drawBinding(pts, clamp((t - 300) / 700), 0.7)
      const anchor = project(0.42, -0.34, k)
      const chars = Math.floor(clamp((t - 700) / 500) * readoutA.length)
      mono(readoutA.slice(0, chars), anchor.x, anchor.y - 110 * anchor.s, 11.5, 'rgba(224,210,180,0.92)', 'center', clamp((t - 650) / 300))
    }

    // 06 conflict: two slips of file A slide to centre, squared and parallel
    if (index === 5) {
      const fa = slips.filter((s) => s.file === (slips[0]?.file ?? ''))
      const pair = [fa[0], fa[1]].filter(Boolean) as Slip[]
      const ct = easeOutExpo(clamp((t - 120) / 420))
      pair.forEach((s, j) => {
        const from = project(s.u, s.v, k)
        const to = project(0.52, -0.02 + (j === 0 ? -0.07 : 0.07), k)
        drawSlip(lerp(from.x, to.x, ct), lerp(from.y, to.y, ct), lerp(from.s, to.s, ct), lerp(s.rot, 0, ct), s.type, 1)
      })
      const mid = project(0.52, 0.12, k)
      mono('two accounts, same weight, no ranking', mid.x, mid.y, 11, C.faint, 'center', clamp((t - 520) / 400))
    }

    // 07 boundary: the failed slip lifts straight up and out; clean rectangle left
    if (index === 6) {
      const f = slips.find((s) => s.fails)
      if (f) {
        const p = project(f.u, f.v, k)
        const lift = easeOutCubic(clamp((t - 200) / 420))
        if (lift < 1) drawSlip(p.x, p.y, p.s, f.rot, f.type, 1 - lift, lift * 220)
        if (lift > 0.2) {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(f.rot)
          ctx.globalAlpha = clamp((lift - 0.2) / 0.5) * 0.85
          ctx.strokeStyle = `rgba(${C.lamp},0.4)`
          ctx.setLineDash([3, 3])
          ctx.lineWidth = 1
          rr(-32 * p.s, -21 * p.s, 64 * p.s, 42 * p.s, 3 * p.s)
          ctx.stroke()
          ctx.setLineDash([])
          ctx.restore()
          mono('withdrawn — workflow state', p.x + 26 * p.s, p.y + 4, 11, `rgba(${C.lamp},0.8)`, 'left', clamp((lift - 0.2) / 0.5))
        }
      }
      const bx = W < 620 ? 22 : 46
      ;['no verdict', 'no ranking', 'no sentiment score'].forEach((line, j) => {
        mono(line, bx, H - 96 + j * 20, 12, C.faint, 'left', clamp((t - 700 - j * 130) / 400))
      })
    }

    // 08 open: the empty finding line, near the front, left blank
    if (index === 7) {
      const fp = project(0.26, 0.06, k)
      const a = clamp((t - 200) / 500)
      ctx.save()
      ctx.translate(fp.x, fp.y)
      ctx.globalAlpha = a * 0.85
      const fw = 118 * fp.s
      const fh = 78 * fp.s
      const g = ctx.createLinearGradient(-fw / 2, 0, fw / 2, 0)
      g.addColorStop(0, C.paperLit)
      g.addColorStop(1, C.paperMid)
      ctx.fillStyle = g
      rr(-fw / 2, -fh / 2, fw, fh, 3 * fp.s)
      ctx.fill()
      ctx.strokeStyle = C.paperEdge
      ctx.lineWidth = fp.s
      ctx.stroke()
      ctx.strokeStyle = 'rgba(44,36,23,0.35)'
      ctx.lineWidth = 0.8 * fp.s
      for (let r = 0; r < 4; r += 1) {
        ctx.beginPath()
        ctx.moveTo(-fw / 2 + 9 * fp.s, -fh / 2 + 18 * fp.s + r * 13 * fp.s)
        ctx.lineTo(fw / 2 - 9 * fp.s, -fh / 2 + 18 * fp.s + r * 13 * fp.s)
        ctx.stroke()
      }
      ctx.restore()
      ctx.globalAlpha = 1
      mono('FINDING', fp.x, fp.y - 52 * fp.s, 10, C.faint, 'center', a * 0.7)
      mono('left to the reader', fp.x, fp.y + 60 * fp.s, 11, 'rgba(120,189,151,0.95)', 'center', a * 0.95)
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
