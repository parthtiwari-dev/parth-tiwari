<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import * as THREE from 'three'

const { camera, renderer, scene, sizes } = useTres()
const loop = useLoop()
let composer: EffectComposer | null = null
let stopRender: (() => void) | null = null
let stopWatch: (() => void) | null = null

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
  composer.addPass(
    new EffectPass(
      activeCamera,
      new BloomEffect({
        luminanceThreshold: 0.62,
        luminanceSmoothing: 0.08,
        intensity: 0.58,
        mipmapBlur: true,
      }),
    ),
  )
  syncComposerSize()

  const renderHandle = loop.render(({ delta }) => {
    const frameComposer = composer

    if (!frameComposer || sizes.width.value <= 0 || sizes.height.value <= 0) {
      return
    }

    if (camera.value) {
      frameComposer.setMainCamera(camera.value)
    }

    frameComposer.render(delta)
  })

  stopRender = renderHandle.off
}

onMounted(() => {
  stopWatch = watch(
    [renderer, camera, sizes.width, sizes.height],
    () => {
      createComposer()
      syncComposerSize()
    },
    { immediate: true },
  )
})

onUnmounted(() => {
  stopWatch?.()
  stopRender?.()
  composer?.dispose()
  composer = null
})
</script>

<template></template>
