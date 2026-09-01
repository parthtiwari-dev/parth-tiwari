const body = document.body
const paper = document.querySelector('[data-paper-sheet]')
const entry = document.querySelector('[data-project-entry]')
const aperture = document.querySelector('[data-preview-aperture]')
const tearStage = document.querySelector('[data-tear-stage]')
const status = document.querySelector('[data-study-status]')
const name = document.querySelector('[data-study-name]')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
const coarsePointer = matchMedia('(pointer: coarse)')
const names = { row: '01 / Row Rip', edge: '02 / Edge Peel', sheet: '03 / Sheet Fault' }
const params = new URLSearchParams(location.search)
let previewTimer
let resetTimer
let tearing = false
let coarseFrame

const sanitizeClone = (clone) => {
  clone.setAttribute('aria-hidden', 'true')
  clone.inert = true
  clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'))
  clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((node) => {
    node.setAttribute('tabindex', '-1')
    node.setAttribute('aria-hidden', 'true')
  })
  return clone
}

const placeAperture = () => {
  const paperRect = paper.getBoundingClientRect()
  const entryRect = entry.getBoundingClientRect()
  aperture.style.left = `${entryRect.left - paperRect.left}px`
  aperture.style.top = `${entryRect.top - paperRect.top}px`
  aperture.style.width = `${entryRect.width}px`
  aperture.style.height = `${entryRect.height}px`
  paper.style.setProperty('--light-x', `${((entryRect.right - paperRect.left) / paperRect.width) * 100}%`)
  paper.style.setProperty('--light-y', `${((entryRect.top + entryRect.height / 2 - paperRect.top) / paperRect.height) * 100}%`)
}

const activatePreview = () => {
  if (tearing) return
  clearTimeout(previewTimer)
  placeAperture()
  body.classList.add('is-preview')
  status.textContent = 'BeatMind preview active. The project link remains available.'
}

const schedulePreview = () => {
  clearTimeout(previewTimer)
  previewTimer = setTimeout(activatePreview, 180)
}

const clearPreview = () => {
  if (tearing) return
  clearTimeout(previewTimer)
  body.classList.remove('is-preview')
  status.textContent = 'Ready to preview BeatMind.'
}

const positionClone = (clone, rect) => {
  Object.assign(clone.style, {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  })
}

const makePieces = () => {
  const mode = body.dataset.study
  const source = mode === 'sheet' ? paper : entry
  const rect = source.getBoundingClientRect()
  const entryRect = entry.getBoundingClientRect()
  const seam = ((entryRect.top + entryRect.height / 2 - rect.top) / rect.height) * 100
  tearStage.style.setProperty('--seam', `${Math.max(8, Math.min(92, seam))}%`)

  const first = sanitizeClone(source.cloneNode(true))
  const second = sanitizeClone(source.cloneNode(true))
  first.classList.add('tear-piece', 'tear-piece-a')
  second.classList.add('tear-piece', 'tear-piece-b')
  positionClone(first, rect)
  positionClone(second, rect)
  tearStage.replaceChildren(first, second)
  source.style.visibility = 'hidden'
  return source
}

const reset = () => {
  clearTimeout(resetTimer)
  tearing = false
  body.classList.remove('is-tearing', 'is-running')
  paper.style.visibility = ''
  entry.style.visibility = ''
  tearStage.replaceChildren()
  activatePreview()
  status.textContent = 'Study reset. BeatMind preview active.'
}

const play = () => {
  if (tearing) return
  activatePreview()
  if (reducedMotion.matches) {
    status.textContent = 'Reduced motion: the composed world frame replaces the tear.'
    return
  }

  tearing = true
  const source = makePieces()
  body.classList.add('is-tearing')
  status.textContent = `${names[body.dataset.study]} is playing. Navigation would occur by 500 milliseconds.`
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('is-running')))

  if (!params.has('hold')) {
    resetTimer = setTimeout(() => {
      source.style.visibility = ''
      reset()
    }, 880)
  }
}

const setStudy = (study) => {
  if (!(study in names)) return
  clearTimeout(resetTimer)
  tearing = false
  body.classList.remove('is-tearing', 'is-running')
  paper.style.visibility = ''
  entry.style.visibility = ''
  tearStage.replaceChildren()
  body.dataset.study = study
  name.textContent = names[study]
  document.querySelectorAll('[data-study-choice]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.studyChoice === study))
  })
  activatePreview()
}

entry.querySelector('a').addEventListener('pointerenter', schedulePreview)
entry.querySelector('a').addEventListener('pointerleave', clearPreview)
entry.querySelector('a').addEventListener('focus', activatePreview)
entry.querySelector('a').addEventListener('blur', clearPreview)
entry.querySelector('a').addEventListener('click', (event) => {
  event.preventDefault()
  play()
})

document.querySelectorAll('[data-study-choice]').forEach((button) => {
  button.addEventListener('click', () => setStudy(button.dataset.studyChoice))
})
document.querySelector('[data-replay]').addEventListener('click', () => {
  reset()
  requestAnimationFrame(play)
})
addEventListener('resize', placeAperture)

const updateCoarsePreview = () => {
  coarseFrame = undefined
  if (!coarsePointer.matches || tearing) return
  const rect = entry.getBoundingClientRect()
  const viewportCenter = innerHeight / 2
  const entryCenter = rect.top + rect.height / 2
  const isCandidate = rect.bottom > 0 && rect.top < innerHeight && Math.abs(entryCenter - viewportCenter) <= innerHeight * .34
  if (isCandidate) activatePreview()
  else clearPreview()
}

const scheduleCoarsePreview = () => {
  if (coarseFrame !== undefined) return
  coarseFrame = requestAnimationFrame(updateCoarsePreview)
}

addEventListener('scroll', scheduleCoarsePreview, { passive: true })
addEventListener('resize', scheduleCoarsePreview)

const requestedStudy = params.get('study')
setStudy(requestedStudy in names ? requestedStudy : 'row')

if (coarsePointer.matches) scheduleCoarsePreview()

window.phase4Study = { activatePreview, clearPreview, play, reset, setStudy }
