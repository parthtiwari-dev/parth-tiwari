/*
 * BeatMind world storyboard.
 *
 * Data provenance:
 * - tempo, key, bars, progression, event patterns and five stem roles mirror
 *   BeatMind apps/web/src/lib/beat.ts on the local hulk branch, read 2026-08-29;
 * - colours mirror BeatMind's current design tokens;
 * - the failure/retry scene intentionally contains no id or duration because
 *   a complete real failed-run trace has not been exported yet.
 *
 * This is a design study. It does not enter the Astro production build.
 */

const canvas = document.querySelector('[data-world-canvas]')
const world = document.querySelector('[data-world]')
const scenes = [...document.querySelectorAll('[data-scene]')]
const progressBar = document.querySelector('[data-world-progress]')
const sceneCount = document.querySelector('[data-scene-count]')
const sceneLabel = document.querySelector('[data-scene-label]')
const plates = [...document.querySelectorAll('.foundry-plate')]
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

if (!(canvas instanceof HTMLCanvasElement) || !(world instanceof HTMLElement)) {
  throw new Error('BeatMind world study could not find its stage')
}

const ctx = canvas.getContext('2d', { alpha: true })
if (!ctx) throw new Error('BeatMind world study requires a 2D canvas')

const COLORS = ['#f0a2c0', '#c58fd6', '#f0955a', '#5aa8f0', '#7de3a8']
const LABELS = ['VOCALS', 'BACKING', 'DRUMS', 'BASS', 'OTHER']
const LEVEL_DB = [-3, -6.5, -1.5, -2, -8]
const BPM = 124
const BARS = 8
const BEAT = 60 / BPM
const BAR = BEAT * 4
const DURATION = BAR * BARS
const POINTS = 240

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const mix = (from, to, amount) => from + (to - from) * clamp(amount)
const ease = (value) => 1 - Math.pow(1 - clamp(value), 3)
const smooth = (value) => {
  const x = clamp(value)
  return x * x * (3 - 2 * x)
}

function makeEvents() {
  const lanes = Array.from({ length: 5 }, () => [])
  const push = (lane, bar, step, velocity, decay = .16) => {
    lanes[lane].push({ time: bar * BAR + step * (BEAT / 4), velocity, decay })
  }

  for (let bar = 0; bar < BARS; bar += 1) {
    const fill = bar === BARS - 1
    const kicks = fill ? [0, 3, 6, 10, 12] : bar % 4 === 3 ? [0, 6, 10, 14] : [0, 6, 10]
    kicks.forEach((step) => push(2, bar, step, step === 0 ? 1 : .84, .13))
    ;(fill ? [4, 12, 14, 15] : [4, 12]).forEach((step) => push(2, bar, step, step >= 14 ? .7 : .92, .11))
    ;(fill ? [0, 2, 4, 6, 8, 10, 12, 13, 14, 15] : [0, 2, 4, 6, 8, 10, 12, 14])
      .forEach((step) => push(2, bar, step, step % 4 === 0 ? .5 : .28, .05))

    ;[0, 3, 6, 8, 11, 14].forEach((step) => push(3, bar, step, step === 0 ? .95 : .72, .16))
    ;[0, 2, 3, 6, 8, 10, 11, 14].forEach((step) => push(1, bar, step, .62, .12))

    if (bar % 2 === 0) push(4, bar, 0, .58, BAR * 2.2)
  }

  const lead = [
    [1, 8, .8], [1, 12, .8], [2, 0, .8], [2, 6, .72], [2, 8, .8],
    [3, 8, .8], [4, 0, .8], [4, 4, .76], [4, 8, .8], [5, 12, .72],
    [6, 0, .8], [6, 6, .72], [6, 8, .78], [7, 8, .76],
  ]
  lead.forEach(([bar, step, velocity]) => push(0, bar, step, velocity, .34))
  return lanes
}

