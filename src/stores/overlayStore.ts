import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useEvidenceOverlayStore } from '@/stores/evidenceOverlayStore'

const maxPanelIndex = 4

export const useOverlayStore = defineStore('overlay', () => {
  const isOpen = ref(false)
  const activeProjectId = ref<string | null>(null)
  const activePanelIndex = ref(0)

  function open(projectId: string) {
    // Only one surface at a time (PLAN.md 2.9). Nothing used to enforce this,
    // so a project overlay could open on top of an evidence overlay, leaving
    // two dialogs stacked, two scroll locks held, and an ambiguous Escape.
    useEvidenceOverlayStore().close()
    activeProjectId.value = projectId
    activePanelIndex.value = 0
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    activeProjectId.value = null
    activePanelIndex.value = 0
  }

  function setPanel(index: number) {
    activePanelIndex.value = Math.min(Math.max(index, 0), maxPanelIndex)
  }

  function nextPanel() {
    setPanel(activePanelIndex.value + 1)
  }

  function previousPanel() {
    setPanel(activePanelIndex.value - 1)
  }

  return {
    isOpen,
    activeProjectId,
    activePanelIndex,
    open,
    close,
    setPanel,
    nextPanel,
    previousPanel,
  }
})
