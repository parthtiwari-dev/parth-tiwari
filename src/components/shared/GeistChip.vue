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
  'border-[color:var(--ice-faint)] text-[color:var(--ice-muted)]': props.variant === 'default',
  'border-[color:var(--gold)] text-[color:var(--gold)]': props.variant === 'gold',
  'border-[color:var(--cold-text)] text-[color:var(--cold-text)]': props.variant === 'muted',
  'border-[color:var(--teal-active)] text-[color:var(--ice)]': props.variant === 'status',
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
