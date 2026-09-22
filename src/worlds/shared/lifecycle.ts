/**
 * Shared lifecycle for the DOM/SVG illustrated worlds. Canvas worlds use
 * `src/scripts/world-lifecycle.ts`; both keep the same contract: native scroll is the
 * only required input, one 30fps ceiling, paused on hidden tabs, stopped on pagehide and
 * `world:destroy`, and an immediate composed state under reduced motion.
 *
 * `mountScrollScenes` is a port of the approved study engine (`illustrated-scroll.js`):
 * the active chapter and its local progress come from section offsets, so the owner-
 * approved choreography is reproduced exactly. `mountEventScenes` ports the Order
 * Supervisor study: scroll selects a chapter and one bounded eased event plays, then rests.
 */

const FRAME_INTERVAL = 1000 / 30

type Instrumented = { draws: number; firstDraw: number; maxDraw: number }

const instrument = (metrics: Instrumented, started: number, now: number) => {
  const body = document.body
  metrics.draws += 1
  if (!metrics.firstDraw) metrics.firstDraw = now
  metrics.maxDraw = Math.max(metrics.maxDraw, performance.now() - started)
  body.dataset.worldDrawCount = String(metrics.draws)
  body.dataset.worldDrawSpan = Math.max(0, now - metrics.firstDraw).toFixed(1)
  body.dataset.worldMaxDraw = metrics.maxDraw.toFixed(2)
}

const markChapters = (index: number) => {
  document.querySelectorAll('.chapter-nav a, .chapters a').forEach((link, position) => {
    if (position === index) link.setAttribute('aria-current', 'step')
    else link.removeAttribute('aria-current')
  })
}

/** The Sheet Fault transition stores the destination; the world heading takes focus once. */
export function restoreWorldFocus() {
  try {
    if (sessionStorage.getItem('paper-world-focus-path') !== window.location.pathname) return
    sessionStorage.removeItem('paper-world-focus-path')
    requestAnimationFrame(() => document.querySelector<HTMLElement>('#world-title')?.focus({ preventScroll: true }))
  } catch {
    /* sessionStorage can throw in privacy modes */
  }
}

export interface ScrollScenesOptions {
  /** Called with the active chapter, its local progress (0-1) and the reduced-motion state. */
  paint: (index: number, progress: number, reduced: boolean) => void
  /** Class toggled on <html> while the enhanced composition is active. */
  enhancedClass?: string
}

export interface SceneController {
  refresh: () => void
  destroy: () => void
}

