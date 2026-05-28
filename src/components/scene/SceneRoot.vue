<script setup lang="ts">
import { computed, shallowRef, ref } from 'vue'
import { TresCanvas, type TresContext } from '@tresjs/core'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { usePlainMode } from '@/composables/usePlainMode'
import { projects } from '@/data/projects'
import { useOverlayStore } from '@/stores/overlayStore'
import CameraPathController from '@/components/scene/CameraPathController.vue'
import ConstellationNodes from '@/components/scene/ConstellationNodes.vue'
import ConnectorLines from '@/components/scene/ConnectorLines.vue'
import IridescentBackground from '@/components/scene/IridescentBackground.vue'
import NodeLabel from '@/components/scene/NodeLabel.vue'
import ParticleField from '@/components/scene/ParticleField.vue'
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
    <div class="sticky top-0 h-screen overflow-hidden bg-[color:var(--bg)]">
      <TresCanvas
        class="absolute inset-0 h-full w-full"
        :alpha="true"
        :antialias="true"
        clear-color="#0c1a20"
        :dpr="dpr"
        :output-color-space="SRGBColorSpace"
        power-preference="high-performance"
        render-mode="always"
        :tone-mapping="ACESFilmicToneMapping"
        @ready="handleReady"
      >
        <TresPerspectiveCamera
          :args="[45, 1, 0.1, 100]"
          :position="[0, 10, 28]"
        />
        <TresAmbientLight :intensity="0.55" />
        <CameraPathController />
        <IridescentBackground />
        <ParticleField :hovered-cluster-index="hoveredClusterIndex" />
        <RefusalRipple />
        <ConstellationNodes
          @hover="handleHover"
          @select="handleSelect"
        />
      </TresCanvas>

      <ConnectorLines
        :context="tresContext"
        :paused="connectorsPaused"
      />
      <NodeLabel
        :context="tresContext"
        :project="hoveredProject"
        :visible="Boolean(hoveredProject)"
      />
    </div>
  </section>
</template>
