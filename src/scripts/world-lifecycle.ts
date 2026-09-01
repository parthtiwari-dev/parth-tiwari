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
    const nextActive = clamp(Math.round(currentProgress), 0, Math.max(0, sceneCount - 1))
    if (nextActive !== activeIndex) {
      activeIndex = nextActive
      onActiveScene(activeIndex, currentProgress)
    }

    readDimensions()
    const drawStarted = performance.now()
    draw({ ...dimensions, progress: currentProgress, activeIndex, now })
    maxDrawDuration = Math.max(maxDrawDuration, performance.now() - drawStarted)
    lastDraw = now
    drawCount += 1
    if (!firstDraw) firstDraw = now
    root.dataset.worldDrawCount = String(drawCount)
    root.dataset.worldDrawSpan = String(Math.max(0, now - firstDraw).toFixed(1))
    root.dataset.worldMaxDraw = maxDrawDuration.toFixed(2)
    root.dataset.worldState = 'running'

    if (Math.abs(targetProgress - currentProgress) >= 0.001) schedule()
  }

  const refresh = () => {
    readProgress()
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
    observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
      root.dataset.worldViewport = visible ? 'visible' : 'hidden'
      if (!visible && frameId) {
        cancelAnimationFrame(frameId)
        frameId = 0
      }
      if (visible) refresh()
    }, { threshold: 0 })
    observer.observe(root)
  }

  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(refresh)
    resizeObserver.observe(canvas)
  }

  refresh()

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
    },
  }
}
