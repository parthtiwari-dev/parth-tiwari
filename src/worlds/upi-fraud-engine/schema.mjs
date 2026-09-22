import { z } from 'astro/zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const rate = z.number().min(0).max(1)
const count = z.number().int().nonnegative()

const day = z.object({
  date: isoDate,
  num_transactions: count,
  num_alerts: count,
  alert_rate: rate,
  tp: count,
  fp: count,
  fn: count,
  tn: count,
  total_fraud: count,
  total_legit: count,
  precision: rate,
  recall: rate,
  false_alert_rate: rate,
})

/**
 * UPI Fraud Engine / The Narrow Harbour. Two separate records that must never merge: the
 * held-out model evaluation and the seven-day operational replay, each with its own claim.
 */
export const dataSchema = z.object({
  version: z.literal(1),
  project: z.literal('upi-fraud-engine'),
  provenance: z.literal('committed-export'),
  verifiedOn: isoDate,
  heldout: z.object({
    claimRef: z.literal('upi-heldout'),
    revision: z.string().regex(/^[0-9a-f]{7}$/),
    recordedAt: isoDate,
    model: z.string().min(3),
    rows: count,
    budget: rate,
    precision: rate,
    recall: rate,
  }),
  replay: z.object({
    claimRef: z.literal('upi-replay'),
    revision: z.string().regex(/^[0-9a-f]{7}$/),
    period: z.object({ start: isoDate, end: isoDate }),
    budget: rate,
    alertBudgetViolations: count,
    daily: z.array(day).min(1),
    cumulative: z.object({
      total_days: count,
      total_transactions: count,
      total_fraud: count,
      total_alerts: count,
      total_caught: count,
      total_missed: count,
      total_false_positives: count,
      overall_precision: rate,
      overall_recall: rate,
    }).passthrough(),
  }).refine((replay) => {
    const sum = (key) => replay.daily.reduce((total, row) => total + row[key], 0)
    const totals = replay.cumulative
    return replay.daily.length === totals.total_days
      && sum('num_transactions') === totals.total_transactions
      && sum('total_fraud') === totals.total_fraud
      && sum('num_alerts') === totals.total_alerts
      && sum('tp') === totals.total_caught
      && sum('fn') === totals.total_missed
      && sum('fp') === totals.total_false_positives
  }, 'Replay daily rows must sum to the recorded cumulative totals.'),
})
