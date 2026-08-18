<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectStatus } from '@/types/project'

const props = defineProps<{
  status: ProjectStatus
}>()

const label = computed(() => {
  if (props.status === 'complete') return '[COMPLETE]'
  if (props.status === 'active') return '[ACTIVE]'
  if (props.status === 'in-progress') return '[IN FIELD]'
  return '[EXPERIENCE]'
})

const badgeClass = computed(() => ({
  'text-gold': props.status === 'complete',
  'text-teal-active': props.status === 'active',
  'text-amber': props.status === 'in-progress',
  'text-ice-faint': props.status === 'experience',
}))
</script>

<template>
  <span class="type-mono text-[length:var(--text-xs)] uppercase tracking-[0.14em]" :class="badgeClass">
    {{ label }}
  </span>
</template>
