import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import {
  claimSchema,
  experienceSchema,
  noteSchema,
  serviceSchema,
  siteCopySchema,
  workSchema,
} from './content/schemas.mjs'

const work = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/work' }), schema: workSchema })
const notes = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/notes' }), schema: noteSchema })
const claims = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/claims' }), schema: claimSchema })
const experience = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/experience' }), schema: experienceSchema })
const services = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/services' }), schema: serviceSchema })
const site = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/site' }), schema: siteCopySchema })

export const collections = { work, notes, claims, experience, services, site }
