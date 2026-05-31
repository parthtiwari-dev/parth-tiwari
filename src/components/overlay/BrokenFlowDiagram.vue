<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: string
}>()

interface FlowVariant {
  labelA: string
  labelB: string
  labelC: string
  points: string
}

const flowVariants: Array<{ match: string; variant: FlowVariant }> = [
  {
    match: 'storyboard',
    variant: {
      labelA: 'brief',
      labelB: 'identity drift',
      labelC: 'shipped artifact',
      points: '18,118 98,74 174,106 256,48 338,86',
    },
  },
  {
    match: 'sql',
    variant: {
      labelA: 'question',
      labelB: 'schema drift',
      labelC: 'checked query',
      points: '18,92 82,54 142,78 202,118 270,62 338,98',
    },
  },
  {
    match: 'fraud',
    variant: {
      labelA: 'transaction',
      labelB: 'leakage risk',
      labelC: 'budgeted alert',
      points: '18,120 76,88 126,112 182,46 246,78 338,54',
    },
  },
  {
    match: 'medical',
    variant: {
      labelA: 'query',
      labelB: 'unsupported claim',
      labelC: 'cited answer',
      points: '18,74 88,112 154,58 214,70 282,116 338,86',
    },
  },
  {
    match: 'atlas',
    variant: {
      labelA: 'topic',
      labelB: 'content gap',
      labelC: 'source boundary',
      points: '18,96 98,44 164,56 218,108 286,74 338,118',
    },
  },
  {
    match: 'workflow',
    variant: {
      labelA: 'event',
      labelB: 'llm authority',
      labelC: 'durable rule',
      points: '18,56 78,88 138,52 198,92 258,58 338,104',
    },
  },
  {
    match: 'infra',
    variant: {
      labelA: 'capacity',
      labelB: 'retry loop',
      labelC: 'safe notify',
      points: '18,112 76,70 134,112 194,70 254,112 338,70',
    },
  },
]

const fallbackVariant: FlowVariant = {
  labelA: 'claim',
  labelB: 'missing evidence',
  labelC: 'bounded output',
  points: '18,88 92,50 168,96 248,62 338,112',
}

const variant = computed(() => {
  return flowVariants.find((entry) => props.id.includes(entry.match))?.variant ?? fallbackVariant
})
</script>

<template>
  <svg
    class="broken-flow"
    viewBox="0 0 360 170"
    role="img"
    :aria-label="`Broken flow diagram for ${id}`"
  >
    <defs>
      <linearGradient id="broken-flow-line" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="var(--ice-faint)" stop-opacity="0.32" />
        <stop offset="52%" stop-color="var(--gold)" stop-opacity="0.76" />
        <stop offset="100%" stop-color="var(--teal-active)" stop-opacity="0.52" />
      </linearGradient>
      <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <path
      :d="`M ${variant.points}`"
      fill="none"
      stroke="url(#broken-flow-line)"
      stroke-linecap="round"
      stroke-width="1.6"
    />
    <path
      d="M 118 30 L 146 64 L 126 66 L 154 112 L 114 78 L 136 76 Z"
      fill="none"
      stroke="var(--gold)"
      stroke-opacity="0.42"
      stroke-width="1"
    />

    <g filter="url(#soft-glow)">
      <circle cx="18" cy="88" r="4" fill="var(--ice)" opacity="0.8" />
      <circle cx="168" cy="96" r="5" fill="var(--gold)" opacity="0.9" />
      <circle cx="338" cy="112" r="4" fill="var(--teal-active)" opacity="0.78" />
    </g>

    <g class="broken-flow__labels">
      <text x="18" y="146">{{ variant.labelA }}</text>
      <text x="136" y="24">{{ variant.labelB }}</text>
      <text x="236" y="146">{{ variant.labelC }}</text>
    </g>
  </svg>
</template>

<style scoped>
.broken-flow {
  width: 100%;
  min-height: 16rem;
  color: var(--ice);
}

.broken-flow__labels {
  fill: var(--ice-muted);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.56rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
</style>
