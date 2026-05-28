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
  onHover: (projectId: string | null, clusterIndex: number | null) => void
  onSelect: (projectId: string) => void
}

export function useNodeInteraction(options: NodeInteractionOptions) {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let hoveredProjectId: string | null = null
  let pointerMoveTick = 0

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

  function handlePointerMove(event: PointerEvent) {
    pointerMoveTick = (pointerMoveTick + 1) % 2

    if (pointerMoveTick === 1) {
      return
    }

    setHover(pick(event))
  }

  function handlePointerDown(event: PointerEvent) {
    const entry = pick(event)

    if (entry) {
      options.onSelect(entry.projectId)
    }
  }

  function handlePointerLeave() {
    setHover(null)
  }

  function start() {
    let canvas: HTMLCanvasElement | null = null
    let frameId = 0

    function attach() {
      const renderer = options.getRenderer()

      if (!renderer) {
        frameId = requestAnimationFrame(attach)
        return
      }

      canvas = renderer.domElement
      canvas.addEventListener('pointermove', handlePointerMove, { passive: true })
      canvas.addEventListener('pointerdown', handlePointerDown)
      canvas.addEventListener('pointerleave', handlePointerLeave)
    }

    attach()

    return () => {
      cancelAnimationFrame(frameId)

      if (!canvas) {
        return
      }

      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
    }
  }

  return { start }
}
