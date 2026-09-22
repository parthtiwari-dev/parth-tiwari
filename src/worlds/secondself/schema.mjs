import { z } from 'astro/zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

/**
 * SecondSelf / A Little Further, Together: a labelled source-behavior illustration built
 * from safe committed fixtures. It carries no private record and performs no outbound act.
 */
export const dataSchema = z.object({
  version: z.literal(1),
  project: z.literal('secondself'),
  provenance: z.literal('source-behavior'),
  source: z.object({
    fixtureRevision: z.string().regex(/^[0-9a-f]{7}$/),
    verifiedOn: isoDate,
    privateData: z.literal('excluded'),
    outboundActions: z.literal('none'),
  }),
  evaluation: z.object({
    claimRef: z.literal('secondself-ragas'),
    faithfulness: z.string().regex(/^0\.\d{4}$/),
    questions: z.number().int().positive(),
    recordedAt: isoDate,
  }),
  retrievalPaths: z.tuple([z.literal('lexical'), z.literal('semantic')]),
  evidenceCategories: z.array(z.object({ id: z.enum(['project', 'experience', 'unsupported']), supported: z.boolean() }))
    .refine((categories) => categories.some((category) => !category.supported), 'The evidence check must show material that is removed.'),
  reviewPaths: z.tuple([z.literal('approve'), z.literal('revise'), z.literal('reject')]),
  reviewChannel: z.string().min(3),
})