export function mountScrollScenes({ paint, enhancedClass = 'illustrated' }: ScrollScenesOptions): SceneController {
  const scenes = [...document.querySelectorAll<HTMLElement>('[data-world-scene]')]
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const body = document.body
  const abort = new AbortController()
  const signal = abort.signal
  const metrics: Instrumented = { draws: 0, firstDraw: 0, maxDraw: 0 }
  let frame = 0
  let last = -Infinity
  let destroyed = false
  // Chapter offsets are cached and refreshed only when a chapter resizes, so a frame never
  // forces a synchronous layout after the previous frame's style writes. The one-time
  // measurement is recorded separately from per-frame drawing cost.
  let positions: number[] | undefined
  let maxMeasure = 0
  const measure = () => {
    const started = performance.now()
    positions = scenes.map((element) => element.offsetTop)
    maxMeasure = Math.max(maxMeasure, performance.now() - started)
    body.dataset.worldMaxMeasure = maxMeasure.toFixed(2)
    return positions
  }

  const draw = (now: number, positions: number[]) => {
    const started = performance.now()
    const y = window.scrollY + window.innerHeight * 0.25
    let index = 0
    while (index < scenes.length - 1 && y >= positions[index + 1]) index += 1
    const span = positions[index + 1] - positions[index] || window.innerHeight
    const progress = Math.max(0, Math.min(1, (y - positions[index]) / span))
    body.dataset.scene = String(index)
    body.dataset.worldActiveScene = scenes[index]?.id ?? ''
    markChapters(index)
    document.documentElement.style.setProperty('--journey', `${((index + progress) / scenes.length) * 100}%`)
    paint(index, reduce.matches ? 1 : progress, reduce.matches)
    instrument(metrics, started, now)
  }

  const tick = (now: number) => {
    frame = 0
    if (destroyed || document.hidden) return
    if (now - last < FRAME_INTERVAL) {
      frame = requestAnimationFrame(tick)
      return
    }
    last = now
    body.dataset.worldState = 'running'
    draw(now, positions ?? measure())
    body.dataset.worldState = 'idle'
  }

  const schedule = () => {
    if (destroyed || frame || document.hidden) return
    frame = requestAnimationFrame(tick)
  }

  const cancel = () => {
    if (frame) cancelAnimationFrame(frame)
    frame = 0
  }

  const configure = () => {
    if (destroyed) return
    const enhanced = !reduce.matches
    document.documentElement.classList.toggle(enhancedClass, enhanced)
    body.dataset.worldMode = enhanced ? 'animated' : 'static'
    if (enhanced) body.dataset.worldReady = 'true'
    else delete body.dataset.worldReady
    schedule()
  }

  const invalidate = () => {
    positions = undefined
    schedule()
  }
  const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(invalidate) : undefined
  scenes.forEach((scene) => resizeObserver?.observe(scene))

  window.addEventListener('scroll', schedule, { passive: true, signal })
  window.addEventListener('resize', invalidate, { passive: true, signal })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancel()
      body.dataset.worldState = 'paused'
    } else schedule()
  }, { signal })
  window.addEventListener('pagehide', () => {
    cancel()
    body.dataset.worldState = 'stopped'
  }, { signal })
  window.addEventListener('pageshow', () => {
    positions = undefined
    configure()
  }, { signal })
  reduce.addEventListener('change', () => {
    positions = undefined
    configure()
  }, { signal })

  const destroy = () => {
    if (destroyed) return
    destroyed = true
    cancel()
    resizeObserver?.disconnect()
    abort.abort()
    body.dataset.worldState = 'stopped'
  }
  window.addEventListener('world:destroy', destroy, { signal })

  configure()
  return { refresh: schedule, destroy }
}

export interface EventScenesOptions<State extends Record<string, number | string>> {
  /** One composed state per chapter; numeric keys interpolate, the rest switch at selection. */
  states: State[]
  /** Duration of one chapter event in milliseconds. */
  duration: number
  paint: (state: State) => void
  onSelect?: (index: number, state: State) => void
  /** Maps the event's global progress to a key's local progress (for staged phases). */
  phase?: (key: string, progress: number) => number
  /** Final adjustment after interpolation, for example a mechanical rebound. */
  adjust?: (current: State, progress: number, active: number) => void
  /** Optional establishing move when the page opens on the first chapter. */
  intro?: (current: State) => void
  enhancedClass?: string
}