function sampleLanes() {
  const events = makeEvents()
  return events.map((lane, laneIndex) => Array.from({ length: POINTS }, (_, index) => {
    const time = (index / (POINTS - 1)) * DURATION
    let level = 0
    for (const event of lane) {
      let delta = time - event.time
      if (delta < 0) delta += DURATION
      const attack = Math.min(1, delta / .018)
      const value = attack * Math.exp(-delta / event.decay) * event.velocity
      level = Math.max(level, value)
    }
    const floor = laneIndex === 4 ? .1 : .035
    return clamp(floor + level * .9)
  }))
}

const LANES = sampleLanes()
const WHOLE = Array.from({ length: POINTS }, (_, index) => {
  const sum = LANES.reduce((value, lane) => value + lane[index], 0)
  return clamp(sum / 2.35)
})

const state = {
  width: 0,
  height: 0,
  dpr: 1,
  progress: reduced ? 8 : 0,
  target: reduced ? 8 : 0,
  active: 0,
  dirty: true,
  visible: true,
  lastDraw: 0,
}

function sizeCanvas() {
  const bounds = canvas.getBoundingClientRect()
  const dpr = Math.min(devicePixelRatio || 1, 1.75)
  if (!bounds.width || !bounds.height) return
  state.width = bounds.width
  state.height = bounds.height
  state.dpr = dpr
  canvas.width = Math.round(bounds.width * dpr)
  canvas.height = Math.round(bounds.height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  state.dirty = true
}

function readScroll() {
  if (reduced) {
    plates.forEach((plate, index) => plate.classList.toggle('is-active', index === 5))
    sceneCount.textContent = `${String(scenes.length).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`
    sceneLabel.textContent = scenes.at(-1)?.dataset.scene || ''
    return
  }
  const bounds = world.getBoundingClientRect()
  const travel = Math.max(1, bounds.height - innerHeight)
  const fraction = clamp(-bounds.top / travel)
  state.target = fraction * (scenes.length - 1)
  const active = Math.min(scenes.length - 1, Math.max(0, Math.round(state.target)))
  if (active !== state.active) {
    state.active = active
    scenes.forEach((scene, index) => scene.classList.toggle('is-current', index === active))
    sceneCount.textContent = `${String(active + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`
    sceneLabel.textContent = scenes[active].dataset.scene || ''
    const activePlate = Number(scenes[active].dataset.plate || 0)
    plates.forEach((plate, index) => plate.classList.toggle('is-active', index === activePlate))
  }
  progressBar.style.transform = `scaleX(${fraction.toFixed(4)})`
  world.style.setProperty('--scene-progress', fraction.toFixed(4))
  state.dirty = true
}

function background() {
  const { width, height } = state
  ctx.clearRect(0, 0, width, height)
  const gradient = ctx.createRadialGradient(width * .5, height * .48, 0, width * .5, height * .48, Math.max(width, height) * .72)
  gradient.addColorStop(0, 'rgba(9,12,13,.08)')
  gradient.addColorStop(.55, 'rgba(4,5,6,.18)')
  gradient.addColorStop(1, 'rgba(2,3,4,.44)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  const gap = Math.max(42, Math.min(72, width / 18))
  ctx.strokeStyle = 'rgba(255,255,255,.035)'
  ctx.lineWidth = 1
  for (let x = width % gap; x < width; x += gap) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke()
  }
  for (let y = height % gap; y < height; y += gap) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
  }
}

function horizontalPad() {
  if (state.width < 520) return 76
  if (state.width < 800) return 58
  return Math.max(32, state.width * .07)
}

function drawWave(series, y, amplitude, color, opacity = 1, widthScale = 1, offsetX = 0) {
  const pad = horizontalPad()
  const available = (state.width - pad * 2) * widthScale
  const left = pad + (state.width - pad * 2 - available) / 2 + offsetX
  ctx.beginPath()
  series.forEach((value, index) => {
    const x = left + (index / (series.length - 1)) * available
    const direction = index % 2 === 0 ? -1 : 1
    const yy = y + direction * value * amplitude
    if (index === 0) ctx.moveTo(x, yy)
    else ctx.lineTo(x, yy)
  })
  ctx.strokeStyle = color
  ctx.globalAlpha = opacity
  ctx.lineWidth = Math.max(1, state.width / 1100)
  ctx.stroke()
  ctx.globalAlpha = 1
}

