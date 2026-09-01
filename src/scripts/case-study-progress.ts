const article = document.querySelector<HTMLElement>('.case-article')
const chapters = [...document.querySelectorAll<HTMLElement>('[data-case-chapter]')]
const progressBars = [...document.querySelectorAll<HTMLProgressElement>('progress')]
const currentChapter = document.querySelector<HTMLElement>('[data-current-chapter]')
const chapterLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-chapter-link]')]
const caseTitle = document.querySelector<HTMLElement>('#case-title')

try {
  const focusPath = sessionStorage.getItem('paper-world-focus-path')
  if (focusPath === window.location.pathname && caseTitle) {
    sessionStorage.removeItem('paper-world-focus-path')
    window.requestAnimationFrame(() => caseTitle.focus({ preventScroll: true }))
  }
} catch {
  // Storage can be unavailable in hardened browser contexts. Reading remains unaffected.
}

if (article && chapters.length) {
  document.documentElement.classList.add('case-enhanced')
  let frame = 0

  const updateProgress = () => {
    frame = 0
    const start = article.getBoundingClientRect().top + window.scrollY
    const distance = Math.max(article.offsetHeight - window.innerHeight, 1)
    const value = Math.min(100, Math.max(0, ((window.scrollY - start) / distance) * 100))
    progressBars.forEach((progress) => { progress.value = value })
  }

  const requestProgress = () => {
    if (frame) return
    frame = window.requestAnimationFrame(updateProgress)
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]
    const id = (visible?.target as HTMLElement | undefined)?.id
    if (!id) return
    const activeLink = chapterLinks.find((link) => link.dataset.chapterLink === id)
    chapterLinks.forEach((link) => link.classList.toggle('is-current', link === activeLink))
    if (currentChapter && activeLink) currentChapter.textContent = activeLink.textContent?.replace(/^\d+/, '').trim() ?? ''
  }, { rootMargin: '-18% 0px -58% 0px', threshold: [0, .25, .6] })

  chapters.forEach((chapter) => observer.observe(chapter))
  window.addEventListener('scroll', requestProgress, { passive: true })
  window.addEventListener('resize', requestProgress, { passive: true })
  updateProgress()
}
