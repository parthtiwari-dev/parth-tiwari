import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ScaleMode } from '@/data/layout'

/**
 * Which spatial scale the constellation is drawn in (PLAN.md 3.6).
 *
 * Deliberately a store rather than a prop: the scene, the label layer, the
 * connector layer and the ambient particle field all have to agree, and a
 * disagreement here shows up as labels floating away from their nodes.
 *
 * Default is schematic — legible first — but the mode is always disclosed on
 * screen. The disclosure is the point, not a settings afterthought
 * (DESIGN.md §2).
 */
export const useScaleModeStore = defineStore('scaleMode', () => {
  const mode = ref<ScaleMode>('schematic')

  function toggle() {
    mode.value = mode.value === 'schematic' ? 'true' : 'schematic'
  }

  return { mode, toggle }
})
