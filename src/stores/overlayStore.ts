import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { projects } from '@/data/projects'
import { panelCountFor } from '@/data/showcase'
import { useEvidenceOverlayStore } from '@/stores/evidenceOverlayStore'

export const useOverlayStore = defineStore('overlay', () => {
  const isOpen = ref(false)
  const activeProjectId = ref<string | null>(null)
  const activePanelIndex = ref(0)

  /**
   * Not a constant any more. Projects with a capture get a Demo panel first
   * (`data/showcase.ts`), so a fixed `maxPanelIndex = 4` would clamp navigation
   * one panel short of what the strip renders.
   */
  const panelCount = computed(() => panelCountFor(
    projects.find((project) => project.id === activeProjectId.value),
  ))

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
    activePanelIndex.value = Math.min(Math.max(index, 0), panelCount.value - 1)
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
    panelCount,
    open,
    close,
    setPanel,
    nextPanel,
    previousPanel,
  }
})
