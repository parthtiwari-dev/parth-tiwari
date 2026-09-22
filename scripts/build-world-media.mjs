/**
 * Encodes the owner-approved study paintings in design/directions/assets for public
 * delivery. The PNG originals stay in design/ as the source of truth; the WebP output in
 * public/media/worlds is what the world routes serve. Same pixels and dimensions, far
 * fewer bytes: the paintings are 2-3 MB PNGs.
 *
 *   node scripts/build-world-media.mjs [slug]
 */
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const source = path.resolve('design', 'directions', 'assets')
const target = path.resolve('public', 'media', 'worlds')
const paintings = {
  medrag: [['medrag-theatre-v1.png', 'medrag-theatre.webp']],
  secondself: [['secondself-journey-v1.png', 'secondself-journey.webp'], ['secondself-room-illustrated-v1.png', 'secondself-room.webp']],
  querypilot: [['querypilot-atlas-v1.png', 'querypilot-atlas.webp']],
}

const only = process.argv[2]
await mkdir(target, { recursive: true })
for (const [slug, files] of Object.entries(paintings)) {
  if (only && slug !== only) continue
  for (const [input, output] of files) {
    const info = await sharp(path.join(source, input)).webp({ quality: 88, effort: 6, smartSubsample: true }).toFile(path.join(target, output))
    const before = (await stat(path.join(source, input))).size
    console.log(`${slug}: ${input} ${Math.round(before / 1024)} KB -> ${output} ${Math.round(info.size / 1024)} KB (${info.width}x${info.height})`)
  }
}
