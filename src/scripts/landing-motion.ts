const root = document.documentElement
const nav = document.querySelector<HTMLElement>('[data-paper-nav]')
const sentinel = document.querySelector<HTMLElement>('[data-nav-sentinel]')
const revealTargets = document.querySelectorAll<HTMLElement>('[data-reveal]')

if ('IntersectionObserver' in window) {
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
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  )

  revealTargets.forEach((target) => revealObserver.observe(target))
} else {
  if (nav) nav.dataset.state = 'open'
  revealTargets.forEach((target) => target.classList.add('is-visible'))
}
