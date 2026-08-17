/**
 * Read a CSS custom property off the document root.
 *
 * Exists so the WebGL layer can use the same palette as the DOM instead of
 * keeping a second, drifting copy of it (CLAUDE.md: "the 3D layer must read the
 * same palette as the DOM"). Three.js takes hex strings, so the token values it
 * consumes must stay plain hex — no `color-mix()`, no `rgb()`, no references to
 * other variables — or this returns something Three cannot parse.
 *
 * Always pass the real colour as `fallback`, never a placeholder. This resolves
 * at module-init time, and if a stylesheet has not landed yet the fallback is
 * what ships to the GPU — a wrong-but-plausible star beats a black one.
 */
export function readToken(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}
