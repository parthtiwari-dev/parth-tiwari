import * as THREE from 'three'

export const NODE_HOVER_SCALE = 1.4
export const CLUSTER_HOVER_BRIGHTNESS = 1.4

export interface NodeMeshEntry {
  projectId: string
  clusterIndex: number
  mesh: THREE.Mesh
}

interface NodeInteractionOptions {
  getCamera: () => THREE.Camera | undefined
  getRenderer: () => THREE.WebGLRenderer | undefined
  getNodes: () => NodeMeshEntry[]
  isEnabled?: () => boolean
  onHover: (projectId: string | null, clusterIndex: number | null) => void
  onSelect: (projectId: string) => void
}

export function useNodeInteraction(options: NodeInteractionOptions) {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let hoveredProjectId: string | null = null

  /**
   * Time-throttled, with a trailing pick (PLAN.md 8.10).
   *
   * This throttled by dropping every *other* `pointermove` — `tick = (tick + 1)
   * % 2`, return on odd. Two things are wrong with that. It is not actually a
   * throttle: event rate varies by device and pointer, so on a 120Hz trackpad
   * it still picked 60 times a second while on a slow one it halved an already
   * sparse stream. And because it drops by parity rather than by time, the
   * event that gets dropped can be the *last* one — the pointer comes to rest
   * on a star and the hover never fires, which reads as a star that sometimes
   * refuses to respond.
   *
   * That got worse when orbital speeds were scaled up (8.3): a star now moves
   * 40-80px per second, so a dropped final event leaves the pick resolved
   * against a position the star has already left. `npm run labels` caught it as
   * a hover that produced no card.
   *
   * So: at most one pick per frame, and if an event arrives inside that window
   * it is remembered and picked on the next frame rather than thrown away.
   */
  const PICK_INTERVAL_MS = 16
  let lastPickAt = 0
  let pendingEvent: PointerEvent | null = null
  let trailingFrame = 0

  function pick(event: PointerEvent) {
    const renderer = options.getRenderer()
    const camera = options.getCamera()

    if (!renderer || !camera) {
      return null
    }

    const canvas = renderer.domElement
    const rect = canvas.getBoundingClientRect()

    if (rect.width <= 0 || rect.height <= 0) {
      return null
    }

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)

    const nodes = options.getNodes()
    const intersections = raycaster.intersectObjects(
      nodes.map((node) => node.mesh),
      false,
    )

    const hit = intersections[0]?.object
    return nodes.find((node) => node.mesh === hit) ?? null
  }

  function setHover(entry: NodeMeshEntry | null) {
    const nextProjectId = entry?.projectId ?? null

    if (hoveredProjectId === nextProjectId) {
      return
    }

    hoveredProjectId = nextProjectId
    options.onHover(nextProjectId, entry?.clusterIndex ?? null)
  }

  function runPick(event: PointerEvent) {
    lastPickAt = performance.now()
    pendingEvent = null
    setHover(pick(event))
  }

  function handlePointerMove(event: PointerEvent) {
    if (options.isEnabled && !options.isEnabled()) {
      setHover(null)
      return
    }

    if (performance.now() - lastPickAt >= PICK_INTERVAL_MS) {
      runPick(event)
      return
    }

    // Inside the window: remember it and resolve on the next frame, so the
    // pointer coming to rest always ends with a pick against where it stopped.
    pendingEvent = event
    if (trailingFrame) return
    trailingFrame = requestAnimationFrame(() => {
      trailingFrame = 0
      const held = pendingEvent
      if (!held) return
      if (options.isEnabled && !options.isEnabled()) return
      runPick(held)
    })
  }

  /**
   * A press is not a click (PLAN.md 4.10).
   *
   * This opened the overlay on `pointerdown`, with no movement threshold and no
   * `pointerup`. Pressing a star to orbit the scene therefore selected it the
   * instant the button went down — before the drag had moved a single pixel —
   * so the one gesture the scene is built around could not be started from the
   * one place a visitor naturally reaches for. Drag from empty space and free
   * orbit worked; drag from a star and you got a dialog.
   *
   * Discriminate the way every other pointer surface does: remember what was
   * under the press, and only select if the pointer comes back up on the same
   * node without having travelled. `SLOP` is in CSS pixels and deliberately
   * generous — a touch press wanders a few pixels on its own, and the cost of
   * being strict is a tap that does nothing.
   */
  const SLOP = 6
  let pressedProjectId: string | null = null
  let pressedAt: { x: number; y: number } | null = null

  function handlePointerDown(event: PointerEvent) {
    pressedProjectId = null
    pressedAt = null

    if (options.isEnabled && !options.isEnabled()) {
      return
    }

    const entry = pick(event)
    if (!entry) return

    pressedProjectId = entry.projectId
    pressedAt = { x: event.clientX, y: event.clientY }
  }

  function handlePointerUp(event: PointerEvent) {
    const projectId = pressedProjectId
    const from = pressedAt
    pressedProjectId = null
    pressedAt = null

    if (!projectId || !from) return
    if (options.isEnabled && !options.isEnabled()) return
    if (Math.hypot(event.clientX - from.x, event.clientY - from.y) > SLOP) return

    // Re-pick on release: the scene keeps moving under a stationary pointer
    // (nodes orbit, and the idle drift rotates the rig), so "same place" is not
    // the same thing as "same star".
    const entry = pick(event)
    if (entry?.projectId !== projectId) return

    options.onSelect(projectId)
  }

  function handlePointerCancel() {
    pressedProjectId = null
    pressedAt = null
  }

  function cancelTrailing() {
    if (!trailingFrame) return
    cancelAnimationFrame(trailingFrame)
    trailingFrame = 0
    pendingEvent = null
  }

  function handlePointerLeave() {
    setHover(null)
    handlePointerCancel()
  }

  function start() {
    let frameId = 0

    function attach() {
      const renderer = options.getRenderer()

      if (!renderer) {
        frameId = requestAnimationFrame(attach)
        return
      }

      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      window.addEventListener('pointerdown', handlePointerDown)
      window.addEventListener('pointerup', handlePointerUp)
      window.addEventListener('pointercancel', handlePointerCancel)
      window.addEventListener('blur', handlePointerLeave)
    }

    attach()

    return () => {
      cancelAnimationFrame(frameId)
      cancelTrailing()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerCancel)
      window.removeEventListener('blur', handlePointerLeave)
    }
  }

  return { start }
}
