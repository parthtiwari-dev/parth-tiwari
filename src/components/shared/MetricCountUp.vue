<script setup lang="ts">
defineProps<{
  label: string
  display: string
  unit?: string
}>()
</script>

<template>
  <div class="type-mono grid gap-1">
    <span class="text-[length:var(--text-xs)] uppercase tracking-[0.12em] text-ice-faint">
      {{ label }}
    </span>
    <span class="bg-gradient-to-r from-gold to-gold-glow bg-clip-text text-2xl text-transparent">
      {{ display }}<span v-if="unit && !display.includes(unit)">{{ unit }}</span>
    </span>
  </div>
</template>
