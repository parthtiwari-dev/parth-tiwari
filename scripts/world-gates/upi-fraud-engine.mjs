/** UPI Fraud Engine / The Narrow Harbour: a fixed review budget with the misses kept in view. */
const pct = (value) => `${(value * 100).toFixed(2)}%`

export default {
  slug: 'upi-fraud-engine',
  scenes: 8,
  enhancedClass: 'illustrated',
  activation: 'offset',
  still: { scene: 6 },
  controls: (data) => [
    { scene: 4, click: '[data-day="2"]', pressed: true, result: '.day-record', expect: new RegExp(`^3 June 2025${pct(data.replay.daily[2].precision).replace('.', '\\.')}PRECISION`) },
    { scene: 4, click: '[data-day="6"]', pressed: true, result: '#day-counts', expect: new RegExp(`^${data.replay.daily[6].num_alerts} alerts / ${data.replay.daily[6].num_transactions.toLocaleString('en-US')} transactions$`) },
    { scene: 6, click: '[data-view="caught"]', pressed: true, result: '.reveal-result', expect: new RegExp(`^Focusing on the ${data.replay.cumulative.total_caught} caught\\. The ${data.replay.cumulative.total_missed} missed remain dimly visible; recall is still ${pct(data.replay.cumulative.overall_recall).replace('.', '\\.')}\\.$`) },
  ],
  facts: (data) => [
    `${pct(data.heldout.precision).slice(0, -1)}<small>%</small>`,
    `${pct(data.replay.cumulative.overall_precision).slice(0, -1)}<small>%</small>`,
    'Production XGBoost evaluation · 22 January 2026',
    'Held-out and replay records remain separate.',
    `Committed replay · ${data.replay.revision}`,
  ],
  dataChecks: (data, html) => [
    { pass: (html.match(/fraud-dot caught/g) ?? []).length === data.replay.cumulative.total_caught, message: 'caught points differ from the replay count' },
    { pass: (html.match(/fraud-dot missed/g) ?? []).length === data.replay.cumulative.total_missed, message: 'missed points differ from the replay count' },
    { pass: (html.match(/<tr><td>2025-06-0\d<\/td>/g) ?? []).length === data.replay.daily.length, message: 'the seven-day table does not list every recorded day' },
    { pass: data.replay.alertBudgetViolations === 0, message: 'the replay copy claims zero budget violations' },
  ],
  summary: (data) => `held-out ${pct(data.heldout.precision)} / ${pct(data.heldout.recall)} on ${data.heldout.rows.toLocaleString('en-US')} rows, replay ${pct(data.replay.cumulative.overall_precision)} / ${pct(data.replay.cumulative.overall_recall)} on ${data.replay.cumulative.total_transactions.toLocaleString('en-US')}, kept separate`,
}