function drawRecord(morph) {
  const cx = state.width * .5
  const cy = state.height * .49
  const radius = Math.min(state.width, state.height) * .245
  const flatY = state.height * .5
  const pad = horizontalPad()
  const flatWidth = state.width - pad * 2
  ctx.beginPath()
  WHOLE.forEach((value, index) => {
    const angle = -Math.PI / 2 + (index / (WHOLE.length - 1)) * Math.PI * 2
    const ring = radius + value * radius * .23
    const circleX = cx + Math.cos(angle) * ring
    const circleY = cy + Math.sin(angle) * ring
    const flatX = pad + (index / (WHOLE.length - 1)) * flatWidth
    const flatWaveY = flatY + (index % 2 === 0 ? -1 : 1) * value * Math.min(90, state.height * .1)
    const x = mix(circleX, flatX, morph)
    const y = mix(circleY, flatWaveY, morph)
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  const stroke = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy)
  COLORS.forEach((color, index) => stroke.addColorStop(index / (COLORS.length - 1), color))
  ctx.strokeStyle = stroke
  ctx.lineWidth = mix(2.2, 1.25, morph)
  ctx.shadowColor = 'rgba(125,227,168,.25)'
  ctx.shadowBlur = mix(18, 5, morph)
  ctx.stroke()
  ctx.shadowBlur = 0

  if (morph < .72) {
    ctx.beginPath()
    ctx.arc(cx, cy, radius * .22 * (1 - morph), 0, Math.PI * 2)
    ctx.fillStyle = '#090a0b'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,.18)'
    ctx.stroke()
  }
}

function laneGeometry(split) {
  const top = state.height * .26
  const bottom = state.height * .73
  const centre = state.height * .5
  return LANES.map((_, index) => mix(centre, top + (index / 4) * (bottom - top), split))
}

function drawLanes(split, analysis = 0, arrangement = 0, mixAmount = 0) {
  const ys = laneGeometry(split)
  const baseAmplitude = Math.min(36, state.height * .038)
  const widthScale = mix(1, .86, arrangement)

  LANES.forEach((lane, index) => {
    const gain = 1 + mixAmount * ((Math.pow(10, LEVEL_DB[index] / 20) * 1.35) - 1)
    const blockShift = arrangement * ((index % 2 ? 1 : -1) * state.width * .025)
    drawWave(lane, ys[index], baseAmplitude * gain, COLORS[index], mix(.42, .95, split), widthScale, blockShift)

    if (split > .35) {
      ctx.globalAlpha = smooth((split - .35) / .65)
      ctx.fillStyle = COLORS[index]
      const labelX = state.width < 520 ? 18 : Math.max(36, state.width * .052)
      ctx.fillRect(state.width < 520 ? 18 : Math.max(16, state.width * .035), ys[index] - 13, state.width < 520 ? 20 : 14, 2)
      ctx.fillStyle = 'rgba(225,228,226,.72)'
      ctx.font = `${state.width < 520 ? 7 : Math.max(8, Math.min(11, state.width / 110))}px 'DM Mono', monospace`
      ctx.fillText(LABELS[index], labelX, ys[index] + 4)
      if (mixAmount > .35 && state.width >= 520) {
        ctx.textAlign = 'right'
        ctx.fillText(`${LEVEL_DB[index].toFixed(1)} dB`, state.width - Math.max(18, state.width * .035), ys[index] + 4)
        ctx.textAlign = 'left'
      }
      ctx.globalAlpha = 1
    }
  })

  if (analysis > 0) drawAnalysis(ys, analysis)
  if (arrangement > 0) drawSections(ys, arrangement)
}

