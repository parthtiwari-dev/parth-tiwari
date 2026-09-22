/** Order Supervisor / Inside the Night Watch: the model advises, the lifecycle decides. */
export default {
  slug: 'order-supervisor',
  scenes: 8,
  enhancedClass: 'enhanced',
  // Scroll selects the chapter nearest the viewport centre; each event plays for 2.8 s.
  activation: 'center',
  settleMs: 3100,
  parityWaitMs: 3300,
  idleSettleMs: 3100,
  still: { scene: 5, wait: 3300 },
  controls: [],
  facts: (data) => [
    'Delivered, refund resolved or order cancelled',
    'No external messages are sent.',
    'This is not a universal human-approval gate.',
    data.source.revision,
  ],
  dataChecks: (data, html) => [
    { pass: (html.match(/class="gear"/g) ?? []).length === 6, message: 'the watch movement lost gears in extraction' },
    { pass: !data.lifecycle.recommendationCompletesAlone && !data.lifecycle.externalSends, message: 'the authority boundary no longer matches the source record' },
    { pass: !/Motion study/i.test(html), message: 'study scaffolding copy reached the production page' },
  ],
  summary: (data) => `${data.lifecycle.terminalEvents.length} terminal events own completion at ${data.source.revision}, recommendation cannot complete alone, no external sends`,
}
