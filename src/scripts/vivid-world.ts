import { mountWorldLifecycle, type WorldFrame, type WorldLifecycle } from './world-lifecycle'

type VividData = { frames: Array<{ src: string }>; plan: Array<{ label: string }> }
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t) }

const parseData = (): VividData | undefined => {
  const node = document.querySelector('#vivid-world-data')
  if (!(node instanceof HTMLScriptElement) || !node.textContent) return undefined
  try { return JSON.parse(node.textContent) as VividData } catch { return undefined }
}

function renderer(context: CanvasRenderingContext2D, root: HTMLElement, bar: HTMLElement) {
  return (frame: WorldFrame) => {
    const { width, height, dpr, progress } = frame
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, width, height)
    const x0 = width < 560 ? width * .18 : width * .11
    const x1 = width < 560 ? width * .82 : width * .89
    const anchorX = width < 560 ? width * .5 : width * .24
    const anchorY = height * .54
    const threadCount = width < 560 ? 2 : 5
    const arrival = ease((progress - .55) / 2.1)
    const contact = ease((progress - 2.35) / 1.25)
    const resolve = ease((progress - 5.1) / 1.3)
    for (let index = 0; index < threadCount; index += 1) {
      const y = anchorY + (index - (threadCount - 1) / 2) * (width < 560 ? 28 : 42)
      const targetY = height * (.3 + index * (.4 / Math.max(1, threadCount - 1)))
      const endX = x0 + (x1 - x0) * (index / Math.max(1, threadCount - 1))
      const color = index === 0 ? '#c47a3a' : index === threadCount - 1 ? '#8fa7ab' : 'rgba(232,220,199,.58)'
      context.globalAlpha = .18 + arrival * .72
      context.strokeStyle = color
      context.lineWidth = index === 0 ? 2 : 1
      context.beginPath()
      context.moveTo(anchorX, y)
      context.bezierCurveTo(width * .43, y - height * .24, width * .62, targetY + height * .19, endX, targetY)
      context.stroke()
    }
    if (contact > 0) {
      context.globalAlpha = contact * .72
      context.strokeStyle = 'rgba(232,220,199,.28)'
      context.strokeRect(width * .18, height * .23, width * .64, height * .54)
    }
    if (resolve > 0) {
      context.globalAlpha = resolve * .7
      context.strokeStyle = '#c47a3a'
      context.lineWidth = 1.5
      context.beginPath(); context.moveTo(x0, height * .5); context.lineTo(x1, height * .5); context.stroke()
    }
    context.globalAlpha = 1
    const fraction = clamp(progress / Math.max(1, Number(root.dataset.sceneCount) - 1))
    bar.style.transform = `scaleX(${fraction.toFixed(4)})`
    root.style.setProperty('--world-progress', fraction.toFixed(4))
    root.style.setProperty('--world-camera-y', `${(2.4 - fraction * 4.8).toFixed(2)}%`)
    root.style.setProperty('--world-light-x', `${(-2 + fraction * 4).toFixed(2)}vw`)
  }
}

const root = document.querySelector('[data-world-root]')
const canvas = document.querySelector('[data-world-canvas]')
const bar = document.querySelector('[data-world-progress]')
const counter = document.querySelector('[data-world-scene-count]')
const label = document.querySelector('[data-world-scene-label]')
const scenes = [...document.querySelectorAll<HTMLElement>('[data-world-scene]')]
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
let lifecycle: WorldLifecycle | undefined

const stop = () => { lifecycle?.destroy(); lifecycle = undefined }
const start = () => {
  stop()
  if (reduced.matches || !(root instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement) || !(bar instanceof HTMLElement) || !(counter instanceof HTMLElement) || !(label instanceof HTMLElement) || !parseData()) { if (root instanceof HTMLElement) root.dataset.worldMode = 'static'; return }
  const context = canvas.getContext('2d', { alpha: true })
  if (!context) { root.dataset.worldMode = 'static'; return }
  root.dataset.worldReady = 'true'; root.dataset.worldMode = 'animated'
  lifecycle = mountWorldLifecycle({ root, canvas, sceneCount: scenes.length, draw: renderer(context, root, bar), onActiveScene(index) {
    scenes.forEach((scene, sceneIndex) => scene.classList.toggle('is-current', sceneIndex === index))
    const scene = scenes[index]
    root.dataset.worldActiveScene = scene?.id ?? ''
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`
    label.textContent = scene?.querySelector('.world-scene-copy > p')?.textContent?.trim() ?? ''
  } })
}
window.addEventListener('pagehide', stop)
window.addEventListener('pageshow', () => { if (!lifecycle) start() })
window.addEventListener('world:destroy', stop)
reduced.addEventListener('change', start)
try { if (sessionStorage.getItem('paper-world-focus-path') === window.location.pathname) { sessionStorage.removeItem('paper-world-focus-path'); requestAnimationFrame(() => document.querySelector<HTMLElement>('#world-title')?.focus({ preventScroll: true })) } } catch {}
start()
