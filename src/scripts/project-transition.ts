type TransitionWindow = Window & {
  __paperWorldTestHold?: boolean
  __paperWorldTransition?: {
    activate: (slug: string) => void
    reset: () => void
  }
}

const root = document.documentElement
const stage = document.querySelector<HTMLElement>('[data-project-transition-stage]')
const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-paper-project][data-project-slug]')]
const previews = [...document.querySelectorAll<HTMLElement>('[data-project-preview]')]
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const coarseQuery = window.matchMedia('(hover: none), (pointer: coarse)')
const transitionWindow = window as TransitionWindow

if (stage && links.length && previews.length) {
  root.classList.add('paper-transition-ready')

  let activeLink: HTMLAnchorElement | undefined
  let hoverTimer = 0
  let scrollFrame = 0
  let navigating = false
  let faultOverlay: HTMLElement | undefined

  const previewFor = (slug: string) => previews.find((preview) => preview.dataset.projectPreview === slug)

  const positionStage = (link: HTMLAnchorElement) => {
    const rect = link.getBoundingClientRect()
    const bleed = Math.min(18, Math.max(8, rect.height * .08))
    stage.style.setProperty('--preview-left', `${Math.max(0, rect.left - bleed)}px`)
    stage.style.setProperty('--preview-top', `${Math.max(0, rect.top - bleed)}px`)
    stage.style.setProperty('--preview-width', `${Math.min(window.innerWidth, rect.width + (bleed * 2))}px`)
    stage.style.setProperty('--preview-height', `${rect.height + (bleed * 2)}px`)
  }

  const activate = (link: HTMLAnchorElement) => {
    const slug = link.dataset.projectSlug
    if (!slug || navigating) return
    const preview = previewFor(slug)
    if (!preview) return
    const previewImage = preview.querySelector<HTMLImageElement>('img')
    if (previewImage) {
      previewImage.loading = 'eager'
      void previewImage.decode().catch(() => undefined)
    }

    activeLink?.removeAttribute('data-preview-active')
    previews.forEach((candidate) => candidate.removeAttribute('data-active'))
    activeLink = link
    positionStage(link)
    link.dataset.previewActive = 'true'
    preview.dataset.active = 'true'
    stage.dataset.visible = 'true'
  }

  const clear = () => {
    if (navigating) return
    activeLink?.removeAttribute('data-preview-active')
    activeLink = undefined
    previews.forEach((preview) => preview.removeAttribute('data-active'))
    stage.removeAttribute('data-visible')
  }

  const schedulePointerPreview = (link: HTMLAnchorElement) => {
    window.clearTimeout(hoverTimer)
    hoverTimer = window.setTimeout(() => activate(link), 180)
  }

  const nearestCoarseLink = () => {
    scrollFrame = 0
    if (!coarseQuery.matches || navigating) return
    const viewportCenter = window.innerHeight / 2
    const candidates = links
      .filter((link) => {
        const rect = link.getBoundingClientRect()
        return rect.bottom > 0 && rect.top < window.innerHeight && !link.closest<HTMLElement>('[hidden]')
      })
      .map((link) => {
        const rect = link.getBoundingClientRect()
        return { link, distance: Math.abs((rect.top + rect.height / 2) - viewportCenter) }
      })
      .sort((left, right) => left.distance - right.distance)

    const nearest = candidates[0]
    if (nearest && nearest.distance <= window.innerHeight * .34) activate(nearest.link)
    else clear()
  }

  const requestCoarsePreview = () => {
    if (scrollFrame) return
    scrollFrame = window.requestAnimationFrame(nearestCoarseLink)
  }

  const reset = () => {
    navigating = false
    faultOverlay?.remove()
    faultOverlay = undefined
    delete root.dataset.paperWorldStage
    stage.removeAttribute('data-visible')
    previews.forEach((preview) => preview.removeAttribute('data-active'))
    activeLink?.removeAttribute('data-preview-active')
    activeLink = undefined
  }

  const sanitizeClone = (clone: HTMLElement) => {
    clone.classList.add('paper-fault-row-clone')
    clone.setAttribute('aria-hidden', 'true')
    clone.setAttribute('inert', '')
    clone.querySelectorAll<HTMLElement>('*').forEach((element) => {
      element.removeAttribute('id')
      element.removeAttribute('href')
      element.removeAttribute('name')
      element.removeAttribute('data-paper-project')
      element.removeAttribute('data-project-slug')
      element.removeAttribute('data-preview-active')
      if (element.matches('a, button, input, select, textarea, [tabindex]')) element.tabIndex = -1
    })
  }

  const createFaultOverlay = (link: HTMLAnchorElement, faultY: number, opening: number) => {
    const sourceRow = link.closest<HTMLElement>('li') ?? link
    const rowRect = sourceRow.getBoundingClientRect()
    const overlay = document.createElement('div')
    overlay.className = 'paper-fault-overlay'
    overlay.setAttribute('aria-hidden', 'true')
    overlay.setAttribute('inert', '')
    overlay.style.setProperty('--paper-fault-y', `${faultY}px`)
    overlay.style.setProperty('--paper-fault-gap', `${opening}px`)
    overlay.style.setProperty('--paper-fault-row-top', `${rowRect.top}px`)
    overlay.style.setProperty('--paper-fault-row-left', `${rowRect.left}px`)
    overlay.style.setProperty('--paper-fault-row-width', `${rowRect.width}px`)
    overlay.style.setProperty('--paper-fault-row-height', `${rowRect.height}px`)

    const topPanel = document.createElement('div')
    topPanel.className = 'paper-fault-panel paper-fault-panel-top'
    const bottomPanel = document.createElement('div')
    bottomPanel.className = 'paper-fault-panel paper-fault-panel-bottom'

    for (const panel of [topPanel, bottomPanel]) {
      const rowClone = sourceRow.cloneNode(true) as HTMLElement
      sanitizeClone(rowClone)
      panel.append(rowClone)
      overlay.append(panel)
    }

    document.body.append(overlay)
    faultOverlay = overlay
    // The initial transform must be committed before the panels separate.
    overlay.getBoundingClientRect()
    window.requestAnimationFrame(() => { overlay.dataset.state = 'open' })
    return { overlay, topPanel }
  }

  const waitForFault = (panel: HTMLElement) => new Promise<void>((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      panel.removeEventListener('transitionend', finish)
      resolve()
    }
    const timeout = window.setTimeout(finish, 490)
    panel.addEventListener('transitionend', finish, { once: true })
  })

  const rememberReturnTarget = (link: HTMLAnchorElement) => {
    const slug = link.dataset.projectSlug
    if (!slug) return
    const state = typeof history.state === 'object' && history.state !== null ? history.state : {}
    history.replaceState({ ...state, paperWorldReturn: slug }, '', window.location.href)
    try {
      sessionStorage.setItem('paper-world-focus-path', new URL(link.href).pathname)
    } catch {
      // Storage is optional. The real link remains the navigation source of truth.
    }
  }

  const openProject = async (link: HTMLAnchorElement) => {
    if (navigating) return
    window.clearTimeout(hoverTimer)
    activate(link)
    navigating = true
    rememberReturnTarget(link)

    if (motionQuery.matches) {
      window.location.assign(link.href)
      return
    }

    const rect = link.getBoundingClientRect()
    const faultY = Math.min(window.innerHeight - 24, Math.max(24, rect.top + rect.height / 2))
    const opening = Math.min(window.innerHeight * .34, Math.max(126, rect.height * 2.25))

    try {
      root.dataset.paperWorldStage = 'open'
      const { topPanel } = createFaultOverlay(link, faultY, opening)
      await waitForFault(topPanel)
      if (transitionWindow.__paperWorldTestHold) {
        navigating = false
        return
      }
      window.location.assign(link.href)
    } catch {
      faultOverlay?.remove()
      window.location.assign(link.href)
    }
  }

  for (const link of links) {
    link.addEventListener('mouseenter', () => schedulePointerPreview(link))
    link.addEventListener('mouseleave', () => {
      window.clearTimeout(hoverTimer)
      if (!coarseQuery.matches) window.setTimeout(clear, 70)
    })
    link.addEventListener('focus', () => activate(link))
    link.addEventListener('blur', () => {
      if (!coarseQuery.matches) window.setTimeout(clear, 70)
    })
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      void openProject(link)
    })
  }

  window.addEventListener('scroll', requestCoarsePreview, { passive: true })
  window.addEventListener('resize', () => {
    if (activeLink) positionStage(activeLink)
    requestCoarsePreview()
  }, { passive: true })
  window.addEventListener('pageshow', () => {
    const returnSlug = history.state?.paperWorldReturn
    if (typeof returnSlug !== 'string') return
    const returnLink = links.find((link) => link.dataset.projectSlug === returnSlug)
    if (!returnLink) return
    returnLink.focus({ preventScroll: true })
    const { paperWorldReturn: _removed, ...nextState } = history.state
    history.replaceState(nextState, '', window.location.href)
  })

  transitionWindow.__paperWorldTransition = {
    activate: (slug) => {
      const link = links.find((candidate) => candidate.dataset.projectSlug === slug)
      if (link) activate(link)
    },
    reset,
  }

  requestCoarsePreview()
}
