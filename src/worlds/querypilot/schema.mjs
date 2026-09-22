import { z } from 'astro/zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

/**
 * QueryPilot / The Cartographer's Fold: one committed Day 6 record (question, schema names,
 * final SQL, attempt count) and the published core-benchmark aggregate. Intermediate SQL and
 * failure reasons were not preserved and are never reconstructed.
 */
export const dataSchema = z.object({
  version: z.literal(1),
  project: z.literal('querypilot'),
  provenance: z.literal('committed-export'),
  source: z.object({
    revision: z.string().regex(/^[0-9a-f]{7}$/),
    artifact: z.string().min(3),
    recordedAt: isoDate,
    verifiedOn: isoDate,
  }),
  record: z.object({
    id: z.string().regex(/^[a-z]+_\d{3}$/),
    question: z.string().min(10),
    sql: z.string().min(20),
    success: z.literal(true),
    attempts: z.number().int().min(2),
    firstAttemptSuccess: z.literal(false),
    correctionApplied: z.literal(true),
    schemaTables: z.array(z.string().regex(/^[a-z_]+$/)).min(1),
    intermediateAttempts: z.literal('not-preserved'),
  }),
  ledger: z.object({
    claimRef: z.literal('querypilot-correction'),
    core: z.number().int().positive(),
    beforeCorrection: z.number().int().nonnegative(),
    afterCorrection: z.number().int().nonnegative(),
    adversarial: z.number().int().nonnegative(),
  }).refine((ledger) => ledger.beforeCorrection <= ledger.afterCorrection && ledger.afterCorrection <= ledger.core, 'Ledger counts must be ordered within the core set.'),
})
