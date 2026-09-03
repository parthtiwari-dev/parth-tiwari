const root = document.documentElement
const nav = document.querySelector<HTMLElement>('[data-paper-nav]')
const sentinel = document.querySelector<HTMLElement>('[data-nav-sentinel]')
const revealTargets = document.querySelectorAll<HTMLElement>('[data-reveal]')
const reveal = (target: Element) => target.classList.add('is-visible')

if (typeof window.IntersectionObserver === 'function') {
  root.classList.add('motion-ready')

  if (nav && sentinel) {
    const navObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return

      const isPastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0
      nav.dataset.state = isPastHero ? 'open' : 'closed'
    })

    navObserver.observe(sentinel)
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        reveal(entry.target)
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  )

  revealTargets.forEach((target) => {
    // Anything already within a screen of the viewport is shown at once, so a slow
    // or missed observer callback can never leave first-paint content invisible.
    if (target.getBoundingClientRect().top < window.innerHeight * 1.15) reveal(target)
    else revealObserver.observe(target)
  })

  // Final backstop: never leave a reveal target stuck at opacity 0.
  window.setTimeout(() => revealTargets.forEach(reveal), 2600)
} else {
  if (nav) nav.dataset.state = 'open'
  revealTargets.forEach(reveal)
}
