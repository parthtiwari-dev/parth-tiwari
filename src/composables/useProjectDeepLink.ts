import { watch } from 'vue'
import { projects } from '@/data/projects'
import { useNavigationStore } from '@/stores/navigationStore'
import { useOverlayStore } from '@/stores/overlayStore'

/**
 * `?project=<id>` — one URL per project (PLAN.md 4.7).
 *
 * There is no router here and adding one for a single-page site would be a large
 * dependency for one query parameter. `history.replaceState` does the whole job:
 * the address bar tracks what is open, the link is copyable and shareable, and
 * the back button is not filled with entries for panels the visitor flicked
 * through.
 *
 * **`replaceState`, deliberately, not `pushState`.** Opening a project is not
 * navigation — it is opening a panel over a page that has not changed. Pushing
 * history would mean Back closes an overlay instead of leaving the site, which
 * is the behaviour people complain about most in gallery-style pages, and on
 * this site it would trap someone who arrived from a cold-outreach link.
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

function writeParam(projectId: string | null): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const current = url.searchParams.get(PARAM)
  if (current === projectId || (current === null && projectId === null)) return

  if (projectId) url.searchParams.set(PARAM, projectId)
  else url.searchParams.delete(PARAM)

  window.history.replaceState(window.history.state, '', url)
}

export function useProjectDeepLink(): void {
  const overlayStore = useOverlayStore()
  const navigation = useNavigationStore()

  const initial = readParam()
  if (initial) {
    overlayStore.open(initial)
    navigation.focusProject(initial)
  }

  // The overlay is the thing a link should restore, so it owns the URL.
  watch(
    () => (overlayStore.isOpen ? overlayStore.activeProjectId : null),
    (projectId) => writeParam(projectId),
  )

  // Back/forward between two shared links, and any external URL edit.
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      const next = readParam()
      if (next) {
        overlayStore.open(next)
        navigation.focusProject(next)
      } else {
        overlayStore.close()
      }
    })
  }
}
