<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRenderLoop, useTres } from '@tresjs/core'
import { projects } from '@/data/projects'
import { useParticleField } from '@/composables/useParticleField'

const props = defineProps<{
  hoveredClusterIndex: number | null
}>()

const { scene } = useTres()
const particleField = useParticleField(projects)

onMounted(() => {
  scene.value.add(particleField.points)
})

const loopStop = useRenderLoop().onLoop(({ delta }) => {
  particleField.update(delta, props.hoveredClusterIndex)
})

onUnmounted(() => {
  loopStop.off()
  scene.value.remove(particleField.points)
  particleField.dispose()
})
</script>
