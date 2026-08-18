<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import {
  BloomEffect,
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  NoiseEffect,
  RenderPass,
} from 'postprocessing'
import * as THREE from 'three'
import { getQuality } from '@/utils/qualityTier'

const { camera, renderer, scene, sizes } = useTres()
const loop = useLoop()
let composer: EffectComposer | null = null

/**
 * Aberration is driven by how fast the camera is actually moving, so it reads as
 * a lens under stress rather than as a constant colour fringe. A fixed offset is
 * the usual mistake — it looks like a broken display on a still frame.
 */
let aberration: ChromaticAberrationEffect | null = null
const previousCameraPosition = new THREE.Vector3()
let cameraSpeed = 0

function syncComposerSize() {
  if (!composer) {
    return
  }

  const width = sizes.width.value
  const height = sizes.height.value

  if (width <= 0 || height <= 0) {
    return
  }

  composer.setSize(width, height, false)
}

function createComposer() {
  const activeRenderer = renderer.value
  const activeCamera = camera.value
  const width = sizes.width.value
  const height = sizes.height.value

  if (composer || !activeRenderer || !activeCamera || width <= 0 || height <= 0) {
    return
  }

  composer = new EffectComposer(activeRenderer, {
    frameBufferType: THREE.HalfFloatType,
  })
  composer.addPass(new RenderPass(scene.value, activeCamera))

  const effects: ConstructorParameters<typeof EffectPass>[1][] = [
    new BloomEffect({
      luminanceThreshold: 0.52,
      luminanceSmoothing: 0.1,
      intensity: 0.72,
      mipmapBlur: true,
    }),
  ]

  /**
   * Chromatic aberration and grain are high tier only (PLAN.md 6.11).
   *
   * Both are cheap per fragment but they are not free, and the medium tier is
   * the one already running a 42-noise sky shader on a phone that reports eight
   * cores and then throttles. Bloom is the effect that carries the look; these
   * two are the ones that can go first.
   *
   * **Depth of field is deliberately not here.** 6.11 asks for a racking focus
   * on approach, and `DepthOfFieldEffect` would do it — but it needs a depth
   * pass, and the subjects in this scene are small bright points against black.
   * Blurring by depth blurs exactly the thing the viewer is looking at, and the
   * bokeh it produces on a bloomed point light is a smear rather than a circle.
   * The FOV change already carries "approach" (4.3). Cost with no gain.
   */
  if (getQuality().tier === 'high') {
    aberration = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0, 0),
      radialModulation: true,
      modulationOffset: 0.3,
    })
    effects.push(aberration)
    // Very low opacity: film grain that you can see is a filter, not a finish.
    // `opacity` is not a constructor option in postprocessing 6 — it lives on
    // the effect's blend mode.
    const grain = new NoiseEffect({ premultiply: true })
    grain.blendMode.opacity.value = 0.028
    effects.push(grain)
  }

  composer.addPass(new EffectPass(activeCamera, ...effects))
  syncComposerSize()
}

const renderHandle = loop.render(({ delta }) => {
  const frameComposer = composer

  if (!frameComposer || sizes.width.value <= 0 || sizes.height.value <= 0) {
    return
  }

  if (camera.value) {
    frameComposer.setMainCamera(camera.value)
  }

  if (aberration && camera.value && delta > 0) {
    const moved = camera.value.position.distanceTo(previousCameraPosition) / delta
    previousCameraPosition.copy(camera.value.position)
    // Smoothed hard: raw frame-to-frame speed spikes on any scroll jump and the
    // fringe would strobe.
    cameraSpeed += (Math.min(moved, 24) - cameraSpeed) * Math.min(delta * 4, 1)
    const strength = Math.min(cameraSpeed / 24, 1) * 0.0016
    aberration.offset.set(strength, strength * 0.6)
  }

  frameComposer.render(delta)
})

const stopWatch = watch(
  [renderer, camera, sizes.width, sizes.height],
  () => {
    createComposer()
    syncComposerSize()
  },
  { immediate: true },
)

onUnmounted(() => {
  stopWatch()
  renderHandle.off()
  composer?.dispose()
  composer = null
})
</script>

<template></template>