function drawAnalysis(ys, amount) {
  const pad = horizontalPad()
  const width = state.width - pad * 2
  ctx.globalAlpha = amount
  for (let bar = 0; bar <= BARS; bar += 1) {
    const x = pad + (bar / BARS) * width
    ctx.strokeStyle = bar % 2 === 0 ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.075)'
    ctx.beginPath(); ctx.moveTo(x, ys[0] - 38); ctx.lineTo(x, ys[4] + 38); ctx.stroke()
    if (bar < BARS) {
      ctx.fillStyle = 'rgba(230,232,229,.58)'
      ctx.font = `${Math.max(8, state.width / 130)}px 'DM Mono', monospace`
      ctx.fillText(String(bar + 1).padStart(2, '0'), x + 6, ys[0] - 24)
    }
  }

  const chords = ['C♯m', 'C♯m', 'A', 'A', 'E', 'E', 'B', 'B']
  chords.forEach((chord, index) => {
    const x = pad + ((index + .5) / BARS) * width
    ctx.fillStyle = index % 2 ? 'rgba(197,143,214,.78)' : 'rgba(240,162,192,.78)'
    ctx.textAlign = 'center'
    ctx.fillText(chord, x, ys[4] + 42)
  })
  ctx.textAlign = 'left'
  ctx.globalAlpha = 1
}

function drawSections(ys, amount) {
  const pad = horizontalPad()
  const width = state.width - pad * 2
  const sections = [
    { from: 0, to: 2, name: 'INTRO' },
    { from: 2, to: 4, name: 'VERSE' },
    { from: 4, to: 6, name: 'CHORUS' },
    { from: 6, to: 8, name: 'OUTRO' },
  ]
  ctx.globalAlpha = amount * .7
  sections.forEach((section, index) => {
    const x = pad + (section.from / BARS) * width + (index % 2 ? -1 : 1) * amount * 10
    const w = ((section.to - section.from) / BARS) * width - 6
    ctx.strokeStyle = 'rgba(255,255,255,.2)'
    ctx.strokeRect(x, ys[0] - 30, w, ys[4] - ys[0] + 60)
    ctx.fillStyle = 'rgba(230,232,229,.55)'
    ctx.font = `${Math.max(8, state.width / 140)}px 'DM Mono', monospace`
    ctx.fillText(section.name, x + 7, ys[0] - 13)
  })
  ctx.globalAlpha = 1
}

function drawTrace(failure, recovery) {
  const stages = ['INGEST', 'SEPARATE', 'ANALYSE', 'INITIALISE', 'READY']
  const left = Math.max(42, state.width * .09)
  const right = state.width - left
  const y = state.height * .79
  const gapIndex = 1

  stages.forEach((stage, index) => {
    const x = mix(left, right, index / (stages.length - 1))
    const reached = index <= gapIndex || recovery > .45
    ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2)
    ctx.fillStyle = index === gapIndex && failure > .2 ? '#b8241a' : reached ? '#7de3a8' : '#34393d'
    ctx.fill()
    ctx.font = `${Math.max(8, state.width / 135)}px 'DM Mono', monospace`
    ctx.textAlign = index === 0 ? 'left' : index === stages.length - 1 ? 'right' : 'center'
    ctx.fillStyle = reached ? 'rgba(230,232,229,.72)' : 'rgba(145,151,153,.42)'
    ctx.fillText(stage, x, y + 24)
  })
  ctx.textAlign = 'left'

  for (let index = 0; index < stages.length - 1; index += 1) {
    const x1 = mix(left, right, index / (stages.length - 1))
    const x2 = mix(left, right, (index + 1) / (stages.length - 1))
    const isBroken = index === gapIndex
    ctx.strokeStyle = isBroken && failure > .2
      ? recovery > 0 ? `rgba(125,227,168,${recovery})` : '#b8241a'
      : index < gapIndex || recovery > .45 ? 'rgba(125,227,168,.72)' : 'rgba(52,57,61,.72)'
    ctx.lineWidth = isBroken ? 2 : 1
    ctx.setLineDash(isBroken && recovery < .5 ? [5, 7] : [])
    ctx.beginPath(); ctx.moveTo(x1 + 7, y); ctx.lineTo(x2 - 7, y); ctx.stroke()
  }
  ctx.setLineDash([])

  if (failure > .12) {
    const x = mix(left, right, gapIndex / (stages.length - 1))
    ctx.globalAlpha = failure
    ctx.fillStyle = '#b8241a'
    ctx.font = `${Math.max(9, state.width / 115)}px 'DM Mono', monospace`
    ctx.fillText('WORKER LOST', x + 14, y - 18)
    ctx.fillStyle = 'rgba(218,104,92,.72)'
    ctx.font = `${Math.max(7, state.width / 155)}px 'DM Mono', monospace`
    ctx.fillText('REAL TRACE REQUIRED BEFORE PRODUCTION', x + 14, y - 4)
    ctx.globalAlpha = 1
  }
  if (recovery > .35) {
    const x = mix(left, right, 2 / (stages.length - 1))
    ctx.globalAlpha = recovery
    ctx.fillStyle = '#7de3a8'
    ctx.font = `${Math.max(9, state.width / 115)}px 'DM Mono', monospace`
    ctx.fillText('RETRY ACCEPTED', x + 14, y - 18)
    ctx.globalAlpha = 1
  }
}