export function mountEventScenes<State extends Record<string, number | string>>(options: EventScenesOptions<State>): SceneController {
  const { states, duration, paint, onSelect, phase, adjust, intro, enhancedClass = 'enhanced' } = options
  const scenes = [...document.querySelectorAll<HTMLElement>('[data-world-scene]')]
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const body = document.body
  const abort = new AbortController()
  const signal = abort.signal
  const metrics: Instrumented = { draws: 0, firstDraw: 0, maxDraw: 0 }
  const numberKeys = Object.keys(states[0]).filter((key) => typeof states[0][key] === 'number')
  const smooth = (t: number) => t * t * (3 - 2 * t)
  let active = -1
  let current: State = { ...states[states.length - 1] }
  let origin: State = { ...current }
  let raf = 0
  let scrollFrame = 0
  let start = 0
  let last = 0
  let destroyed = false

  const render = (now = performance.now()) => {
    const started = performance.now()
    paint(current)
    instrument(metrics, started, now)
  }

  const stop = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    body.dataset.worldState = 'idle'
  }

  const tick = (now: number) => {
    raf = 0
    if (destroyed || document.hidden || reduce.matches) return stop()
    if (now - last < FRAME_INTERVAL) {
      raf = requestAnimationFrame(tick)
      return
    }
    last = now
    const progress = Math.min(1, (now - start) / duration)
    const target = states[active]
    const next = { ...current } as Record<string, number | string>
    for (const key of numberKeys) {
      const local = phase ? phase(key, progress) : progress
      next[key] = (origin[key] as number) + ((target[key] as number) - (origin[key] as number)) * smooth(local)
    }
    current = next as State
    adjust?.(current, progress, active)
    render(now)
    if (progress < 1) raf = requestAnimationFrame(tick)
    else body.dataset.worldState = 'idle'
  }

  const play = () => {
    origin = { ...current }
    start = performance.now()
    body.dataset.worldState = 'running'
    raf = requestAnimationFrame(tick)
  }

  const select = (index: number, immediate = false) => {
    if (active === index && !immediate) return
    stop()
    active = index
    body.dataset.scene = String(index)
    body.dataset.worldActiveScene = scenes[index]?.id ?? ''
    markChapters(index)
    onSelect?.(index, states[index])
    if (immediate) {
      current = { ...states[index] }
      render()
      return
    }
    play()
  }

  const nearest = () => {
    let index = 0
    let best = Infinity
    scenes.forEach((scene, position) => {
      const bounds = scene.getBoundingClientRect()
      const distance = Math.abs(bounds.top + bounds.height / 2 - window.innerHeight / 2)
      if (distance < best) {
        best = distance
        index = position
      }
    })
    return index
  }

  const locate = () => {
    scrollFrame = 0
    if (destroyed || reduce.matches || document.hidden) return
    select(nearest())
  }

  const schedule = () => {
    if (!destroyed && !scrollFrame && !document.hidden) scrollFrame = requestAnimationFrame(locate)
  }

  const configure = () => {
    if (destroyed) return
    stop()
    if (scrollFrame) cancelAnimationFrame(scrollFrame)
    scrollFrame = 0
    const enhanced = !reduce.matches
    document.documentElement.classList.toggle(enhancedClass, enhanced)
    body.dataset.worldMode = enhanced ? 'animated' : 'static'
    if (enhanced) body.dataset.worldReady = 'true'
    else delete body.dataset.worldReady
    active = -1
    if (!enhanced) {
      select(states.length - 1, true)
      return
    }
    // The study located, started an event, then snapped to it; snapping directly to the
    // nearest chapter is the same result and stays valid when the tab opens hidden.
    select(nearest(), true)
    if (active === 0 && intro) {
      intro(current)
      render()
      active = -1
      select(0)
    }
  }

  window.addEventListener('scroll', schedule, { passive: true, signal })
  window.addEventListener('resize', () => {
    render()
    schedule()
  }, { passive: true, signal })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop()
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
      scrollFrame = 0
      body.dataset.worldState = 'paused'
    } else {
      active = -1
      schedule()
    }
  }, { signal })
  window.addEventListener('pagehide', () => {
    stop()
    if (scrollFrame) cancelAnimationFrame(scrollFrame)
    scrollFrame = 0
    body.dataset.worldState = 'stopped'
  }, { signal })
  window.addEventListener('pageshow', configure, { signal })
  reduce.addEventListener('change', configure, { signal })

  const destroy = () => {
    if (destroyed) return
    destroyed = true
    stop()
    if (scrollFrame) cancelAnimationFrame(scrollFrame)
    abort.abort()
    body.dataset.worldState = 'stopped'
  }
  window.addEventListener('world:destroy', destroy, { signal })

  configure()
  return { refresh: () => render(), destroy }
}
