<script setup lang="ts">
/**
 * The body every project orbits (PLAN.md 6.7 — DESIGN.md §5).
 *
 * **It did not exist.** DESIGN.md specifies iridescent thin-film shading "on the
 * center star" and the scene had no centre star — twelve nodes orbiting an empty
 * origin. The composition wanted the anchor: `layout.ts` derives every position
 * as a radius and an angle *about a centre*, and until now that centre was the
 * one thing in the derivation with nothing to show for it.
 *
 * What it encodes: the person the work belongs to. Radius is maturity measured
 * *from here*, and the arc is a career read clockwise — both are statements
 * about a subject, and this is the subject.
 *
 * Deliberately small and quiet. It is the origin of the coordinate system, not a
 * sun: making it dominant would invert the point of a portfolio, which is that
 * the work is the evidence.
 */
import { onMounted, onUnmounted } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import * as THREE from 'three'
import fragmentShader from '@/shaders/thinFilm.frag.glsl'
import vertexShader from '@/shaders/thinFilm.vert.glsl'
import { readToken } from '@/utils/cssTokens'

const { scene } = useTres()

const uniforms = {
  uTime: { value: 0 },
  uTint: { value: new THREE.Color(readToken('--gold', '#c9a84c')) },
  uOpacity: { value: 1 },
}

const geometry = new THREE.SphereGeometry(0.42, 48, 32)
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  transparent: true,
  depthWrite: false,
  // Additive would blow the interference bands out to white and lose the colour
  // that is the entire point. Normal blending keeps them readable against the sky.
  blending: THREE.NormalBlending,
  side: THREE.FrontSide,
})

const mesh = new THREE.Mesh(geometry, material)
mesh.name = 'EphemerisCentreStar'
mesh.renderOrder = 2

onMounted(() => {
  scene.value.add(mesh)
})

const loopStop = useLoop().onBeforeRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed
  // A slow tumble, so the bands sweep across the surface rather than only
  // shifting with the camera. Barely perceptible on purpose.
  mesh.rotation.y = elapsed * 0.06
  mesh.rotation.x = Math.sin(elapsed * 0.04) * 0.22
})

onUnmounted(() => {
  loopStop.off()
  scene.value.remove(mesh)
  geometry.dispose()
  material.dispose()
})
</script>

<template></template>
