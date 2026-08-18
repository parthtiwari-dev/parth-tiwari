<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean
    message?: string
  }>(),
  {
    message: '[copied]',
  },
)
</script>

<template>
  <div
    v-if="show"
    class="type-mono fixed bottom-6 right-6 z-50 border border-gold bg-bg px-3 py-2 text-[length:var(--text-xs)] text-gold"
  >
    {{ message }}
  </div>
</template>
