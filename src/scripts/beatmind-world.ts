import { mountWorldLifecycle, type WorldFrame, type WorldLifecycle } from './world-lifecycle'

interface Envelope {
  rms: number[]
  peak: number[]
}

interface BeatMindWorldData {
  analysis: {
    durationSeconds: number
    bpm: number
    key: string
    downbeatTimes: number[]
    sections: Array<{ label: string; startSeconds: number; endSeconds: number }>
  }
  envelopes: Record<'source' | 'vocals' | 'backing_vocals' | 'drums' | 'bass' | 'other', Envelope>
  trace: { available: boolean; reason?: string }
}

const SIGNALS = [
  { key: 'vocals', label: 'VOCALS', color: '#f0a2c0' },
  { key: 'backing_vocals', label: 'BACKING', color: '#c58fd6' },
  { key: 'drums', label: 'DRUMS', color: '#f0955a' },
  { key: 'bass', label: 'BASS', color: '#5aa8f0' },
  { key: 'other', label: 'OTHER', color: '#7de3a8' },
] as const

const clamp = (value: number, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value))
const mix = (from: number, to: number, amount: number) => from + (to - from) * clamp(amount)
const smooth = (value: number) => {
  const bounded = clamp(value)
  return bounded * bounded * (3 - 2 * bounded)
}

function parseData(): BeatMindWorldData | undefined {
  const node = document.querySelector('#beatmind-world-data')
  if (!(node instanceof HTMLScriptElement) || !node.textContent) return undefined
  try {
    return JSON.parse(node.textContent) as BeatMindWorldData
  } catch {
    return undefined
  }
}