function drawFinal(amount) {
  const ys = laneGeometry(1)
  const centre = state.height * (state.width < 800 ? .37 : .38)
  const collapse = smooth(amount)
  LANES.forEach((lane, index) => {
    drawWave(lane, mix(ys[index], centre, collapse), Math.min(33, state.height * .036), COLORS[index], mix(.85, .24, collapse))
  })
  drawWave(WHOLE, centre, Math.min(100, state.height * .11), '#f1f0eb', collapse, 1)

  if (amount > .55) {
    ctx.globalAlpha = smooth((amount - .55) / .45)
    ctx.fillStyle = 'rgba(241,240,235,.76)'
    ctx.font = `${Math.max(9, state.width / 120)}px 'DM Mono', monospace`
    ctx.textAlign = 'center'
    ctx.fillText('5 STEMS · 1 TIMELINE · 1 MIXDOWN', state.width * .5, centre + Math.min(145, state.height * .17))
    ctx.textAlign = 'left'
    ctx.globalAlpha = 1
  }
}

function drawFoundryOverlay(progress) {
  const { width, height } = state
  const pad = horizontalPad()
  const machineTop = height * .18
  const machineBottom = height * .78

  if (progress >= .55 && progress < 2.05) {
    const arrival = ease((progress - .55) / .7)
    ctx.globalAlpha = arrival * .82
    ctx.strokeStyle = 'rgba(225,228,226,.58)'
    ctx.lineWidth = 1
    ;[-1, 1].forEach((direction) => {
      const x = width * .5 + direction * mix(width * .34, width * .19, arrival)
      ctx.beginPath()
      ctx.moveTo(x, machineTop)
      ctx.lineTo(x, machineBottom)
      ctx.lineTo(x - direction * 22, machineBottom + 20)
      ctx.stroke()
    })
    ctx.globalAlpha = 1
  }

  if (progress >= 1.72 && progress < 3.75) {
    const failure = smooth((progress - 1.72) / .42)
    const recovery = smooth((progress - 2.75) / .55)
    const pulse = .55 + Math.sin(performance.now() / 170) * .22
    ctx.globalAlpha = recovery > .15 ? mix(pulse, .4, recovery) : pulse * failure
    ctx.fillStyle = recovery > .15 ? '#7de3a8' : '#d83b2d'
    ctx.fillRect(pad, machineTop, width - pad * 2, 2)
    ctx.fillRect(width * .5 - 1, machineTop, 2, machineBottom - machineTop)
    ctx.globalAlpha = 1
  }

  if (progress >= 3.55 && progress < 5.3) {
    const phase = clamp(progress - 3.55)
    const x = mix(pad, width - pad, phase)
    const beam = ctx.createLinearGradient(x - 44, 0, x + 44, 0)
    beam.addColorStop(0, 'rgba(125,227,168,0)')
    beam.addColorStop(.5, 'rgba(125,227,168,.26)')
    beam.addColorStop(1, 'rgba(125,227,168,0)')
    ctx.fillStyle = beam
    ctx.fillRect(x - 44, machineTop, 88, machineBottom - machineTop)
    ctx.strokeStyle = 'rgba(125,227,168,.8)'
    ctx.beginPath(); ctx.moveTo(x, machineTop); ctx.lineTo(x, machineBottom); ctx.stroke()
  }

  if (progress >= 4.7 && progress < 7.25) {
    const position = (progress - 4.7) / 2.55
    const x = mix(pad, width - pad, position)
    ctx.strokeStyle = 'rgba(241,240,235,.7)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(x, machineTop); ctx.lineTo(x, machineBottom); ctx.stroke()
    ctx.fillStyle = 'rgba(241,240,235,.62)'
    ctx.font = `${Math.max(8, width / 150)}px 'DM Mono', monospace`
    ctx.fillText(`${Math.round(position * 100)}%`, Math.min(x + 8, width - 45), machineTop + 14)
  }

  if (progress >= 7.1) {
    const sealed = smooth((progress - 7.1) / .75)
    const cx = width * .5
    const cy = height * (width < 800 ? .34 : .39)
    const radius = Math.min(width, height) * mix(.08, .26, sealed)
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.45)
    glow.addColorStop(0, 'rgba(241,240,235,.16)')
    glow.addColorStop(.45, 'rgba(125,227,168,.055)')
    glow.addColorStop(1, 'rgba(5,6,7,0)')
    ctx.fillStyle = glow
    ctx.beginPath(); ctx.arc(cx, cy, radius * 1.45, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = sealed
    ctx.strokeStyle = 'rgba(241,240,235,.48)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke()
    ctx.strokeStyle = 'rgba(125,227,168,.3)'
    ctx.beginPath(); ctx.arc(cx, cy, radius * .82, 0, Math.PI * 2); ctx.stroke()
    ctx.fillStyle = 'rgba(241,240,235,.62)'
    ctx.font = `${Math.max(8, width / 150)}px 'DM Mono', monospace`
    ctx.textAlign = 'center'
    ctx.fillText('MASTER / COMPLETE', cx, cy + radius + 24)
    ctx.textAlign = 'left'
    ctx.globalAlpha = 1
  }
}

