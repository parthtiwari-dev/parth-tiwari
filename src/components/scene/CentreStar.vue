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
import fragmentShader from '@/shaders/star.frag.glsl'
import vertexShader from '@/shaders/star.vert.glsl'
import coronaFragment from '@/shaders/corona.frag.glsl'
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
  // Opaque, and depth-writing. The thin-film version was transparent with
  // `depthWrite: false` so the particle field showed straight through it — a
  // body you can see stars behind is not a body, which is a large part of why
  // the old one read as a decal rather than an object.
  transparent: false,
  depthWrite: true,
  blending: THREE.NormalBlending,
  side: THREE.FrontSide,
})

const mesh = new THREE.Mesh(geometry, material)
mesh.name = 'EphemerisCentreStar'
mesh.renderOrder = 2

/**
 * The corona (PLAN.md 8.5).
 *
 * A star's disc is not where most of its light is. Without something outside
 * the silhouette the sphere reads as a ball painted bright, and no amount of
 * work on the body fixes that — the glow *is* the difference between an
 * emitter and a lit object.
 *
 * A camera-facing plane rather than a second sphere: the falloff is radial in
 * screen space, so a billboard is the correct shape and costs two triangles.
 * Additive and depth-tested-but-not-writing, so it never occludes a node that
 * happens to be in front of it.
 */
const CORONA_SCALE = 5.2
const coronaGeometry = new THREE.PlaneGeometry(0.42 * CORONA_SCALE * 2, 0.42 * CORONA_SCALE * 2)
const coronaMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: coronaFragment,
  uniforms: {
    uTime: uniforms.uTime,
    uTint: uniforms.uTint,
    uOpacity: uniforms.uOpacity,
  },
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
})

const corona = new THREE.Mesh(coronaGeometry, coronaMaterial)
corona.name = 'EphemerisCentreStarCorona'
corona.renderOrder = 1

onMounted(() => {
  scene.value.add(mesh)
  scene.value.add(corona)
})

const { camera } = useTres()

const loopStop = useLoop().onBeforeRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed
  // A slow tumble, so the granulation drifts across the surface rather than
  // only shifting with the camera. Barely perceptible on purpose.
  mesh.rotation.y = elapsed * 0.06
  mesh.rotation.x = Math.sin(elapsed * 0.04) * 0.22

  // Billboard the corona. It lives inside the rig, so it inherits the rig's
  // rotation and has to be un-rotated back toward the camera every frame —
  // `lookAt` on a world-space point does that through the parent transform
  // without this file having to know what the rig is doing.
  const active = camera.value
  if (active) corona.lookAt(active.position)
})

onUnmounted(() => {
  loopStop.off()
  scene.value.remove(mesh)
  scene.value.remove(corona)
  geometry.dispose()
  material.dispose()
  coronaGeometry.dispose()
  coronaMaterial.dispose()
})
</script>

<template></template>
