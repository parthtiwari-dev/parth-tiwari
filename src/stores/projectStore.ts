import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { projects } from '@/data/projects'
import type { Project } from '@/types/project'

export const useProjectStore = defineStore('project', () => {
  const projectList = ref<Project[]>(projects)
  const highlightedProjectIds = ref<string[]>([])

  const projectCount = computed(() => projectList.value.length)

  function getById(projectId: string) {
    return projectList.value.find((project) => project.id === projectId)
  }

  function highlight(projectIds: string[]) {
    highlightedProjectIds.value = projectIds
  }

  function clearHighlight() {
    highlightedProjectIds.value = []
  }

  return {
    projects: projectList,
    highlightedProjectIds,
    projectCount,
    getById,
    highlight,
    clearHighlight,
  }
})
