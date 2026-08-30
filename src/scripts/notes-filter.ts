const root = document.documentElement
const controls = document.querySelector<HTMLElement>('[data-notes-controls]')
const errataSection = document.querySelector<HTMLElement>('[data-errata-section]')
const writingSection = document.querySelector<HTMLElement>('[data-writing-section]')
const count = document.querySelector<HTMLElement>('[data-note-count]')

if (controls && errataSection && writingSection) {
  root.classList.add('notes-enhanced')
  const errataCount = document.querySelectorAll('[data-note-entry][data-note-type="erratum"]').length

  controls.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-note-filter]')
    if (!button) return
    const filter = button.dataset.noteFilter ?? 'all'

    controls.querySelectorAll<HTMLButtonElement>('[data-note-filter]').forEach((candidate) => {
      candidate.setAttribute('aria-pressed', String(candidate === button))
    })

    errataSection.hidden = filter === 'post'
    writingSection.hidden = filter === 'erratum'
    if (count) count.textContent = String(filter === 'post' ? 0 : errataCount)
  })
}