function makeRenderer(
  context: CanvasRenderingContext2D,
  data: BeatMindWorldData,
  root: HTMLElement,
  progressBar: HTMLElement,
) {
  const duration = data.analysis.durationSeconds

  const horizontalPadding = (width: number) => {
    if (width < 520) return 54
    if (width < 850) return 72
    return Math.max(76, width * 0.075)
  }

  const drawEnvelope = (
    values: number[],
    y: number,
    amplitude: number,
    color: string,
    opacity: number,
    width: number,
    widthScale = 1,
  ) => {
    const padding = horizontalPadding(width)
    const available = (width - padding * 2) * widthScale
    const left = padding + (width - padding * 2 - available) / 2
    context.beginPath()
    values.forEach((value, index) => {
      const x = left + (index / (values.length - 1)) * available
      const direction = index % 2 === 0 ? -1 : 1
      const pointY = y + direction * value * amplitude
      if (index === 0) context.moveTo(x, pointY)
      else context.lineTo(x, pointY)
    })
    context.globalAlpha = opacity
    context.strokeStyle = color
    context.lineWidth = Math.max(1, width / 1280)
    context.stroke()
    context.globalAlpha = 1
  }

  const drawSignal = (
    envelope: Envelope,
    y: number,
    amplitude: number,
    color: string,
    opacity: number,
    width: number,
    widthScale = 1,
  ) => {
    drawEnvelope(envelope.peak, y, amplitude, color, opacity * 0.16, width, widthScale)
    drawEnvelope(envelope.rms, y, amplitude, color, opacity, width, widthScale)
  }

  const drawSourceRing = (frame: WorldFrame, morph: number) => {
    const { width, height } = frame
    const source = data.envelopes.source.rms
    const centreX = width * 0.5
    const centreY = height * 0.46
    const radius = Math.min(width, height) * (width < 560 ? 0.25 : 0.29)
    const padding = horizontalPadding(width)
    const flatWidth = width - padding * 2
    context.beginPath()
    source.forEach((value, index) => {
      const angle = -Math.PI / 2 + (index / (source.length - 1)) * Math.PI * 2
      const ring = radius + value * radius * 0.32
      const ringX = centreX + Math.cos(angle) * ring
      const ringY = centreY + Math.sin(angle) * ring
      const flatX = padding + (index / (source.length - 1)) * flatWidth
      const flatY = centreY + (index % 2 === 0 ? -1 : 1) * value * Math.min(96, height * 0.11)
      const x = mix(ringX, flatX, morph)
      const y = mix(ringY, flatY, morph)
      if (index === 0) context.moveTo(x, y)
      else context.lineTo(x, y)
    })
    if (morph < 0.98) context.closePath()
    const gradient = context.createLinearGradient(centreX - radius, centreY, centreX + radius, centreY)
    SIGNALS.forEach((signal, index) => gradient.addColorStop(index / (SIGNALS.length - 1), signal.color))
    context.strokeStyle = gradient
    context.lineWidth = mix(2.2, 1.25, morph)
    context.shadowColor = 'rgba(125,227,168,.28)'
    context.shadowBlur = mix(20, 5, morph)
    context.stroke()
    context.shadowBlur = 0
  }

  const lanePositions = (height: number, split: number, converge: number) => {
    const top = height * (height < 680 ? 0.27 : 0.25)
    const bottom = height * (height < 680 ? 0.67 : 0.72)
    const centre = height * 0.48
    return SIGNALS.map((_, index) => {
      const lane = top + (index / (SIGNALS.length - 1)) * (bottom - top)
      const separated = mix(centre, lane, split)
      const compressed = centre + (index - 2) * mix((bottom - top) / 4, 10, converge)
      return mix(separated, compressed, converge)
    })
  }

  const drawAnalysis = (frame: WorldFrame, positions: number[], opacity: number) => {
    const { width } = frame
    const padding = horizontalPadding(width)
    const available = width - padding * 2
    const top = positions[0] - 44
    const bottom = positions.at(-1)! + 44
    context.globalAlpha = opacity

    for (const downbeat of data.analysis.downbeatTimes) {
      const x = padding + (downbeat / duration) * available
      context.strokeStyle = 'rgba(244,244,239,.09)'
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(x, top)
      context.lineTo(x, bottom)
      context.stroke()
    }

    data.analysis.sections.forEach((section, index) => {
      const x = padding + (section.startSeconds / duration) * available
      const end = padding + (section.endSeconds / duration) * available
      context.strokeStyle = index % 2 === 0 ? 'rgba(125,227,168,.32)' : 'rgba(90,168,240,.26)'
      context.strokeRect(x, top, Math.max(2, end - x), bottom - top)
      if (end - x > 42 && width > 560) {
        context.fillStyle = 'rgba(230,232,229,.62)'
        context.font = `${Math.max(8, Math.min(11, width / 130))}px 'DM Mono', monospace`
        context.fillText(section.label.toUpperCase(), x + 5, top + 14)
      }
    })
    context.globalAlpha = 1
  }

  const drawLanes = (frame: WorldFrame, split: number, analysis: number, converge: number, render: number) => {
    const { width, height } = frame
    const positions = lanePositions(height, split, converge)
    const amplitude = Math.min(34, height * 0.04)
    const widthScale = mix(1, 0.82, render)

    SIGNALS.forEach((signal, index) => {
      const envelope = data.envelopes[signal.key]
      const opacity = mix(0.32, 0.94, split) * mix(1, 0.28, render)
      drawSignal(envelope, positions[index], amplitude, signal.color, opacity, width, widthScale)

      if (split > 0.35 && render < 0.75) {
        context.globalAlpha = smooth((split - 0.35) / 0.65) * (1 - render)
        context.fillStyle = signal.color
        const labelX = width < 520 ? 16 : Math.max(22, width * 0.035)
        context.fillRect(labelX, positions[index] - 13, width < 520 ? 17 : 13, 2)
        context.fillStyle = 'rgba(230,232,229,.72)'
        context.font = `${width < 520 ? 7 : Math.max(8, Math.min(11, width / 120))}px 'DM Mono', monospace`
        context.fillText(signal.label, labelX, positions[index] + 3)
        context.globalAlpha = 1
      }
    })

    if (analysis > 0) drawAnalysis(frame, positions, analysis * (1 - render))

    if (render > 0) {
      const centreY = height * 0.48
      const padding = horizontalPadding(width)
      const available = width - padding * 2
      const lineWidth = available * smooth(render)
      const start = width * 0.5 - lineWidth * 0.5
      const glow = context.createLinearGradient(start, 0, start + lineWidth, 0)
      glow.addColorStop(0, 'rgba(125,227,168,0)')
      glow.addColorStop(0.2, 'rgba(125,227,168,.62)')
      glow.addColorStop(0.8, 'rgba(244,244,239,.8)')
      glow.addColorStop(1, 'rgba(244,244,239,0)')
      context.strokeStyle = glow
      context.lineWidth = 2
      context.beginPath()
      context.moveTo(start, centreY)
      context.lineTo(start + lineWidth, centreY)
      context.stroke()
      context.globalAlpha = smooth((render - 0.55) / 0.45)
      context.fillStyle = 'rgba(244,244,239,.64)'
      context.font = `${Math.max(8, Math.min(11, width / 125))}px 'DM Mono', monospace`
      context.textAlign = 'center'
      context.fillText('MIXDOWN REPRESENTATION / AUDIO WITHHELD', width * 0.5, centreY + 30)
      context.textAlign = 'left'
      context.globalAlpha = 1
    }
  }

  const drawScanner = (frame: WorldFrame, opacity: number) => {
    if (opacity <= 0) return
    const padding = horizontalPadding(frame.width)
    const scan = clamp(frame.progress - 1.75)
    const x = mix(padding, frame.width - padding, scan)
    const beam = context.createLinearGradient(x - 46, 0, x + 46, 0)
    beam.addColorStop(0, 'rgba(125,227,168,0)')
    beam.addColorStop(0.5, `rgba(125,227,168,${0.22 * opacity})`)
    beam.addColorStop(1, 'rgba(125,227,168,0)')
    context.fillStyle = beam
    context.fillRect(x - 46, frame.height * 0.18, 92, frame.height * 0.62)
    context.strokeStyle = `rgba(125,227,168,${0.72 * opacity})`
    context.beginPath()
    context.moveTo(x, frame.height * 0.18)
    context.lineTo(x, frame.height * 0.8)
    context.stroke()
  }

  return (frame: WorldFrame) => {
    const { width, height, dpr, progress } = frame
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, width, height)

    const specimenMorph = smooth((progress - 0.18) / 0.72)
    const split = smooth((progress - 0.48) / 0.72)
    const analysis = smooth((progress - 1.55) / 0.72)
    const converge = smooth((progress - 3.55) / 0.9)
    const render = smooth((progress - 4.6) / 0.95)

    if (progress < 1.05) drawSourceRing(frame, specimenMorph)
    if (progress >= 0.42) drawLanes(frame, split, analysis, converge, render)
    drawScanner(frame, analysis * (1 - smooth((progress - 2.8) / 0.5)))

    const fraction = clamp(progress / Math.max(1, Number(root.dataset.sceneCount) - 1))
    progressBar.style.transform = `scaleX(${fraction.toFixed(4)})`
    root.style.setProperty('--world-progress', fraction.toFixed(4))
    root.style.setProperty('--world-camera-y', `${mix(2.8, -2.8, fraction).toFixed(2)}%`)
    root.style.setProperty('--world-light-x', `${mix(-2.5, 2.5, fraction).toFixed(2)}vw`)
  }
}

