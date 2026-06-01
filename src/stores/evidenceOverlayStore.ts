import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type EvidenceOverlayKind = 'experience'

export const useEvidenceOverlayStore = defineStore('evidenceOverlay', () => {
  const activeKind = ref<EvidenceOverlayKind | null>(null)
  const isOpen = computed(() => activeKind.value !== null)

  function open(kind: EvidenceOverlayKind) {
    activeKind.value = kind
  }

  function close() {
    activeKind.value = null
  }

  return {
    activeKind,
    isOpen,
    open,
    close,
  }
})
