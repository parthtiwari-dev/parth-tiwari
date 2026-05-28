import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SliderKey } from '@/types/slider'

const defaultValues: Record<SliderKey, number> = {
  evidenceStrictness: 0.5,
  latencyBudget: 0.5,
  costPerQuery: 0.5,
  alertBudget: 0.5,
  automationVsControl: 0.5,
}

export const useSliderStore = defineStore('slider', () => {
  const values = ref<Record<SliderKey, number>>({ ...defaultValues })

  function setValue(key: SliderKey, value: number) {
    values.value[key] = Math.min(Math.max(value, 0), 1)
  }

  function reset() {
    values.value = { ...defaultValues }
  }

  return {
    values,
    setValue,
    reset,
  }
})
