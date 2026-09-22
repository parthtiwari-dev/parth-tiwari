import { z } from 'astro/zod'

/**
 * Order Supervisor / Inside the Night Watch: a labelled demonstration of committed source
 * behavior. It carries no recorded order, run, recovery measurement or external send.
 */
export const dataSchema = z.object({
  version: z.literal(1),
  project: z.literal('order-supervisor'),
  provenance: z.literal('source-behavior'),
  source: z.object({
    revision: z.string().regex(/^[0-9a-f]{7}$/),
    files: z.array(z.string().min(3)).min(1),
    verifiedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  lifecycle: z.object({
    terminalEvents: z.array(z.string().regex(/^[a-z_]+$/)).min(1),
    otherCompletionPaths: z.array(z.string().min(3)),
    recommendationCompletesAlone: z.literal(false),
    universalHumanApproval: z.literal(false),
    businessActions: z.literal('activity-log'),
    externalSends: z.literal(false),
  }),
  measurements: z.literal('none'),
})
