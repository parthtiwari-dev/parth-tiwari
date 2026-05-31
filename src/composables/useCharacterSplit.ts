import { onUnmounted, ref } from 'vue'

export function useCharacterSplit(
  text: string,
  msPerChar: number,
  onComplete?: () => void,
) {
  const displayed = ref('')
  let index = 0
  let timer: number | null = null

  function clearTimer() {
    if (timer !== null) {
      window.clearTimeout(timer)
      timer = null
    }
  }

  function complete() {
    displayed.value = text
    index = text.length
    clearTimer()
    onComplete?.()
  }

  function tick() {
    if (index >= text.length) {
      onComplete?.()
      return
    }

    displayed.value += text[index]
    index += 1
    timer = window.setTimeout(tick, msPerChar)
  }

  function start() {
    clearTimer()
    displayed.value = ''
    index = 0
    tick()
  }

  onUnmounted(clearTimer)

  return {
    displayed,
    start,
    complete,
  }
}
