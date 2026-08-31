import { getCollection } from 'astro:content'
import { SITE_URL } from '../config/site'

export const prerender = true

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

export async function GET() {
  const notes = (await getCollection('notes'))
    .filter((note) => note.data.state === 'published' && note.data.publishedAt)
    .sort((left, right) => (right.data.publishedAt?.getTime() ?? 0) - (left.data.publishedAt?.getTime() ?? 0))

  const items = notes.map((note) => {
    const url = `${SITE_URL}/notes/${note.id}/`
    return [
      '    <item>',
      `      <title>${escapeXml(note.data.title)}</title>`,
      `      <description>${escapeXml(note.data.summary)}</description>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${note.data.publishedAt?.toUTCString()}</pubDate>`,
      '    </item>',
    ].join('\n')
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Parth Tiwari — Notes and Errata</title>\n    <link>${SITE_URL}/notes/</link>\n    <description>What went wrong, what changed, and the evidence behind each correction.</description>\n${items}\n  </channel>\n</rss>\n`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
