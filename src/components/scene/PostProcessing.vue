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

  composer.setSize(sizes.width.value, sizes.height.value, false)
}

function createComposer() {
  const activeRenderer = renderer.value
  const activeCamera = camera.value

  if (composer || !activeRenderer || !activeCamera) {
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
        luminanceThreshold: 0.18,
        luminanceSmoothing: 0.06,
        intensity: 1.6,
        mipmapBlur: true,
      }),
    ),
  )
  syncComposerSize()

  const renderHandle = loop.render(({ delta }) => {
    const frameComposer = composer

    if (!frameComposer) {
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
