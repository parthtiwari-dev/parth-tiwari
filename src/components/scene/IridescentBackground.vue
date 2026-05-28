<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRenderLoop, useTres } from '@tresjs/core'
import * as THREE from 'three'
import fragmentShader from '@/shaders/iridescent.frag.glsl'
import vertexShader from '@/shaders/iridescent.vert.glsl'

const { camera, scene } = useTres()
const geometry = new THREE.PlaneGeometry(1, 1)
const uniforms = {
  uTime: { value: 0 },
  uHueShift: { value: 0 },
}
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  depthTest: false,
  depthWrite: false,
  side: THREE.DoubleSide,
})
const mesh = new THREE.Mesh(geometry, material)
const cameraDirection = new THREE.Vector3()

mesh.name = 'EvidenceBoundIridescentBackground'
mesh.renderOrder = -100

onMounted(() => {
  scene.value.add(mesh)
})

const loopStop = useRenderLoop().onLoop(({ delta }) => {
  const activeCamera = camera.value

  if (!activeCamera) {
    return
  }

  uniforms.uTime.value += delta
  uniforms.uHueShift.value = (uniforms.uHueShift.value + (delta / 8) * 360) % 360
  activeCamera.getWorldDirection(cameraDirection)
  mesh.position.copy(activeCamera.position).addScaledVector(cameraDirection, 60)
  mesh.quaternion.copy(activeCamera.quaternion)
  mesh.scale.set(80, 45, 1)
})

onUnmounted(() => {
  loopStop.off()
  scene.value.remove(mesh)
  geometry.dispose()
  material.dispose()
})
</script>
