import * as THREE from 'three'

/**
 * Matcap textures for the star bodies, generated rather than shipped
 * (PLAN.md 6.8 — DESIGN.md §5).
 *
 * **Why matcaps at all.** The bodies were `MeshStandardMaterial` lit by twelve
 * per-node `PointLight`s plus a camera key light and an ambient. That means the
 * PBR fragment shader looped over every light for every fragment of every
 * sphere, and DESIGN.md names it the single largest mid-tier GPU cost in the
 * scene. A matcap is one texture lookup. Bruno Simon's portfolio runs with no
 * lights at all for exactly this reason.
 *
 * **Why generated and not a PNG.** A matcap image would be a binary asset whose
 * colour could drift from `tokens.css`, and this repo has already been bitten by
 * a 3D layer whose hardcoded hexes disagreed with the legend describing them
 * (2.6). Generating from the same token means the star and its swatch cannot
 * disagree — and the file is 128×128, so building it costs less than decoding a
 * PNG would.
 *
 * **Why the centre is blown out.** Standard material carried an `emissive` term,
 * which is what pushed these spheres above the bloom threshold and made them
 * read as stars rather than as balls. Matcaps have no emissive, so the glow is
 * baked into the texture instead: a hot core falling to a dark limb, with a thin
 * rim light. The remaining headroom comes from `material.color`, which multiplies
 * this and can exceed 1 into the half-float buffer — that is where the breathing
 * pulse and the hover boost now live.
 */

const SIZE = 128
const cache = new Map<string, THREE.Texture>()

/**
 * `#rrggbb` → `rgb(r, g, b)`, so the gradient stops can carry alpha-free tints
 * mixed toward white without a colour library.
 */
function mix(hex: string, towardWhite: number): string {
  const color = new THREE.Color(hex)
  const r = Math.round((color.r + (1 - color.r) * towardWhite) * 255)
  const g = Math.round((color.g + (1 - color.g) * towardWhite) * 255)
  const b = Math.round((color.b + (1 - color.b) * towardWhite) * 255)
  return `rgb(${r}, ${g}, ${b})`
}

function dim(hex: string, factor: number): string {
  const color = new THREE.Color(hex)
  return `rgb(${Math.round(color.r * factor * 255)}, ${Math.round(color.g * factor * 255)}, ${Math.round(color.b * factor * 255)})`
}

/**
 * One matcap per node colour, cached. Twelve nodes share four kinds, so this
 * builds four textures for the whole scene.
 */
export function starMatcap(hex: string): THREE.Texture {
  const existing = cache.get(hex)
  if (existing) return existing

  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!

  // Everything outside the sphere's silhouette. Never sampled in practice, but a
  // transparent surround would fringe under mipmapping.
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, SIZE, SIZE)

  const half = SIZE / 2

  // The body. Nearly radially symmetric on purpose: these are stars, not lit
  // spheres. A strongly offset highlight is the right matcap for a ball bouncing
  // around Bruno Simon's garden and the wrong one here — the first pass had one
  // and every node read as a shaded marble instead of something emitting light.
  // The small remaining offset keeps it from looking like a flat bullseye.
  const body = ctx.createRadialGradient(
    half * 0.94, half * 0.9, SIZE * 0.03,
    half, half, half,
  )
  body.addColorStop(0, mix(hex, 0.96))
  body.addColorStop(0.34, mix(hex, 0.62))
  body.addColorStop(0.62, hex)
  body.addColorStop(0.86, dim(hex, 0.42))
  body.addColorStop(1, dim(hex, 0.1))

  ctx.fillStyle = body
  ctx.beginPath()
  ctx.arc(half, half, half, 0, Math.PI * 2)
  ctx.fill()

  // A thin rim light on the far side. Without it the limb reads as a flat disc,
  // which is the usual tell of a hand-made matcap.
  const rim = ctx.createRadialGradient(half, half, half * 0.82, half, half, half)
  rim.addColorStop(0, 'rgba(0, 0, 0, 0)')
  rim.addColorStop(0.72, `${mix(hex, 0.4).replace('rgb', 'rgba').replace(')', ', 0.34)')}`)
  rim.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = rim
  ctx.beginPath()
  ctx.arc(half, half, half, 0, Math.PI * 2)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  cache.set(hex, texture)
  return texture
}

/** Frees every generated texture. Called when the scene unmounts. */
export function disposeMatcaps(): void {
  cache.forEach((texture) => texture.dispose())
  cache.clear()
}
