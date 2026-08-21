/**
 * The offer. Three services, deliberately ranked rather than presented as equals
 * (PRD.md 4) — four co-equal options dilute intent.
 *
 * Copy rule: describe what the client gets, not which library was used. The stack
 * already has a home in `projects.ts`; this file is the part a founder reads.
 *
 * No prices. Every path leads to a conversation (PRD.md 7.3).
 * No claims that are not already evidenced by a project in `projects.ts` — every
 * offer names the project ids that back it. `Project['id']` is a plain string, so
 * the ids are not type-checked; `ServicesBlock` resolves them against `projects`
 * and drops anything that no longer exists rather than rendering a dead name.
 */

import type { Project } from '@/types/project'

export type ServiceRank = 'lead' | 'second' | 'third'

export interface Service {
  id: string
  /** Ordering intent. `lead` is the offer the site is actually selling. */
  rank: ServiceRank
  /** Short enough to scan in a list. */
  label: string
  /** One line, outcome-first: what the client ends up with. */
  outcome: string
  /** Concrete scope, so "AI product" is not left as a word. */
  detail: string
  /** Existing projects that already prove this offer. Ids from `projects.ts`. */
  evidenceProjectIds: Project['id'][]
  /** Evidence that is not a project record. Optional, and factual only. */
  evidenceNote?: string
}

export const services: Service[] = [
  {
    id: 'ai-products',
    rank: 'lead',
    label: 'Custom AI products, end to end',
    outcome:
      'A working AI product your users can open in a browser, not a notebook or a demo script.',
    detail:
      'Retrieval over your own documents and data, agents that take real actions, and the evaluation and refusal rules that decide when the system should answer and when it should stop.',
    evidenceProjectIds: ['querypilot', 'medrag', 'secondself', 'upi-fraud', 'stick-and-dot'],
  },
  {
    id: 'ai-automation',
    rank: 'second',
    label: 'AI automation for businesses',
    outcome:
      'Work that currently happens by hand happens on its own, with a person still approving anything that matters.',
    detail:
      'Order and workflow supervision, scheduled provisioning, risk and fraud scoring. Each one has a human gate before an action is applied, and a log of why it was taken.',
    evidenceProjectIds: ['order-supervisor', 'oracle-auto-provision', 'fraud-risk-intel'],
  },
  {
    id: 'interactive-web',
    rank: 'third',
    label: 'Creative interactive web, with AI behind it',
    outcome:
      'A site or interface that holds attention, built to the same standard as the system underneath it.',
    detail:
      '3D, motion and generative work where the interaction is engineered rather than decorated: data-driven scenes, real accessibility, and a static fallback that still works.',
    evidenceProjectIds: ['oncoverse', 'stick-and-dot'],
    evidenceNote: 'This site is the working example.',
  },
]

export const leadService = services.find((service) => service.rank === 'lead')
