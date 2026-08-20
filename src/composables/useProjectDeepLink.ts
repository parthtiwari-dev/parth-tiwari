import { nextTick, watch } from 'vue'
import { projects } from '@/data/projects'
import { useNavigationStore } from '@/stores/navigationStore'
import { useOverlayStore } from '@/stores/overlayStore'

/**
 * `?project=<id>` — one URL per project (PLAN.md 4.7).
 *
 * There is no router here and adding one for a single-page site would be a large
 * dependency for one query parameter. The History API does the whole job: the
 * address bar tracks what is open, and the link is copyable and shareable.
 *
 * **`pushState` on open, reversing an earlier decision.** This used to use
 * `replaceState` on the argument that opening a panel is not navigation, so Back
 * should leave the site rather than close an overlay. Tested on the phone
 * profile this site is actually built for, that argument inverts: traffic
 * arrives from a DM link on Android, where the system Back gesture *is* how
 * people dismiss anything that covers the screen. Measured on the deployed
 * site — open a project, press Back, and you are gone. Trapping someone was the
 * fear; ejecting them was the behaviour.
 *
 * Only one entry is ever pushed per open. Switching projects with the panel up
 * replaces, so a visitor who flicks through six of them presses Back once, not
 * six times, and a close we initiated unwinds the entry we added rather than
 * leaving a dead one behind.
 *
 * Arriving *directly* on `?project=x` is the case that must not call `back()`:
 * there is no entry of ours to pop and the previous page belongs to whoever
 * linked here. That open is not ours, so its close only rewrites the URL.
 *
 * The parameter is validated against the real project list. An unknown id is
 * ignored rather than opening an empty overlay — a stale link from an old share
 * should land on the constellation, not on a broken panel.
 *
 * Other parameters are preserved: `?plain=1` and `?debug=1` are read elsewhere,
 * and rewriting the query string from scratch would silently drop them.
 */

const PARAM = 'project'

const knownIds = new Set(projects.map((project) => project.id))

function readParam(): string | null {
  if (typeof window === 'undefined') return null
  const value = new URLSearchParams(window.location.search).get(PARAM)
  return value && knownIds.has(value) ? value : null
}

function writeParam(projectId: string | null, mode: 'push' | 'replace'): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const current = url.searchParams.get(PARAM)
  if (current === projectId || (current === null && projectId === null)) return

  if (projectId) url.searchParams.set(PARAM, projectId)
  else url.searchParams.delete(PARAM)

  if (mode === 'push') window.history.pushState(window.history.state, '', url)
  else window.history.replaceState(window.history.state, '', url)
}

export function useProjectDeepLink(): void {
  const overlayStore = useOverlayStore()
  const navigation = useNavigationStore()

  /** Whether the entry currently on top of the stack is one we pushed. */
  let ownsHistoryEntry = false
  /** Set while reacting to the browser, so the watcher does not write back. */
  let syncingFromHistory = false

  const initial = readParam()
  if (initial) {
    overlayStore.open(initial)
    navigation.focusProject(initial)
  }

  // The overlay is the thing a link should restore, so it owns the URL.
  watch(
    () => (overlayStore.isOpen ? overlayStore.activeProjectId : null),
    (projectId) => {
      if (syncingFromHistory) return

      if (projectId) {
        // First open pushes; switching projects with the panel up replaces.
        writeParam(projectId, ownsHistoryEntry ? 'replace' : 'push')
        ownsHistoryEntry = true
        return
      }

      if (ownsHistoryEntry) {
        // Unwind our own entry so Escape and the close button leave the history
        // stack exactly as they found it. The `popstate` below does the URL.
        ownsHistoryEntry = false
        window.history.back()
        return
      }

      writeParam(null, 'replace')
    },
  )

  // The Android back gesture, desktop Back/Forward, and any external URL edit.
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      syncingFromHistory = true

      // Whatever entry we land on is the browser's, not one we are holding.
      ownsHistoryEntry = false

      const next = readParam()
      if (next) {
        overlayStore.open(next)
        navigation.focusProject(next)
      } else {
        overlayStore.close()
      }

      void nextTick(() => {
        syncingFromHistory = false
      })
    })
  }
}
