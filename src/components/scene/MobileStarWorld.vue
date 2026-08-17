<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface MobileStar {
  x: number
  y: number
  radius: number
  alpha: number
  warmth: number
  phase: number
  speed: number
  drift: number
  parallax: number
  glint: number
  colorIndex: number
  color: string
}

const canvasRef = ref<HTMLCanvasElement | null>(null)

const DPR_CAP = 1.35
const FIELD_PADDING = 180
const GLOW_SPRITE_RADIUS = 64
const STAR_CHANNELS: ReadonlyArray<readonly [number, number, number]> = [
  [232, 200, 106],
  [142, 222, 245],
  [216, 234, 240],
]
const STAR_FILLS = STAR_CHANNELS.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`)
const glowSprites: (HTMLCanvasElement | null)[] = [null, null, null]
// FROZEN SEED — see useParticleField.ts. Renaming this reshuffles the mobile
// star world. Retired brand name, load-bearing value.
const random = seededRandom('evidencebound-mobile-star-world-v1')
const stars: MobileStar[] = []

let context: CanvasRenderingContext2D | null = null
let animationFrame = 0
let width = 0
let height = 0
let dpr = 1
let reducedMotion = false
let lastScrollY = 0

function seededRandom(seed: string) {
  let hash = 2166136261

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return () => {
    hash += 0x6d2b79f5
    let value = Math.imul(hash ^ (hash >>> 15), 1 | hash)
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function starColorIndex(warmth: number) {
  if (warmth > 0.94) {
    return 0
  }

  if (warmth > 0.82) {
    return 1
  }

  return 2
}

function glowSprite(colorIndex: number) {
  const cached = glowSprites[colorIndex]

  if (cached) {
    return cached
  }

  const sprite = document.createElement('canvas')
  const size = GLOW_SPRITE_RADIUS * 2
  sprite.width = size
  sprite.height = size

  const spriteContext = sprite.getContext('2d')

  if (spriteContext) {
    const [r, g, b] = STAR_CHANNELS[colorIndex]
    const gradient = spriteContext.createRadialGradient(
      GLOW_SPRITE_RADIUS,
      GLOW_SPRITE_RADIUS,
      0,
      GLOW_SPRITE_RADIUS,
      GLOW_SPRITE_RADIUS,
      GLOW_SPRITE_RADIUS,
    )
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    spriteContext.fillStyle = gradient
    spriteContext.fillRect(0, 0, size, size)
  }

  glowSprites[colorIndex] = sprite
  return sprite
}

function createStar(): MobileStar {
  const tier = random()
  const bright = tier > 0.994
  const mid = !bright && tier > 0.9
  const warmthRoll = random()

  const star: MobileStar = {
    x: random(),
    y: random(),
    radius: bright
      ? 0.82 + random() * 0.92
      : mid
        ? 0.34 + random() * 0.38
        : 0.12 + random() * 0.24,
    alpha: bright
      ? 0.38 + random() * 0.26
      : mid
        ? 0.18 + random() * 0.2
        : 0.085 + random() * 0.15,
    warmth: warmthRoll > 0.996 ? 0.98 : warmthRoll > 0.96 ? 0.86 : random() * 0.055,
    phase: random() * Math.PI * 2,
    speed: 0.18 + random() * 0.55,
    drift: bright ? 0.18 + random() * 0.5 : random() * 0.34,
    parallax: bright ? 0.1 + random() * 0.12 : mid ? 0.05 + random() * 0.08 : 0.012 + random() * 0.045,
    glint: bright ? 0.5 + random() * 0.5 : mid && random() > 0.9 ? 0.2 + random() * 0.25 : 0,
    colorIndex: 2,
    color: STAR_FILLS[2],
  }

  star.colorIndex = starColorIndex(star.warmth)
  star.color = STAR_FILLS[star.colorIndex]

  return star
}

function seedStars() {
  stars.length = 0
  const area = width * height
  const count = clamp(Math.round(area / 56), 5200, 9200)

  for (let index = 0; index < count; index += 1) {
    stars.push(createStar())
  }
}

function resize() {
  const canvas = canvasRef.value

  if (!canvas) {
    return
  }

  const rect = canvas.getBoundingClientRect()
  width = Math.max(1, Math.floor(rect.width))
  height = Math.max(1, Math.floor(rect.height))
  dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1)

  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  context = canvas.getContext('2d')

  if (context) {
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  seedStars()
  renderFrame(performance.now())
}

function drawStar(ctx: CanvasRenderingContext2D, star: MobileStar, time: number) {
  const twinkle = reducedMotion ? 1 : 0.72 + Math.sin(time * star.speed + star.phase) * 0.28
  const scrollOffset = lastScrollY * star.parallax
  const driftX = reducedMotion ? 0 : Math.sin(time * 0.18 + star.phase) * star.drift
  const driftY = reducedMotion ? 0 : Math.cos(time * 0.14 + star.phase) * star.drift
  const x = star.x * width + driftX
  const fieldHeight = height + FIELD_PADDING * 2
  const y = ((star.y * fieldHeight + scrollOffset + driftY) % fieldHeight) - FIELD_PADDING
  const alpha = clamp(star.alpha * twinkle, 0, 0.86)
  const radius = star.radius

  ctx.globalAlpha = alpha
  ctx.fillStyle = star.color

  if (radius < 0.24) {
    ctx.fillRect(x, y, 0.95, 0.95)
  } else if (radius < 0.34) {
    ctx.fillRect(x - 0.5, y - 0.5, 1.15, 1.15)
  } else {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  if (star.glint > 0) {
    const glintAlpha = alpha * star.glint
    const glintSize = radius * (5.5 + star.glint * 4)
    const glowRadius = radius * 8

    ctx.globalAlpha = glintAlpha * 0.42
    ctx.strokeStyle = star.color
    ctx.lineWidth = 0.55
    ctx.beginPath()
    ctx.moveTo(x - glintSize, y)
    ctx.lineTo(x + glintSize, y)
    ctx.moveTo(x, y - glintSize * 0.72)
    ctx.lineTo(x, y + glintSize * 0.72)
    ctx.stroke()

    ctx.globalAlpha = glintAlpha * 0.22
    ctx.drawImage(
      glowSprite(star.colorIndex),
      x - glowRadius,
      y - glowRadius,
      glowRadius * 2,
      glowRadius * 2,
    )
  }
}

function renderFrame(now: number) {
  if (!context) {
    return
  }

  const time = now / 1000
  context.clearRect(0, 0, width, height)
  context.globalCompositeOperation = 'lighter'

  stars.forEach((star) => drawStar(context as CanvasRenderingContext2D, star, time))

  context.globalAlpha = 1
  context.globalCompositeOperation = 'source-over'
}

function loop(now: number) {
  animationFrame = 0
  renderFrame(now)

  if (!reducedMotion) {
    animationFrame = requestAnimationFrame(loop)
  }
}

function stopLoop() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = 0
  }
}

function startLoop() {
  stopLoop()

  if (reducedMotion) {
    return
  }

  animationFrame = requestAnimationFrame(loop)
}

function handleScroll() {
  lastScrollY = window.scrollY
}

function handleVisibilityChange() {
  if (document.hidden) {
    stopLoop()
    return
  }

  startLoop()
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)
  startLoop()
})

onUnmounted(() => {
  stopLoop()
  window.removeEventListener('resize', resize)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <section
    id="mobile-star-world"
    class="mobile-star-world"
    aria-hidden="true"
  >
    <div class="mobile-star-world__viewport">
      <canvas ref="canvasRef" class="mobile-star-world__canvas"></canvas>
    </div>
  </section>
</template>

<style scoped>
.mobile-star-world {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: var(--bg);
  pointer-events: none;
}

.mobile-star-world__viewport {
  position: absolute;
  inset: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background:
    radial-gradient(circle at 48% 24%, rgb(17 63 112 / 0.46), transparent 28rem),
    radial-gradient(circle at 82% 52%, rgb(11 182 214 / 0.12), transparent 20rem),
    radial-gradient(circle at 16% 74%, rgb(201 168 76 / 0.06), transparent 16rem),
    linear-gradient(180deg, #06152a 0%, #031021 42%, #010409 100%);
}

.mobile-star-world__viewport::before {
  position: absolute;
  inset: -8%;
  pointer-events: none;
  content: '';
  background:
    radial-gradient(ellipse at 50% 18%, rgb(69 134 202 / 0.14), transparent 34%),
    radial-gradient(ellipse at 42% 62%, rgb(15 101 162 / 0.08), transparent 38%),
    repeating-linear-gradient(
      105deg,
      transparent 0 5.2rem,
      rgb(216 234 240 / 0.018) 5.35rem,
      transparent 5.55rem
    );
  filter: blur(0.3px);
  opacity: 0.78;
  transform: translateZ(0);
}

.mobile-star-world__viewport::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(180deg, rgb(0 0 0 / 0.12), transparent 20%, transparent 72%, rgb(0 0 0 / 0.3)),
    radial-gradient(circle at center, transparent 0 48%, rgb(0 0 0 / 0.34) 100%);
}

.mobile-star-world__canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
}

@media (min-width: 768px) {
  .mobile-star-world {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-star-world__viewport::before {
    opacity: 0.58;
  }
}
</style>
