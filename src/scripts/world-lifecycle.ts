export interface WorldFrame {
  progress: number
  activeIndex: number
  width: number
  height: number
  dpr: number
  now: number
}

interface WorldLifecycleOptions {
  root: HTMLElement
  canvas: HTMLCanvasElement
  sceneCount: number
  draw: (frame: WorldFrame) => void
  onActiveScene: (activeIndex: number, progress: number) => void
}

export interface WorldLifecycle {
  destroy: () => void
}

const FRAME_INTERVAL = 1000 / 30

const clamp = (value: number, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value))

export function mountWorldLifecycle(options: WorldLifecycleOptions): WorldLifecycle {
  const { root, canvas, sceneCount, draw, onActiveScene } = options
  const abortController = new AbortController()
  const signal = abortController.signal
  let observer: IntersectionObserver | undefined
  let resizeObserver: ResizeObserver | undefined
  let frameId = 0
  let lastDraw = -Infinity
  let targetProgress = 0
  let currentProgress = 0
  let activeIndex = -1
  let visible = true
  let destroyed = false
  let dimensions = { width: 0, height: 0, dpr: 1 }
  let drawCount = 0
  let firstDraw = 0
  let maxDrawDuration = 0

  const readDimensions = () => {
    const bounds = canvas.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return false
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    const pixelWidth = Math.round(bounds.width * dpr)
    const pixelHeight = Math.round(bounds.height * dpr)
    const changed = canvas.width !== pixelWidth || canvas.height !== pixelHeight
    if (changed) {
      canvas.width = pixelWidth
      canvas.height = pixelHeight
    }
    dimensions = { width: bounds.width, height: bounds.height, dpr }
    return changed
  }

  const readProgress = () => {
    const bounds = root.getBoundingClientRect()
    const travel = Math.max(1, bounds.height - window.innerHeight)
    const fraction = clamp(-bounds.top / travel)
    targetProgress = fraction * Math.max(0, sceneCount - 1)
  }

  const schedule = () => {
    if (destroyed || frameId || document.hidden || !visible) return
    frameId = requestAnimationFrame(renderFrame)
  }

  const markRunning = () => {
    if (!root.dataset.worldRunning && dimensions.width > 0 && dimensions.height > 0) {
      root.dataset.worldRunning = 'true'
    }
  }

  // Chapter tracking runs off the scroll position directly, so the active scene and HUD
  // stay correct even where requestAnimationFrame is throttled to nothing. The canvas
  // still eases via currentProgress inside renderFrame.
  const SWITCH_BAND = 0.16
  const syncActiveScene = () => {
    const maxIndex = Math.max(0, sceneCount - 1)
    const rounded = clamp(Math.round(targetProgress), 0, maxIndex)
    if (rounded === activeIndex) return
    // Hysteresis: an active chapter holds until the scroll is clearly into the next
    // one, so jitter near the midpoint cannot flip two narration blocks back and
    // forth through half opacity.
    if (activeIndex >= 0 && Math.abs(targetProgress - activeIndex) < 0.5 + SWITCH_BAND) return
    activeIndex = rounded
    onActiveScene(activeIndex, targetProgress)
  }

  const renderFrame = (now: number) => {
    frameId = 0
    if (destroyed || document.hidden || !visible) return
    const elapsed = now - lastDraw
    if (elapsed < FRAME_INTERVAL) {
      schedule()
      return
    }

    const delta = targetProgress - currentProgress
    currentProgress = Math.abs(delta) < 0.001 ? targetProgress : currentProgress + delta * 0.24
    syncActiveScene()

    readDimensions()
    const drawStarted = performance.now()
    draw({ ...dimensions, progress: currentProgress, activeIndex, now })
    maxDrawDuration = Math.max(maxDrawDuration, performance.now() - drawStarted)
    lastDraw = now
    drawCount += 1
    if (!firstDraw) firstDraw = now
    markRunning()
    root.dataset.worldDrawCount = String(drawCount)
    root.dataset.worldDrawSpan = String(Math.max(0, now - firstDraw).toFixed(1))
    root.dataset.worldMaxDraw = maxDrawDuration.toFixed(2)
    root.dataset.worldState = 'running'

    if (Math.abs(targetProgress - currentProgress) >= 0.001) schedule()
  }

  const refresh = () => {
    // Self-heal: if the stage overlaps the viewport we are visible, whatever a stale
    // IntersectionObserver entry claimed. Without this a single missed entry can wedge
    // the RAF loop and leave the scenes de-emphasised with no active chapter.
    const bounds = root.getBoundingClientRect()
    if (bounds.bottom > 0 && bounds.top < window.innerHeight) visible = true
    readProgress()
    syncActiveScene()
    readDimensions()
    schedule()
  }

  const onVisibilityChange = () => {
    if (document.hidden) {
      if (frameId) cancelAnimationFrame(frameId)
      frameId = 0
      root.dataset.worldState = 'paused'
      return
    }
    refresh()
  }

  window.addEventListener('scroll', refresh, { passive: true, signal })
  window.addEventListener('resize', refresh, { passive: true, signal })
  window.addEventListener('orientationchange', refresh, { passive: true, signal })
  document.addEventListener('visibilitychange', onVisibilityChange, { signal })

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1]
      visible = entry?.isIntersecting ?? true
      root.dataset.worldViewport = visible ? 'visible' : 'hidden'
      if (!visible && frameId) {
        cancelAnimationFrame(frameId)
        frameId = 0
      }
      if (visible) refresh()
    }, { threshold: 0, rootMargin: '256px' })
    observer.observe(root)
  }

  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(refresh)
    resizeObserver.observe(canvas)
  }

  // Prime the first scene before the RAF loop starts, so the DOM is never left in the
  // pre-active state (no is-current, scenes not yet highlighted) and a deep-link or a
  // reload mid-world opens on the correct chapter with no opening scrub.
  readProgress()
  readDimensions()
  currentProgress = targetProgress
  activeIndex = clamp(Math.round(currentProgress), 0, Math.max(0, sceneCount - 1))
  onActiveScene(activeIndex, currentProgress)
  schedule()

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      if (frameId) cancelAnimationFrame(frameId)
      frameId = 0
      observer?.disconnect()
      resizeObserver?.disconnect()
      abortController.abort()
      root.dataset.worldState = 'stopped'
      root.removeAttribute('data-world-ready')
      root.removeAttribute('data-world-running')
    },
  }
}
