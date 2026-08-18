<script setup lang="ts">
/**
 * Dev-only camera authoring GUI (PLAN.md 2.8). `?debug=1` only.
 *
 * This is only worth building because 2.2 made the path data. Previously a pose
 * was five positions in one array and two look-at points in another with a
 * hardcoded smoothstep between them, so there was nothing a GUI could
 * meaningfully write back. Now a pose is a record, and "drag until it looks
 * right, then copy the record" is a real workflow.
 *
 * Tweakpane is a devDependency and this component is only ever reached through
 * an async import behind the debug flag, so it is code-split out of the
 * production entry. Confirm that after any change: it must not appear in the
 * main chunk.
 */
import { onMounted, onUnmounted, ref } from 'vue'
import { useTres } from '@tresjs/core'
import * as THREE from 'three'
import { CAMERA_POSES, sampleCameraPath, type CameraSample } from '@/data/cameraPath'

const { camera } = useTres()
const container = ref<HTMLElement | null>(null)

let pane: { dispose: () => void } | null = null

const sample: CameraSample = {
  position: new THREE.Vector3(),
  target: new THREE.Vector3(),
}

const state = {
  progress: 0,
  // Live read-back of where the sampled path actually puts the camera. Editing
  // these is not the workflow — scrub, look, then copy.
  posX: 0, posY: 0, posZ: 0,
  tgtX: 0, tgtY: 0, tgtZ: 0,
}

function syncFromPath() {
  sampleCameraPath(state.progress, sample)
  state.posX = round(sample.position.x)
  state.posY = round(sample.position.y)
  state.posZ = round(sample.position.z)
  state.tgtX = round(sample.target.x)
  state.tgtY = round(sample.target.y)
  state.tgtZ = round(sample.target.z)

  const activeCamera = camera.value
  if (activeCamera) {
    activeCamera.position.copy(sample.position)
    activeCamera.lookAt(sample.target)
  }
}

function round(n: number) {
  return Math.round(n * 100) / 100
}

/** Emits the whole array, not one pose — a pose is only meaningful in order. */
function posesAsSource(): string {
  const rows = CAMERA_POSES.map((pose) => {
    const p = pose.position
    const t = pose.target
    return `  { at: ${pose.at}, position: new THREE.Vector3(${round(p.x)}, ${round(p.y)}, ${round(p.z)}), target: new THREE.Vector3(${round(t.x)}, ${round(t.y)}, ${round(t.z)}) },`
  })
  return `export const CAMERA_POSES: CameraPose[] = [\n${rows.join('\n')}\n]`
}

onMounted(async () => {
  if (!container.value) return
  const { Pane } = await import('tweakpane')

  const p = new Pane({ container: container.value, title: 'camera path' })
  pane = p

  p.addBinding(state, 'progress', { min: 0, max: 1, step: 0.001 }).on('change', syncFromPath)

  const read = p.addFolder({ title: 'sampled', expanded: true })
  for (const key of ['posX', 'posY', 'posZ', 'tgtX', 'tgtY', 'tgtZ'] as const) {
    read.addBinding(state, key, { readonly: true })
  }

  p.addButton({ title: 'copy CAMERA_POSES' }).on('click', () => {
    const source = posesAsSource()
    navigator.clipboard?.writeText(source).catch(() => {})
    // Logged as well as copied: clipboard write fails silently without a user
    // gesture in some contexts, and losing the poses to that would be annoying.
    console.log(source)
  })

  syncFromPath()
})

onUnmounted(() => {
  pane?.dispose()
  pane = null
})
</script>

<template>
  <div ref="container" class="camera-authoring" />
</template>

<style scoped>
.camera-authoring {
  position: fixed;
  top: 4.5rem;
  right: 1rem;
  z-index: 95;
  width: 17rem;
}
</style>
