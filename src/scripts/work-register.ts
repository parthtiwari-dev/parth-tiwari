const root = document.documentElement
const list = document.querySelector<HTMLOListElement>('[data-work-list]')
const controls = document.querySelector<HTMLElement>('[data-work-controls]')
const count = document.querySelector<HTMLElement>('[data-visible-count]')
const activeFilter = document.querySelector<HTMLInputElement>('[data-active-filter]')

if (list && controls) {
  root.classList.add('work-enhanced')

  const rows = [...list.querySelectorAll<HTMLElement>('[data-project-row]')]
  const effortRank = { flagship: 3, substantial: 2, focused: 1 }
  const activeStatuses = new Set(['live', 'running', 'in-progress'])
  let sortMode = 'editorial'

  const compareRows = (left: HTMLElement, right: HTMLElement) => {
    const editorialDifference = Number(left.dataset.editorial) - Number(right.dataset.editorial)
    if (sortMode === 'effort') {
      const difference = (effortRank[right.dataset.effort as keyof typeof effortRank] ?? 0)
        - (effortRank[left.dataset.effort as keyof typeof effortRank] ?? 0)
      return difference || editorialDifference
    }
    if (sortMode === 'recent') {
      return (right.dataset.started ?? '').localeCompare(left.dataset.started ?? '') || editorialDifference
    }
    return editorialDifference
  }

  const render = () => {
    const activeOnly = activeFilter?.checked ?? false
    const orderedRows = [...rows].sort(compareRows)
    let visible = 0

    for (const row of orderedRows) {
      list.append(row)
      const shown = !activeOnly || activeStatuses.has(row.dataset.status ?? '')
      row.hidden = !shown
      if (!shown) continue
      visible += 1
    }

    if (count) count.textContent = String(visible)
  }

  controls.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-sort]')
    if (!button) return
    sortMode = button.dataset.sort ?? 'editorial'
    controls.querySelectorAll<HTMLButtonElement>('[data-sort]').forEach((candidate) => {
      candidate.setAttribute('aria-pressed', String(candidate === button))
    })
    render()
  })

  activeFilter?.addEventListener('change', render)
}
