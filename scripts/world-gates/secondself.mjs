/** SecondSelf / A Little Further, Together: evidence first, then a human decision. */
export default {
  slug: 'secondself',
  scenes: 8,
  enhancedClass: 'illustrated',
  activation: 'offset',
  still: { scene: 2 },
  controls: [
    { scene: 2, click: '[data-path="semantic"]', pressed: true, result: '.path-result', expect: /^Semantic search surfaces related experience\. Similarity does not establish a new fact\.$/ },
    { scene: 3, click: '[data-evidence="unsupported"]', pressed: true, result: '.evidence-result', expect: /^Removed before drafting\./ },
    { scene: 6, click: '[data-decision="approve"]', pressed: true, result: '.review-result', expect: /Nothing was sent\./ },
    { scene: 6, click: '[data-decision="reject"]', pressed: true, result: '.review-result', expect: /Nothing was sent\./ },
    { scene: 6, click: '.reset-review', result: '.review-result', expect: /^Awaiting your decision in this illustration\. Nothing has been sent\.$/ },
  ],
  facts: (data) => [`${data.evaluation.faithfulness} faithfulness on a ${data.evaluation.questions}-question internal RAGAS evaluation on 14 May 2026`, data.source.fixtureRevision, 'NO APPLICATIONS SENT'],
  dataChecks: (data, html) => [
    { pass: data.evaluation.recordedAt === '2026-05-14', message: 'prose date "14 May 2026" no longer matches the recorded evaluation date' },
    { pass: data.reviewPaths.every((decision) => html.includes(`data-decision="${decision}"`)), message: 'a recorded review path has no rehearsal control' },
    { pass: !/fetch\(|XMLHttpRequest|sendBeacon/.test(html), message: 'the review rehearsal must not make a request' },
  ],
  summary: (data) => `${data.evaluation.faithfulness} faithfulness on ${data.evaluation.questions} questions, ${data.reviewPaths.length} rehearsed review paths, no outbound action`,
}
