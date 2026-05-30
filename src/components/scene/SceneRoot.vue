<script setup lang="ts">
import { computed, shallowRef, ref } from 'vue'
import { TresCanvas, type TresContext } from '@tresjs/core'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { usePlainMode } from '@/composables/usePlainMode'
import { projects } from '@/data/projects'
import { useOverlayStore } from '@/stores/overlayStore'
import CameraPathController from '@/components/scene/CameraPathController.vue'
import CameraLight from '@/components/scene/CameraLight.vue'
import ConstellationNodes from '@/components/scene/ConstellationNodes.vue'
import ConnectorLines from '@/components/scene/ConnectorLines.vue'
import IridescentBackground from '@/components/scene/IridescentBackground.vue'
import NodeLabel from '@/components/scene/NodeLabel.vue'
import ParticleField from '@/components/scene/ParticleField.vue'
import PostProcessing from '@/components/scene/PostProcessing.vue'
import RefusalRipple from '@/components/scene/RefusalRipple.vue'

const { isPlain } = usePlainMode()
const overlayStore = useOverlayStore()
const tresContext = shallowRef<TresContext | null>(null)
const hoveredProjectId = ref<string | null>(null)
const hoveredClusterIndex = ref<number | null>(null)
const selectedProjectId = ref<string | null>(null)
const dpr: [number, number] = [1, 1.75]

const hoveredProject = computed(() => {
  return projects.find((project) => project.id === hoveredProjectId.value) ?? null
})
const connectorsPaused = computed(() => overlayStore.isOpen)

function handleReady(context: TresContext) {
  tresContext.value = context
}

function handleHover(payload: { projectId: string | null; clusterIndex: number | null }) {
  hoveredProjectId.value = payload.projectId
  hoveredClusterIndex.value = payload.clusterIndex
}

function handleSelect(projectId: string) {
  selectedProjectId.value = projectId
}
</script>

<template>
  <section
    v-if="!isPlain"
    id="constellation-section"
    class="relative h-[400vh]"
    :data-selected-project-id="selectedProjectId ?? undefined"
  >
    <div class="constellation-viewport sticky top-0 h-screen overflow-hidden bg-[color:var(--bg)]">
      <TresCanvas
        class="absolute inset-0 z-0 h-full w-full"
        :alpha="true"
        :antialias="true"
        clear-color="#010409"
        :dpr="dpr"
        :enable-provide-bridge="false"
        :output-color-space="SRGBColorSpace"
        power-preference="high-performance"
        render-mode="always"
        :tone-mapping="ACESFilmicToneMapping"
        @ready="handleReady"
      >
        <TresPerspectiveCamera
          :args="[45, 1, 0.1, 100]"
          :position="[0, 6, 22]"
        />
        <TresAmbientLight :intensity="0.12" />
        <CameraPathController />
        <CameraLight />
        <IridescentBackground />
        <ParticleField :hovered-cluster-index="hoveredClusterIndex" />
        <RefusalRipple />
        <ConstellationNodes
          @hover="handleHover"
          @select="handleSelect"
        />
        <PostProcessing />
      </TresCanvas>

      <!-- Pass hoveredProjectId so lines only show for related nodes -->
      <ConnectorLines
        :context="tresContext"
        :paused="connectorsPaused"
        :hovered-project-id="hoveredProjectId"
      />
      <NodeLabel
        :context="tresContext"
        :project="hoveredProject"
        :visible="Boolean(hoveredProject)"
      />

      <!-- Hint text: fades out after 5s, tells first-time visitor what to do -->
      <p
        class="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--ice-faint)] opacity-0"
        style="animation: eb-hint-fade 5s ease-out 1.8s forwards;"
      >
        hover nodes to explore
      </p>
    </div>
  </section>
</template>

<style scoped>
@keyframes eb-hint-fade {
  0%   { opacity: 0; }
  15%  { opacity: 0.55; }
  70%  { opacity: 0.55; }
  100% { opacity: 0; }
}
</style>