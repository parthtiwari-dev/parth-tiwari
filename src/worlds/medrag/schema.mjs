import { z } from 'astro/zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const query = z.object({
  id: z.number().int().positive(),
  retrieved: z.number().int().positive(),
  cited: z.number().int().nonnegative(),
  refused: z.boolean(),
})

/** MedRAG / The Theatre of an Answer: two recorded evaluation outcomes, counts only. */
export const dataSchema = z.object({
  version: z.literal(1),
  project: z.literal('medrag'),
  provenance: z.literal('committed-export'),
  source: z.object({
    revision: z.string().regex(/^[0-9a-f]{7}$/),
    artifact: z.string().min(3),
    recordedAt: isoDate,
    evaluator: z.string().min(3),
    retrieval: z.string().min(3),
    verifiedOn: isoDate,
  }),
  queries: z.tuple([query, query]).refine(
    ([answered, withheld]) => !answered.refused && answered.cited > 0 && withheld.refused && withheld.cited === 0 && answered.retrieved === withheld.retrieved,
    'The theatre compares one cited answer with one refusal at the same retrieved count.',
  ),
  evaluation: z.object({
    claimRef: z.literal('medrag-refusals'),
    questions: z.number().int().positive(),
    refused: z.number().int().nonnegative(),
    refusedIds: z.array(z.number().int().positive()),
  }).refine((evaluation) => evaluation.refusedIds.length === evaluation.refused && evaluation.refused <= evaluation.questions, 'Refused IDs must match the refused count.'),
  boundary: z.string().min(20),
})
