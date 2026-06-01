let lockCount = 0
let savedScrollY = 0
let previousBodyPosition = ''
let previousBodyTop = ''
let previousBodyLeft = ''
let previousBodyRight = ''
let previousBodyWidth = ''
let previousBodyOverflow = ''
let previousDocumentOverflow = ''

export function lockBodyScroll() {
  lockCount += 1

  if (lockCount > 1) {
    return
  }

  savedScrollY = window.scrollY
  previousBodyPosition = document.body.style.position
  previousBodyTop = document.body.style.top
  previousBodyLeft = document.body.style.left
  previousBodyRight = document.body.style.right
  previousBodyWidth = document.body.style.width
  previousBodyOverflow = document.body.style.overflow
  previousDocumentOverflow = document.documentElement.style.overflow

  document.documentElement.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${savedScrollY}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
  document.body.style.overflow = 'hidden'
}

export function unlockBodyScroll() {
  if (lockCount === 0) {
    return
  }

  lockCount -= 1

  if (lockCount > 0) {
    return
  }

  document.documentElement.style.overflow = previousDocumentOverflow
  document.body.style.position = previousBodyPosition
  document.body.style.top = previousBodyTop
  document.body.style.left = previousBodyLeft
  document.body.style.right = previousBodyRight
  document.body.style.width = previousBodyWidth
  document.body.style.overflow = previousBodyOverflow
  window.scrollTo(0, savedScrollY)
}
