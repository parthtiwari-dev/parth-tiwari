import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useOverlayStore } from '@/stores/overlayStore'

export type EvidenceOverlayKind = 'experience' | 'training' | 'capability' | 'about' | 'resume'

export const useEvidenceOverlayStore = defineStore('evidenceOverlay', () => {
  const activeKind = ref<EvidenceOverlayKind | null>(null)
  const isOpen = computed(() => activeKind.value !== null)

  function open(kind: EvidenceOverlayKind) {
    // See overlayStore.open — one surface at a time (PLAN.md 2.9).
    useOverlayStore().close()
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
