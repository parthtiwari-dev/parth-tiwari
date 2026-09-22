/** MedRAG / The Theatre of an Answer: two recorded outcomes at one retrieved count. */
const result = (record) => `Query ${record.id}: ${record.retrieved} retrieved, ${record.cited} cited. ${record.refused ? 'Refused.' : 'Not refused.'}`
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default {
  slug: 'medrag',
  scenes: 8,
  enhancedClass: 'illustrated',
  activation: 'offset',
  still: { scene: 3 },
  controls: (data) => [data.queries[1], data.queries[0]].map((record) => ({
    scene: 4,
    click: `[data-query="${record.id}"]`,
    pressed: true,
    result: '.interaction-result',
    expect: new RegExp(`^${escape(result(record))}$`),
  })),
  facts: (data) => [result(data.queries[0]), 'Four refusals in twenty recorded queries.', '3 February 2026', data.source.revision],
  dataChecks: (data, html) => [
    { pass: (html.match(/class="scenic-piece"/g) ?? []).length === data.queries[0].retrieved, message: 'scenery count differs from the recorded retrieved count' },
    { pass: (html.match(/<circle cx="\d+" cy="\d+" r="18" fill="#315e60"/g) ?? []).length === data.queries[0].cited, message: 'citation marks differ from the recorded cited count' },
    { pass: data.evaluation.refused === 4 && data.evaluation.questions === 20, message: 'prose "Four refusals in twenty" no longer matches the data' },
  ],
  summary: (data) => `queries ${data.queries.map((record) => `${record.id}=${record.cited}/${record.retrieved}${record.refused ? ' refused' : ''}`).join(', ')}, ${data.evaluation.refused} of ${data.evaluation.questions} refused`,
}
