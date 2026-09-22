/** QueryPilot / The Cartographer's Fold: one recorded correction and an honest core ledger. */
export default {
  slug: 'querypilot',
  scenes: 9,
  enhancedClass: 'illustrated',
  activation: 'offset',
  still: { scene: 2 },
  controls: (data) => [
    { scene: 2, click: `[data-table="${data.record.schemaTables[0]}"]`, pressed: true, result: '.table-result', expect: new RegExp(`^${data.record.schemaTables[0]}: present in the retrieved schema context for ${data.record.id}\\.`) },
    { scene: 2, click: '#atlas-angle', fill: 18 },
    { scene: 5, click: '[data-attempt="1"]', pressed: true, result: '.attempt-result', expect: /^First attempt: unsuccessful\. Its SQL and specific failure reason are not preserved/ },
    { scene: 5, click: '[data-attempt="2"]', pressed: true, result: '.attempt-result', expect: /intermediate SQL is not preserved\. This is a record gap, not a reconstructed second attempt\.$/ },
    { scene: 6, click: '[data-intent="write"]', pressed: true, result: '.guard-result', expect: /destructive intent is blocked\. Correction cannot grant write permission\. No SQL was executed\.$/ },
    { scene: 7, click: '[data-ledger="before"]', pressed: true, result: '.ledger-result', expect: new RegExp(`^${data.ledger.beforeCorrection} of ${data.ledger.core} core queries executed successfully before correction\\.`) },
  ],
  facts: (data) => [
    data.record.question,
    'LIMIT 1000;',
    `63 → 67 execution successes. Out of 70.`,
    `The ${data.ledger.adversarial} adversarial questions are a separate set`,
    `${data.ledger.afterCorrection} of ${data.ledger.core} core queries executed successfully.`,
    `commit ${data.source.revision}, recorded 25 February 2026`,
  ],
  dataChecks: (data, html) => [
    { pass: data.ledger.beforeCorrection === 63 && data.ledger.afterCorrection === 67 && data.ledger.core === 70, message: 'the ledger lead "63 → 67 ... Out of 70" no longer matches the data' },
    { pass: data.record.attempts === 3, message: 'prose "three attempts" no longer matches the recorded attempt count' },
    { pass: data.record.schemaTables.length === 4, message: 'prose "Four table names" no longer matches the recorded schema context' },
    { pass: (html.match(/class="ledger-tile"/g) ?? []).length === data.ledger.core, message: 'atlas ledger tiles differ from the core benchmark count' },
    { pass: html.includes(data.record.sql.replaceAll('>', '&gt;')), message: 'the final SQL is not reproduced exactly' },
  ],
  summary: (data) => `${data.record.id} in ${data.record.attempts} attempts, core ledger ${data.ledger.beforeCorrection} to ${data.ledger.afterCorrection} of ${data.ledger.core}, ${data.ledger.adversarial} adversarial kept separate`,
}
