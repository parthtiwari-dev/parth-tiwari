import { computed, reactive } from 'vue'

/**
 * What the boot screen is actually waiting for.
 *
 * The bars it drew used to be string literals — `'████████░░  80%'`, always
 * eighty percent, measuring nothing, in front of a site whose stated rule is
 * that no visual may claim something it does not encode. A progress bar is the
 * purest form of that failure: it is *only* a claim about progress.
 *
 * These are the real dependencies of a first frame. Each one flips when its
 * promise settles, and the boot dismisses when they all have rather than after
 * a timer that was tuned to feel right.
 *
 * A task is registered only when it is genuinely going to happen. Under reduced
 * motion the scene chunk is never fetched (`App.vue`), so a boot that waited on
 * it would hang on work nobody asked for — which is how a progress display
 * starts lying in the other direction.
 */
export type LoadTaskId = 'scene' | 'fonts'

type LoadTaskState = 'idle' | 'pending' | 'done'

interface LoadTask {
  /** Shown on the boot line. Names the dependency, not the activity. */
  readonly label: string
  state: LoadTaskState
}

const tasks = reactive<Record<LoadTaskId, LoadTask>>({
  scene: { label: 'scene bundle', state: 'idle' },
  fonts: { label: 'typefaces', state: 'idle' },
})

export function beginLoadTask(id: LoadTaskId) {
  if (tasks[id].state === 'idle') tasks[id].state = 'pending'
}

export function completeLoadTask(id: LoadTaskId) {
  tasks[id].state = 'done'
}

/** Only the tasks this visit actually started. Idle ones are not claims. */
export const activeLoadTasks = computed(() => (
  (Object.keys(tasks) as LoadTaskId[])
    .map((id) => ({ id, label: tasks[id].label, done: tasks[id].state === 'done' }))
    .filter((task) => tasks[task.id].state !== 'idle')
))

/**
 * True once every started task has settled — including the vacuous case where
 * none started, which is correct: nothing to wait for is not a reason to wait.
 */
export const loadComplete = computed(() => activeLoadTasks.value.every((task) => task.done))
