<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    variant?: 'default' | 'gold' | 'muted' | 'status'
  }>(),
  {
    variant: 'default',
  },
)

const chipClass = computed(() => ({
  'border-ice-faint text-ice-muted': props.variant === 'default',
  'border-gold text-gold': props.variant === 'gold',
  'border-cold-text text-cold-text': props.variant === 'muted',
  'border-teal-active text-ice': props.variant === 'status',
}))
</script>

<template>
  <span
    class="type-mono inline-flex items-center border px-2 py-1 text-[length:var(--text-xs)] uppercase tracking-[0.08em]"
    :class="chipClass"
  >
    {{ label }}
  </span>
</template>
