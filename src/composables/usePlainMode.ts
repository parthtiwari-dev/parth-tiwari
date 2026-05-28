import { readonly, ref } from 'vue'

const isPlain = ref(false)

export function usePlainMode() {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    isPlain.value = params.has('plain') && params.get('plain') === '1'
  }
  return { isPlain: readonly(isPlain) }
}