const root = document.querySelector('[data-world-root]')
const canvas = document.querySelector('[data-world-canvas]')
const progressBar = document.querySelector('[data-world-progress]')
const countNode = document.querySelector('[data-world-scene-count]')
const labelNode = document.querySelector('[data-world-scene-label]')
const scenes = [...document.querySelectorAll<HTMLElement>('[data-world-scene]')]
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let lifecycle: WorldLifecycle | undefined

const restoreDestinationFocus = () => {
  const title = document.querySelector<HTMLElement>('#world-title')
  if (!title) return
  try {
    const focusPath = sessionStorage.getItem('paper-world-focus-path')
    if (focusPath !== window.location.pathname) return
    sessionStorage.removeItem('paper-world-focus-path')
    requestAnimationFrame(() => title.focus({ preventScroll: true }))
  } catch {
    // Storage and scripted focus are enhancements. The heading remains the document title.
  }
}

const stop = () => {
  lifecycle?.destroy()
  lifecycle = undefined
}

const start = () => {
  stop()
  if (
    reducedMotion.matches
    || !(root instanceof HTMLElement)
    || !(canvas instanceof HTMLCanvasElement)
    || !(progressBar instanceof HTMLElement)
    || !(countNode instanceof HTMLElement)
    || !(labelNode instanceof HTMLElement)
  ) {
    if (root instanceof HTMLElement) root.dataset.worldMode = 'static'
    return
  }

  const data = parseData()
  const context = canvas.getContext('2d', { alpha: true })
  if (!data || !context) {
    root.dataset.worldMode = 'static'
    return
  }

  root.dataset.worldReady = 'true'
  root.dataset.worldMode = 'animated'
  const draw = makeRenderer(context, data, root, progressBar)

  lifecycle = mountWorldLifecycle({
    root,
    canvas,
    sceneCount: scenes.length,
    draw,
    onActiveScene(activeIndex) {
      scenes.forEach((scene, index) => scene.classList.toggle('is-current', index === activeIndex))
      const activeScene = scenes[activeIndex]
      root.dataset.worldActiveScene = activeScene?.id ?? ''
      countNode.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`
      labelNode.textContent = activeScene?.querySelector('.world-scene-copy > p')?.textContent?.trim() ?? ''
    },
  })
}

window.addEventListener('pagehide', stop)
window.addEventListener('pageshow', () => { if (!lifecycle) start() })
window.addEventListener('world:destroy', stop)
reducedMotion.addEventListener('change', start)
restoreDestinationFocus()
start()