function draw() {
  background()
  const p = state.progress

  if (p < 1.25) {
    drawRecord(ease((p - .35) / .8))
  }

  if (p >= .65 && p < 7.25) {
    const split = ease((p - .65) / .65)
    const analysis = smooth((p - 3.65) / .75)
    const arrangement = smooth((p - 4.65) / .8)
    const mixAmount = smooth((p - 5.6) / .75)
    drawLanes(split, analysis, arrangement, mixAmount)
  }

  if (p >= 1.65 && p < 3.85) {
    const failure = smooth((p - 1.65) / .45)
    const recovery = smooth((p - 2.65) / .7)
    drawTrace(failure, recovery)
  }

  if (p >= 6.65) {
    drawFinal((p - 6.65) / 1.2)
  }

  drawFoundryOverlay(p)
}

function frame(now) {
  requestAnimationFrame(frame)
  if (document.hidden || !state.visible) return
  if (now - state.lastDraw < 33) return
  state.lastDraw = now

  const delta = state.target - state.progress
  if (Math.abs(delta) > .0005) {
    state.progress += delta * (reduced ? 1 : .18)
    state.dirty = true
  } else {
    state.progress = state.target
  }

  if (!state.dirty) return
  state.dirty = false
  draw()
}

scenes[0]?.classList.add('is-current')
plates[0]?.classList.add('is-active')
addEventListener('resize', sizeCanvas, { passive: true })
addEventListener('scroll', readScroll, { passive: true })
document.addEventListener('visibilitychange', () => { state.dirty = true })

if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting
    if (entry.isIntersecting) state.dirty = true
  }, { threshold: 0 }).observe(world)
}

sizeCanvas()
readScroll()
requestAnimationFrame(frame)
